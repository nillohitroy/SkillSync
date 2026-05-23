from fastapi import FastAPI, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import get_db
from app.api.routes import business

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(business.router, prefix="/api/business", tags=["Business"])

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