"""Stub — implement me."""

class TokenBucket:
    def __init__(self, capacity: int, refill_rate: float):
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.tokens = float(capacity)
        self.last_refill_time = 0.0

    def take(self, tokens: int = 1, now: float = 0.0) -> bool:
        if tokens < 0:
            return False
        if tokens == 0:
            return True
        if tokens > self.capacity:
            return False
        # Refill based on elapsed time
        elapsed = now - self.last_refill_time
        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
        self.last_refill_time = now
        if self.tokens >= tokens:
            self.tokens -= tokens
            return True
        return False
