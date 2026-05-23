from pydantic import BaseModel
from typing import List
from datetime import datetime

# --- Shared Schemas ---
class JobSummary(BaseModel):
    id: str
    title: str
    category: str
    escrow_amount: float
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True # Tells Pydantic to read SQLAlchemy models

# --- Business Dashboard Schemas ---
class BusinessStats(BaseModel):
    total_active_volume: float
    awaiting_signoff: int
    active_tasks: int

class BusinessDashboardResponse(BaseModel):
    stats: BusinessStats
    active_pipeline: List[JobSummary]