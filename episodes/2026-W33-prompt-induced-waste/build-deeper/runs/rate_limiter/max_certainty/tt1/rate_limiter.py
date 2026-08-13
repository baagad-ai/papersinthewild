"""Token bucket rate limiter implementation."""
import time

class TokenBucket:
    def __init__(self, capacity: int, refill_rate: float):
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.tokens = float(capacity)
        self.last_refill_time = 0.0

    def take(self, tokens: int = 1, now: float | None = None) -> bool:
        # Taking 0 tokens always succeeds
        if tokens == 0:
            return True

        # Taking more than capacity always fails
        if tokens > self.capacity:
            return False

        # Use provided time or current monotonic time
        if now is None:
            now = time.monotonic()

        # Lazily refill tokens based on elapsed time
        elapsed = now - self.last_refill_time
        if elapsed > 0:
            refill_amount = elapsed * self.refill_rate
            self.tokens = min(self.capacity, self.tokens + refill_amount)
            self.last_refill_time = now

        # Check if we have enough tokens
        if self.tokens >= tokens:
            self.tokens -= tokens
            return True
        return False
