"""
Configuration Settings for Medical AI Platform
Environment-based configuration with type safety
"""

from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    """Application settings"""
    
    # API Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    
    # Database
    DATABASE_URL: str = "sqlite:///./medical_ai.db"
    
    # JWT
    JWT_SECRET: str = os.getenv("JWT_SECRET", "default-secret-change-in-production")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"
    ALLOWED_METHODS: str = "GET,POST,PUT,DELETE,OPTIONS"
    ALLOWED_HEADERS: str = "Content-Type,Authorization"
    
    @property
    def allowed_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]
    
    @property
    def allowed_methods_list(self) -> List[str]:
        return [method.strip() for method in self.ALLOWED_METHODS.split(",")]
    
    @property
    def allowed_headers_list(self) -> List[str]:
        return [header.strip() for header in self.ALLOWED_HEADERS.split(",")]
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # ML Configuration
    ML_ENABLED: bool = True
    ML_MODEL_PATH: str = "./models"
    
    # LLM Configuration (ADTC)
    LLM_ENABLED: bool = True
    LLM_MODEL_PATH: str = "./models/phi-3-mini-4k-instruct-q4.gguf"
    LLM_MAX_TOKENS: int = 512
    LLM_N_CTX: int = 2048
    MAX_RAM_USAGE_GB: float = 6.5
    
    # RAG Configuration
    RAG_ENABLED: bool = True
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    RAG_TOP_K: int = 3
    
    # Redis (optional)
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Ignore extra environment variables

settings = Settings()
