from pydantic import ValidationError

from app.schemas import CopilotChatRequest, CopilotChatResponse
from app.services.gemini_client import generate_json
from app.services.prompts import COPILOT_SYSTEM, build_copilot_user_prompt
from app.utils.json_parser import AIJSONError


async def chat(payload: CopilotChatRequest) -> CopilotChatResponse:
    raw = await generate_json(
        COPILOT_SYSTEM,
        build_copilot_user_prompt(
            payload.lead,
            payload.analysis.model_dump(),
            [turn.model_dump() for turn in payload.history],
            payload.question,
        ),
        timeout=20.0,
    )
    try:
        result = CopilotChatResponse.model_validate(
            {"answer": str(raw.get("answer", "")).strip(), "suggested_action": str(raw.get("suggested_action", "")).strip()}
        )
    except ValidationError as error:
        raise AIJSONError("AI response did not match the copilot schema") from error
    if not result.answer:
        raise AIJSONError("AI returned an empty answer")
    if not result.suggested_action:
        result.suggested_action = "Follow up with the lead."
    return result
