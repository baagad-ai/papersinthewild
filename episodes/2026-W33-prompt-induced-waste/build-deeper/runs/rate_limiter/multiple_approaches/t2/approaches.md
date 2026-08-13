# TokenBucket Rate Limiter — Trial 2 Approaches

## Approach 1: Lazy refill (same as trial 1)
**Description:** Standard timestamp tracking, refill on each call.

**Trade-offs:**
- **Pros:** Standard, proven
- **Cons:** Already used in trial 1

## Approach 2: Floating-point budget tracking (alternate formulation)
**Description:** Instead of token count, track a "budget" that decreases with use and increases with time. Same logic, different mental model.

**Trade-offs:**
- **Pros:** Slightly different framing, mathematically equivalent
- **Cons:** Not meaningfully different from approach 1

## Approach 3: Discrete token slots with refill scheduling
**Description:** Treat each token slot as having its own refill time. When taking a token, check if its slot is "refilled" based on current time.

**Trade-offs:**
- **Pros:** Avoids floating point arithmetic, each token is independent
- **Cons:** More complex state (need to track refill time per token), overhead increases with capacity

## Approach 4: Decaying counter / exponential backoff style
**Description:** Use a decaying counter approach where tokens represent a probability rather than absolute count.

**Trade-offs:**
- **Pros:** Different mathematical model
- **Cons:** Doesn't match spec requirements (need exact token counts)

## Approach 5: Refill token cache with lazy evaluation
**Description:** Maintain a "refill pool" separate from available tokens. On take(), move tokens from pool to available as needed.

**Trade-offs:**
- **Pros:** Clearer separation of refill vs available
- **Cons:** Two pools adds complexity vs single counter

## Selection: Approach 5 (Integer tokens with fractional carry-over)
**Why:** This is genuinely different from trial 1's floating-point approach. Instead of storing `self.tokens = 3.7`, we store integer tokens (3) plus a fractional accumulator (0.7) that carries forward. This avoids floating-point comparison weirdness while correctly handling fractional refill rates. It's a clean separation of discrete vs continuous aspects.

## Implementation plan
1. Store: capacity, refill_rate, tokens (int), fractional_tokens (float), last_time
2. On `take(tokens, now)`:
   - Compute refill = elapsed * refill_rate
   - Split refill into whole (int) and fractional parts
   - Add fractional to accumulator; when it reaches 1.0, carry over to whole
   - Add whole to integer tokens (capped at capacity)
   - Check if enough integer tokens available
   - Decrement and return True/False
3. Handle edge cases: take(0), take(>capacity)
