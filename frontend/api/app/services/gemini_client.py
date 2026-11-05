import asyncio
import logging
from typing import Any

import httpx
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
            raise AIConfigError("AI API key is not configured")
        _client = genai.Client(api_key=settings.gemini_api_key)
    return _client


async def _call_groq(system: str, user: str, timeout: float) -> str:
    settings = get_settings()
    headers = {
        "Authorization": f"Bearer {settings.groq_api_key.strip()}",
        "Content-Type": "application/json",
        "User-Agent": "BuyerPulseAI/1.0",
    }
    candidate_models = [settings.groq_model, "openai/gpt-oss-20b", "openai/gpt-oss-120b"]
    try:
        async with httpx.AsyncClient(timeout=timeout) as http_client:
            for model_name in candidate_models:
                payload = {
                    "model": model_name,
                    "messages": [
                        {"role": "system", "content": system},
                        {"role": "user", "content": user},
                    ],
                    "response_format": {"type": "json_object"},
                    "temperature": 0.3,
                }
                resp = await http_client.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    json=payload,
                    headers=headers,
                )
                if resp.status_code == 429:
                    logger.warning("groq_model_rate_limited_failover", extra={"model": model_name})
                    continue
                if resp.status_code != 200:
                    logger.warning("groq_upstream_error", extra={"status": resp.status_code, "body": resp.text[:200]})
                    raise AIUpstreamError(f"Groq API error ({resp.status_code})")
                data = resp.json()
                return data["choices"][0]["message"]["content"]
            raise AIUpstreamError("All AI models currently busy. Please retry in a few seconds.")
    except httpx.TimeoutException as error:
        raise AITimeoutError(f"AI request exceeded {timeout}s") from error
    except (AIConfigError, AITimeoutError, AIUpstreamError):
        raise
    except Exception as error:  # noqa: BLE001
        logger.warning("ai_upstream_error", extra={"err_type": type(error).__name__})
        raise AIUpstreamError("AI request failed") from error


async def _one_call(system: str, user: str, timeout: float) -> str:
    settings = get_settings()
    if settings.groq_api_key.strip():
        return await _call_groq(system, user, timeout)
    client = _client_or_raise()
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
