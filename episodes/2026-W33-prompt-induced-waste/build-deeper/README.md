# Deeper Experiment - 36-trial reproduction of arXiv 2608.01347

> An expansion of the original 1-task / 2-prompt / 1-trial anecdote into a real reproduction with 3 tasks × 6 prompt variants × 2 trials each = **36 trials**.

## Why this exists

The first build-log captured a single anecdote: max-certainty prompt vs bounded-efficiency prompt, on a 4-line `slugify` function, one trial each. It showed 9.62× wall-clock and 18.75× lines churned. That was interesting but methodologically thin - N=1 per cell, single task, no variance signal.

This deeper experiment:
- Adds **2 more task complexity tiers** (medium CSV parser, harder rate limiter)
- Tests **6 prompt variants** from the paper instead of 2 (baseline, multiple_approaches, deep_thinking, max_certainty, exhaustive_exploration, bounded_efficiency)
- Runs **2 trials per cell** for variance signal
- Dispatches **6 parallel subagents** so each variant runs in an independent context (less cross-contamination than one agent role-playing all 6 variants in sequence)

## What it found (headline)

**The paper's effect reproduces, more modestly than the anecdote but consistently across task complexity.**

| Variant | Avg tool calls (all 3 tasks) | Avg wall-clock | Success rate |
|---------|------------------------------|----------------|--------------|
| baseline | 3.7 | 11.7s | 100% |
| **bounded_efficiency** (paper's fix) | **5.0** | **15.2s** | **100%** |
| exhaustive_exploration | 6.3 | 23.5s | 100% |
| multiple_approaches | 6.2 | 29.8s | 100% |
| deep_thinking | 7.7 | 32.0s | 100% |
| **max_certainty** | **20.2** | **42.0s** | **100%** |

**max_certainty ≈ 4× more tool calls than bounded_efficiency.** The verification loop (probe tests + re-run) is the dominant cost driver, confirming the paper's "Level 3+ redundant verification" finding.

The effect **scales with task complexity**: 3.3× on trivial slugify, 4.2× on medium CSV parser, 4.6× on harder rate limiter. Harder tasks amplify the waste.

## What's in this folder

```
build-deeper/
├── README.md              ← you are here
├── prompts.md             ← the 6 prompt variants, verbatim from the paper
├── runner.sh              ← per-trial setup + capture script
├── analyze.py             ← aggregates results.csv → summary.csv + ratios.csv + report.md
├── results.csv            ← raw 36-row data
├── tasks/
│   ├── slugify/           ← trivial (single regex)
│   ├── csv_parser/        ← medium (string processing)
│   └── rate_limiter/      ← harder (state + time)
├── runs/{task}/{variant}/t{1,2}/  ← one folder per trial
└── analysis/
    ├── summary.csv        ← mean ± std per (task, variant)
    ├── ratios.csv         ← cost ratios vs baseline + bounded_efficiency
    └── report.md          ← narrative summary
```

## Reproducibility

```bash
cd build-deeper

# Re-run analysis (idempotent - reads results.csv)
python3 analyze.py

# View per-cell summary
cat analysis/report.md
```

To re-run the trials from scratch (in a fresh Claude Code session):
```bash
# Clear trial data
rm -rf runs/ results.csv analysis/

# The runner.sh setup + capture pattern is documented in prompts.md.
# Each variant's protocol is documented in the build-deeper/runs/{variant}/ README.
```

## Honest accounting

**Bias:** the 6 subagents were spawned from the same parent (me). They share my training, my reading of the paper, and my tendency to "demonstrate the effect." A truly independent reproduction would use:
- Multiple model families (paper tested 7)
- Multiple agent harnesses (paper tested 2)
- 5+ trials per cell (we did 2)
- Blind annotation (paper did this; we couldn't, in-session)

**What the data DOES show:**
- The qualitative direction (wasteful prompts cost more) reproduces clearly
- The mechanism (branch tournament + verification loop) is visible in artifacts (`approaches.md`, `reasoning.md`, `probe_tests.py`)
- The complexity-scaling effect is a finding the original blog post missed

**What the data does NOT show:**
- Exact 5-30× ratios (our average is 3-5×)
- Cross-model generalization (we only used one model)
- Statistical significance (N=2 per cell is too small for proper hypothesis testing)

## What changed in the blog post

The original blog led with "9.62× on wall-clock" - a single trial. The new blog keeps that as the hook (it really happened) but adds the deeper analysis as the rigorous follow-up. The conclusion is now:

> On 36 trials across 3 task complexity tiers, the effect is real but more modest than the anecdote: 3-5× average cost inflation from wasteful prompts, scaling worse on harder tasks. The mechanism (branch tournaments + verification loops) is visible in the artifacts. The bounded-efficiency fix remains free.

---

*Run completed 2026-08-12. Total wall-clock across all 36 trials: ~14 minutes (parallelized across 6 subagents).*
