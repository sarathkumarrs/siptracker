from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..crud import create_sip_plan, get_sip_summary, get_or_create_user_profile # <-- Import new function
from ..schemas import SipPlanCreate, SipPlanResponse, SipSummary # <-- Ensure all schemas are imported
from ..auth import get_current_user # This gives us the user_id (UUID)

router = APIRouter(
    prefix="/sips",
    tags=["SIPs"],
)

@router.post("/", response_model=SipPlanResponse, status_code=status.HTTP_201_CREATED)
async def create_sip(
    sip_plan: SipPlanCreate,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user) # Authenticated user's UUID
):
    """
    Create a new SIP plan for the authenticated user.
    """
    # --- NEW: Ensure user profile exists in your public.users table ---
    # The 'email' claim from the JWT can be accessed from the 'payload' in get_current_user
    # For now, we'll assume current_user_id is the primary key.
    # A more robust solution might pass the full JWT payload or current user object from auth dependency.
    # For simplicity, we'll pass the user_id and allow get_or_create to use a placeholder if email isn't passed.
    
    # To pass email, you'd modify get_current_user to return a dict with user_id and email,
    # or access the email claim from the JWT payload within this endpoint.
    # Let's assume get_current_user is modified to return a dict:
    # `current_user_data: dict = Depends(get_current_user)` and use `current_user_data['id']` and `current_user_data['email']`
    
    # However, since get_current_user currently returns just the user_id string,
    # we'll proceed by calling get_or_create_user_profile only with the user_id.
    # The email will be null in public.users unless you adjust `get_current_user` to return it.
    
    # Option 1: Simple, assumes email might not be available here, or you'll update it later
    user_profile = get_or_create_user_profile(db, current_user_id) 
    
    # Option 2: If you modify get_current_user to return {'id': ..., 'email': ...}
    # user_profile = get_or_create_user_profile(db, current_user_id['id'], current_user_id['email'])

    db_sip = create_sip_plan(db, sip_plan, user_profile.id) # Use the ID from the profile
    return db_sip


@router.get("/summary", response_model=list[SipSummary])
async def get_sips_summary(
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user)
):
    """
    Get a summary of all SIP plans for the authenticated user, grouped by scheme.
    """
    # Ensure the user profile exists before querying their SIPs
    # Although not strictly necessary if no SIPs exist, it guarantees profile creation on first authenticated GET.
    user_profile = get_or_create_user_profile(db, current_user_id) 
    
    summary = get_sip_summary(db, user_profile.id) # Use the ID from the profile
    return summary