"""
Authentication Module
JWT-based authentication with refresh tokens and database integration
"""

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from config.settings import settings
from modules.database.database import get_db, User

auth_router = APIRouter()
router = auth_router  # For backwards compatibility
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Demo users for testing (fallback if database is empty)
DEMO_USERS = {
    "sarah.martin@medai.com": {
        "id": 1,
        "email": "sarah.martin@medai.com",
        "password": "doctor123",
        "name": "Dr. Sarah Martin",
        "role": "doctor"
    },
    "marie.dupont@email.com": {
        "id": 2,
        "email": "marie.dupont@email.com",
        "password": "patient123",
        "name": "Marie Dupont",
        "role": "patient"
    }
}

# Models
class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str
    role: str = "patient"  # patient or doctor

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    role: str

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash password"""
    return pwd_context.hash(password)

def create_access_token(data: dict) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def create_refresh_token(data: dict) -> str:
    """Create JWT refresh token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def verify_token(token: str) -> dict:
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)) -> dict:
    """Get current user from JWT token - checks database first, falls back to demo users"""
    token = credentials.credentials
    payload = verify_token(token)

    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid token type")

    user_id = payload.get("sub")

    # Try database first
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        return {
            "id": db_user.id,
            "email": db_user.email,
            "name": db_user.name,
            "role": db_user.role
        }

    # Fallback to demo users
    user = next((u for u in DEMO_USERS.values() if u["id"] == user_id), None)

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user

# Routes
@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Login endpoint - uses database first, falls back to demo users"""
    # Try database first
    db_user = db.query(User).filter(User.email == request.email).first()

    if db_user:
        # Verify password hash
        if verify_password(request.password, db_user.password_hash):
            access_token = create_access_token({"sub": db_user.id, "email": db_user.email, "role": db_user.role})
            refresh_token = create_refresh_token({"sub": db_user.id})

            return TokenResponse(
                access_token=access_token,
                refresh_token=refresh_token,
                expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
            )

    # Fallback to demo users for testing
    user = DEMO_USERS.get(request.email)

    if not user or user["password"] != request.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token({"sub": user["id"], "email": user["email"], "role": user["role"]})
    refresh_token = create_refresh_token({"sub": user["id"]})

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

@router.post("/register", response_model=UserResponse)
async def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """Register new user - saves to database"""
    # Check if email already exists in database
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Check demo users
    if request.email in DEMO_USERS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user in database
    new_user = User(
        email=request.email,
        password_hash=get_password_hash(request.password),
        name=request.name,
        role=request.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return UserResponse(
        id=new_user.id,
        email=new_user.email,
        name=new_user.name,
        role=new_user.role
    )

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    """Refresh access token"""
    try:
        payload = jwt.decode(refresh_token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])

        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")

        user_id = payload.get("sub")

        # Try database first
        db_user = db.query(User).filter(User.id == user_id).first()
        if db_user:
            access_token = create_access_token({"sub": db_user.id, "email": db_user.email, "role": db_user.role})
            new_refresh_token = create_refresh_token({"sub": db_user.id})

            return TokenResponse(
                access_token=access_token,
                refresh_token=new_refresh_token,
                expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
            )

        # Fallback to demo users
        user = next((u for u in DEMO_USERS.values() if u["id"] == user_id), None)

        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        access_token = create_access_token({"sub": user["id"], "email": user["email"], "role": user["role"]})
        new_refresh_token = create_refresh_token({"sub": user["id"]})

        return TokenResponse(
            access_token=access_token,
            refresh_token=new_refresh_token,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user info"""
    return UserResponse(**current_user)

@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    """Logout endpoint (token invalidation handled client-side)"""
    return {"message": "Successfully logged out"}
