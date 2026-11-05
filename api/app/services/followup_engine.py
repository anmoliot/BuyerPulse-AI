from pydantic import ValidationError

from app.schemas import FollowUpRequest, FollowUpResponse
from app.services.gemini_client import generate_json
from app.services.prompts import FOLLOWUP_SYSTEM, build_followup_user_prompt
from app.utils.json_parser import AIJSONError
from app.utils.validators import compute_decay_risk, escalate_only


async def generate_followup(payload: FollowUpRequest) -> FollowUpResponse:
    analysis = payload.analysis
    raw = await generate_json(
        FOLLOWUP_SYSTEM,
        build_followup_user_prompt(payload.lead, analysis.model_dump()),
        timeout=20.0,
    )
    raw["decay_risk"] = str(raw.get("decay_risk", "LOW")).upper()
    try:
        result = FollowUpResponse.model_validate(raw)
    except (ValidationError, TypeError, ValueError) as error:
        raise AIJSONError("AI response did not match the follow-up schema") from error
    result.decay_risk = escalate_only(result.decay_risk, compute_decay_risk(analysis))
    return result
