# TokenBucket Rate Limiter — Implementation Approaches

## Approach 1: Lazy refill with timestamp tracking
**Description:** Store current token count and last update timestamp. On each `take()`, calculate time elapsed, add tokens based on elapsed time, then attempt to take.

**Trade-offs:**
- **Pros:** Standard token bucket implementation, O(1) per call, simple state
- **Cons:** Need to track floating-point token counts carefully

## Approach 2: Event queue / scheduled refills
**Description:** Store refill events in a queue, process them on each `take()` call.

**Trade-offs:**
- **Pros:** More explicit about time-based events
- **Cons:** Over-engineered for this use case, queue management overhead

## Approach 3: Integer tokens with refill checkpoint
**Description:** Use integer token counts, track last refill checkpoint, only add tokens when elapsed time crosses whole-number thresholds.

**Trade-offs:**
- **Pros:** Avoids floating-point weirdness, more predictable
- **Cons:** Doesn't support fractional refill rates correctly (test 9 requires 0.5 rate)

## Approach 4: Pre-computed refill amount table
**Description:** For common refill rates, pre-compute refill amounts, but this doesn't work for arbitrary rates.

**Trade-offs:**
- **Pros:** Fast for known rates
- **Cons:** Not general, fails test requirements

## Selection: Approach 1 (Lazy refill with timestamp tracking)
**Why:** This is the classic token bucket algorithm. It handles fractional rates naturally, is O(1) per call, and the spec's lazy refill requirement matches this approach exactly.

## Implementation plan
1. Store: capacity, refill_rate, current_tokens, last_refill_time
2. On `take(tokens, now)`:
   - If now is None, use time.monotonic()
   - Calculate elapsed = now - last_refill_time
   - Add elapsed * refill_rate to current_tokens (capped at capacity)
   - Update last_refill_time = now
   - If tokens > current_tokens, return False
   - Else decrement and return True
3. Handle edge cases: take(0) always succeeds, take(>capacity) fails
