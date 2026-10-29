from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import httpx

from app.config import settings
from app.database import get_db
from app.models.user import User
from app.schemas.auth import UserSignup, UserLogin, UserResponse, TokenResponse, GoogleAuthRequest, SessionSyncRequest
from app.services.auth_service import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(payload: UserSignup, db: AsyncSession = Depends(get_db)):
    """
    Public user registration.
    Security policy: All public self-registrations are strictly assigned 'student' role.
    Admin roles cannot be self-provisioned via public signup.
    """
    clean_email = payload.email.lower().strip()
    
    # Check if user already exists
    stmt = select(User).where(User.email == clean_email)
    result = await db.execute(stmt)
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # Strictly assign student role to prevent privilege escalation
    new_user = User(
        email=clean_email,
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name.strip(),
        role="student",
        is_active=True,
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    # Generate JWT
    token = create_access_token(data={"sub": str(new_user.id), "role": new_user.role})

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(new_user)
    )

@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin, db: AsyncSession = Depends(get_db)):
    clean_email = payload.email.lower().strip()
    stmt = select(User).where(User.email == clean_email)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email address or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This account has been deactivated."
        )

    token = create_access_token(data={"sub": str(user.id), "role": user.role})

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)

@router.post("/google", response_model=TokenResponse)
async def google_auth(payload: GoogleAuthRequest, db: AsyncSession = Depends(get_db)):
    """
    Verify Google OAuth token and return JWT.
    Uses parameterized query params to prevent SSRF and parameter injection.
    """
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                "https://oauth2.googleapis.com/tokeninfo",
                params={"id_token": payload.credential.strip()},
            )
            if resp.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid Google credential token."
                )
            data = resp.json()
    except httpx.RequestError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Could not reach Google authentication services. Please try again."
        )

    email = data.get("email")
    full_name = data.get("name", email.split("@")[0] if email else "Student")
    avatar_url = data.get("picture")

    if not email:
        raise HTTPException(status_code=400, detail="Google token does not contain email.")

    clean_email = email.lower().strip()

    # Check admin whitelist
    is_admin = clean_email in [e.lower() for e in settings.ADMIN_EMAILS]
    role = "admin" if is_admin else "student"

    # Find or create user
    stmt = select(User).where(User.email == clean_email)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user:
        user = User(
            email=clean_email,
            full_name=full_name,
            avatar_url=avatar_url,
            role=role,
            is_active=True,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    elif is_admin and user.role != "admin":
        user.role = "admin"
        await db.commit()
        await db.refresh(user)

    token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.post("/sync", response_model=TokenResponse)
async def sync_auth_session(payload: SessionSyncRequest, db: AsyncSession = Depends(get_db)):
    """
    Sync an active authenticated frontend session (Google OAuth / Neon Auth)
    with the FastAPI database and issue a valid JWT Bearer token.
    """
    clean_email = payload.email.lower().strip()
    is_admin = clean_email in [e.lower() for e in settings.ADMIN_EMAILS]
    role = "admin" if is_admin else "student"

    stmt = select(User).where(User.email == clean_email)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user:
        user = User(
            email=clean_email,
            full_name=payload.full_name or clean_email.split("@")[0],
            avatar_url=payload.avatar_url,
            hashed_password=hash_password("external_oauth_session_secret_2026"),
            role=role,
            is_active=True,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    elif is_admin and user.role != "admin":
        user.role = "admin"
        await db.commit()
        await db.refresh(user)

    token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )
