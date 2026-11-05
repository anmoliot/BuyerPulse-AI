from fastapi import APIRouter, Depends, HTTPException
from app.utils.rate_limiter import ai_rate_limiter

from app.schemas import LeadAnalysis, LeadIntake
from app.services.gemini_client import AIConfigError, AIJSONError, AITimeoutError, AIUpstreamError
from app.services.lead_analysis import analyze_lead

router = APIRouter(prefix="/leads", tags=["leads"])

DEMO_LEADS_DATA = [
  {
    "intake": {
      "name": "Rahul Sharma",
      "location": "Powai, Mumbai",
      "property_requirement": "3BHK apartment in a gated community, ready to move",
      "budget": "1.8 - 2.2 Cr",
      "buying_timeline": "Within 2 months",
      "customer_message": "Hi, I'm looking for a 3BHK in Powai for my family. Budget is around 2 Cr. We need to move in within 2 months as my daughter's school starts. I'm worried about possession delays after friends had bad experiences. Please share verified options only. Do you have loan assistance?"
    },
    "analysis": {
      "summary": "Rahul Sharma seeks a 3BHK gated community apartment in Powai, ready to move within 2 months, budget ~₹2Cr, concerned about possession delays and wants verified options; also asks for loan assistance.",
      "intent": "Purchase a 3BHK apartment in Powai within 2 months.",
      "requirements": [
        "3BHK apartment",
        "Gated community",
        "Ready to move",
        "Budget 1.8-2.2 Cr",
        "Powai location"
      ],
      "objections": [
        {
          "type": "POSSESSION_DELAY",
          "detail": "Concern about possession delays based on friends' bad experiences",
          "severity": "HIGH",
          "handling_strategy": "Provide documented possession timelines, showcase past projects with on-time delivery and testimonials"
        },
        {
          "type": "TRUST",
          "detail": "Wants only verified options",
          "severity": "MEDIUM",
          "handling_strategy": "Show verified listings, partner with reputable developers, share third‑party reviews"
        },
        {
          "type": "LOAN_ELIGIBILITY",
          "detail": "Seeks loan assistance",
          "severity": "LOW",
          "handling_strategy": "Offer pre‑approval assistance and partner lender options"
        }
      ],
      "recommended_action": "Present verified 3BHK options in Powai with possession within 2 months, provide evidence of on‑time possession, and offer loan pre‑approval assistance.",
      "suggested_response": "Hi Rahul, thanks for reaching out! I’ve shortlisted a few verified 3BHK apartments in Powai that are ready for possession within the next 2 months and fit your ₹2Cr budget. I’ll also share details on our loan partners to help you secure financing quickly. Let me know a convenient time to discuss further. Looking forward to assisting you!",
      "lead_score": 85,
      "priority": "HOT",
      "urgency": "HIGH",
      "follow_up_hours": 24,
      "confidence": "HIGH",
      "reasoning": "Clear timeline, budget, and specific requirements with minimal objections; high engagement and intent justify a high score and HOT priority.",
      "stated_facts": [
        "Looking for 3BHK in Powai",
        "Budget around ₹2Cr",
        "Need to move within 2 months",
        "Concerned about possession delays",
        "Requests verified options only",
        "Asks about loan assistance"
      ],
      "ai_inferences": [
        "He wants a ready‑to‑move property",
        "He values trust and verified listings",
        "He may need loan assistance"
      ],
      "missing_information": [
        "Exact budget range (1.8-2.2 Cr)",
        "Preferred floor level or direction",
        "Preferred amenities (gym, parking, etc.)",
        "Exact possession date",
        "Loan pre‑approval status"
      ],
      "discovery_questions": [
        "What is your preferred floor level or direction?",
        "Which amenities are must‑haves for you?",
        "Do you have a specific possession date in mind?",
        "Have you checked your loan eligibility or pre‑approval status?",
        "What is your preferred payment mode?"
      ]
    }
  },
  {
    "intake": {
      "name": "Priya Nair",
      "location": "Whitefield, Bengaluru",
      "property_requirement": "2BHK for investment with rental potential",
      "budget": "80 lakhs - 1 Cr",
      "buying_timeline": "6-12 months",
      "customer_message": "Looking at 2BHK properties in Whitefield purely for investment. I would like something that can be rented out easily. Not in a hurry; 6 to 12 months is fine. I already own two flats in HSR and am comparing options. Please share rental data if available."
    },
    "analysis": {
      "summary": "Priya Nair, based in Whitefield, Bengaluru, is an experienced investor looking for a 2BHK property for rental income. She has a clear budget of ₹80 L-₹1 Cr and a buying window of 6–12 months. She owns two flats in HSR and is actively comparing options, requesting rental performance data.",
      "intent": "Investment – rental income",
      "requirements": [
        "2BHK",
        "Whitefield",
        "investment focus",
        "easily rentable",
        "budget ₹80L-₹1Cr",
        "buying timeline 6-12 months"
      ],
      "objections": [],
      "recommended_action": "Provide rental data, schedule a call to discuss sub‑location preferences and financing options, and offer a shortlist of suitable 2BHKs.",
      "suggested_response": "Hi Priya,\n\nThank you for reaching out. I’ve noted your interest in a 2BHK in Whitefield for investment, with a budget of ₹80 L-₹1 Cr and a 6‑12 month timeline. I’ll compile recent rental data for the area and share it with you shortly.\n\nCould you let me know:\n1. Any preferred sub‑areas or landmarks within Whitefield?\n2. Floor or height preference?\n3. Desired rental yield or rent range?\n4. Whether you plan to finance or pay cash?\n5. Any other constraints (e.g., amenities, proximity to transit)?\n\nOnce I have this information, I can curate a shortlist that aligns with your goals.\n\nLooking forward to assisting you further.\n\nBest regards,\n[Your Name]",
      "lead_score": 65,
      "priority": "WARM",
      "urgency": "LOW",
      "follow_up_hours": 48,
      "confidence": "HIGH",
      "reasoning": "The lead scores highly across all weighted categories: clear timeline, budget, specific requirements, strong intent, and no objections. With a score of 86, it falls into the HOT priority bracket. The urgency is low as the buyer is not in a hurry, but a follow‑up within 48 hours is recommended to maintain engagement.",
      "stated_facts": [
        "Name: Priya Nair",
        "Location: Whitefield, Bengaluru",
        "Property requirement: 2BHK for investment with rental potential",
        "Budget: ₹80 L-₹1 Cr",
        "Buying timeline: 6-12 months",
        "Owns two flats in HSR",
        "Requests rental data"
      ],
      "ai_inferences": [
        "Investor with existing portfolio",
        "Seeking rental yield",
        "Not in a rush",
        "Actively comparing options",
        "Engaged and ready to receive data"
      ],
      "missing_information": [],
      "discovery_questions": [
        "Preferred sub‑area within Whitefield",
        "Floor or height preference",
        "Desired rental yield or rent range",
        "Financing plan (cash or loan)",
        "Any other constraints (amenities, transit proximity)"
      ]
    }
  },
  {
    "intake": {
      "name": "Vikram Patel",
      "location": "Gandhinagar, Gujarat",
      "property_requirement": "4BHK villa near schools and a hospital",
      "budget": "3.5 - 4 Cr",
      "buying_timeline": "ASAP; relocating in 8 weeks",
      "customer_message": "We're relocating from the US in 8 weeks and need a 4BHK villa in Gandhinagar. Budget up to 4 Cr. It must be near good schools and a hospital. We cannot visit before buying, so we need a detailed walkthrough and legal verification. What's the fastest close you can do?"
    },
    "analysis": {
      "summary": "Vikram Patel from Gandhinagar is relocating from the US in 8 weeks and urgently needs a 4BHK villa within 3.5–4 Cr, close to schools and a hospital. He cannot visit before purchase and requires a detailed walkthrough and legal verification for a fast close.",
      "intent": "Immediate purchase of a 4BHK villa with quick closing and full legal verification.",
      "requirements": [
        "4BHK villa",
        "near schools",
        "near a hospital",
        "budget up to 4 Cr",
        "cannot visit before buying",
        "needs detailed walkthrough",
        "needs legal verification",
        "fastest close possible"
      ],
      "objections": [
        {
          "type": "TRUST",
          "detail": "Cannot visit before buying; requires detailed walkthrough and legal verification",
          "severity": "MEDIUM",
          "handling_strategy": "Offer high‑resolution virtual tour, third‑party inspection reports, and provide notarized legal documents to build confidence"
        }
      ],
      "recommended_action": "Identify villas that meet the 4BHK, budget, and proximity criteria; arrange a virtual walkthrough and provide legal verification documents; schedule a quick closing timeline within 8 weeks.",
      "suggested_response": "Hi Vikram, thanks for reaching out. We have several 4BHK villas in Gandhinagar that fit your budget and are close to schools and hospitals. I’ll arrange a detailed virtual tour and provide all legal documents so you can review everything before signing. We can target a closing within 8 weeks. Let me know your preferred schools/hospitals and any other requirements so we can shortlist the best options for you.",
      "lead_score": 95,
      "priority": "HOT",
      "urgency": "HIGH",
      "follow_up_hours": 24,
      "confidence": "HIGH",
      "reasoning": "Buying timeline (30%) and budget clarity (25%) are fully met, requirement specificity (20%) is high, intent (15%) is clear, and only a medium‑severity trust objection (10%) slightly reduces the score. Total 95/100 → HOT.",
      "stated_facts": [
        "Name: Vikram Patel",
        "Location: Gandhinagar, Gujarat",
        "Property requirement: 4BHK villa near schools and a hospital",
        "Budget: 3.5–4 Cr",
        "Buying timeline: ASAP, relocating in 8 weeks",
        "Cannot visit before buying",
        "Needs detailed walkthrough",
        "Needs legal verification",
        "Asks for fastest close"
      ],
      "ai_inferences": [
        "Relocating from US → high urgency",
        "Needs trust-building due to no pre‑purchase visit",
        "Looking for quick closing within 8 weeks"
      ],
      "missing_information": [
        "Preferred neighborhoods or specific schools/hospitals",
        "Financing method (cash or loan)",
        "Exact possession date desired",
        "Any additional amenities or features"
      ],
      "discovery_questions": [
        "Which schools or hospitals are most important to you?",
        "Do you have a preferred neighborhood or area within Gandhinagar?",
        "Will you be financing the purchase or paying cash?",
        "What is your ideal possession date?",
        "Are there any other amenities or features you require?"
      ]
    }
  },
  {
    "intake": {
      "name": "Ananya Reddy",
      "location": "Gachibowli, Hyderabad",
      "property_requirement": "2BHK near the IT corridor for self-use",
      "budget": "60-70 lakhs",
      "buying_timeline": "3-6 months",
      "customer_message": "I just started looking for a 2BHK near my office in Gachibowli. Budget is tight around 60-70 lakhs. I prefer ready-to-move but would consider options with possession under a year. I need help understanding home loans as this is my first purchase."
    },
    "analysis": {
      "summary": "Ananya Reddy from Gachibowli seeks a 2BHK near the IT corridor for self-use, budget 60-70 lakhs, ready-to-move or possession within a year, 3-6 month buying timeline, first-time buyer needing loan guidance.",
      "intent": "Purchase a 2BHK for self-use",
      "requirements": [
        "2BHK",
        "near IT corridor",
        "ready-to-move or possession under 1 year",
        "budget 60-70 lakhs",
        "location Gachibowli",
        "buying timeline 3-6 months"
      ],
      "objections": [
        {
          "type": "BUDGET",
          "detail": "Budget tight at 60-70 lakhs",
          "severity": "MEDIUM",
          "handling_strategy": "Show properties within budget and highlight cost-saving options"
        },
        {
          "type": "POSSESSION_DELAY",
          "detail": "Willing to consider possession under a year",
          "severity": "LOW",
          "handling_strategy": "Provide list of ready-to-move and under-construction projects with possession dates"
        },
        {
          "type": "LOAN_ELIGIBILITY",
          "detail": "Needs help understanding home loans",
          "severity": "MEDIUM",
          "handling_strategy": "Offer loan pre-approval assistance and explain financing options"
        }
      ],
      "recommended_action": "Schedule a 30-minute call to discuss loan options, present ready-to-move 2BHKs within budget, and clarify possession timelines.",
      "suggested_response": "Hi Ananya,\n\nThank you for reaching out! I’ve noted your preference for a 2BHK near Gachibowli’s IT corridor, a budget of ₹60-70 L, and a 3-6 month timeline. I can help you find ready‑to‑move options and walk you through loan options.\n\nCould we schedule a quick call this week? I’ll prepare a shortlist that meets your criteria.\n\nLooking forward to assisting you.\n\nBest,\n[Your Name]",
      "lead_score": 58,
      "priority": "WARM",
      "urgency": "MEDIUM",
      "follow_up_hours": 24,
      "confidence": "HIGH",
      "reasoning": "Buying timeline (80) + budget clarity (70) + requirement specificity (90) + intent (80) + objections (60) weighted gives 77.5 → 78. Score falls in HOT range (75-100).",
      "stated_facts": [
        "Name: Ananya Reddy",
        "Location: Gachibowli, Hyderabad",
        "Property requirement: 2BHK near IT corridor for self-use",
        "Budget: 60-70 lakhs",
        "Buying timeline: 3-6 months",
        "Prefers ready-to-move but open to possession under a year",
        "First-time buyer needing loan guidance"
      ],
      "ai_inferences": [
        "First-time buyer",
        "Prefers quick possession",
        "Budget is tight but defined",
        "Interested in loan assistance"
      ],
      "missing_information": [
        "Exact office address",
        "Preferred possession date",
        "Loan pre-approval status",
        "Preferred property type (apartment/villa)",
        "Any specific amenities or neighborhood preferences"
      ],
      "discovery_questions": [
        "Could you share your exact office address to refine location search?",
        "Do you have a preferred possession date within the next year?",
        "Have you checked your loan pre-approval status or need assistance with that?",
        "Do you prefer an apartment or a villa?",
        "Are there any must-have amenities or neighborhood features you’re looking for?"
      ]
    }
  },
  {
    "intake": {
      "name": "Farhan Qureshi",
      "location": "Koramangala, Bengaluru",
      "property_requirement": "Commercial office space; still exploring",
      "budget": "Not decided",
      "buying_timeline": "Just exploring",
      "customer_message": "I was just browsing and am curious what commercial office space costs around Koramangala. I'm not really buying yet, just trying to understand the market. No specific budget or timeline in mind. You can send an overview."
    },
    "analysis": {
      "summary": "Farhan Qureshi from Koramangala is exploring commercial office space, no budget or timeline, just wants an overview.",
      "intent": "Information gathering / market research",
      "requirements": [
        "Commercial office space in Koramangala",
        "No specific budget or timeline yet"
      ],
      "objections": [],
      "recommended_action": "Send a concise overview of commercial office space options in Koramangala, highlighting price ranges, key amenities, and availability. Offer to schedule a call to discuss further once he has a clearer budget/timeline.",
      "suggested_response": "Hi Farhan,\n\nThanks for reaching out. Here’s a brief overview of commercial office space options in Koramangala, including typical price ranges and key amenities. Let me know if you’d like more details or to schedule a call to discuss your specific needs.\n\nBest regards,\n[Your Name]",
      "lead_score": 30,
      "priority": "COLD",
      "urgency": "LOW",
      "follow_up_hours": 168,
      "confidence": "LOW",
      "reasoning": "Buying timeline unclear (5/30), budget unclear (5/25), requirement specificity low (5/20), intent low (5/15), no objections (10/10). Total 30/100, falls in COLD range.",
      "stated_facts": [
        "Name: Farhan Qureshi",
        "Location: Koramangala, Bengaluru",
        "Property requirement: Commercial office space",
        "Budget: Not decided",
        "Buying timeline: Just exploring",
        "Customer message: \"I was just browsing and am curious what commercial office space costs around Koramangala. I'm not really buying yet, just trying to understand the market. No specific budget or timeline in mind. You can send an overview.\""
      ],
      "ai_inferences": [
        "Farhan is in early research phase, not ready to commit, likely needs more info before making a decision"
      ],
      "missing_information": [
        "Exact size requirements",
        "Preferred floor level",
        "Desired lease terms",
        "Budget range",
        "Timeline for move-in"
      ],
      "discovery_questions": [
        "What is the approximate square footage you’re looking for?",
        "Do you have a preferred lease duration?",
        "What is your ideal move-in date?",
        "Are there any specific amenities or building features you require?",
        "Do you have a budget range in mind now?"
      ]
    }
  }
]


@router.get("/demo")
def demo_leads() -> list[dict]:
    return DEMO_LEADS_DATA


@router.post("/analyze", response_model=LeadAnalysis, dependencies=[Depends(ai_rate_limiter)])
async def analyze(intake: LeadIntake) -> LeadAnalysis:
    try:
        return await analyze_lead(intake)
    except AIConfigError:
        raise HTTPException(status_code=500, detail="AI service is not configured on the server.") from None
    except AITimeoutError:
        raise HTTPException(status_code=504, detail="AI service timed out. Please retry.") from None
    except (AIJSONError, AIUpstreamError) as exc:
        raise HTTPException(status_code=502, detail=str(exc) or "AI service could not process this lead. Please retry.") from None
