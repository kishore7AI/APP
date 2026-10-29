import sys
from pathlib import Path
from contextlib import asynccontextmanager
import os

# Ensure 'backend' directory is in Python sys.path so 'from app...' imports always work
backend_dir = str(Path(__file__).resolve().parent.parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import init_db
from app.api.auth import router as auth_router
from app.api.admin import router as admin_router
from app.api.courses import router as courses_router

# Ensure uploads dir exists
uploads_path = Path("uploads")
uploads_path.mkdir(parents=True, exist_ok=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize all database tables
    await init_db()
    yield
    # Shutdown logic if needed

# Gated Swagger/Redoc: Enabled in development, restricted in production
docs_url = None if settings.ENVIRONMENT == "production" else "/docs"
redoc_url = None if settings.ENVIRONMENT == "production" else "/redoc"

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="High-performance async REST API for NxtLearnn course platform",
    docs_url=docs_url,
    redoc_url=redoc_url,
    lifespan=lifespan,
)

# -----------------------------------------------------------------------------
# Security Headers Middleware
# -----------------------------------------------------------------------------
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    # Prevent MIME type sniffing
    response.headers["X-Content-Type-Options"] = "nosniff"
    # Prevent Clickjacking
    response.headers["X-Frame-Options"] = "DENY"
    # Enable XSS protection filter
    response.headers["X-XSS-Protection"] = "1; mode=block"
    # Strict Referrer Policy
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    # Restrict dangerous browser features
    response.headers["Permissions-Policy"] = "geolocation=(), camera=(), microphone=()"
    return response

# -----------------------------------------------------------------------------
# CORS Configuration (Constrained origins & explicit methods/headers)
# -----------------------------------------------------------------------------
origins = [
    settings.FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"],
)

# -----------------------------------------------------------------------------
# Include API Routers
# -----------------------------------------------------------------------------
app.include_router(auth_router, prefix="/api")
app.include_router(admin_router, prefix="/api")
app.include_router(courses_router, prefix="/api")

# Static uploads mount
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
async def root():
    return {
        "message": "Welcome to NxtLearnn API",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "nxtlearnn-backend",
        "database": "configured",
        "version": settings.VERSION,
    }
