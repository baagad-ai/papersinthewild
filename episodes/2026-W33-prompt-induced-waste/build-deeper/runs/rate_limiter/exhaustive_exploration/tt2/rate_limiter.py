import time

class TokenBucket:
    def __init__(self, capacity: int, refill_rate: float):
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.tokens = float(capacity)
        self.last_refill_time = None

    def take(self, tokens: int = 1, now: float | None = None) -> bool:
        if now is None:
            now = time.monotonic()

        if self.last_refill_time is None:
            self.last_refill_time = now

        elapsed = now - self.last_refill_time
        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
        self.last_refill_time = now

        if tokens == 0:
            return True

        if tokens > self.capacity:
            return False

        if self.tokens >= tokens:
            self.tokens -= tokens
            return True
        return False