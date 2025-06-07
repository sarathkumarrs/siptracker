from sqlalchemy.orm import Session
from . import models
from .schemas import UserCreate,SipPlanCreate, SipPlanResponse
from passlib.context import CryptContext
from datetime import date
from sqlalchemy import func

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password:str):
    return pwd_context.hash(password)


def create_user(db:Session, user: UserCreate):
    db_user = models.User(
        username=user.username,
        password_hash=hash_password(user.password),
        email=user.email,
        is_active=True
        )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_username(db:Session,username:str):
    return db.query(models.User).filter(models.User.username==username).first()


def get_or_create_user_profile(db: Session, user_id: str, email: str | None = None) -> models.User:
    """
    Checks if a user profile (in public.users) exists for the given Supabase user_id (UUID).
    If not, creates a new profile.
    """
    db_user = db.query(models.User).filter(models.User.id == user_id).first()

    if db_user:
        return db_user
    
    # If user profile doesn't exist, create it.
    # We'll use a placeholder username (e.g., from email or user_id)
    # and no password_hash as auth is handled by Supabase.
    # The 'email' parameter is optional, you might get it from JWT claims if needed.
    
    # If email is not provided, use a generic username from the UUID or just the UUID
    profile_username = email if email else f"user_{user_id[:8]}" # Example: user_uuidprefix
    
    # Create the user profile in your public.users table
    # We're not storing a password_hash here because authentication is via Supabase JWT
    new_user_profile = models.User(
        id=user_id, # Use the Supabase UUID as the primary key
        username=profile_username,
        email=email, # Store email if available
        password_hash="" # Store an empty string or null, as password is not managed here
    )
    db.add(new_user_profile)
    db.commit()
    db.refresh(new_user_profile)
    return new_user_profile

def create_sip_plan(db: Session, sip_plan: SipPlanCreate, user_id: str):
    """
    Creates a new SIP plan for a given user.
    """
    db_sip = models.SIP(
        scheme_name=sip_plan.scheme_name,
        monthly_amount=sip_plan.monthly_amount,
        start_date=sip_plan.start_date,
        owner_id=user_id # Assign the authenticated user's ID
    )
    db.add(db_sip)
    db.commit()
    db.refresh(db_sip)
    return db_sip

def get_user_sips(db: Session, user_id: str):
    """
    Retrieves all SIP plans for a specific user.
    """
    return db.query(models.SIP).filter(models.SIP.owner_id == user_id).all()


def get_sip_summary(db: Session, user_id: str):
    """
    Calculates and returns the SIP summary for a specific user.
    """
    # Get all SIPs for the user
    sips = get_user_sips(db, user_id)

    summary_data = {}
    current_date = date.today()

    for sip in sips:
        scheme_name = sip.scheme_name
        
        # Calculate months invested
        # This is a simplified calculation. For real-world, consider partial months,
        # exact days, etc.
        months_invested = (current_date.year - sip.start_date.year) * 12 + \
                          (current_date.month - sip.start_date.month)
        
        # Ensure months_invested is at least 0 (or 1 if started in current month)
        if months_invested < 0: # Future start date
            months_invested = 0
        elif months_invested == 0 and current_date.day >= sip.start_date.day:
             months_invested = 1 # If started in current month, consider 1 month invested if day has passed
        elif months_invested == 0 and current_date.day < sip.start_date.day:
             months_invested = 0
        else:
             months_invested += 1 # Account for the current month being invested

        total_invested = sip.monthly_amount * months_invested

        if scheme_name not in summary_data:
            summary_data[scheme_name] = {
                "scheme_name": scheme_name,
                "total_invested": 0.0,
                "months_invested": 0
            }
        
        summary_data[scheme_name]["total_invested"] += total_invested
        summary_data[scheme_name]["months_invested"] = max(
            summary_data[scheme_name]["months_invested"],
            months_invested # Use max months_invested for the group, or sum if plans are concurrent
        )
        
    # Convert dictionary to list of SipSummary models
    return list(summary_data.values())
