"""
Toneo - Chinese Tone Learning App
FastAPI Backend Entry Point
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.routers import analyze, tts, dictionary


class DataSourceMiddleware(BaseHTTPMiddleware):
    """Add X-Data-Source header to dictionary/analyze responses for CC-CEDICT attribution."""

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        # Add attribution header for endpoints using CC-CEDICT data
        if request.url.path.startswith(f"{settings.api_prefix}/analyze") or \
           request.url.path.startswith(f"{settings.api_prefix}/dictionary"):
            response.headers["X-Data-Source"] = "CC-CEDICT"
            response.headers["X-Data-License"] = "CC BY-SA 4.0"
        return response


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    print("Starting Toneo API...")
    yield
    # Shutdown
    print("Shutting down Toneo API...")


app = FastAPI(
    title="Toneo API",
    description="Chinese Tone Learning App - API Backend",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Data-Source", "X-Data-License"],
)

# Data source attribution
app.add_middleware(DataSourceMiddleware)

# Routers
app.include_router(analyze.router, prefix=settings.api_prefix, tags=["analyze"])
app.include_router(tts.router, prefix=settings.api_prefix, tags=["tts"])
app.include_router(dictionary.router, prefix=settings.api_prefix, tags=["dictionary"])


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "app": "Toneo",
        "version": "1.0.0",
        "description": "Chinese Tone Learning App",
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "version": "1.0.0",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
