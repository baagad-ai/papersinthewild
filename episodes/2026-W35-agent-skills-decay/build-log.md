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
{
  "session": "gen-2026-08-28",
  "startedAt": "2026-08-28T19:38:06.475Z",
  "started": "2026-08-28T19:38:06.475Z",
  "stage": "ship",
  "params": {
    "count": 1,
    "ceilingINR": 100
  },
  "episodes": [],
  "decisions": [
    {
      "gate": "pick",
      "choice": "paper 2608.14036 (Demystifying Agent Skills) carried over; twins-lab receipts reusable",
      "at": "2026-08-28T19:38:06.591Z"
    },
    {
      "gate": "design",
      "choice": "angle=drawer-of-lies; spec=reuse on-disk twins-lab receipts, Rs0 new spend, no frontier calls; digest-vs-tally mismatch resolved in favor of on-disk artifacts",
      "at": "2026-08-28T19:41:01.466Z"
    },
    {
      "gate": "run",
      "choice": "full clean rerun approved <=INR3 (label stripped); old grid preserved as *-labeledtrap.*",
      "at": "2026-08-28T19:46:50.979Z"
    },
    {
      "gate": "run",
      "choice": "clean grid complete, 72 calls, actual Rs1.19 vs est Rs3.45; key receipts: gemma counterfeit pick, phi4 twin-drawer collapse, qwen twin-drawer perfection, grader leniency",
      "at": "2026-08-28T20:10:41.622Z"
    },
    {
      "gate": "story",
      "choice": "story+title approved (drawer of lies)",
      "at": "2026-08-28T20:18:52.772Z"
    },
    {
      "gate": "ship",
      "choice": "SHIP approved by owner",
      "at": "2026-08-29T06:49:11.920Z"
    }
  ],
  "artifacts": [
    "projects/ai-papers-explained/site/content/episodes/2026-w35-agent-skills-decay.mdx",
    "projects/ai-papers-explained/episodes/2026-W35-agent-skills-decay/story.md"
  ],
  "gates": {
    "design": {
      "name": "design + spec",
      "checkpoint": "C2 DESIGN",
      "at": "2026-08-28T19:38:06.566Z",
      "artifacts": []
    },
    "run": {
      "name": "run experiment",
      "checkpoint": null,
      "at": "2026-08-28T19:41:01.494Z",
      "artifacts": []
    },
    "story": {
      "name": "story review",
      "checkpoint": "C3 STORY",
      "at": "2026-08-28T20:10:41.651Z",
      "artifacts": []
    },
    "write": {
      "name": "write + build",
      "checkpoint": null,
      "at": "2026-08-28T20:18:52.808Z",
      "artifacts": []
    },
    "ship": {
      "name": "ship",
      "checkpoint": "C4 SHIP",
      "at": "2026-08-29T06:49:11.948Z",
      "artifacts": []
    }
  },
  "escalations": [],
  "now": "WRITE+BUILD done: MDX, kits READY, OG, posting card, check green; awaiting decks",
  "next": "",
  "archivedAt": "2026-08-29T06:50:23.206Z"
}
