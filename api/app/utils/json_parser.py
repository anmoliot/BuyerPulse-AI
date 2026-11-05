import json
import re
from typing import Any


class AIJSONError(Exception):
    """The model response was not a valid JSON object."""


_FENCE_RE = re.compile(r"^\s*```(?:json)?\s*|\s*```\s*$", re.IGNORECASE)


def parse_json_strict(text: str) -> dict[str, Any]:
    if not text or not text.strip():
        raise AIJSONError("empty AI response")
    cleaned = _FENCE_RE.sub("", text).strip()
    start = cleaned.find("{")
    if start < 0:
        raise AIJSONError("no JSON object found")

    depth = 0
    end = -1
    in_string = False
    escaped = False
    for index in range(start, len(cleaned)):
        char = cleaned[index]
        if in_string:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == '"':
                in_string = False
            continue
        if char == '"':
            in_string = True
        elif char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                end = index + 1
                break
    if end < 0:
        raise AIJSONError("unbalanced JSON braces")
    try:
        value = json.loads(cleaned[start:end])
    except json.JSONDecodeError as error:
        raise AIJSONError(f"invalid JSON: {error.msg}") from error
    if not isinstance(value, dict):
        raise AIJSONError("response must be a JSON object")
    return value
