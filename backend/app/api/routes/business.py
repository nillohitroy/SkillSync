from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
import stripe
import os
from datetime import datetime, timedelta
from pydantic import BaseModel

from app.core.database import get_db
from app.models.schema import Job, JobStatus, User
from app.schemas.dashboard import BusinessDashboardResponse, BusinessStats, JobSummary
from app.schemas.job import JobCreate, JobResponse, JobDetailResponse, PipelineJob, AutomationResponse
from app.schemas.profile import ProfileUpdatePayload

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_mock")

class PaymentMethodItem(BaseModel):
    id: str
    brand: str
    last4: str
    exp_month: int
    exp_year: int
    is_default: bool

class InvoiceItem(BaseModel):
    id: str
    title: str
    date: str
    amount: float

class BusinessBillingResponse(BaseModel):
    active_escrow: float
    active_jobs_count: int
    payment_methods: List[PaymentMethodItem]
    recent_invoices: List[InvoiceItem]

# --- NEW SECURITY DEPENDENCY ---
def verify_ownership(client_id: str, x_user_id: str = Header(default=None)):
    """
    Cross-checks the URL client_id against the actual logged-in user ID passed in the headers.
    Prevents User B from querying User A's data.
    """
    if not x_user_id or x_user_id != client_id:
        raise HTTPException(
            status_code=403, 
            detail="Security Block: You cannot access or modify data belonging to another business."
        )
    return client_id


@router.get("/{client_id}/dashboard", response_model=BusinessDashboardResponse)
def get_business_dashboard(client_id: str = Depends(verify_ownership), db: Session = Depends(get_db)):
    client = db.query(User).filter(User.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    active_jobs = db.query(Job).filter(
        Job.client_id == client_id,
        Job.status != JobStatus.completed
    ).all()

    total_volume = sum(job.escrow_amount for job in active_jobs)
    awaiting_signoff = sum(1 for job in active_jobs if job.status == JobStatus.review)
    
    stats = BusinessStats(
        total_active_volume=total_volume,
        awaiting_signoff=awaiting_signoff,
        active_tasks=len(active_jobs)
    )

    return BusinessDashboardResponse(stats=stats, active_pipeline=active_jobs)


@router.post("/{client_id}/jobs", response_model=JobResponse)
def create_new_job(job_data: JobCreate, client_id: str = Depends(verify_ownership), db: Session = Depends(get_db)):
    client = db.query(User).filter(User.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    new_job = Job(
        **job_data.model_dump(), 
        client_id=client_id,
        status=JobStatus.collecting_pitches 
    )

    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return new_job


@router.get("/{client_id}/jobs", response_model=List[JobResponse])
def get_business_jobs(client_id: str = Depends(verify_ownership), db: Session = Depends(get_db)):
    client = db.query(User).filter(User.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    jobs = db.query(Job).filter(
        Job.client_id == client_id
    ).order_by(Job.created_at.desc()).all()

    return jobs


@router.get("/{client_id}/jobs/{job_id}")
def get_job_details(job_id: str, client_id: str = Depends(verify_ownership), db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id, Job.client_id == client_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    formatted_pitches = []
    for pitch in job.pitches:
        student = pitch.student
        formatted_pitches.append({
            "id": pitch.id,
            "content": pitch.content,
            "ai_match_score": pitch.ai_match_score,
            "is_accepted": pitch.is_accepted,
            "student_name": student.full_name if student else "Unknown Student",
            "student_tier": student.trust_tier.value.title() if student and student.trust_tier else "Bronze"
        })
        
    assigned_name = job.assigned_student.full_name if job.assigned_student else "Pending Assignment"
        
    return {
        "id": job.id,
        "title": job.title,
        "category": job.category,
        "escrow_amount": job.escrow_amount,
        "status": job.status.value if hasattr(job.status, 'value') else job.status,
        "deadline": job.deadline,
        "created_at": job.created_at,
        "client_id": job.client_id,
        "pitches": sorted(formatted_pitches, key=lambda x: x['ai_match_score'], reverse=True),
        "assigned_student_name": assigned_name
    }


@router.get("/{client_id}/pipeline", response_model=List[PipelineJob])
def get_pipeline(client_id: str = Depends(verify_ownership), db: Session = Depends(get_db)):
    jobs = db.query(Job).filter(
        Job.client_id == client_id,
        Job.status.in_([JobStatus.assigned, JobStatus.in_progress, JobStatus.review])
    ).order_by(Job.created_at.desc()).all()
    
    result = []
    for job in jobs:
        student_name = job.assigned_student.full_name if job.assigned_student else "Pending Assignment"
        result.append({
            "id": job.id,
            "title": job.title,
            "category": job.category,
            "escrow_amount": job.escrow_amount,
            "status": job.status.value if hasattr(job.status, 'value') else job.status,
            "created_at": job.created_at,
            "assigned_student_name": student_name
        })
    return result


@router.post("/{client_id}/jobs/{job_id}/signoff")
def signoff_job(job_id: str, client_id: str = Depends(verify_ownership), db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id, Job.client_id == client_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job.status = JobStatus.completed
    
    if job.assigned_student:
        current_balance = getattr(job.assigned_student, 'wallet_balance', 0.0)
        job.assigned_student.wallet_balance = current_balance + job.escrow_amount
        
    db.commit()
    return {"status": "success", "message": "Escrow released successfully"}


@router.get("/{client_id}/automations", response_model=List[AutomationResponse])
def get_automations(client_id: str = Depends(verify_ownership), db: Session = Depends(get_db)):
    jobs = db.query(Job).filter(
        Job.client_id == client_id,
        Job.cron_schedule.is_not(None) 
    ).order_by(Job.created_at.desc()).all()
    
    result = []
    for job in jobs:
        student_name = job.assigned_student.full_name if job.assigned_student else "Auto-matched Pool"
        result.append({
            "id": job.id,
            "title": job.title,
            "category": job.category,
            "cron_schedule": job.cron_schedule,
            "is_cron_active": job.is_cron_active,
            "escrow_amount": job.escrow_amount,
            "created_at": job.created_at,
            "assigned_student_name": student_name
        })
    return result


@router.patch("/{client_id}/automations/{job_id}/toggle")
def toggle_automation(job_id: str, client_id: str = Depends(verify_ownership), db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id, Job.client_id == client_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Automation not found")
    
    job.is_cron_active = not job.is_cron_active
    db.commit()
    return {"status": "success", "is_cron_active": job.is_cron_active}


@router.get("/{client_id}/profile")
def get_business_profile(client_id: str = Depends(verify_ownership), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == client_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Client not found")
        
    total_jobs = db.query(Job).filter(Job.client_id == client_id).count()
    active_jobs = db.query(Job).filter(
        Job.client_id == client_id, 
        Job.status.in_([JobStatus.collecting_pitches, JobStatus.assigned, JobStatus.in_progress])
    ).count()
    
    recent_jobs = db.query(Job).filter(Job.client_id == client_id).order_by(Job.created_at.desc()).limit(3).all()

    return {
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "profile_data": user.profile_data or {},
        "metrics": {"total_jobs": total_jobs, "active_jobs": active_jobs},
        "recent_jobs": [{"id": j.id, "title": j.title, "budget": j.escrow_amount, "status": j.status.value if hasattr(j.status, 'value') else j.status} for j in recent_jobs]
    }


@router.patch("/{client_id}/profile")
def update_business_profile(payload: ProfileUpdatePayload, client_id: str = Depends(verify_ownership), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == client_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Client not found")
        
    if payload.full_name:
        user.full_name = payload.full_name
    if payload.profile_data:
        current_data = user.profile_data or {}
        user.profile_data = {**current_data, **payload.profile_data}
        
    db.commit()
    return {"status": "success"}


@router.get("/{client_id}/billing", response_model=BusinessBillingResponse)
def get_business_billing(client_id: str = Depends(verify_ownership), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == client_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Client not found")

    active_jobs = db.query(Job).filter(
        Job.client_id == client_id,
        Job.status.in_([JobStatus.collecting_pitches, JobStatus.assigned, JobStatus.in_progress, JobStatus.review])
    ).all()
    active_escrow = sum(j.escrow_amount for j in active_jobs)
    
    completed_jobs = db.query(Job).filter(
        Job.client_id == client_id,
        Job.status == JobStatus.completed
    ).order_by(Job.created_at.desc()).limit(5).all()

    invoices = [{
        "id": job.id,
        "title": job.title,
        "date": job.created_at.strftime("%b %d, %Y"),
        "amount": job.escrow_amount
    } for job in completed_jobs]

    payment_methods = []
    if user.stripe_customer_id:
        try:
            customer = stripe.Customer.retrieve(user.stripe_customer_id)
            default_pm = customer.invoice_settings.default_payment_method

            pms = stripe.PaymentMethod.list(
                customer=user.stripe_customer_id,
                type="card",
                limit=3
            )
            for pm in pms.data:
                payment_methods.append({
                    "id": pm.id,
                    "brand": pm.card.brand.upper(),
                    "last4": pm.card.last4,
                    "exp_month": pm.card.exp_month,
                    "exp_year": pm.card.exp_year,
                    "is_default": pm.id == default_pm
                })
        except Exception as e:
            print(f"Stripe error: {e}")

    return {
        "active_escrow": active_escrow,
        "active_jobs_count": len(active_jobs),
        "payment_methods": payment_methods,
        "recent_invoices": invoices
    }


@router.post("/{client_id}/stripe/portal")
def create_customer_portal(client_id: str = Depends(verify_ownership), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == client_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Client not found")

    try:
        if not user.stripe_customer_id:
            customer = stripe.Customer.create(
                email=user.email,
                name=user.full_name
            )
            user.stripe_customer_id = customer.id
            db.commit()

        session = stripe.billing_portal.Session.create(
            customer=user.stripe_customer_id,
            return_url="http://localhost:3000/business/billing"
        )
        return {"url": session.url}
    except stripe.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/trigger-automations", tags=["Automations"])
def trigger_cron_automations(db: Session = Depends(get_db)):
    """
    This endpoint acts as the 'Cron Engine'. 
    When called, it finds all active recurring jobs and creates a fresh copy 
    in the 'collecting_pitches' status.
    """
    try:
        # 1. Find all parent jobs where cron is actively running
        active_crons = db.query(Job).filter(
            Job.is_cron_active == True,
            Job.cron_schedule.is_not(None)
        ).all()

        jobs_created = 0

        for parent_job in active_crons:
            # 2. Logic to determine if it's time to trigger based on schedule
            # (For this hackathon demo, we will bypass the actual time-check 
            # and just forcefully duplicate the job to prove it works).
            
            # 3. Create the duplicate child job
            new_job = Job(
                client_id=parent_job.client_id,
                title=f"{parent_job.title} (Auto-Generated)",
                category=parent_job.category,
                prompt_text=parent_job.prompt_text,
                escrow_amount=parent_job.escrow_amount,
                # Reset the status so students can pitch again
                status=JobStatus.collecting_pitches, 
                # Ensure the child is NOT a cron job itself
                is_cron_active=False,
                cron_schedule=None,
                # Set a generic deadline 7 days from now
                deadline=datetime.utcnow() + timedelta(days=7)
            )
            
            db.add(new_job)
            jobs_created += 1

        db.commit()
        return {"status": "success", "automations_triggered": jobs_created}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))