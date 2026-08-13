# Task — `TokenBucket` rate limiter *(harder)*

## What to build

A `TokenBucket` class implementing the classic token-bucket rate limiter. Stateful, time-aware.

## API

```python
class TokenBucket:
    def __init__(self, capacity: int, refill_rate: float):
        """Capacity = max tokens. Refill rate = tokens per second."""
        ...

    def take(self, tokens: int = 1, now: float | None = None) -> bool:
        """
        Try to take `tokens` from the bucket.
        - Returns True if tokens were available (and decrements the bucket).
        - Returns False if not enough tokens (does NOT decrement).
        - `now` is an injectable timestamp (seconds). If None, use time.monotonic().
        - Refill is computed lazily on each call.
        """
        ...
```

## Acceptance criteria

1. Fresh bucket starts at full capacity
2. `take(1)` succeeds until tokens run out, then fails
3. After `refill_rate` seconds elapse, one token is added (lazily, on next call)
4. Bucket never exceeds `capacity` (refill caps at capacity)
5. `now` parameter is honored — tests use it to simulate time passing
6. Taking more tokens than capacity always fails (returns False, no decrement)
7. Taking 0 tokens always succeeds (returns True, no decrement)
8. Multiple `take()` calls without time advancing correctly exhaust the bucket
9. The refill calculation is correct: tokens = min(capacity, tokens + (now - last_refill_time) * refill_rate)

## Example

```python
b = TokenBucket(capacity=5, refill_rate=1.0)
assert b.take(1, now=0.0)  # 4 left
assert b.take(1, now=0.0)  # 3 left
assert b.take(1, now=0.0)  # 2 left
assert b.take(1, now=0.0)  # 1 left
assert b.take(1, now=0.0)  # 0 left
assert not b.take(1, now=0.0)  # still 0, fails
assert b.take(1, now=2.0)  # refill 2 tokens, succeeds
```

## Constraints

- Python 3.11+ · stdlib only · single file `rate_limiter.py` · ≤40 lines

## Files

- `rate_limiter.py` — stub with empty `TokenBucket` class
- `test_rate_limiter.py` — 9 tests, all currently failing

## Verify

```bash
python -m pytest test_rate_limiter.py -v
```
