import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.routes import copilot, health, leads

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
logger = logging.getLogger("buyerpulse")
settings = get_settings()

app = FastAPI(title="BuyerPulse AI", version="1.0.0")
# Permissive CORS for public assessment API (no session cookies or credentials used)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(leads.router, prefix="/api")
app.include_router(copilot.router, prefix="/api")


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception: %s", exc, exc_info=True)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


@app.get("/")
def root() -> dict[str, str]:
    return {"service": "BuyerPulse AI", "docs": "/docs", "health": "/api/health"}


@app.get("/health")
def health_direct():
    from app.routes.health import health
    return health()
