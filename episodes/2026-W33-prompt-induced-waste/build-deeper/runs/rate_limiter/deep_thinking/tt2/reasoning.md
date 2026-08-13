# Deep Reasoning: TokenBucket - Mathematical Correctness and Invariants

## Problem Formalization

The token bucket is a rate-limiting algorithm that can be formalized as a state machine with temporal dynamics. Let me approach this from a mathematical perspective to ensure correctness.

## State Space Definition

The system has the following state variables:

1. **C**: Capacity (constant, integer ≥ 0)
2. **R**: Refill rate (constant, float ≥ 0, tokens/second)
3. **T**: Current tokens (mutable, 0 ≤ T ≤ C, float)
4. **t_last**: Last refill calculation timestamp (mutable, float or None)

## Invariant Properties

The system must maintain these invariants at all times:

**Invariant 1**: `0 ≤ current_tokens ≤ capacity`
- Can never have negative tokens
- Can never exceed capacity

**Invariant 2**: `refill_rate ≥ 0`
- Rate is non-negative (time only moves forward)

**Invariant 3**: `current_tokens` is always a float
- Even if capacity is integer, refill can be fractional
- Internal representation must handle fractions

**Invariant 4**: Monotonic time assumption
- `now` values are non-decreasing
- If `now` is provided, it must be ≥ `last_refill_time`

## Transition Function Analysis

### Transition 1: Initialization

```
state_0 = (capacity, refill_rate, capacity, None)
```

**Why start full?** Per specification: "Fresh bucket starts at full capacity."

**Why None for timestamp?** First call will initialize to avoid calling `time.monotonic()` prematurely.

### Transition 2: Token Consumption

Preconditions for `take(k)` to succeed:
1. `k > 0` (positive number of tokens)
2. `k ≤ capacity` (request is reasonable)
3. `current_tokens ≥ k` (enough available)

Postconditions:
- `current_tokens ← current_tokens - k`
- `t_last ← now`
- Return `True`

If preconditions not met, return `False` with no state change (except time tracking).

### Transition 3: Refill Calculation

On each call with timestamp `now`:

```
Δt = now - t_last
if Δt > 0:
    refill = R × Δt
    current_tokens ← min(C, current_tokens + refill)
    t_last ← now
```

**Why multiply by Δt?**
- R is tokens/second
- Δt is seconds
- R × Δt = tokens to add

**Why min(C, ...)?**
- Bucket can't exceed capacity
- Excess tokens are discarded (overflow)

## Edge Case Analysis

### Case 1: Zero Tokens Request

```
take(0, now=t)
```

**Specification**: "Taking 0 tokens always succeeds (returns True, no decrement)"

**Reasoning**:
- Request is vacuously satisfiable
- No state change needed
- Time should not advance (no meaningful operation)
- Return True immediately

### Case 2: Excessive Request

```
take(k, now=t) where k > C
```

**Specification**: "Taking more tokens than capacity always fails (returns False, no decrement)"

**Reasoning**:
- Request exceeds maximum possible tokens
- Can never succeed in any future state
- Immediate rejection is optimal
- No state change (no time advancement)

### Case 3: Empty Bucket with Time Advance

```
take(1, now=0.0)  # T = 0
take(1, now=2.0)  # Should add 2R tokens
```

**Trace**:
1. First call: `T = 0`, `t_last = 0.0`, returns False
2. Second call: `Δt = 2.0 - 0.0 = 2.0`, `refill = 2R`, `T = 2R`, succeeds if `2R ≥ 1`

This correctly handles the "lazy refill" behavior.

### Case 4: Fractional Refill

```
R = 0.5, take(1, now=1.0) after empty
```

**Calculation**:
- `Δt = 1.0`
- `refill = 0.5 × 1.0 = 0.5`
- `T = 0.5`
- `take(1)` checks: `0.5 ≥ 1` → False

Correct! Partial tokens are tracked but insufficient for request.

### Case 5: Overfill Protection

```
C = 3, R = 10.0, wait 100 seconds
```

**Calculation**:
- `Δt = 100.0`
- `refill = 10.0 × 100.0 = 1000`
- `T = min(3, 0 + 1000) = 3`

Correctly caps at capacity.

## Mathematical Correctness Proof

**Theorem**: The algorithm maintains all invariants and correctly implements token bucket semantics.

**Proof by induction on number of operations**:

**Base case**: Initialization
- `current_tokens = capacity` (by construction)
- `0 ≤ capacity ≤ capacity` ✓
- Invariant 1 holds

**Inductive step**: Assume invariants hold before operation `op`

**Case A**: `op = take(0, now=t)`
- No state change
- Invariants preserved by IH ✓

**Case B**: `op = take(k, now=t)` where `k > capacity`
- No state change
- Invariants preserved by IH ✓

**Case C**: `op = take(k, now=t)` where `0 < k ≤ capacity`
Let `T_old` be tokens before, `T_new` after.

**Subcase C1**: Refill occurs (`Δt > 0`)
```
refill = R × Δt
T_temp = T_old + refill
T_new = min(C, T_temp)
```

Show `0 ≤ T_new ≤ C`:
- `T_old ≥ 0` (IH)
- `refill ≥ 0` (R ≥ 0, Δt > 0)
- `T_temp = T_old + refill ≥ 0`
- `T_new = min(C, T_temp) ≤ C` ✓
- If `T_temp ≤ C`, `T_new = T_temp ≥ 0` ✓
- If `T_temp > C`, `T_new = C ≥ 0` ✓

**Subcase C2**: No refill (`Δt = 0`)
```
T_new = T_old
```
- `T_new = T_old ≥ 0` (IH) ✓
- `T_new = T_old ≤ C` (IH) ✓

**Subcase C3**: Token consumption (if `T_new ≥ k`)
```
T_final = T_new - k
```

Show `0 ≤ T_final ≤ C`:
- `T_final = T_new - k ≥ 0` (since `T_new ≥ k`) ✓
- `T_final = T_new - k ≤ T_new ≤ C` (since `k ≥ 0`) ✓

**Subcase C4**: Rejection (if `T_new < k`)
- No state change
- Invariants preserved ✓

**Conclusion**: By induction, all invariants hold for any sequence of operations. ✓

## Algorithm Correctness

**Claim**: The refill calculation is correct.

**Proof**: The token bucket algorithm specifies that tokens accumulate at rate R over time. After time Δt, we should have added `R × Δt` tokens. The algorithm implements this exactly. ✓

**Claim**: The capacity cap is correct.

**Proof**: Specification says "Bucket never exceeds capacity." The algorithm uses `min(C, T + refill)` which mathematically guarantees `T ≤ C`. ✓

**Claim**: Time tracking is correct.

**Proof**: The algorithm updates `t_last` only when time advances (`Δt > 0`). This ensures:
- Refill calculated on actual elapsed time
- No "double counting" of time periods
- Correct lazy refill semantics ✓

## Implementation Strategy

Based on this mathematical analysis, the implementation should:

1. **Use float for token count**: Handle fractional tokens from refill
2. **Track time explicitly**: Store `last_refill_time` for Δt calculation
3. **Apply min(capacity, ...)**: Enforce overflow protection
4. **Check conditions before mutation**: Ensure atomicity of state updates
5. **Handle edge cases first**: `tokens = 0` and `tokens > capacity`

### State Update Sequence

On each `take(k, now)` call:

1. **Validate request**: Check edge cases (`k = 0`, `k > C`)
2. **Determine time**: Use `now` or `time.monotonic()`
3. **Initialize if needed**: Set `t_last` on first call
4. **Calculate elapsed**: `Δt = now - t_last`
5. **Apply refill if time passed**: `T ← min(C, T + R × Δt)` if `Δt > 0`
6. **Update timestamp**: `t_last ← now` (if refill occurred)
7. **Check availability**: Return `True` if `T ≥ k`, else `False`
8. **Consume if success**: `T ← T - k` if returning `True`

This sequence ensures:
- All invariants maintained
- Correct token accounting
- Proper time tracking
- Atomic state transitions

## Complexity Analysis

**Time complexity**: O(1) per `take()` call
- Constant number of operations
- No loops or recursion
- Just arithmetic operations

**Space complexity**: O(1) total
- Fixed number of instance variables
- No dynamic data structures
- Constant memory footprint

**Numerical stability**:
- Uses floating-point for token count
- Potential for floating-point errors with extreme values
- For typical use cases (seconds to hours), double precision is sufficient
- Could use decimal.Decimal for exact arithmetic if needed (not required here)

## Alternative Implementations Considered

### Alternative 1: Continuous Refill (Background Thread)
- Pro: More "real-time" feeling
- Con: Overkill, requires threading, complexity
- Rejected: Lazy refill is specified and sufficient

### Alternative 2: Integer-Based Tokens
- Pro: Avoid floating-point issues
- Con: Loses precision for fractional rates
- Rejected: Specification allows fractional rates

### Alternative 3: Event-Based Tracking
- Pro: Detailed history of operations
- Con: Unbounded memory, complex
- Rejected: Only current state needed

### Alternative 4: Fixed-Point Arithmetic
- Pro: Precision without floating-point
- Con: More complex, less standard
- Rejected: Standard float is adequate

## Final Algorithm

The chosen implementation follows directly from the mathematical analysis:

1. Maintain state `(C, R, T, t_last)`
2. On `take(k, now)`:
   - Handle trivial cases (k=0, k>C)
   - Calculate and apply refill if time passed
   - Check and consume tokens if available
   - Return success/failure

This ensures correctness, maintains all invariants, and matches the specification precisely.
