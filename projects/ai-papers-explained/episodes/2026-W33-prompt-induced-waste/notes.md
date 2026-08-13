# Notes — Prompt-Induced Waste in Coding Agents

> Stage 2 (READ) output. Structured understanding of arXiv 2608.01347.
> Source: https://arxiv.org/abs/2608.01347 (HTML: /html/2608.01347)

---

## ELI5 (explain like I'm 5)

Imagine you ask two friends to fix the same broken toy.

To Friend 1 you say: *"Fix the wheel. Stop when it rolls."*
To Friend 2 you say: *"Fix the wheel. Think really hard about every possible way to fix it. Try three different fixes. Then check your work five times to be absolutely sure."*

Both friends fix the wheel. Same toy. Same rolling.

But Friend 2 took 30 times longer, used 30 times more glue, opened the toolbox 18 times, and asked you "are you sure?" so many times you stopped answering.

The toy is identical. The work was not.

That's what this paper found with AI coding agents. The words you use to ask for a fix change how much *work* the AI does — even when the final fix is exactly the same.

---

## Practitioner (what a marketer / builder needs to know)

### The headline finding

If you pay for Claude Code, Cursor, or any coding agent by the token, **your prompt wording is silently setting your bill on fire** — without buying you any extra correctness.

Across 4,644 runs, 24 tasks, 7 reasoning models, and 2 agent harnesses:

- Wording that asks for **"multiple approaches"** → agent builds ~3 solution branches, throws away the losers, you pay for all of them. Up to **16.6x more reasoning tokens** (Kimi-K3).
- Wording that asks for **"maximum certainty"** → agent re-verifies in a loop. **Level 3+ redundant verification costs 18.25x the clean run** (same success rate).
- A short **"bounded efficiency"** instruction → **0.89-1.02x baseline cost, no success loss**. The fix is free.

### Two mechanisms of waste (memorise these)

| Mechanism | Trigger phrase | Cost carrier | Median cost |
|-----------|---------------|--------------|-------------|
| **Branch tournament** | "develop several distinct approaches" | Reasoning tokens | up to 16.6x |
| **Verification loop** | "be absolutely certain / re-verify" | Tool calls + turns | up to 18.25x |

### The harness tax

The paper compares two agent harnesses on the **same model, same task, same prompt**:

- **PI.DEV 0.82.1** — minimal static prefix (~1,147-1,642 tokens)
- **Claude Code 2.1.220** — heavy static prefix (~15,983-20,330 tokens) — **12-15x larger**

Result: Claude Code costs **5-30x more per success** on matched work. For Nemotron-3-Ultra specifically: ~18x. Native Claude Code baseline (no-cache): ~15x PI.DEV.

Even when both solve 100% of pilot tasks correctly, you pay 5-30x more for the same outcome depending on which tool wraps the model.

### The cache rebate

Provider-side prefix caching rebates **~61% of the would-be bill** but leaves behavior unchanged. So the *sticker shock* you see in your invoice is already after a 61% discount. The waste is happening behind that discount.

### The practical fix (today, free)

Append this to your next coding-agent prompt:

> *"Work efficiently: begin with the failing test and the most likely implementation files; inspect additional files only when evidence requires it; avoid unrelated cleanup; make the smallest sufficient change."*

The paper measured this. It costs ~0.89-1.02x baseline. Success rate does not drop.

You can also **delete** these phrases from any prompt template you currently use:
- "think very deeply"
- "be absolutely certain"
- "re-verify"
- "develop several distinct approaches"
- "explore every possibility"

Each one is a cost multiplier with no success upside.

---

## Researcher (the actual contribution)

### What's genuinely new here

This isn't another "prompt engineering improves accuracy" paper. The contribution is a **causal separation of cost from success** on coding agents — a dimension most benchmarks ignore.

The authors built a **semantically controlled prompt corpus**: variants that ask for the *same deliverable* but phrase the work-design differently. Across 4,644 runs they annotate 2,801 of them with evidence-quoted mechanism labels (branch tournament, verification loop, etc.) and show the cost variance is mechanistic, not random.

### Setup

- **Tasks:** 24 deterministic coding tasks (8 low / 8 medium / 8 high complexity). 9 Python, 9 JavaScript, 6 Go. Max 4 files per task (deliberate, for causal control). 16 development + 8 frozen holdout.
- **Models (7):** DeepSeek-V4-Pro, Kimi-K2.6, Kimi-K2.7-Code, Nemotron-3-Ultra-550B-A55B, Inkling, GLM-5.2 + post-registration Kimi-K3 and claude-sonnet-5.
- **Harnesses:** PI.DEV 0.82.1 (OpenAI chat completions) and Claude Code 2.1.220 (Anthropic Messages + LiteLLM 1.93.0 gateway).
- **Annotation:** 2,801 condition-blind, evidence-quoted semantic annotations. Mechanism levels are *observed mediators*, not randomized treatments — important caveat.

### Key causal claim

> Two prompts can produce the same correct patch while asking the agent to perform radically different amounts and kinds of work.

Cost variance decomposes into two distinct mechanisms with different cost carriers:
- **Branch tournaments** → token-borne (reasoning inflation)
- **Verification loops** → tool-borne (extra test runs, turns, context growth)

This is actionable because it tells you *where* to attack the cost: tokens vs tool callses.

### Headline numbers worth memorising

| Quantity | Value |
|----------|-------|
| Valid runs | 4,644 |
| Annotated runs | 2,801 |
| Tasks | 24 (16 dev + 8 holdout) |
| Models | 7 (originally 6, +Kimi-K3, +claude-sonnet-5) |
| Harnesses | 2 |
| Branch tournament cost (Kimi-K3) | 16.6x reasoning tokens |
| Level 3+ redundant verification | 18.25x median |
| Claude Code vs PI.DEV per-success cost | 5-30x (Nemotron ≈18x) |
| Static prefix gap | 12-15x |
| Cache rebate | ~61% |
| Bounded-efficiency cost | 0.89-1.02x |

---

## Core trick in plain English

**Prompt engineering for coding agents is work design, not persuasion.**

You're not convincing the model. You're *specifying the deliverable, constraining unnecessary paths, and defining when the agent is done*. Old prompt-engineering advice ("think step by step", "reason carefully", "explore multiple approaches") was built for *reasoning* models. For *agents* — models with tools and turns — those phrases are cost multipliers, because they unlock hidden expensive behaviors (branch elaboration, re-verification loops) that don't change the answer.

---

## Limitations the authors acknowledge

1. **Provider-exposed reasoning text isn't complete or necessarily faithful.** Claims are about observable traces, not hidden cognition.
2. **Tasks are small** (max 4 files, high success ceilings). Multiple-approaches *might* help on repo-scale or architectural work — not tested here.
3. **Mechanism levels are observed mediators, not randomized treatments.** The 18x verification comparison is descriptive, not causal.
4. **Per-turn cost attribution isn't available** — tool-induced model cost bounded at 4-12%, not exact.
5. **Claude Code arms are smaller**, provider prices and cache behavior are time-specific, and remaining new-task/long-validation arms were still in progress at writing.

---

## My 3 questions back to Claude (Mode 2 protocol — must answer before Stage 3)

1. **Does bounded_efficiency break down on hard tasks?** The holdout shows 0.89-1.02x *cost*, but does success hold at the high-complexity tier specifically (the 8 hardest tasks), or does it quietly drop there?
2. **Is the harness tax really about the prefix, or about tool-invocation discipline?** PI.DEV has 22% test-execution calls vs Claude Code's 52%. Is the 12-15x prefix the cause, or just correlated with a different default loop budget?
3. **What about when the agent is wrong?** "Bounded efficiency" assumes the first attempt works. If the model is *incorrect* on the first pass, does the absence of re-verification hurt success where it matters most?

---

## Build ideas (preview — Stage 3 will pick one)

- **Reproduce on Claude Code in this repo.** Run the same 4-word swap on 5 real commits. Plot cost.
- **Prompt-cost linter.** A script that flags expensive phrases ("be certain", "multiple approaches") in your prompt templates.
- **"Day in the life of a wasted token."** Stylised visual essay using their Table 4 numbers.
- **A/B test on a real client task** if we land one before this episode ships.

Full ideation in `use-cases.md` (Stage 3, next).

---

## Source

- arXiv abstract: https://arxiv.org/abs/2608.01347
- HTML full text: https://arxiv.org/html/2608.01347
- Version used: v3 (Aug 6, 2026)
