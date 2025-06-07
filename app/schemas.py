from pydantic import BaseModel, Field
from datetime import date

class UserBase(BaseModel):
    username: str
    email: str | None = None # Make email optional or required based on your need

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool = True # Assuming active by default

    class Config:
        from_attributes = True


class SipPlanBase(BaseModel):
    scheme_name: str = Field(..., example="Parag Parikh Flexi Cap")
    monthly_amount: float = Field(..., gt=0, example=5000.0) # gt=0 ensures amount is positive
    start_date: date = Field(..., example="2024-01-01") # Pydantic will validate date format

class SipPlanCreate(SipPlanBase):
    pass # No extra fields needed for creation beyond base

class SipPlanResponse(SipPlanBase):
    id: int
    owner_id: int # The ID of the user who owns this SIP

    class Config:
        from_attributes = True

# --- NEW SIP SUMMARY SCHEMA ---
class SipSummary(BaseModel):
    scheme_name: str
    total_invested: float
    months_invested: int