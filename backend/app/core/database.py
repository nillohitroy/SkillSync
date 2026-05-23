from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Create the SQLAlchemy engine using psycopg3
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True, # Verifies connection health before using it
    echo=False # Set to True to print SQL queries in the terminal during dev
)

# SessionLocal will be used to spawn individual database sessions per request
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# All ORM models will inherit from this Base class
Base = declarative_base()

# Dependency to yield a database session and close it automatically
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()