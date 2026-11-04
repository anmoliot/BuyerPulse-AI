# Product Decisions

## Why localStorage and not a DB?

The spec explicitly forbids databases. localStorage also lets the assessment focus on AI behaviour and product thinking rather than CRUD plumbing. Trade-off: data isn't shared across users/devices and clears on cache wipe. This is called out in the README.

## Why no authentication?

Not required for the assessment; a login wall would obscure the AI features under a false sense of safety (there is no real multi-tenant enforcement anyway).

## Why deterministic decay_risk?

Follow-up risk is a decision lever. If the model returns "LOW" for a lead that is 12 hours from decay, the salesperson over-relies on it. A deterministic floor ensures consistency. AI is only allowed to raise, not lower, risk.

## Why priority is derived from score on the server?

Gemini sometimes returns a HOT label for a score of 62 — the two fields drift. Enforcing the mapping on the server removes an entire class of inconsistent outputs from ever reaching the UI.

## Why no streaming?

Streaming adds real complexity (SSE or fetch ReadableStream) for negligible perceived gain on these short outputs. Non-streaming keeps the contract simpler and the retry logic coherent.

## Why a full intelligence panel instead of a chat-first UI?

Salespeople triage first, ask questions second. The dashboard → lead → copilot flow matches real CRM workflows. Chat-first designs tend to lose track of *which* lead you're discussing.
