# Build Log: My agent forgot how to skill. (Episode 3, 2026-W35-agent-skills-decay)

Paper: <<PAPER SHORT NAME>> (https://arxiv.org/abs/2608.14036). Paper notes in `notes.md`.

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
Grid: 3 conditions x 6 tasks x 4 models = 72 calls. Ledger: Rs.1.20 ($0.0125) all frontier arm. Warnings: 4x qwen empty-response (retried ok).
Tally (pickAcc/passRate): clean6 qwen 1.00/.67 gemma 1.00/.83 phi4 .83/.83 flash .83/.83 | clean8 qwen 1.00/.83 gemma 1.00/1.00 phi4 .83/.83 flash 1.00/1.00 | twins8 qwen .67/.67 gemma .83/.83 phi4 .83/.67 flash .83/.83.
Graded predictions: P3 directionally held (twins hurt). P2 WRONG: wrong pick ~= wrong outcome here; paper's stable-downstream did not replicate at our scale/n. Surprise pick: R2. Headline (G4): "One lookalike skill made every model dumber. Even the smart one."
