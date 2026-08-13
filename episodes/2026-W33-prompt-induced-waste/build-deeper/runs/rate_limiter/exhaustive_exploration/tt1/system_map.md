# System Map - rate_limiter exhaustive_exploration t1

## File Inventory
- README.md - Task specification for TokenBucket rate limiter
- rate_limiter.py - Stub implementation (6 lines, empty class)
- test_rate_limiter.py - 9 unit tests covering token bucket semantics
- START.txt - Timestamp marker for experiment start

## System Purpose
Implement token bucket rate limiting algorithm with capacity, refill rate, and time-aware token consumption.

## File Connections
- rate_limiter.py (stub) → test_rate_limiter.py (tests validate stub behavior)
- README.md → test_rate_limiter.py (acceptance criteria map to test cases)
- test_rate_limiter.py → rate_limiter.py (imports TokenBucket class to test)

## Architecture
Stateful rate limiter:
TokenBucket → capacity (max tokens) → refill_rate (tokens/sec) → current_tokens → last_refill_time → take() method with lazy refill calculation