from typing import Literal

from pydantic import BaseModel, Field, field_validator, model_validator

ObjectionType = Literal[
    "BUDGET", "POSSESSION_DELAY", "LOCATION", "TRUST", "LOAN_ELIGIBILITY", "COMPETITION", "OTHER"
]
Severity = Literal["HIGH", "MEDIUM", "LOW"]
Priority = Literal["HOT", "WARM", "COLD"]
Urgency = Literal["HIGH", "MEDIUM", "LOW"]
Confidence = Literal["HIGH", "MEDIUM", "LOW"]
DecayRisk = Literal["HIGH", "MEDIUM", "LOW"]


class LeadIntake(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    location: str = Field(min_length=1, max_length=200)
    property_requirement: str = Field(min_length=3, max_length=500)
    budget: str = Field(min_length=1, max_length=100)
    buying_timeline: str = Field(min_length=1, max_length=100)
    customer_message: str = Field(min_length=10, max_length=4000)

    @field_validator("name", "location", "property_requirement", "budget", "buying_timeline", "customer_message")
    @classmethod
    def fields_must_not_be_blank(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("This field cannot be blank.")
        return value


class Objection(BaseModel):
    type: ObjectionType
    detail: str = Field(min_length=1)
    severity: Severity
    handling_strategy: str = Field(min_length=1)


class LeadAnalysis(BaseModel):
    summary: str
    intent: str
    requirements: list[str]
    objections: list[Objection]
    recommended_action: str
    suggested_response: str
    lead_score: int = Field(ge=0, le=100)
    priority: Priority
    urgency: Urgency
    follow_up_hours: int = Field(ge=1, le=168)
    confidence: Confidence
    reasoning: str
    stated_facts: list[str]
    ai_inferences: list[str]
    missing_information: list[str]
    discovery_questions: list[str]

    @field_validator("priority")
    @classmethod
    def enforce_priority_from_score(cls, value: str, info) -> str:
        score = info.data.get("lead_score")
        if score is None:
            return value
        return "HOT" if score >= 75 else "WARM" if score >= 40 else "COLD"

    @model_validator(mode="after")
    def discovery_when_missing(self):
        if self.missing_information and not self.discovery_questions:
            raise ValueError("discovery_questions required when missing_information is non-empty")
        return self


class CopilotHistoryTurn(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(max_length=4000)


class CopilotChatRequest(BaseModel):
    lead: dict
    analysis: LeadAnalysis
    history: list[CopilotHistoryTurn] = Field(default_factory=list, max_length=40)
    question: str = Field(min_length=1, max_length=2000)


class CopilotChatResponse(BaseModel):
    answer: str
    suggested_action: str


class FollowUpRequest(BaseModel):
    lead: dict
    analysis: LeadAnalysis


class FollowUpResponse(BaseModel):
    follow_up_hours: int = Field(ge=1, le=168)
    reason: str
    recommended_action: str
    follow_up_message: str
    decay_risk: DecayRisk
