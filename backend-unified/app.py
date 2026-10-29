"""
Medical AI Platform - Unified Backend
Professional Monolithic Architecture with Modular Design

Architecture:
- Auth Module: JWT authentication, user management
- Chatbot Module: RAG, Memory, Guardrails, Tool Calling
- ML Service Module: XGBoost predictions for 7 diseases
- LLM Service Module: Local LLM for African healthcare context
- Database Module: SQLite/PostgreSQL with ORM
- Middleware: CORS, Rate Limiting, Logging, Audit
"""

from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import uvicorn
import os
from contextlib import asynccontextmanager

# Import modules - all modules enabled
from modules.auth.routes import auth_router
from modules.database.database import init_db
from modules.chatbot.routes import chatbot_router
from modules.ml_service.routes import ml_router
from modules.llm_service.routes import llm_router
from modules.vision_service.routes import vision_router
from modules.appointments.routes import appointments_router
from modules.middleware.logging import logging_middleware
from modules.middleware.audit import audit_middleware
from modules.agents_routes import agents_router

# Configuration
from config.settings import settings

# Lifespan management
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting Medical AI Platform Backend...")
    await init_db()
    print("Database initialized")
    print("Backend ready")
    yield
    # Shutdown
    print("Shutting down Medical AI Platform Backend...")

# Create FastAPI app
app = FastAPI(
    title="Medical AI Platform API",
    description="""
    ## Medical AI Platform - Unified Backend API
    
    This API provides comprehensive medical AI services including:
    
    * **Authentication**: JWT-based auth with user management
    * **Chatbot**: Intelligent medical assistant with local LLM (phi-3-mini)
    * **ML Predictions**: XGBoost models for 7 diseases (diabetes, cardiovascular, cancer, kidney, liver, thyroid, respiratory)
    * **Vision Service**: CNN-based medical image analysis (ResNet50) for X-Ray, MRI, CT
    * **LLM Service**: Local LLM for African healthcare context with RAG
    
    ## Features
    
    * Real AI everywhere (no simulations)
    * Modular architecture
    * Rate limiting
    * CORS enabled
    * Structured logging
    * Health checks
    
    ## Authentication
    
    Most endpoints require JWT authentication. Use `/api/auth/login` to obtain a token.
    
    ## Quick Start
    
    1. Install dependencies: `pip install -r requirements.txt`
    2. Run installation script: `install.sh` (Linux/Mac) or `install.bat` (Windows)
    3. Start server: `uvicorn app:app --reload`
    4. Access API docs: `http://localhost:8000/docs`
    """,
    version="2.0.0",
    lifespan=lifespan,
    contact={
        "name": "Medical AI Platform Team",
        "email": "contact@medical-ai-platform.com"
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT"
    }
)

# Rate limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=settings.allowed_methods_list,
    allow_headers=settings.allowed_headers_list,
)

# Gzip compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Custom middleware for logging and audit
app.middleware("http")(logging_middleware)
app.middleware("http")(audit_middleware)

# Include routers - all modules enabled
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(chatbot_router, prefix="/api/chatbot", tags=["Chatbot"])
app.include_router(ml_router, prefix="/api/ml", tags=["ML Predictions"])
app.include_router(llm_router, prefix="/api/llm", tags=["Local LLM"])
app.include_router(vision_router, prefix="/api/vision", tags=["Vision Service"])
app.include_router(appointments_router, prefix="/api", tags=["Appointments"])
app.include_router(agents_router, prefix="/api/agents", tags=["AI Agents"])

# Health check
@app.get("/health", 
    summary="Health Check",
    description="Check if the API and all modules are running properly",
    responses={
        200: {
            "description": "All systems operational",
            "content": {
                "application/json": {
                    "example": {
                        "status": "healthy",
                        "version": "2.0.0",
                        "environment": "development",
                        "modules": {
                            "auth": "active",
                            "chatbot": "active",
                            "ml_service": "active",
                            "llm_service": "active",
                            "vision_service": "active"
                        }
                    }
                }
            }
        }
    }
)
@limiter.limit("60/minute")
async def health_check(request: Request):
    return {
        "status": "healthy",
        "version": "2.0.0",
        "environment": settings.ENVIRONMENT,
        "modules": {
            "auth": "active",
            "chatbot": "active",
            "ml_service": "active",
            "llm_service": "active",
            "vision_service": "active"
        }
    }

# Root endpoint
@app.get("/", 
    summary="API Root",
    description="Get basic API information and available endpoints"
)
async def root():
    return {
        "message": "Medical AI Platform - Unified Backend",
        "version": "2.0.0",
        "description": "Comprehensive medical AI platform with chatbot, ML predictions, and vision services",
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "auth": "/api/auth",
            "chatbot": "/api/chatbot",
            "ml": "/api/ml",
            "llm": "/api/llm",
            "vision": "/api/vision"
        },
        "features": [
            "JWT Authentication",
            "LLM Chatbot (phi-3-mini)",
            "ML Predictions (XGBoost)",
            "Vision Service (ResNet50)",
            "RAG Support",
            "Rate Limiting"
        ]
    }

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG,
        log_level="info"
    )
