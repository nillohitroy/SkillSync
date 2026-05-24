from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.schemas.dashboard import JobSummary

class StudentDashboardResponse(BaseModel):
    id: str
    full_name: str
    xp_points: int
    trust_tier: str
    pending_escrow: float
    active_deliverables: List[JobSummary]
    recommended_jobs: List[JobSummary]

class MarketJob(BaseModel):
    id: str
    title: str
    client: str
    category: str
    budget: float
    match: int
    posted: datetime
    desc: str

    class Config:
        from_attributes = True


class WorkspaceJob(BaseModel):
    id: str
    title: str
    client: str
    status: str
    deadline: datetime
    escrow_amount: float
    prompt_text: str

    class Config:
        from_attributes = True


class TransactionItem(BaseModel):
    id: str
    date: str
    description: str
    client: str
    type: str
    amount: str
    status: str
    statusColor: str

class EarningsResponse(BaseModel):
    available_balance: float
    locked_escrow: float
    lifetime_earnings: float
    transactions: List[TransactionItem]

class LinkedCard(BaseModel):
    id: str
    brand: str
    last4: str
    is_default: bool

class StudentBillingResponse(BaseModel):
    available_balance: float
    monthly_earnings: float
    pending_payouts: float
    is_stripe_connected: bool
    stripe_account_status: str  # "unlinked", "pending", "active"
    linked_cards: List[LinkedCard]
    transactions: List[dict]