from fastapi import APIRouter, HTTPException

from app.schemas import LeadAnalysis, LeadIntake
from app.services.gemini_client import AIConfigError, AIJSONError, AITimeoutError, AIUpstreamError
from app.services.lead_analysis import analyze_lead

router = APIRouter(prefix="/leads", tags=["leads"])

DEMO_LEADS = [
    {
        "name": "Rahul Sharma", "location": "Powai, Mumbai",
        "property_requirement": "3BHK apartment in a gated community, ready to move",
        "budget": "1.8 - 2.2 Cr", "buying_timeline": "Within 2 months",
        "customer_message": "Hi, I'm looking for a 3BHK in Powai for my family. Budget is around 2 Cr. We need to move in within 2 months as my daughter's school starts. I'm worried about possession delays after friends had bad experiences. Please share verified options only. Do you have loan assistance?",
    },
    {
        "name": "Priya Nair", "location": "Whitefield, Bengaluru",
        "property_requirement": "2BHK for investment with rental potential",
        "budget": "80 lakhs - 1 Cr", "buying_timeline": "6-12 months",
        "customer_message": "Looking at 2BHK properties in Whitefield purely for investment. I would like something that can be rented out easily. Not in a hurry; 6 to 12 months is fine. I already own two flats in HSR and am comparing options. Please share rental data if available.",
    },
    {
        "name": "Vikram Patel", "location": "Gandhinagar, Gujarat",
        "property_requirement": "4BHK villa near schools and a hospital",
        "budget": "3.5 - 4 Cr", "buying_timeline": "ASAP; relocating in 8 weeks",
        "customer_message": "We're relocating from the US in 8 weeks and need a 4BHK villa in Gandhinagar. Budget up to 4 Cr. It must be near good schools and a hospital. We cannot visit before buying, so we need a detailed walkthrough and legal verification. What's the fastest close you can do?",
    },
    {
        "name": "Ananya Reddy", "location": "Gachibowli, Hyderabad",
        "property_requirement": "2BHK near the IT corridor for self-use",
        "budget": "60-70 lakhs", "buying_timeline": "3-6 months",
        "customer_message": "I just started looking for a 2BHK near my office in Gachibowli. Budget is tight around 60-70 lakhs. I prefer ready-to-move but would consider options with possession under a year. I need help understanding home loans as this is my first purchase.",
    },
    {
        "name": "Farhan Qureshi", "location": "Koramangala, Bengaluru",
        "property_requirement": "Commercial office space; still exploring",
        "budget": "Not decided", "buying_timeline": "Just exploring",
        "customer_message": "I was just browsing and am curious what commercial office space costs around Koramangala. I'm not really buying yet, just trying to understand the market. No specific budget or timeline in mind. You can send an overview.",
    },
]


@router.get("/demo")
def demo_leads() -> list[dict[str, str]]:
    return DEMO_LEADS


@router.post("/analyze", response_model=LeadAnalysis)
async def analyze(intake: LeadIntake) -> LeadAnalysis:
    try:
        return await analyze_lead(intake)
    except AIConfigError:
        raise HTTPException(status_code=500, detail="AI service is not configured on the server.") from None
    except AITimeoutError:
        raise HTTPException(status_code=504, detail="AI service timed out. Please retry.") from None
    except (AIJSONError, AIUpstreamError):
        raise HTTPException(status_code=502, detail="AI service could not process this lead. Please retry.") from None
