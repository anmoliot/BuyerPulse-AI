# BuyerPulse AI — AI Design

## Model and SDK

The backend uses Google's official `google-genai` Python SDK. The default configured model is `gemini-3.8-flash`; `GEMINI_MODEL` can override it without a code change. Responses request JSON MIME type and use low temperature.

## Prompt boundaries

All system prompts and prompt builders are in `backend/app/services/prompts.py`:

- `LEAD_ANALYSIS_SYSTEM` and `build_lead_analysis_user_prompt`
- `COPILOT_SYSTEM` and `build_copilot_user_prompt`
- `FOLLOWUP_SYSTEM` and `build_followup_user_prompt`

Prompts distinguish customer-provided facts from inferences and prohibit invented property names, inventory, prices, possession dates, amenities, and legal claims. Each prompt defines the expected JSON fields and enums.

## Lead scoring rubric

| Signal | Weight |
|---|---:|
| Buying timeline | 30% |
| Budget clarity and fit | 25% |
| Requirement specificity | 20% |
| Stated intent and engagement | 15% |
| Objections and risk | 10% |

Priority is computed from the score in the Pydantic model: HOT at 75+, WARM at 40–74, and COLD below 40.

## Output validation and reliability

- `json_parser.py` strips code fences and finds the first balanced JSON object.
- `LeadAnalysis`, `CopilotChatResponse`, and `FollowUpResponse` validate output fields and enum values.
- Malformed JSON gets one corrective retry. Schema-invalid output is rejected with a controlled 502 response.
- Gemini calls have bounded timeouts: 30 seconds for analysis and 20 seconds for chat and follow-up.
- API errors are mapped to clear HTTP responses; logs avoid keys and full message contents.

## Follow-up decay risk

`compute_decay_risk` sets a deterministic minimum from follow-up interval, objection severity, and confidence. The model may raise this risk; `escalate_only` prevents it from lowering the server's level.

## Evidence handling

The response separates `stated_facts`, `ai_inferences`, `missing_information`, and `discovery_questions`. A heuristic sanitizer drops likely unsupported specific price or project references from stated facts when the corresponding detail is absent from the customer message. This is a guardrail, not a proof of factual correctness; agents must verify all output.

## Context limits

Customer messages are limited to 4,000 characters. Copilot prompt construction includes at most the latest eight conversation turns.

## Naming

The product name is **BuyerPulse AI** across prompts, logs, documentation, and UI.
