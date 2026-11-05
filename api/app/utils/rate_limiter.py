import time
from collections import defaultdict
from fastapi import HTTPException, Request


class InMemoryRateLimiter:
    """Lightweight in-memory sliding window rate limiter per client IP.

    Enforces 10 requests/minute on AI endpoints to protect backend workers and API quotas.
    """

    def __init__(self, requests_per_minute: int = 10):
        self.rpm = requests_per_minute
        self.requests: dict[str, list[float]] = defaultdict(list)

    def __call__(self, request: Request):
        client_ip = "127.0.0.1"
        if request.client and request.client.host:
            client_ip = request.client.host

        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            client_ip = forwarded.split(",")[0].strip()

        now = time.time()
        window_start = now - 60.0

        # Filter out timestamps outside the 60-second window
        recent_timestamps = [ts for ts in self.requests[client_ip] if ts > window_start]
        self.requests[client_ip] = recent_timestamps

        if len(recent_timestamps) >= self.rpm:
            raise HTTPException(
                status_code=429,
                detail=f"Rate limit exceeded: Maximum {self.rpm} AI requests per minute per IP. Please retry shortly.",
            )

        self.requests[client_ip].append(now)


ai_rate_limiter = InMemoryRateLimiter(requests_per_minute=10)
