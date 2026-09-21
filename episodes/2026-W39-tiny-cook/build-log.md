# Build Log: The smallest cook in the kitchen carried a recipe box and beat the giants. (2026-W39-tiny-cook)

Paper: <<PAPER SHORT NAME>> (2609.13356). Paper notes in `notes.md`.

## Attempt log

| # | Date | Attempt | Result |
|---|---|---|---|
| | | | |

## Harness

Shared harness: `tools/lab-core.mjs` (engines: local:<ollama-model>, or:<openrouter-model>, mock:<name>). Import it from the experiment script in this folder's build/ directory.

Flow, always in this order:

1. Smoke test: `node tools/lab-core.mjs --smoke --engines=<specs>`
2. Estimate: INR-first, into experiment-spec.md
3. Self-review against the spec (termination, output budgets)
4. Run via createLab() in build/<experiment>.mjs; every call lands in the ledger

## Smoke results

<<Paste the PASS/FAIL table here before any real run. No smoke, no run.>>

## Runs

| Tag | Models | Calls | Wall time | Actual |
|---|---|---|---|---|
| | | | | INR <<n>> ($<<n>>) |

## Costs: estimate vs actual (INR-first)

| Stage | Estimated | Actual | Notes |
|---|---|---|---|
| | | | |

## Field journal appendix

<<node tools/session.mjs --close appends the session archive here at SHIP.>>
