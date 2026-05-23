from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from app.core.database import get_db
from app.models.schema import Job, JobStatus, User
from app.schemas.dashboard import BusinessDashboardResponse, BusinessStats, JobSummary
from app.schemas.job import JobCreate, JobResponse, JobDetailResponse, PipelineJob, AutomationResponse

router = APIRouter()

@router.get("/{client_id}/dashboard", response_model=BusinessDashboardResponse)
def get_business_dashboard(client_id: str, db: Session = Depends(get_db)):
    # 1. Verify the client exists
    client = db.query(User).filter(User.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    # 2. Fetch all active jobs for this specific SME
    active_jobs = db.query(Job).filter(
        Job.client_id == client_id,
        Job.status != JobStatus.completed
    ).all()

    # 3. Calculate dynamic metrics based on the real database state
    total_volume = sum(job.escrow_amount for job in active_jobs)
    awaiting_signoff = sum(1 for job in active_jobs if job.status == JobStatus.review)
    
    stats = BusinessStats(
        total_active_volume=total_volume,
        awaiting_signoff=awaiting_signoff,
        active_tasks=len(active_jobs)
    )

    # 4. Return the structured payload
    return BusinessDashboardResponse(
        stats=stats,
        active_pipeline=active_jobs
    )


@router.post("/{client_id}/jobs", response_model=JobResponse)
def create_new_job(client_id: str, job_data: JobCreate, db: Session = Depends(get_db)):
    # 1. Verify the client exists
    client = db.query(User).filter(User.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    # 2. Convert the Pydantic schema into a SQLAlchemy database model
    new_job = Job(
        **job_data.model_dump(), 
        client_id=client_id,
        status=JobStatus.collecting_pitches # Sets initial pipeline stage
    )

    # 3. Save to Supabase
    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    return new_job


@router.get("/{client_id}/jobs", response_model=List[JobResponse])
def get_business_jobs(client_id: str, db: Session = Depends(get_db)):
    """
    Fetches all jobs posted by a specific SME, ordered by newest first.
    """
    # 1. Verify the client exists
    client = db.query(User).filter(User.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    # 2. Fetch all jobs for this client
    jobs = db.query(Job).filter(
        Job.client_id == client_id
    ).order_by(Job.created_at.desc()).all()

    return jobs


@router.get("/{client_id}/jobs/{job_id}")
def get_job_details(client_id: str, job_id: str, db: Session = Depends(get_db)):
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
def get_pipeline(client_id: str, db: Session = Depends(get_db)):
    """
    Fetches only jobs that are actively being worked on.
    """
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
def signoff_job(client_id: str, job_id: str, db: Session = Depends(get_db)):
    """
    Triggers the digital sign-off and releases the escrow.
    """
    job = db.query(Job).filter(Job.id == job_id, Job.client_id == client_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Update the state machine to completed
    job.status = JobStatus.completed
    db.commit()
    
    return {"status": "success", "message": "Escrow released successfully"}

@router.get("/{client_id}/automations", response_model=List[AutomationResponse])
def get_automations(client_id: str, db: Session = Depends(get_db)):
    """
    Fetches only jobs that have a recurring cron schedule attached.
    """
    jobs = db.query(Job).filter(
        Job.client_id == client_id,
        Job.cron_schedule.is_not(None) # Only get recurring tasks
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
def toggle_automation(client_id: str, job_id: str, db: Session = Depends(get_db)):
    """
    Flips the active/paused state of a specific automation.
    """
    job = db.query(Job).filter(Job.id == job_id, Job.client_id == client_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Automation not found")
    
    # Flip the boolean
    job.is_cron_active = not job.is_cron_active
    db.commit()
    
    return {"status": "success", "is_cron_active": job.is_cron_active}