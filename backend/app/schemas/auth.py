from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserSignup(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, description="Password must be at least 6 characters")
    full_name: str = Field(min_length=2)
    role: Optional[str] = "student"  # default student, can be admin for initial setup

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleAuthRequest(BaseModel):
    credential: str  # Google ID token

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str
    avatar_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
