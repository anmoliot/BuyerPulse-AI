import re


_SUSPECT_TOKENS = re.compile(r"(?:₹|\bRs\.?|\bINR\b|\d+\s*(?:lakh|lac|cr|crore|k)\b)", re.IGNORECASE)
_PROJECT_NAME_HINTS = re.compile(r"\b(?:project|tower|phase|block)\s+[A-Z0-9][A-Za-z0-9\- ]{2,}", re.IGNORECASE)


def sanitize_stated_facts(facts: list[str], customer_message: str) -> list[str]:
    """Drop likely invented specific price/project claims not supported by the message."""
    message = customer_message.lower()
    kept: list[str] = []
    for fact in facts:
        fact = fact.strip()
        if not fact:
            continue
        if _SUSPECT_TOKENS.search(fact) or _PROJECT_NAME_HINTS.search(fact):
            digits = re.findall(r"\d+(?:\.\d+)?", fact)
            if not digits or not any(digit in message for digit in digits):
                continue
        kept.append(fact)
    return kept


def compute_decay_risk(analysis) -> str:
    ranks = {"LOW": 0, "MEDIUM": 1, "HIGH": 2}
    top_severity = max((o.severity for o in analysis.objections), key=lambda value: ranks[value], default="LOW")
    if analysis.follow_up_hours <= 12 or top_severity == "HIGH" or analysis.confidence == "LOW":
        return "HIGH"
    if analysis.follow_up_hours <= 36 or analysis.urgency == "MEDIUM":
        return "MEDIUM"
    return "LOW"


def escalate_only(ai_risk: str, deterministic: str) -> str:
    ranks = {"LOW": 0, "MEDIUM": 1, "HIGH": 2}
    return ai_risk if ranks.get(ai_risk, 0) > ranks[deterministic] else deterministic
