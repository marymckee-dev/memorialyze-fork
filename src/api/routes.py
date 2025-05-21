"""
Main API router.

This module configures the main API router and includes all sub-routers.
"""
from fastapi import APIRouter

from core.config import settings

router = APIRouter(prefix=settings.API_V1_STR)

# Import and include other routers here
# from api.endpoints.users import router as users_router
# router.include_router(users_router, prefix="/users", tags=["users"])

# Example health route
@router.get("/health", tags=["health"])
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
