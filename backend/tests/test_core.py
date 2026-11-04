import pytest
from pydantic import ValidationError

from app.schemas import LeadAnalysis, LeadIntake, Objection
from app.utils.json_parser import AIJSONError, parse_json_strict
from app.utils.validators import compute_decay_risk, escalate_only


def test_lead_intake_rejects_blank_fields():
    """1. LeadIntake rejects blank required fields."""
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


def test_priority_mapping_from_score():
    """2. Priority mapping: 85 -> HOT, 60 -> WARM, 20 -> COLD."""
    base_data = {
        "summary": "Sample summary",
        "intent": "Buy apartment",
        "requirements": ["3BHK"],
        "objections": [],
        "recommended_action": "Schedule call",
        "suggested_response": "Hi Rahul...",
        "urgency": "HIGH",
        "follow_up_hours": 24,
        "confidence": "HIGH",
        "reasoning": "Clear intent and budget",
        "stated_facts": ["3BHK requirement"],
        "ai_inferences": ["Ready to move"],
        "missing_information": [],
        "discovery_questions": [],
    }

    # 85 -> HOT
    lead_hot = LeadAnalysis.model_validate({**base_data, "lead_score": 85, "priority": "COLD"})
    assert lead_hot.priority == "HOT"

    # 60 -> WARM
    lead_warm = LeadAnalysis.model_validate({**base_data, "lead_score": 60, "priority": "HOT"})
    assert lead_warm.priority == "WARM"

    # 20 -> COLD
    lead_cold = LeadAnalysis.model_validate({**base_data, "lead_score": 20, "priority": "HOT"})
    assert lead_cold.priority == "COLD"


def test_json_parser_handles_fenced_json():
    """3. JSON parser handles markdown fenced JSON."""
    raw_fenced = """```json
    {
      "summary": "Valid response",
      "score": 90
    }
    ```"""
    parsed = parse_json_strict(raw_fenced)
    assert parsed["summary"] == "Valid response"
    assert parsed["score"] == 90


def test_json_parser_rejects_malformed_json():
    """4. JSON parser rejects malformed JSON."""
    with pytest.raises(AIJSONError):
        parse_json_strict("This is not JSON at all")

    with pytest.raises(AIJSONError):
        parse_json_strict('{"unclosed": "brace"')

    with pytest.raises(AIJSONError):
        parse_json_strict("")


def test_decay_risk_floor_enforcement():
    """5. Decay-risk floor cannot be lowered by model output."""
    high_urgency_analysis = LeadAnalysis.model_validate(
        {
            "summary": "Urgent lead",
            "intent": "Buy",
            "requirements": ["3BHK"],
            "objections": [
                Objection(
                    type="POSSESSION_DELAY",
                    detail="Fears handover delay",
                    severity="HIGH",
                    handling_strategy="Share RERA certificates",
                )
            ],
            "recommended_action": "Call today",
            "suggested_response": "Hi...",
            "lead_score": 90,
            "priority": "HOT",
            "urgency": "HIGH",
            "follow_up_hours": 6,  # <= 12 hours -> HIGH deterministic decay
            "confidence": "HIGH",
            "reasoning": "Urgent buyer",
            "stated_facts": ["Move within 2 months"],
            "ai_inferences": [],
            "missing_information": [],
            "discovery_questions": [],
        }
    )

    deterministic_risk = compute_decay_risk(high_urgency_analysis)
    assert deterministic_risk == "HIGH"

    # Model attempts to return LOW -> Server must keep HIGH
    enforced_risk = escalate_only(ai_risk="LOW", deterministic=deterministic_risk)
    assert enforced_risk == "HIGH"

    # Model attempts to return MEDIUM -> Server must keep HIGH
    enforced_risk_2 = escalate_only(ai_risk="MEDIUM", deterministic=deterministic_risk)
    assert enforced_risk_2 == "HIGH"
