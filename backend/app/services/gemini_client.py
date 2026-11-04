import asyncio
import logging
from typing import Any

from google import genai
from google.genai import types

from app.config import get_settings
from app.utils.json_parser import AIJSONError, parse_json_strict

logger = logging.getLogger("buyerpulse.gemini")
_client: genai.Client | None = None


class AIConfigError(Exception):
    pass


class AIUpstreamError(Exception):
    pass


class AITimeoutError(Exception):
    pass


def _client_or_raise() -> genai.Client:
    global _client
    if _client is None:
        settings = get_settings()
        if not settings.ai_configured:
            raise AIConfigError("GEMINI_API_KEY is not configured")
        _client = genai.Client(api_key=settings.gemini_api_key)
    return _client


async def _one_call(system: str, user: str, timeout: float) -> str:
    client = _client_or_raise()
    settings = get_settings()
    try:
        response = await asyncio.wait_for(
            client.aio.models.generate_content(
                model=settings.gemini_model,
                contents=user,
                config=types.GenerateContentConfig(
                    system_instruction=system,
                    temperature=0.3,
                    response_mime_type="application/json",
                ),
            ),
            timeout=timeout,
        )
        return response.text or ""
    except asyncio.TimeoutError as error:
        raise AITimeoutError(f"Gemini request exceeded {timeout}s") from error
    except (AIConfigError, AITimeoutError):
        raise
    except Exception as error:  # noqa: BLE001
        logger.warning("gemini_upstream_error", extra={"err_type": type(error).__name__})
        raise AIUpstreamError("Gemini request failed") from error


async def generate_json(system: str, user: str, *, timeout: float = 30.0) -> dict[str, Any]:
    """Call Gemini, parse strictly, and retry once only for malformed JSON."""
    response_text = await _one_call(system, user, timeout)
    try:
        return parse_json_strict(response_text)
    except AIJSONError as error:
        retry_reason = str(error)
        logger.info("gemini_json_retry", extra={"reason": retry_reason[:80]})

    retry_prompt = (
        f"{user}\n\nYour previous response was not valid JSON ({retry_reason}). "
        "Return only one valid JSON object matching the requested schema."
    )
    retry_text = await _one_call(system, retry_prompt, timeout)
    try:
        return parse_json_strict(retry_text)
    except AIJSONError as retry_error:
        raise AIJSONError(f"Invalid JSON after retry: {retry_error}") from retry_error
