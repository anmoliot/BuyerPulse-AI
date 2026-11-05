from fastapi import APIRouter, Depends, HTTPException

from app.schemas import CopilotChatRequest, CopilotChatResponse, FollowUpRequest, FollowUpResponse
from app.services.followup_engine import generate_followup
from app.services.gemini_client import AIConfigError, AIJSONError, AITimeoutError, AIUpstreamError
from app.services.sales_copilot import chat as run_chat
from app.utils.rate_limiter import ai_rate_limiter

router = APIRouter(prefix="/copilot", tags=["copilot"])


@router.post("/chat", response_model=CopilotChatResponse, dependencies=[Depends(ai_rate_limiter)])
async def chat(payload: CopilotChatRequest) -> CopilotChatResponse:
    try:
        return await run_chat(payload)
    except AIConfigError:
        raise HTTPException(status_code=500, detail="AI service is not configured on the server.") from None
    except AITimeoutError:
        raise HTTPException(status_code=504, detail="Copilot timed out. Please retry.") from None
    except (AIJSONError, AIUpstreamError):
        raise HTTPException(status_code=502, detail="Copilot could not answer. Please retry.") from None


@router.post("/followup", response_model=FollowUpResponse, dependencies=[Depends(ai_rate_limiter)])
async def followup(payload: FollowUpRequest) -> FollowUpResponse:
    try:
        return await generate_followup(payload)
    except AIConfigError:
        raise HTTPException(status_code=500, detail="AI service is not configured on the server.") from None
    except AITimeoutError:
        raise HTTPException(status_code=504, detail="Follow-up generation timed out. Please retry.") from None
    except (AIJSONError, AIUpstreamError):
        raise HTTPException(status_code=502, detail="Follow-up generation failed. Please retry.") from None
