"""TokenBucket rate limiter — lazy refill approach."""
import time

class TokenBucket:
    def __init__(self, capacity: int, refill_rate: float):
        """Capacity = max tokens. Refill rate = tokens per second."""
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.tokens = float(capacity)
        self.last_refill_time = 0.0

    def take(self, tokens: int = 1, now: float | None = None) -> bool:
        """Try to take tokens from bucket. Returns True if successful."""
        if now is None:
            now = time.monotonic()

        # Lazy refill: add tokens based on elapsed time
        elapsed = now - self.last_refill_time
        if elapsed > 0:
            refill_amount = elapsed * self.refill_rate
            self.tokens = min(self.capacity, self.tokens + refill_amount)
            self.last_refill_time = now

        # Edge cases
        if tokens == 0:
            return True
        if tokens > self.capacity:
            return False

        # Check availability and take if possible
        if self.tokens >= tokens:
            self.tokens -= tokens
            return True
        return False
