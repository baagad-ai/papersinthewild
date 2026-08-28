# Build Log: The gym that studies you. (Episode 5, 2026-W35-adaptive-gym)

Paper: <<PAPER SHORT NAME>> (https://arxiv.org/abs/2608.19880). Paper notes in `notes.md`.

## Attempt log

| # | Date | Attempt | Result |
|---|---|---|---|
| | | | |

## Harness

Shared harness: `tools/lab-core.mjs` (engines: local:<ollama-model>, or:<openrouter-model>, mock:<name>). Import it from the experiment script in this folder's build/ directory.

Flow, always in this order:

1. Estimate first: `node tools/lab-core.mjs --estimate --engines=<specs> --calls=<planned>`
2. Smoke test: `node tools/lab-core.mjs --smoke --engines=<specs>`
3. Run via createLab() in build/<experiment>.mjs; every call lands in the ledger.

## Smoke results

<<Paste the PASS/FAIL table here before any real run. No smoke, no run.>>

## Runs

| Tag | Models | Calls | Wall time | Actual USD |
|---|---|---|---|---|
| | | | | |

## Costs: estimate vs actual

| Stage | Estimated | Actual | Notes |
|---|---|---|---|
| | | | |

## S4 findings digest - tag g2 (2026-08-28)

Grid (novel% | sting%), n=16/10, temp 0, think:false locals / Flit reasoning-768:

| student | none | fixed-drill | adaptive-tutor |
|---|---|---|---|
| Juniper (qwen3:8b) | 69 / 40 | 50 / **100** | 50 / 60 |
| Bram (gemma3:12b) | 50 / 40 | 69 / **100** | 50 / 40 |
| Pip (phi4-mini) | 44 / 40 | 50 / **100** | 50 / 40 |
| Flit (gemini-3.7-flash) | 31 / 60 | 50 / **100** | 38 / 30 |

Findings:
- F1 FIXED-DRILL PARADOX: 4/4 aced the homework at 100% (verbatim notebook recall); novel transfer split: Bram +19, Flit +19, Pip +6, Juniper -19 pts. The cheat sheet doubles as a weak textbook, and one student got worse BECAUSE of it.
- F2 THE TUTOR NO-SHOW: adaptive arm (targeted fresh items + last-8 example notebook) matched no-practice everywhere on novel; P1 graded WRONG. Item-level targeting without rule-level notes transfers nothing at toy scale. The paper's mechanism lives in its component-WRITING loop, not in re-targeted item streams.
- F3 MEMORIZATION CONTROL THE PAPER NEVER RAN: sting-minus-novel gap: fixed +31..+50 pts (huge), adaptive -10..+10 (nil). Fixed drilling is measurable memorization, receipted.
- F4 COLD FRONTIER, WORST STUDENT: Flit cold 31% (below coin flip) on a toy Pip (3.8B) passed at 44%. Size bought nothing here; the consultant needed the answer key to reach 100%.
- F5 ZERO-CHANNEL CONTROL (g1, 432 events preserved): with no notebook, all three arms produced byte-identical exam rows per student. Practice without a transfer channel is theater - the methodology finding g1 died to give us.

Prediction grades: P1 WRONG (most useful line again). P2 SURPRISED/mixed (only Juniper declined; notebooks accidentally helped 3/4 slightly). P3 CONFIRMED x4, huge.

Caveats: n=1 grid, single seed, one toy domain, notebooks differ in size (10 vs 8) by design, Flit temp0 via OR with mandatory reasoning.
Costs: g1 locals-only partial ₹0; g2 actuals in results-gym-g2.json (est was ₹5.88; per-call ledger final).
