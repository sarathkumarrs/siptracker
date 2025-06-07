from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..crud import create_user, get_user_by_username
from ..schemas import UserCreate , User
from ..auth import get_current_user

router = APIRouter()


@router.post("/users/", response_model=User, status_code=status.HTTP_201_CREATED)
def create_user_endpoint(
    user: UserCreate,
    db: Session = Depends(get_db),
   
    current_user_id: str = Depends(get_current_user) # Inject the authenticated user's ID
):
    db_user = get_user_by_username(db, user.username)

    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    created_user = create_user(db, user)
    return created_user