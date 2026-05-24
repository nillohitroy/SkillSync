from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import uuid
import hashlib
import bcrypt

from app.core.database import get_db
from app.models.schema import User, UserRole  # Ensure UserRole is imported!

router = APIRouter()

# --- Schemas ---
class UserRegister(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    role: str # "sme" or "student"
    company_name: Optional[str] = None
    college: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

# --- Routes ---
@router.post("/register")
def register_user(payload: UserRegister, db: Session = Depends(get_db)):
    normalized_email = payload.email.strip().lower()

    # 1. Check if email already exists
    existing_user = db.query(User).filter(User.email == normalized_email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2. Safely cast the role to the SQLAlchemy Enum
    try:
        safe_role = UserRole(payload.role.strip().lower())
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid role. Must be 'student' or 'sme'")

    # 3. Hash the password
    pre_hashed = hashlib.sha256(payload.password.encode('utf-8')).hexdigest()
    hashed_pwd_bytes = bcrypt.hashpw(pre_hashed.encode('utf-8'), bcrypt.gensalt())
    hashed_pwd = hashed_pwd_bytes.decode('utf-8')

    # 4. Structure Profile Data
    profile_data = {}
    if safe_role == UserRole.sme:
        profile_data["company_type"] = "Unspecified"
        if payload.company_name:
            profile_data["company_name"] = payload.company_name
    elif safe_role == UserRole.student:
        profile_data["experience_level"] = "Beginner"
        if payload.college:
            profile_data["college"] = payload.college

    # 5. Create User
    new_user = User(
        id=str(uuid.uuid4()),
        email=normalized_email,
        full_name=f"{payload.first_name.strip()} {payload.last_name.strip()}",
        hashed_password=hashed_pwd,
        role=safe_role,
        profile_data=profile_data
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 6. Auto-Login: Return the EXACT same structure as the login route
    return {
        "status": "success",
        "user_id": new_user.id,
        "role": new_user.role.value,  # .value extracts "student" instead of "UserRole.student"
        "full_name": new_user.full_name,
        "email": new_user.email,
        "access_token": "temporary-dummy-token"
    }


@router.post("/login")
def login_user(payload: UserLogin, db: Session = Depends(get_db)):
    normalized_email = payload.email.strip().lower()

    # 1. Find user by email
    user = db.query(User).filter(User.email == normalized_email).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 2. Verify Password
    pre_hashed_attempt = hashlib.sha256(payload.password.encode('utf-8')).hexdigest()
    
    is_password_correct = bcrypt.checkpw(
        pre_hashed_attempt.encode('utf-8'), 
        user.hashed_password.encode('utf-8')
    )

    if not is_password_correct:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # 3. Return Payload
    return {
        "status": "success",
        "user_id": user.id,
        "role": user.role.value, # .value extracts the raw string to prevent frontend mismatches
        "full_name": user.full_name,
        "email": user.email,
        "access_token": "temporary-dummy-token"
    }