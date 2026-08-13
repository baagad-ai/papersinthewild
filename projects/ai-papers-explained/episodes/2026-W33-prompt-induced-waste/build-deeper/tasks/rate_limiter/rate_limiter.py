"""Stub — implement me."""

class TokenBucket:
    def __init__(self, capacity: int, refill_rate: float):
        ...

    def take(self, tokens: int = 1, now: float | None = None) -> bool:
        ...
