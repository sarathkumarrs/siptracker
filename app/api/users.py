from fastapi import APIRouter, Depends, HTTPException
# from pydantic import BaseModel  <-- REMOVE THIS LINE, no longer needed here
from sqlalchemy.orm import Session

from ..database import get_db
from ..crud import create_user, get_user_by_username
from ..schemas import UserCreate # <-- ADD THIS IMPORT

router = APIRouter()

# UserCreate is now imported from schemas.py
# class UserCreate(BaseModel):  <-- REMOVE THIS CLASS DEFINITION
#    username:str
#    password:str

@router.post("/users/")
def create_user_endpoint(user: UserCreate, db:Session = Depends(get_db)):
    db_user = get_user_by_username(db,user.username)

    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    # Make sure create_user returns a User schema, not just the model
    created_user = create_user(db, user)
    # You might want to return User schema here, not raw db_user model
    # Example: return schemas.User.from_orm(created_user)
    return created_user