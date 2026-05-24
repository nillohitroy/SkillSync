from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import uuid
import hashlib
import bcrypt

from app.core.database import get_db
from app.models.schema import User

router = APIRouter()

class UserRegister(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    role: str # "sme" or "student"
    company_name: Optional[str] = None
    college: Optional[str] = None

@router.post("/register")
def register_user(payload: UserRegister, db: Session = Depends(get_db)):
    # 1. Check if email already exists
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2. Hash the password
    # Pre-hash with SHA-256 (creates a 64-character hex string to bypass 72-byte limit)
    pre_hashed = hashlib.sha256(payload.password.encode('utf-8')).hexdigest()
    
    # Hash the resulting hex string with bcrypt directly
    hashed_pwd_bytes = bcrypt.hashpw(pre_hashed.encode('utf-8'), bcrypt.gensalt())
    hashed_pwd = hashed_pwd_bytes.decode('utf-8')

    # 3. Structure the Profile Data based on role
    profile_data = {}
    if payload.role == "sme":
        profile_data["company_type"] = "Unspecified"
        if payload.company_name:
            profile_data["company_name"] = payload.company_name
    elif payload.role == "student":
        profile_data["experience_level"] = "Beginner"
        if payload.college:
            profile_data["college"] = payload.college

    # 4. Create the User
    new_user = User(
        id=str(uuid.uuid4()), # Generate a new UUID
        email=payload.email,
        full_name=f"{payload.first_name} {payload.last_name}",
        hashed_password=hashed_pwd,
        role=payload.role,
        profile_data=profile_data
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"status": "success", "user_id": new_user.id, "role": new_user.role}