from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator

class UserSignup(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, description="Password must be at least 8 characters")
    full_name: str = Field(min_length=2, max_length=100)

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        trimmed = v.strip()
        if len(trimmed) < 8:
            raise ValueError("Password must be at least 8 non-whitespace characters long.")
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)

class GoogleAuthRequest(BaseModel):
    credential: str = Field(min_length=10, description="Google ID token")

class SessionSyncRequest(BaseModel):
    email: EmailStr
    full_name: Optional[str] = "Student"
    avatar_url: Optional[str] = None

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
