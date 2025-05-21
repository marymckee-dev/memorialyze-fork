"""
Configuration settings for the Memorialyze application.

This module loads environment variables and provides configuration
settings for the application.
"""
from typing import List, Union

from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings class."""
    
    # API settings
    PROJECT_NAME: str = "Memorialyze"
    API_V1_STR: str = "/api/v1"
    
    # CORS settings
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]
    
    # Database settings
    DATABASE_URL: str = "postgresql+asyncpg://memorialyze_user:memorialyze_password@localhost:5432/memorialyze_archive"
    
    # Redis settings
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # S3 settings
    S3_ENDPOINT_URL: str = "http://localhost:4566"  # LocalStack endpoint
    S3_BUCKET_NAME: str = "memorialyze-media"
    
    # Anthropic API settings
    ANTHROPIC_API_KEY: str = ""
    ANTHROPIC_MODEL: str = "claude-3-sonnet-20240229"
    
    # Security settings
    SECRET_KEY: str = "development_secret_key"  # Change in production!
    
    # File upload settings
    MAX_UPLOAD_SIZE: int = 100 * 1024 * 1024  # 100 MB
    ALLOWED_UPLOAD_TYPES: List[str] = [
        "video/mp4", "video/quicktime", "video/x-msvideo",
        "audio/mpeg", "audio/wav", "audio/x-wav",
        "application/pdf", "text/plain",
        "image/jpeg", "image/png", "image/gif"
    ]
    
    # Vector database settings
    VECTOR_DIMENSIONS: int = 1536  # Default for many embedding models
    
    @validator("CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        """Parse CORS_ORIGINS from string to list if needed."""
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )


# Create global settings instance
settings = Settings()
