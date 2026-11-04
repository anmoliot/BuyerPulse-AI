from pydantic import ValidationError

from app.schemas import LeadAnalysis, LeadIntake
from app.services.gemini_client import generate_json
from app.services.prompts import LEAD_ANALYSIS_SYSTEM, build_lead_analysis_user_prompt
from app.utils.json_parser import AIJSONError
from app.utils.validators import sanitize_stated_facts


async def analyze_lead(intake: LeadIntake) -> LeadAnalysis:
    payload = await generate_json(
        LEAD_ANALYSIS_SYSTEM,
        build_lead_analysis_user_prompt(intake.model_dump()),
        timeout=30.0,
    )
    try:
        analysis = LeadAnalysis.model_validate(payload)
    except ValidationError as error:
        raise AIJSONError("AI response did not match the lead analysis schema") from error
    analysis.stated_facts = sanitize_stated_facts(analysis.stated_facts, intake.customer_message)
    return analysis
