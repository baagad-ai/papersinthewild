# Use Cases — Prompt-Induced Waste

> Stage 3 (IDEATE) output. Three candidates, scored. Pick one. Commit.

Scoring rule: **feasibility (1-5) × story value (1-5)**. Advance if ≥16.

---

## Use Case A: "The $0 vs $30 Commit" *(score: 25)*

- **What:** Pick a real open-source issue. Run Claude Code against it twice — once with a max-certainty prompt, once with the bounded-efficiency prompt. Same patch. Plot the bill side-by-side. Publish the receipt.
- **Why it's interesting:** It's *the* canonical demonstration of the paper. Same task, same model, same correct fix — wildly different cost. Receipts beat claims. This is the episode's spine.
- **Feasibility (1-5):** 5 — we already have Claude Code, the paper hands us the exact prompt wording, and a real GitHub issue is 10 minutes to find.
- **Story value (1-5):** 5 — title writes itself: *"Same bug. Same fix. One cost $30, the other cost $0.43."* Reader can replicate in 5 minutes.
- **Score:** 5 × 5 = **25** ✓
- **GitHub repo to fork/start from:** No fork needed. We reproduce the paper's protocol directly. Code lives at `episodes/2026-W33-prompt-induced-waste/build/` and gets its own repo if it grows.
- **Risks:** Real-issue resolution might fail on both arms (pick issue too hard → no patch → no story). Mitigation: pick a `good first issue` on a small repo we can run locally. Cap at 30 minutes per arm.
- **Content angle:** Show actual Anthropic API invoices (or token counts if invoice is sensitive). Screenshot Claude Code's `/cost` readout both times. Embed both diffs side-by-side. The reader has to see: identical patch.

---

## Use Case B: "The Prompt Tax Linter" *(score: 20)*

- **What:** A tiny open-source CLI tool. You point it at a prompt file (your `CLAUDE.md`, `.cursor/rules`, `.aider.conf`, a system prompt). It flags expensive phrases the paper identifies ("be absolutely certain", "develop several distinct approaches", "think very deeply") and suggests bounded-efficiency rewrites. Outputs a score: *"Your prompt template is burning an estimated 9x more tokens than needed."*
- **Why it's interesting:** Turns a research paper into a downloadable tool. Builders share tools. Marketers call this "product-led content" — the content *is* the artifact. Also fills a real gap: no prompt linter currently flags cost, only correctness/injection.
- **Feasibility (1-5):** 4 — a regex + JSON phrase-list CLI in Go or Node. ~200-300 LOC. Single binary. Ship on day one.
- **Story value (1-5):** 5 — *"I read a paper that said my prompt was wasting 30x tokens. So I built a linter that tells me which words are the expensive ones."* Pure build_to_think hook.
- **Score:** 4 × 5 = **20** ✓
- **GitHub repo to fork/start from:** No direct prior art on the cost angle. Adjacent work for inspiration: [PromptSource](https://github.com/promptslab/PromptSource) (collection), [promptfoo](https://github.com/promptfoo/promptfoo) (eval, not cost-lint). Our wedge: cost-aware linting, using this paper's phrase list as the rule set.
- **Risks:** Phrase list is small (paper only tests ~7 variants) → linter feels thin. Mitigation: be honest about it. Frame as "v0.1, rules from one paper, here's how you extend". Honesty = content.
- **Content angle:** The tool is the episode. Blog post is the launch announcement. Run the linter on famous public prompt templates as the demo.

---

## Use Case C: "Auditing the AI Coding Giants" *(score: 20)*

- **What:** Pull public system prompts / rule files from Claude Code, Cursor, Cline, Aider, Continue, Codex. Score each against the paper's findings — count the expensive phrases, estimate the cost multiplier each company is silently imposing on users. Publish a ranking.
- **Why it's interesting:** Politically pointed. Names names. *"Cursor's default system prompt contains 4 phrases this paper proves are 18x cost multipliers. You're paying for them on every commit."* Outs a real cost being passed to users.
- **Feasibility (1-5):** 4 — Claude Code's system prompt has been publicly quoted many times; Cursor/Cline/Aider rules are in their docs and repos. All public.
- **Story value (1-5):** 5 — David-vs-Goliath framing, names companies, instant LinkedIn bait. Marketers call this "thought leadership with receipts".
- **Score:** 4 × 5 = **20** ✓
- **GitHub repo to fork/start from:** [cursor-tips](https://github.com/getcursor/cursor-tips), [aider](https://github.com/Aider-AI/aider), [cline](https://github.com/cline/cline) — rules files all public in repos or docs.
- **Risks:** Could be seen as sniping at companies (anthropic included — we're literally using Claude Code). Mitigation: include Claude Code in the audit. Make it about the pattern, not the company. Also: estimates are estimates — be transparent about the cost-multiplier math.
- **Content angle:** The ranking is the story. Bar chart of "estimated cost multiplier by coding agent, default config". Tag the companies on Twitter. Expect pushback; that's content too.

---

## Side note (for completeness — not a candidate)

Two ideas I considered and rejected:

- **"Live cost-climb counter"** (score 15) — performance art where we watch max-certainty bill climb past $X in real time. Fun but feels gimmicky for Episode 1; we'd be the story, not the paper. Save for later.
- **"Reverse-prompt-engineering the workplace"** (score 20 but off-brief) — satirical LinkedIn post applying the paper to bad management. Clever, but it's a writing exercise, not a build. Stage 4 needs an artifact.

---

## My recommendation

**Pick A.** It's the canonical demonstration. Score 25 (highest). Lowest feasibility risk. Most dramatic receipts. Builds the muscle we'll need for every future episode: pick paper → reproduce finding → publish receipt.

B and C are both strong follow-ups — we can ship B as a "part 2" later in the curriculum, and C is a perfect thought-leadership piece once we have 3-4 episodes of credibility.

For Episode 1: A.

---

## Your call

Reply with **A**, **B**, or **C**. (Or "A but also do C as the LinkedIn angle" — combinations welcome.)

Once you commit, I move to Stage 4 (BUILD) — write `build-log.md`, scope the exact issue + prompts + measurement protocol, then we run it.
