"""Token bucket rate limiter with lazy refill calculation."""

import time

class TokenBucket:
    def __init__(self, capacity: int, refill_rate: float):
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.current_tokens = float(capacity)
        self.last_time = None

    def take(self, tokens: int = 1, now: float | None = None) -> bool:
        # Handle trivial edge cases
        if tokens == 0:
            return True
        if tokens > self.capacity:
            return False

        # Get current timestamp
        timestamp = now if now is not None else time.monotonic()

        # Initialize time tracking on first call
        if self.last_time is None:
            self.last_time = timestamp
        else:
            # Calculate elapsed time and apply refill
            elapsed = timestamp - self.last_time
            if elapsed > 0:
                added = elapsed * self.refill_rate
                self.current_tokens = min(self.capacity, self.current_tokens + added)
                self.last_time = timestamp

        # Check availability and consume if successful
        if self.current_tokens >= tokens:
            self.current_tokens -= tokens
            return True
        return False
