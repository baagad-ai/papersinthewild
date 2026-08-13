# Paper — Prompt-Induced Waste in Coding Agents

**Title:** Same Task, Different Work: Prompt-Induced Waste in Coding Agents
**Authors:** Sarel Weinberger, Amir Hozez
**arXiv:** 2608.01347 (cs.CL) — submitted Aug 2, 2026; v3 Aug 6, 2026
**DOI:** 10.48550/arXiv.2608.01347
**PDF:** https://arxiv.org/pdf/2608.01347
**HTML:** https://arxiv.org/html/2608.01347
**Code/Data:** Not publicly linked in the abstract. Authors mention CatalyX Code Finder + DagsHub on the arXiv toolbar but no canonical GitHub repo is listed. (TODO for build stage: search author names on GitHub.)

## Why this paper for Episode 1

- **Reproducible in our own repo** — we can run the exact same prompt variations on Claude Code in minutes.
- **Numbers are wild** — 5-30x cost variance from wording alone, 18x from redundant verification, 0% success gain.
- **build_to_think hook writes itself** — *"I changed four words in my prompt. My agent's bill dropped 30x."*
- **Marketers + builders both feel the pain** — anyone paying for AI coding tools recognises this instantly.

## One-line summary

Two prompts can request the same code change, produce the same correct patch, and cause a coding agent to do 5-30x more (or less) work for the same result.
