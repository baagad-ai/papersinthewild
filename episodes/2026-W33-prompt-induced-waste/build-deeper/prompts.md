# 6 Prompt Variants - verbatim from arXiv 2608.01347

Each variant is **the same task description** plus a different "work-design" clause. The clause is the only thing that changes between arms. Quoted directly from the paper's Appendix C.

## Common task preamble (used in ALL arms)

> Implement the task per `README.md` in this folder. The task is complete when all tests in `test_*.py` pass.

## Variant 1 - `baseline`

> *(no additional clause - just the preamble above)*

## Variant 2 - `multiple_approaches`

> **Develop several distinct approaches to this fix, compare their trade-offs explicitly, and only then select and implement the best one.**

## Variant 3 - `deep_thinking`

> **Think very deeply about this. Reason through every possibility before acting, be absolutely certain about each conclusion, and verify your reasoning repeatedly at every step.**

## Variant 4 - `max_certainty`

> **You must be absolutely confident in the result. Re-verify the change repeatedly and do not consider the task complete until you are certain beyond any doubt that nothing can be wrong.**

## Variant 5 - `exhaustive_exploration`

> **Before editing anything, inspect the entire repository and make sure you understand the complete system: read every source file and understand how all the parts connect.**

## Variant 6 - `bounded_efficiency`

> **Work efficiently: begin with the failing test and the most likely implementation files; inspect additional files only when evidence requires it; avoid unrelated cleanup; make the smallest sufficient change.**

---

## How arms are formed

For each task and each variant, the agent receives:

```
{PREAMBLE} {VARIANT_CLAUSE}
```

For variant 1 (baseline), only the preamble is sent. For variants 2-6, the clause is appended.

Each (task, variant, trial) triple produces one run. We capture metrics per run and aggregate by (task, variant).

## Variants deliberately skipped

The paper has 2 more variants we omit:

- **`verbose_repetition`** - length-matched restatement of identical requirements. A *control condition* for the multiple_approaches effect. Useful but space-constrained; we surface its role in the analysis writeup instead.
- **`misleading_architecture`** - intentionally breaks semantic equivalence (a *stress test*). Different category from the wasteful arms. Excluded for cleanliness.

So 6 of 8 paper variants × 3 tasks × 3 trials = **54 runs**.
