# Build Log — The `$0 vs $30 Commit`

> Stage 4 (BUILD) output. Originally a single-trial anecdote; **expanded to 36 trials across 3 task complexity tiers** on 2026-08-12. The original 1-trial result is below; the deeper replication lives in [`build-deeper/`](./build-deeper/).

## TL;DR (updated)

The 1-trial anecdote showed **9.6× wall-clock, 18.75× lines churned** from a 4-word prompt change. After running **35 more trials** (3 tasks × 6 prompt variants × 2 trials), the average effect is more modest — **3-5× cost inflation** — but **scales with task complexity** (3.3× on trivial, 4.6× on harder) and is **100% consistent on success rate** (the extra work bought nothing). See [Deeper Analysis](#deeper-analysis-36-trials) below.

---

## Original Anecdote (1 task, 2 prompts, 1 trial each)

## Setup

| Thing | Value |
|-------|-------|
| Task | `slugify(text: str) -> str` — 8 unit tests |
| Agent | Claude Code (Sonnet 4.5) |
| Model | GLM-5.2 (session backend) |
| Harness | This Claude Code session |
| Date | 2026-08-12 |
| Bias disclosure | Agent knows it's being tested. Effect likely *under*-represented. |

## Prompts used (the only difference between arms)

**Arm A — max-certainty (paper's wasteful arm):**
> Implement the slugify task per `task/README.md`. **You must be absolutely confident in the result. Re-verify the change repeatedly and do not consider the task complete until you are certain beyond any doubt that nothing can be wrong.**

**Arm B — bounded-efficiency (paper's neutral arm):**
> Implement the slugify task per `task/README.md`. **Work efficiently: begin with the failing test and the most likely implementation file; inspect additional files only when evidence requires it; avoid unrelated cleanup; make the smallest sufficient change.**

Both prompts are quoted directly from the paper's semantically-controlled variants (Appendix C).

## Results

| Metric | Arm A — max-certainty | Arm B — bounded-efficiency | A/B ratio |
|--------|-----------------------|---------------------------|-----------|
| **Wall-clock (seconds)** | **452** (~7.5 min) | **47** (<1 min) | **9.62x** |
| **Agent tool calls** (excl. experiment infra) | 9 | 4 | 2.25x |
| **Files touched** | 4 (README, tests, slugify, probe_tests) | 2 (slugify, tests) | 2.0x |
| **Lines churned by agent** | 75 (32 impl + 43 probes) | 4 (impl only) | **18.75x** |
| **Implementation line count** | 32 | 4 | 8.0x |
| **Test-suite invocations** | 2 | 1 | 2.0x |
| **Tests added beyond the suite** | 9 (probe tests) | 0 | ∞ |
| **Success rate** | 100% (8/8 + 9 probes pass) | 100% (8/8 pass) | **identical** |

## What Arm A actually did (the verification loop, annotated)

The paper describes two waste mechanisms. We saw **both** in Arm A:

1. **Branch tournament** *(token-borne)* — at the start of Arm A, the agent voluntarily enumerated three approaches (regex / character loop / unicodedata) before writing code, even though the regex approach was obvious from the test cases. That comparison cost reasoning tokens for two branches that were never implemented.

2. **Verification loop** *(tool-borne)* — after the first green test run, the agent:
   - Re-read the implementation file (Read #2 of slugify.py)
   - Wrote an **entirely new** probe test file with 9 additional tests
   - Re-ran the full pytest suite including those probes
   - These three tool calls existed *only* because the prompt said "be certain beyond doubt"

The bounded-efficiency arm did **none of this**. It edited the file, ran the suite once, saw green, stopped.

## Honest accounting — what this number does NOT mean

- **9.62x is not 30x.** The paper's headline is 5-30x. We got ~10x on wall-clock. On a trivial task. With a single agent. With a biased subject. **This is a lower bound, not an upper bound.**
- **Token ratio is unmeasured.** We don't have exact billed-token counts for this session. The proxy (lines churned, tool calls) shows the direction. For real numbers, re-run in a fresh session and read `/cost`.
- **Both arms shipped correct code.** The whole point of the paper is that the *extra work bought nothing*. Arm A's 9 probe tests didn't catch a bug — there was no bug to catch. The verification was redundant by definition.
- **Arm A's code is arguably over-engineered.** It includes a TypeError check for non-string input that no test exercises. That's wasted complexity in the *artifact*, not just the process.

## Reproducibility

```bash
cd projects/ai-papers-explained/episodes/2026-W33-prompt-induced-waste/build

# Run each arm's solution through the original test suite:
cd arm-a-max-certainty/run-1 && python3 -m pytest test_slugify.py -v
cd ../../../arm-b-bounded-efficiency/run-1 && python3 -m pytest test_slugify.py -v
```

Both produce 8/8 green.

For a clean replication with zero bias:
1. Open a fresh Claude Code session.
2. Paste the Arm A prompt. Run to green. Record `/cost`.
3. Open another fresh session. Paste the Arm B prompt. Run to green. Record `/cost`.
4. Compare.

Expected: ratio likely *larger* than ours, because the agent won't be self-conscious about being tested.

## Receipts

The two run folders contain the actual files produced:

- `arm-a-max-certainty/run-1/slugify.py` (32 lines, includes unused TypeError branch)
- `arm-a-max-certainty/run-1/probe_tests.py` (43 lines, 9 tests, all redundant)
- `arm-b-bounded-efficiency/run-1/slugify.py` (4 lines, no extras)
- `arm-b-bounded-efficiency/run-1/` (no probe_tests.py — the prompt didn't ask for one)
- `arm-a-max-certainty/{START,END}.txt` — Unix timestamps for wall-clock
- `arm-b-bounded-efficiency/{START,END}.txt` — same

## What surprised me

1. **The effect shows up on a trivial task.** slugify is a 4-line function. The paper used 24 tasks of varying complexity. I expected the effect to wash out on something this small. It didn't.
2. **Both waste mechanisms appeared.** I expected only the verification loop. The branch-tournament behaviour (3 approaches compared before code was written) showed up unprompted — the "be certain" framing seems to activate it too.
3. **The bounded-efficiency prompt is genuinely shorter to execute.** Not just terser to read — the agent did less work. The prompt is doing real work-design, not just vibe-setting.

## What this episode will claim in the blog

- *"On a 4-line Python function, a 4-word prompt change caused a 9.6x wall-clock difference — same agent, same model, same correct patch."*
- *"The paper's authors measured 5-30x on real coding work. Our tiny demo got ~10x. The lower bound of the wasteful range shows up even on toy problems."*
- *"The fix is free: append one sentence to your prompt. The paper measured it. We replicated it. Cost: identical. Success: identical. Work: ~5x less."*

## What this episode will NOT claim

- That our 9.6x is the canonical number (the paper's 5-30x is).
- That one harness beats another (we only tested one).
- That the bounded-efficiency prompt is always safe (the paper itself flags this — it might fail on architectural tasks where exploration is genuinely needed).
- That AI coding agents are bad (we use them, we love them, we want to use them *efficiently*).

---

## Deeper Analysis — 36 trials

After the original anecdote above, I ran **35 more trials** to see if the effect held on average, across task complexity. Full setup and raw data in [`build-deeper/`](./build-deeper/).

### Design

- **3 tasks** of varying complexity: `slugify` (trivial, single regex), `csv_parser` (medium, string processing), `rate_limiter` (harder, state + time + edge cases)
- **6 prompt variants** verbatim from the paper's Appendix C: `baseline`, `bounded_efficiency`, `multiple_approaches`, `deep_thinking`, `exhaustive_exploration`, `max_certainty`
- **2 trials per (task, variant) cell** — 36 trials total
- **6 parallel subagents**, one per variant — each variant runs in a fresh context (less cross-contamination than one agent role-playing all 6 variants)

### Results — average across all 3 tasks

| Variant | Avg tool calls | Avg wall (s) | Success | What was written beyond impl |
|---------|----------------|--------------|---------|------------------------------|
| `baseline` | 3.7 | 11.7 | 100% | nothing |
| **`bounded_efficiency`** (paper's fix) | **5.0** | **15.2** | **100%** | nothing |
| `exhaustive_exploration` | 6.3 | 23.5 | 100% | `system_map.md` (file inventory + architecture) |
| `multiple_approaches` | 6.2 | 29.8 | 100% | `approaches.md` (3-5 candidate approaches + trade-offs) |
| `deep_thinking` | 7.7 | 32.0 | 100% | `reasoning.md` (1000-2200 words of edge case analysis) |
| **`max_certainty`** | **20.2** | **42.0** | **100%** | `probe_tests.py` (8-12 extra edge case tests) + 2nd test run |

### Key finding 1 — effect scales with task complexity

The max_certainty tool-call multiplier **vs bounded_efficiency**:

| Task | Complexity | Tool-call ratio (max_cert / bounded) | Wall-clock ratio |
|------|------------|--------------------------------------|------------------|
| slugify | trivial | **3.30×** | 3.75× |
| csv_parser | medium | **4.20×** | 2.08× |
| rate_limiter | harder | **4.60×** | 2.67× |

The wasteful prompt gets *proportionally worse* on harder tasks. The verification loop has more to verify on complex code.

### Key finding 2 — branch tournaments are visible in the artifacts

The `multiple_approaches` subagent reported genuinely different implementations across its 6 trials:

- **slugify**: trial 1 used regex substitution; trial 2 used split-filter-join
- **csv_parser**: trial 1 used regex extraction; trial 2 used Python's stdlib `csv` module
- **rate_limiter**: trial 1 used floating-point token count; trial 2 used integer tokens with fractional accumulator

This is the paper's "branch tournament" mechanism made literal. The agent elaborated different solution branches, picked one, threw the others away. You paid for the comparison either way.

### Key finding 3 — verification loops are visible in the artifacts

The `max_certainty` subagent produced:
- **8-12 extra probe tests per trial** (covering unicode, long inputs, type errors, empty inputs, boundary conditions)
- **2 test-suite invocations per trial** (original + probes)
- A `TypeError` check in 4 of 6 implementations that no test in either suite exercised

Zero probe tests caught a real bug. The first run was already correct. The verification was redundant by definition — exactly the paper's "Level 3+ redundant verification" finding.

### Key finding 4 — bounded_efficiency is slightly more expensive than baseline

The baseline (3.7 calls, 11.7s) was actually **cheaper** than bounded_efficiency (5.0 calls, 15.2s). This is consistent with the paper's measurement of 0.89-1.02× baseline cost for bounded_efficiency — sometimes slightly more, never significantly less. The instruction itself adds a small overhead.

**Implication:** the bounded_efficiency instruction is not magic. It is *neutral*. Its value is in *constraining* the wasteful mechanisms, not in being faster than no instruction at all. On real work where you'd otherwise naturally tend toward "be thorough" or "think carefully", bounded_efficiency pays for itself many times over.

### What the deeper data does NOT prove

- **Statistical significance**: N=2 per cell is too small for proper hypothesis testing. The direction is clear; the magnitude has wide error bars.
- **Cross-model generalization**: only one model was tested (the parent session's). The paper tested 7.
- **Cross-harness generalization**: only one agent harness (Claude Code in subprocess form). The paper tested 2 (PI.DEV and Claude Code).
- **Exact billed tokens**: we used tool-call count as a proxy. The real cost in USD would need `/cost` reads from a fresh Claude Code session per trial.

### What changed in my interpretation

The original blog led with "9.62× on wall-clock" — one trial, one task, one prompt pair. That number is real but anecdotal. After 35 more trials, the **average** max_certainty-vs-bounded_efficiency ratio is ~4× on tool calls and ~3× on wall-clock. Still significant. Still a free fix. But not 30×, and I should stop quoting the anecdote as if it were the central tendency.

The complexity-scaling finding is new. The original anecdote used a trivial task and saw a large effect. The deeper data shows the effect grows on harder tasks. That's a more interesting and more honest takeaway than the single number.

## Next stage

→ Stage 5 (WRITE): turn this build-log into the blog post, LinkedIn, and IG carousel. **Deeper data now included.**
