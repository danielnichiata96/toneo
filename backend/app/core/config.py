"""
Toneo Configuration
"""
from pydantic_settings import BaseSettings
from pydantic import field_validator
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings."""

    # API
    api_prefix: str = "/api"
    debug: bool = False  # Set to True only in .env for local dev

    # CORS - accepts comma-separated string or JSON list
    # In production, set CORS_ORIGINS env var to your frontend URL
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "https://toneo.vercel.app",  # Production frontend
    ]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        """Parse CORS origins from JSON array or comma-separated string."""
        if isinstance(v, str):
            v = v.strip()
            # Try JSON array first (e.g., '["http://localhost:3000"]')
            if v.startswith("["):
                import json
                try:
                    return json.loads(v)
                except json.JSONDecodeError:
                    pass
            # Fall back to comma-separated string
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    # Database
    database_url: str = "sqlite+aiosqlite:///./data/cedict.db"

    # Azure TTS (optional)
    azure_speech_key: str = ""
    azure_speech_region: str = "eastus"

    # Cache (optional)
    redis_url: str = ""

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()
