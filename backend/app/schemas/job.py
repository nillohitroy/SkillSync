from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

# What we expect from the Next.js form
class JobCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=100)
    category: str
    deadline: datetime
    prompt_text: str = Field(..., min_length=20)
    escrow_amount: float = Field(..., gt=0) # Must be strictly greater than 0
    cron_schedule: Optional[str] = None

# What we return back to the frontend
class JobResponse(BaseModel):
    id: str
    title: str
    category: str
    escrow_amount: float
    status: str
    deadline: datetime
    created_at: datetime
    client_id: str

    class Config:
        from_attributes = True

class PitchSummary(BaseModel):
    id: str
    content: str
    ai_match_score: int
    is_accepted: bool
    student_name: str
    student_tier: str

class PipelineJob(BaseModel):
    id: str
    title: str
    category: str
    escrow_amount: float
    status: str
    created_at: datetime
    assigned_student_name: Optional[str] = None
    
    class Config:
        from_attributes = True

# Extends JobResponse to include the array of pitches and assigned student
class JobDetailResponse(JobResponse):
    pitches: List[PitchSummary]
    assigned_student_name: Optional[str] = None

class AutomationResponse(BaseModel):
    id: str
    title: str
    category: str
    cron_schedule: str
    is_cron_active: bool
    escrow_amount: float
    created_at: datetime
    assigned_student_name: Optional[str] = None
    
    class Config:
        from_attributes = True