from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import stripe
import os

from app.core.database import get_db
from app.models.schema import User, Job, JobStatus
from app.schemas.students import StudentDashboardResponse, MarketJob, WorkspaceJob, EarningsResponse, StudentBillingResponse
from app.schemas.profile import ProfileUpdatePayload

import random
from datetime import datetime

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_your_key_here")

@router.get("/{student_id}/dashboard", response_model=StudentDashboardResponse)
def get_student_dashboard(student_id: str, db: Session = Depends(get_db)):
    # 1. Verify student exists
    student = db.query(User).filter(User.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # 2. Fetch jobs assigned to this student that are actively in the pipeline
    active_jobs = db.query(Job).filter(
        Job.assigned_student_id == student_id,
        Job.status.in_([JobStatus.assigned, JobStatus.in_progress, JobStatus.review])
    ).all()

    # Calculate their total locked escrow
    pending_escrow = sum(job.escrow_amount for job in active_jobs)

    # 3. Find Recommended Jobs (Jobs collecting pitches that they HAVEN'T pitched for yet)
    pitched_job_ids = [pitch.job_id for pitch in student.pitches]
    
    recommendation_query = db.query(Job).filter(Job.status == JobStatus.collecting_pitches)
    if pitched_job_ids:
        recommendation_query = recommendation_query.filter(~Job.id.in_(pitched_job_ids))
        
    recommended_jobs = recommendation_query.order_by(Job.created_at.desc()).limit(3).all()

    # 4. Return payload
    return {
        "id": student.id,
        "full_name": student.full_name,
        "xp_points": student.xp_points,
        "trust_tier": student.trust_tier.value if student.trust_tier else "bronze",
        "pending_escrow": pending_escrow,
        "active_deliverables": active_jobs,
        "recommended_jobs": recommended_jobs
    }

@router.get("/{student_id}/market", response_model=List[MarketJob])
def get_job_market(student_id: str, db: Session = Depends(get_db)):
    # 1. Fetch the student to see what they've already pitched for
    student = db.query(User).filter(User.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    pitched_job_ids = [pitch.job_id for pitch in student.pitches]

    # 2. Fetch jobs collecting pitches that the student HAS NOT pitched for
    query = db.query(Job).filter(Job.status == JobStatus.collecting_pitches)
    if pitched_job_ids:
        query = query.filter(~Job.id.in_(pitched_job_ids))
        
    available_jobs = query.order_by(Job.created_at.desc()).all()

    # 3. Format the response
    results = []
    for job in available_jobs:
        # Mocking the AI match score for now, keeping it between 70-99
        mock_match_score = random.randint(70, 99) 
        
        results.append({
            "id": job.id,
            "title": job.title,
            "client": job.client.full_name if job.client else "Local Business",
            "category": job.category,
            "budget": job.escrow_amount,
            "match": mock_match_score,
            "posted": job.created_at,
            "desc": job.prompt_text
        })

    return results

@router.get("/{student_id}/workspaces", response_model=List[WorkspaceJob])
def get_student_workspaces(student_id: str, db: Session = Depends(get_db)):
    """Fetches all active jobs assigned to the student."""
    jobs = db.query(Job).filter(
        Job.assigned_student_id == student_id,
        Job.status.in_([JobStatus.assigned, JobStatus.in_progress, JobStatus.review])
    ).order_by(Job.deadline.asc()).all()
    
    results = []
    for job in jobs:
        results.append({
            "id": job.id,
            "title": job.title,
            "client": job.client.full_name if job.client else "Local Business",
            "status": job.status.value if hasattr(job.status, 'value') else job.status,
            "deadline": job.deadline,
            "escrow_amount": job.escrow_amount,
            "prompt_text": job.prompt_text
        })
    return results

@router.get("/{student_id}/jobs/{job_id}", response_model=WorkspaceJob)
def get_student_workspace_detail(student_id: str, job_id: str, db: Session = Depends(get_db)):
    """Fetches details for a specific workspace job."""
    job = db.query(Job).filter(
        Job.id == job_id, 
        Job.assigned_student_id == student_id
    ).first()
    
    if not job:
        raise HTTPException(status_code=404, detail="Workspace not found")
        
    return {
        "id": job.id,
        "title": job.title,
        "client": job.client.full_name if job.client else "Local Business",
        "status": job.status.value if hasattr(job.status, 'value') else job.status,
        "deadline": job.deadline,
        "escrow_amount": job.escrow_amount,
        "prompt_text": job.prompt_text
    }

@router.post("/{student_id}/jobs/{job_id}/submit")
def submit_job_deliverables(student_id: str, job_id: str, db: Session = Depends(get_db)):
    """Moves the job from 'in_progress' to 'review'."""
    job = db.query(Job).filter(
        Job.id == job_id, 
        Job.assigned_student_id == student_id
    ).first()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    job.status = JobStatus.review
    db.commit()
    return {"status": "success", "message": "Deliverables submitted for review"}

@router.get("/{student_id}/earnings", response_model=EarningsResponse)
def get_student_earnings(student_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == student_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Student not found")

    # 1. Calculate Locked Escrow
    active_jobs = db.query(Job).filter(
        Job.assigned_student_id == student_id,
        Job.status.in_([JobStatus.assigned, JobStatus.in_progress, JobStatus.review])
    ).all()
    locked_escrow = sum(j.escrow_amount for j in active_jobs)

    # 2. Calculate Lifetime Earnings
    completed_jobs = db.query(Job).filter(
        Job.assigned_student_id == student_id,
        Job.status == JobStatus.completed
    ).order_by(Job.created_at.desc()).all()
    lifetime_earnings = sum(j.escrow_amount for j in completed_jobs)

    available_balance = getattr(user, 'wallet_balance', 0.0)

    # 3. Dynamically Generate the Transaction Ledger
    transactions = []
    
    # Add a transaction for every completed job
    for job in completed_jobs:
        transactions.append({
            "id": f"TRX-JOB-{job.id[:6].upper()}",
            "date": job.created_at.strftime("%b %d, %Y"),
            "description": job.title,
            "client": job.client.full_name if job.client else "Platform Client",
            "type": "Escrow Release",
            "amount": f"+₹{job.escrow_amount:,.0f}",
            "status": "Cleared",
            "statusColor": "text-teal-600 bg-teal-100 dark:text-teal-400 dark:bg-teal-900/30",
            "raw_date": job.created_at # For sorting
        })

    # Calculate exactly how much money the student has previously withdrawn
    withdrawn_amount = lifetime_earnings - available_balance
    if withdrawn_amount > 0:
        transactions.append({
            "id": "TRX-WD-PAYOUT",
            "date": datetime.utcnow().strftime("%b %d, %Y"),
            "description": "Bank Withdrawal (Platform Payout)",
            "client": "Self",
            "type": "Withdrawal",
            "amount": f"-₹{withdrawn_amount:,.0f}",
            "status": "Processed",
            "statusColor": "text-zinc-600 bg-zinc-100 dark:text-zinc-400 dark:bg-zinc-800",
            "raw_date": datetime.utcnow()
        })

    # Sort newest to oldest
    transactions.sort(key=lambda x: x["raw_date"], reverse=True)

    return {
        "available_balance": available_balance,
        "locked_escrow": locked_escrow,
        "lifetime_earnings": lifetime_earnings,
        "transactions": transactions
    }

@router.post("/{student_id}/withdraw")
def withdraw_funds(student_id: str, db: Session = Depends(get_db)):
    """Triggers a Stripe Payout to the student's connected bank account."""
    user = db.query(User).filter(User.id == student_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Student not found")

    current_balance = getattr(user, 'wallet_balance', 0.0)
    if current_balance <= 0:
        raise HTTPException(status_code=400, detail="Insufficient funds")

    # 1. Verify the student has connected a Stripe account
    if not getattr(user, 'stripe_account_id', None):
        raise HTTPException(
            status_code=403, 
            detail="STRIPE_NOT_CONNECTED: You must link your bank account via Stripe before withdrawing."
        )

    try:
        # 2. Convert INR to paise (Stripe requires the smallest currency unit)
        amount_in_paise = int(current_balance * 100)

        # 3. Create the Payout on their connected account
        payout = stripe.Payout.create(
            amount=amount_in_paise,
            currency="inr",
            stripe_account=user.stripe_account_id
        )

        # 4. If Stripe succeeds, empty the local wallet
        user.wallet_balance = 0.0
        db.commit()
        
        return {
            "status": "success", 
            "withdrawn": current_balance, 
            "stripe_payout_id": payout.id
        }

    except stripe.StripeError as e:
        # Catch any actual Stripe errors (e.g., bank rejected, account restricted)
        raise HTTPException(status_code=400, detail=f"Stripe Error: {str(e)}")
    
@router.get("/{student_id}/billing", response_model=StudentBillingResponse)
def get_student_billing(student_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == student_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Student not found")

    # 1. Gather live database values
    available_balance = getattr(user, 'wallet_balance', 0.0)
    
    # Calculate pending escrow jobs
    pending_jobs = db.query(Job).filter(
        Job.assigned_student_id == student_id,
        Job.status == JobStatus.review
    ).all()
    pending_payouts = sum(j.escrow_amount for j in pending_jobs)

    # Calculate current month's completed jobs volume
    completed_jobs = db.query(Job).filter(
        Job.assigned_student_id == student_id,
        Job.status == JobStatus.completed
    ).all()
    monthly_earnings = sum(j.escrow_amount for j in completed_jobs) # Can filter by current month timestamp if needed

    # 2. Check live status from Stripe if account exists
    is_connected = False
    account_status = "unlinked"
    linked_cards = []

    stripe_id = getattr(user, 'stripe_account_id', None)
    if stripe_id:
        try:
            stripe_acct = stripe.Account.retrieve(stripe_id)
            is_connected = stripe_acct.get("details_submitted", False)
            account_status = "active" if is_connected else "pending"
            
            # Fetch external accounts (linked cards/banks) for payout destinations
            external_accounts = stripe.Account.list_external_accounts(
                stripe_id,
                object="card",
                limit=3
            )
            for card in external_accounts.get("data", []):
                linked_cards.append({
                    "id": card.id,
                    "brand": card.brand,
                    "last4": card.last4,
                    "is_default": card.default_for_currency
                })
        except Exception:
            account_status = "unlinked"

    # Mock historical ledger structure built out dynamically
    transactions = []
    for job in completed_jobs:
        transactions.append({
            "id": f"TRX-{job.id[:6].upper()}",
            "description": f"{job.title} - Final Payout",
            "client": job.client.full_name if job.client else "Platform Client",
            "date": job.created_at.strftime("%b %d, %Y"),
            "amount": f"+₹{job.escrow_amount:,.0f}",
            "type": "Escrow Release",
            "status": "Cleared",
            "statusColor": "text-teal-600 bg-teal-100 dark:text-teal-400 dark:bg-teal-900/30"
        })

    for job in pending_jobs:
        transactions.append({
            "id": f"TRX-{job.id[:6].upper()}",
            "description": f"{job.title} - In Escrow",
            "client": job.client.full_name if job.client else "Platform Client",
            "date": job.created_at.strftime("%b %d, %Y"),
            "amount": f"₹{job.escrow_amount:,.0f}",
            "type": "Escrow Hold",
            "status": "In Review",
            "statusColor": "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30"
        })

    return {
        "available_balance": available_balance,
        "monthly_earnings": monthly_earnings,
        "pending_payouts": pending_payouts,
        "is_stripe_connected": is_connected,
        "stripe_account_status": account_status,
        "linked_cards": linked_cards,
        "transactions": transactions
    }

@router.post("/{student_id}/stripe/onboard")
def generate_stripe_onboarding(student_id: str, db: Session = Depends(get_db)):
    """Creates a Stripe Custom/Express account and returns a dynamic setup URL."""
    user = db.query(User).filter(User.id == student_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Student not found")

    # Generate a new account id if they don't have one initialized
    if not getattr(user, 'stripe_account_id', None):
        try:
            new_acct = stripe.Account.create(
                type="express",
                country="IN",
                capabilities={"transfers": {"requested": True}},
                business_type="individual",
                individual={"email": user.email}
            )
            user.stripe_account_id = new_acct.id
            db.commit()
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Stripe initialization error: {str(e)}")

    # Create setup session link redirecting back to workspace layout
    try:
        account_link = stripe.AccountLink.create(
            account=user.stripe_account_id,
            refresh_url="http://localhost:3000/student/earnings",
            return_url="http://localhost:3000/student/earnings",
            type="account_onboarding",
        )
        return {"url": account_link.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{student_id}/stripe/dashboard")
def generate_stripe_portal(student_id: str, db: Session = Depends(get_db)):
    """Generates direct dashboard access to edit payout mechanisms and cards securely."""
    user = db.query(User).filter(User.id == student_id).first()
    if not user or not getattr(user, 'stripe_account_id', None):
        raise HTTPException(status_code=400, detail="No active Stripe link found.")
        
    try:
        login_link = stripe.Account.create_login_link(user.stripe_account_id)
        return {"url": login_link.url}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/{student_id}/profile")
def get_student_profile(student_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == student_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Student not found")
        
    # Pull completed jobs to act as the student's dynamic portfolio
    completed_jobs = db.query(Job).filter(
        Job.assigned_student_id == student_id,
        Job.status == JobStatus.completed
    ).order_by(Job.created_at.desc()).limit(4).all()

    return {
        "id": user.id,
        "full_name": user.full_name,
        "trust_tier": user.trust_tier.value if user.trust_tier else "bronze",
        "profile_data": user.profile_data or {},
        "portfolio": [{"id": j.id, "title": j.title, "category": j.category} for j in completed_jobs]
    }

@router.patch("/{student_id}/profile")
def update_student_profile(student_id: str, payload: ProfileUpdatePayload, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == student_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Student not found")
        
    if payload.full_name:
        user.full_name = payload.full_name
    if payload.profile_data:
        current_data = user.profile_data or {}
        user.profile_data = {**current_data, **payload.profile_data}
        
    db.commit()
    return {"status": "success"}