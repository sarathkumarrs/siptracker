from sqlalchemy.orm import Session
from . import models
from .schemas import UserCreate
from passlib.context import CryptContext

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