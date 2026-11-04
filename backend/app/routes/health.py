from fastapi import APIRouter

from app.config import get_settings

router = APIRouter()


@router.get("/health")
def health() -> dict[str, str | bool]:
    settings = get_settings()
    return {
        "status": "ok",
        "service": "DealRadar AI",
        "version": "1.0.0",
        "ai_configured": settings.ai_configured,
    }
