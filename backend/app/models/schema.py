from sqlalchemy import String, Integer, Float, ForeignKey, DateTime, Text, Enum, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone
import enum
import uuid

from app.core.database import Base

# --- Enums for strict type safety ---
class UserRole(str, enum.Enum):
    sme = "sme"
    student = "student"

class TrustTier(str, enum.Enum):
    bronze = "bronze"
    silver = "silver"
    gold = "gold"

class JobStatus(str, enum.Enum):
    draft = "draft"
    collecting_pitches = "collecting_pitches"
    assigned = "assigned"
    in_progress = "in_progress"
    review = "review"
    completed = "completed"

# --- Database Models ---

class User(Base):
    __tablename__ = "users"

    # Using UUIDs is standard practice for distributed systems/Supabase
    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole))
    
    # Student specific (Null for SMEs)
    trust_tier: Mapped[TrustTier | None] = mapped_column(Enum(TrustTier), default=TrustTier.bronze)
    xp_points: Mapped[int] = mapped_column(Integer, default=0)
    wallet_balance: Mapped[float] = mapped_column(Float, default=0, server_default="0.0")
    stripe_account_id: Mapped[str | None] = mapped_column(String, nullable=True)
    stripe_customer_id: Mapped[str | None] = mapped_column(String, nullable=True)
    profile_data: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    hashed_password: Mapped[str | None] = mapped_column(String, nullable=True)

    # Relationships
    posted_jobs = relationship("Job", back_populates="client", foreign_keys="Job.client_id")
    pitches = relationship("Pitch", back_populates="student")

class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title: Mapped[str] = mapped_column(String, index=True)
    category: Mapped[str] = mapped_column(String) # e.g., 'Social Media', 'Tech'
    prompt_text: Mapped[str] = mapped_column(Text)
    escrow_amount: Mapped[float] = mapped_column(Float)
    status: Mapped[JobStatus] = mapped_column(Enum(JobStatus), default=JobStatus.collecting_pitches)
    deadline: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    # Cron automation (Null if it's a one-off job)
    cron_schedule: Mapped[str | None] = mapped_column(String)
    is_cron_active: Mapped[bool] = mapped_column(Boolean, default=True)

    client_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    assigned_student_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"))

    # Relationships
    client = relationship("User", foreign_keys=[client_id], back_populates="posted_jobs")
    assigned_student = relationship("User", foreign_keys=[assigned_student_id])
    pitches = relationship("Pitch", back_populates="job")

class Pitch(Base):
    __tablename__ = "pitches"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    content: Mapped[str] = mapped_column(Text)
    ai_match_score: Mapped[int] = mapped_column(Integer) # 0-100 score from your custom LLM
    is_accepted: Mapped[bool] = mapped_column(Boolean, default=False)
    
    job_id: Mapped[str] = mapped_column(ForeignKey("jobs.id"))
    student_id: Mapped[str] = mapped_column(ForeignKey("users.id"))

    # Relationships
    job = relationship("Job", back_populates="pitches")
    student = relationship("User", back_populates="pitches")