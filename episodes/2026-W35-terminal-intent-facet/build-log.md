# Build Log: I said X. My terminal heard Y. (Episode 4, 2026-W35-terminal-intent-facet)

Paper: <<PAPER SHORT NAME>> (https://arxiv.org/abs/2608.18580). Paper notes in `notes.md`.

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

## Findings digest (S4, 2026-08-25)
Grid after E1+E2 fixes: 2 arms x 4 tasks x 4 models = 32 calls, 0 warnings, frontier slice Rs.0.34.
Tally (pass/loud/SILENT): qwen intact 4,0,0 desynced 4,0,0 | gemma 3,1,0 / 3,1,0 | phi4 3,1,0 / 2,1,1 | flash 4,0,0 / 4,0,0.
Graded predictions: P1 PARTIAL - one silent misgrade total, weakest model (phi4) under corrupted key; frontier immune at scale. Headline (G4): "I broke the answer key. Only the smallest AI noticed."
