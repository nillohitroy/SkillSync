from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import os
import sys
import json

# --- RAG INTEGRATION ---
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from app.core.database import get_db
from app.api.routes import business, student, auth

# --- IMPORT RAG PIPELINE ---
from rag.search_engine import find_matching_jobs
from rag.match_generator import generate_match_analysis
from rag.pitch_assistant import evaluate_pitch

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://skill-sync-one-delta.vercel.app/", "https://skill-sync-one-delta.vercel.app", "https://skill-sync-git-main-nillohit-roy-s-projects.vercel.app/", "https://skill-sync-git-main-nillohit-roy-s-projects.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(business.router, prefix="/api/business", tags=["Business"])
app.include_router(student.router, prefix="/api/student", tags=["Student"])
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])


# --- AI JOB MATCHING ENDPOINT (RAG) ---
class MatchRequest(BaseModel):
    student_criteria: str

class PitchRequest(BaseModel):
    job_title: str
    job_description: str
    student_pitch: str

@app.post("/api/match-jobs", tags=["AI Matching"])
async def match_jobs(request: MatchRequest):
    """
    Takes a student's search criteria, retrieves matching jobs via Supabase pgvector, 
    and uses Gemini to generate a personalized match analysis.
    """
    try:
        # 1. Retrieve relevant jobs from Supabase Vector DB
        retrieved_jobs = find_matching_jobs(request.student_criteria)
        
        if not retrieved_jobs:
            return {"message": "No suitable jobs found matching your criteria."}

        # 2. Generate the RAG-based analysis using Gemini
        analysis = generate_match_analysis(request.student_criteria, retrieved_jobs)
        
        return {
            "analysis": analysis,
            # THE FIX: Return the full job context to power the frontend cards
            "jobs_found": [
                {
                    "id": job['id'], 
                    "title": job['title'],
                    "similarity": job.get('similarity', 0.9), # From pgvector
                    "description": job.get('description', ''),
                    "escrow_amount": job.get('escrow_amount', 1500) 
                } for job in retrieved_jobs
            ]
        }
        
    except Exception as e:
        # Catch errors (like missing API keys or DB timeouts) and return cleanly to the frontend
        raise HTTPException(status_code=500, detail=f"RAG Pipeline Error: {str(e)}")

@app.post("/api/evaluate-pitch", tags=["Smart Assistant"])
async def analyze_pitch(request: PitchRequest):
    """
    Intercepts a student's pitch and provides AI coaching to improve it 
    before it gets sent to the business.
    """
    try:
        # Call Gemini
        raw_json_string = evaluate_pitch(
            request.job_title, 
            request.job_description, 
            request.student_pitch
        )
        
        # Parse the JSON string returned by Gemini into a Python dictionary 
        # so FastAPI can return it cleanly to the frontend
        feedback_data = json.loads(raw_json_string)
        
        return feedback_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Assistant Error: {str(e)}")

# --- HEALTH CHECK ---
@app.get("/")
def health_check(db: Session = Depends(get_db)):
    """
    Verifies that the API is running and successfully connected to Supabase.
    """
    try:
        # Execute a simple query to test the psycopg3 connection
        db.execute(text("SELECT 1"))
        db_status = "Connected to Supabase"
    except Exception as e:
        db_status = f"Database connection failed: {str(e)}"

    return {
        "status": "Online",
        "database": db_status
    }