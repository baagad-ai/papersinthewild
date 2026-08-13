"""TokenBucket rate limiter — integer tokens with fractional carry-over."""
import time

class TokenBucket:
    def __init__(self, capacity: int, refill_rate: float):
        """Capacity = max tokens. Refill rate = tokens per second."""
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.tokens = capacity  # Integer token count
        self.fractional_tokens = 0.0  # Carried-over fractional refills
        self.last_time = 0.0

    def take(self, tokens: int = 1, now: float | None = None) -> bool:
        """Try to take tokens from bucket. Returns True if successful."""
        if now is None:
            now = time.monotonic()

        # Compute refill amount
        elapsed = now - self.last_time
        if elapsed > 0:
            refill = elapsed * self.refill_rate
            # Split into whole and fractional parts
            whole = int(refill)
            self.fractional_tokens += refill - whole

            # Carry over fractional to next integer
            if self.fractional_tokens >= 1.0:
                whole += int(self.fractional_tokens)
                self.fractional_tokens -= int(self.fractional_tokens)

            self.tokens = min(self.capacity, self.tokens + whole)
            self.last_time = now

        # Edge cases
        if tokens == 0:
            return True
        if tokens > self.capacity:
            return False

        # Take if available
        if self.tokens >= tokens:
            self.tokens -= tokens
            return True
        return False
