from pathlib import Path
from typing import Optional
import warnings
from pydantic_settings import BaseSettings

# Locate backend/.env or root .env
_backend_env = Path(__file__).resolve().parent.parent / ".env"
_root_env = Path(__file__).resolve().parent.parent.parent / ".env"

env_paths = []
if _backend_env.exists():
    env_paths.append(str(_backend_env))
if _root_env.exists():
    env_paths.append(str(_root_env))
env_paths.append(".env")

DEFAULT_INSECURE_SECRET = "nxtlearnn-super-secret-jwt-key-change-in-production-2026"

class Settings(BaseSettings):
    PROJECT_NAME: str = "NxtLearnn API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    ENVIRONMENT: str = "development"  # "development" | "production" | "staging"
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./backend/nxtlearnn.db"
    
    # JWT Auth
    JWT_SECRET_KEY: str = "nxtlearnn-secure-random-jwt-secret-key-2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # ImageKit
    IMAGEKIT_PUBLIC_KEY: str = ""
    IMAGEKIT_PRIVATE_KEY: str = ""
    IMAGEKIT_URL_ENDPOINT: str = ""
    
    # Polar Payments
    POLAR_ACCESS_TOKEN: str = ""
    POLAR_WEBHOOK_SECRET: str = ""
    POLAR_ORGANIZATION_ID: str = ""
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""

    # Authorized Admin Whitelist
    ADMIN_EMAILS: list[str] = [
        "admin@nxtlearnn.com",
        "kishoresabari007@gmail.com",
    ]

    # Frontend URL for CORS
    FRONTEND_URL: str = "http://localhost:5173"

    class Config:
        env_file = tuple(env_paths)
        extra = "ignore"

settings = Settings()

# Security sanity check for production
if settings.ENVIRONMENT == "production":
    if settings.JWT_SECRET_KEY == DEFAULT_INSECURE_SECRET or len(settings.JWT_SECRET_KEY) < 32:
        raise ValueError(
            "CRITICAL SECURITY CONFIGURATION ERROR: JWT_SECRET_KEY must be a cryptographically secure random string "
            "of at least 32 characters in production. Update your production environment configuration."
        )
elif settings.JWT_SECRET_KEY == DEFAULT_INSECURE_SECRET:
    warnings.warn(
        "SECURITY WARNING: Using default development JWT secret key. Change JWT_SECRET_KEY in backend/.env before deploying to production.",
        RuntimeWarning,
        stacklevel=2,
    )
