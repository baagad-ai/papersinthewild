import time

class TokenBucket:
    def __init__(self, capacity: int, refill_rate: float):
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.tokens = capacity
        self.last_time = 0.0

    def take(self, tokens: int = 1, now: float | None = None) -> bool:
        if tokens == 0:
            return True

        if now is None:
            now = time.monotonic()

        if tokens > self.capacity:
            return False

        self._refill(now)

        if self.tokens >= tokens:
            self.tokens -= tokens
            return True
        return False

    def _refill(self, now: float):
        elapsed = now - self.last_time
        self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
        self.last_time = now
