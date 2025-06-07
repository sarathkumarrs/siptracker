from pydantic import BaseModel

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