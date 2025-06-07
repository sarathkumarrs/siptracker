from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from fastapi import Depends
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Supabase database connection
DATABASE_URL = os.getenv("DATABASE_URL")

# Alternative way to construct the URL if you prefer individual env vars
# SUPABASE_HOST = os.getenv("SUPABASE_HOST")
# SUPABASE_DB = os.getenv("SUPABASE_DB") 
# SUPABASE_USER = os.getenv("SUPABASE_USER")
# SUPABASE_PASSWORD = os.getenv("SUPABASE_PASSWORD")
# SUPABASE_PORT = os.getenv("SUPABASE_PORT", "5432")
# DATABASE_URL = f"postgresql://{SUPABASE_USER}:{SUPABASE_PASSWORD}@{SUPABASE_HOST}:{SUPABASE_PORT}/{SUPABASE_DB}"

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=300,
    echo=False  # Set to True for debugging SQL queries
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --- ADD THIS NEW FUNCTION ---
def create_db_and_tables():
    # Import your models here so Base.metadata knows about them
    # Make sure this import path is correct relative to database.py
    from . import models
    
    print("Attempting to create database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created (if they didn't already exist).")