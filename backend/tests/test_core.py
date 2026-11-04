import pytest
from pydantic import ValidationError

from app.schemas import LeadAnalysis, LeadIntake, Objection
from app.utils.json_parser import AIJSONError, parse_json_strict
from app.utils.validators import compute_decay_risk, escalate_only

BASE_ANALYSIS_DATA = {
    "summary": "Sample summary for buyer inquiry",
    "intent": "Purchase apartment",
    "requirements": ["3BHK"],
    "objections": [],
    "recommended_action": "Schedule introductory call",
    "suggested_response": "Hi, thanks for reaching out...",
    "urgency": "HIGH",
    "follow_up_hours": 24,
    "confidence": "HIGH",
    "reasoning": "Clear intent and validated budget",
    "stated_facts": ["3BHK requirement"],
    "ai_inferences": ["Ready to move"],
    "missing_information": [],
    "discovery_questions": ["What is your preferred floor?"],
}


def test_lead_intake_rejects_blank_fields():
    """1. LeadIntake rejects blank required fields and short customer messages."""
    with pytest.raises(ValidationError):
        LeadIntake(
            name="   ",
            location="Powai, Mumbai",
            property_requirement="3BHK apartment",
            budget="2 Cr",
            buying_timeline="2 months",
            customer_message="Looking for a 3BHK in Powai under 2 Cr.",
        )

    with pytest.raises(ValidationError):
        LeadIntake(
            name="Rahul Sharma",
            location="Powai, Mumbai",
            property_requirement="3BHK apartment",
            budget="2 Cr",
            buying_timeline="2 months",
            customer_message="Short",  # less than 10 characters
        )


def test_score_85_maps_to_hot():
    """2. Score 85 maps to HOT."""
    lead = LeadAnalysis.model_validate({**BASE_ANALYSIS_DATA, "lead_score": 85, "priority": "COLD"})
    assert lead.priority == "HOT"


def test_score_60_maps_to_warm():
    """3. Score 60 maps to WARM."""
    lead = LeadAnalysis.model_validate({**BASE_ANALYSIS_DATA, "lead_score": 60, "priority": "HOT"})
    assert lead.priority == "WARM"


def test_score_20_maps_to_cold():
    """4. Score 20 maps to COLD."""
    lead = LeadAnalysis.model_validate({**BASE_ANALYSIS_DATA, "lead_score": 20, "priority": "HOT"})
    assert lead.priority == "COLD"


def test_json_parser_handles_markdown_fenced_json():
    """5. JSON parser handles Markdown-fenced JSON."""
    raw_fenced = """```json
    {
      "summary": "Valid response",
      "score": 90
    }
    ```"""
    parsed = parse_json_strict(raw_fenced)
    assert parsed["summary"] == "Valid response"
    assert parsed["score"] == 90


def test_malformed_json_raises_controlled_ai_json_error():
    """6. Malformed JSON raises a controlled AI JSON error."""
    with pytest.raises(AIJSONError):
        parse_json_strict("This is not JSON at all")

    with pytest.raises(AIJSONError):
        parse_json_strict('{"unclosed": "brace"')

    with pytest.raises(AIJSONError):
        parse_json_strict("")


def test_deterministic_decay_risk_floor_cannot_be_lowered_by_model_output():
    """7. Deterministic decay-risk floor cannot be lowered by model output."""
    high_urgency_analysis = LeadAnalysis.model_validate(
        {
            "summary": "Urgent lead with handover constraint",
            "intent": "Buy",
            "requirements": ["3BHK"],
            "objections": [
                Objection(
                    type="POSSESSION_DELAY",
                    detail="Fears handover delay",
                    severity="HIGH",
                    handling_strategy="Share RERA certificates and milestones",
                )
            ],
            "recommended_action": "Call today",
            "suggested_response": "Hi...",
            "lead_score": 90,
            "priority": "HOT",
            "urgency": "HIGH",
            "follow_up_hours": 6,  # <= 12 hours -> HIGH deterministic decay
            "confidence": "HIGH",
            "reasoning": "Urgent buyer with school deadline",
            "stated_facts": ["Move within 2 months"],
            "ai_inferences": [],
            "missing_information": [],
            "discovery_questions": [],
        }
    )

    deterministic_risk = compute_decay_risk(high_urgency_analysis)
    assert deterministic_risk == "HIGH"

    # Model attempts to return LOW -> Server floor keeps HIGH
    enforced_risk_low = escalate_only(ai_risk="LOW", deterministic=deterministic_risk)
    assert enforced_risk_low == "HIGH"

    # Model attempts to return MEDIUM -> Server floor keeps HIGH
    enforced_risk_med = escalate_only(ai_risk="MEDIUM", deterministic=deterministic_risk)
    assert enforced_risk_med == "HIGH"
