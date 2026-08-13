"""Token bucket rate limiter."""

import time

class TokenBucket:
    def __init__(self, capacity: int, refill_rate: float):
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.current_tokens = float(capacity)
        self.last_refill_time = None

    def take(self, tokens: int = 1, now: float | None = None) -> bool:
        # Handle edge cases
        if tokens == 0:
            return True
        if tokens > self.capacity:
            return False

        # Determine current time
        if now is None:
            now = time.monotonic()

        # Initialize on first call
        if self.last_refill_time is None:
            self.last_refill_time = now

        # Calculate refill based on elapsed time
        elapsed = now - self.last_refill_time
        if elapsed > 0:
            refill = elapsed * self.refill_rate
            self.current_tokens = min(self.capacity, self.current_tokens + refill)
            self.last_refill_time = now

        # Check if enough tokens available
        if self.current_tokens >= tokens:
            self.current_tokens -= tokens
            return True
        return False
