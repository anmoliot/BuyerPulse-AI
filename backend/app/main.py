import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.routes import copilot, health, leads

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
logger = logging.getLogger("dealradar")
settings = get_settings()

app = FastAPI(title="DealRadar AI", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list or ["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(leads.router, prefix="/api")
app.include_router(copilot.router, prefix="/api")


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.error("unhandled_exception", extra={"path": request.url.path, "err_type": type(exc).__name__})
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


@app.get("/")
def root() -> dict[str, str]:
    return {"service": "DealRadar AI", "docs": "/docs", "health": "/api/health"}
