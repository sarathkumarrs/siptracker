# app/models.py
from sqlalchemy import Column, Integer, String, Boolean, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True, nullable=True)
    password_hash = Column(String)
    is_active = Column(Boolean, default=True)

    sips = relationship("SIP", back_populates="owner")


class SIP(Base):
    __tablename__ = "sips"

    id = Column(Integer, primary_key=True, index=True)
    scheme_name = Column(String, index=True)
    monthly_amount = Column(Float) 
    start_date = Column(Date)

    # Foreign Key to link to the User
    owner_id = Column(String, ForeignKey("users.id")) # <-- Links to users.id

    # Define the relationship to User
    owner = relationship("User", back_populates="sips")
