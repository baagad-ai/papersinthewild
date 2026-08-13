# Pipeline — Papers in the Wild Production Workflow

> 7 stages. One episode per week. No skipping stages.

## Stage 1 — FETCH *(Monday, 30 min)*

**Goal:** Pick this week's paper.

1. Open [dair-ai/AI-Papers-of-the-Week/years/2026.md](https://github.com/dair-ai/AI-Papers-of-the-Week/blob/main/years/2026.md)
2. Scroll to latest week
3. Pick **1 paper** using these filters:
   - Has a free arXiv link
   - Has a GitHub code link (preferred) or Hugging Face demo
   - Topic is accessible enough to explain (skip pure theory unless compelling)
   - **Bonus** if it touches something memeable / culturally relevant
4. Save link to `episodes/YYYY-WW-{slug}/paper.md`

**Claude prompt:** *"Latest paper from dair-ai — pick one with bizarre-use-case potential and explain why"*

---

## Stage 2 — READ *(Monday-Tuesday, 2-3 hrs)*

**Goal:** Understand the paper deeply enough to teach it.

**Claude prompt:** *"Read this paper and explain it: [arxiv URL]"* → triggers **Mode 2 (EXPLAIN-PAPER)**

What Claude produces in `notes.md`:
- **ELI5 section** — explain like the user is 5
- **Practitioner section** — what a marketer / builder needs to know
- **Researcher section** — paper's actual contribution + methodology
- **Core trick in plain English** — what's the genuinely new idea?
- **Limitations** — what the paper does NOT claim

**User's job:** Read `notes.md`. Ask 3 questions back to Claude. If you can't explain it to a friend after this, you don't understand it yet — go deeper.

---

## Stage 3 — IDEATE *(Tuesday, 1 hr)*

**Goal:** Generate 3 bizarre-but-real use cases.

**Claude prompt:** *"what can we do with this?"* → triggers **Mode 3 (IDEATE-USE-CASES)**

What Claude produces in `use-cases.md`:

```markdown
## Use Case 1: [name]
- **What:** [bizarre real application in 1 sentence]
- **Why it's interesting:** [humor / social commentary / utility / surprise]
- **Feasibility (1-5):** X
- **Story value (1-5):** X
- **Score:** X×X = X (advance if ≥16)
- **GitHub repo to fork/start from:** [link if exists]
- **Risks:** [content moderation / ethics / time sink]

## Use Case 2: ...
## Use Case 3: ...
```

**User's job:** Pick ONE. Commit. Move on.

---

## Stage 4 — BUILD *(Tuesday-Wednesday, 3-5 hrs)*

**Goal:** Try the use case. Capture screenshots.

1. Find / fork / build the GitHub repo
2. Set it up locally
3. Run it on real inputs (or plausible fake inputs)
4. Capture **5-10 screenshots + 1-2 short screen recordings**
5. Document failures honestly — they're content

Save to `build-log.md` + `assets/`.

**Claude prompt:** *"let's try it"* → triggers **Mode 4 (BUILD-EPISODE)**

**Quality bar:** Reader should be able to replicate your work from your screenshots + repo link. No "trust me bro".

---

## Stage 5 — WRITE *(Thursday, 3-4 hrs)*

**Goal:** Produce blog + LinkedIn + Instagram carousel — all on-brand.

**Pre-flight:** Read [`BRAND.md`](./BRAND.md) §3 (voice) + §6 (episode anatomy) + §9 (do/don't). Read [`DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md) §4 (components). Run `design-taste-frontend` skill for any UI work.

**Claude prompts:**
- *"write the blog post"* → `episodes/{slug}/blog-post.md` (mirror) AND `site/content/episodes/{slug}.mdx` (canonical)
- *"write the LinkedIn post"* → `episodes/{slug}/linkedin.md` (uses `content-engine` → `platform-writer`)
- *"design the IG carousel"* → `episodes/{slug}/instagram.md` (script ready for `slide-wand --square`)

### Blog post anatomy (1500-2500 words, MDX)

Use the components from `site/components/`. Episode template:

```mdx
<DropCap>I got curious about [claim]. So I [action]. Here's what happened.</DropCap>

## What the paper actually claims
[3 paragraphs, plain English, <Cite href="...">link to paper</Cite>]

## The bizarre idea
[What you tried and why. Use <PullQuote> for the paper's key line.]

## What we built
[Walkthrough with screenshots. Use <CodeBlock filename="...">. Link to repo.]

## What happened
[Results. <ReceiptTable headers={...} rows={...} caption="..." /> mandatory.]

## So what?
[Why this matters. Numbered list with <Num> for inline numbers.]

## Honest accounting  ← REQUIRED
[Caveats, biases, limitations.]

## Try it yourself  ← REQUIRED
- Replication steps
- GitHub repo link
- Paper link
```

### LinkedIn post (130-300 words for max reach)
- Hook (1 line): curiosity, not hype, specific number
- Insight (3-5 lines): what you discovered
- CTA (1 line): "Link in first comment ↓"
- 3-5 calm hashtags lowercase (#promptengineering #ai #codingagents #papersinthewild)
- **NEVER** paste link in body — algorithm penalty. Link goes in first comment.
- Voice check: run `voice-humanizer` before posting

### Instagram carousel (10 slides, square 1080×1080)
- Slide 1: scroll-stopping cover (NO flags, weapons, bare skin, AI-sparkle iconography — per feedback memory)
- Slide 2-5: setup + paper + claim
- Slide 6: **THE RECEIPT** (mandatory `<ReceiptTable>` adaptation)
- Slide 7-8: the fix / the takeaway
- Slide 9: try it yourself
- Slide 10: CTA + PITW seal + "next episode Friday"
- Render with `slide-wand --square` (Stage 6)

---

## Stage 6 — SHIP *(Friday, 1-2 hrs)*

**Goal:** Push to all channels.

1. **Blog:** copy `blog-post.md` into `site/_posts/YYYY-MM-DD-{slug}.md` (Jekyll format) OR render to static HTML if simpler
2. **GitHub Pages:** push to GitHub, site auto-updates
3. **LinkedIn:** post natively. Engage with first 10 comments within 1 hour.
4. **Instagram:** post carousel. Engage with first 10 comments.
5. **Cross-promote:** share LinkedIn post to Twitter/X (optional)

**Update:** `episodes/YYYY-WW-{slug}/published.md` with all links + timestamps.

---

## Stage 7 — MEASURE *(Friday + 7 days later, 30 min)*

**Goal:** Learn what landed.

Track in `analytics.md`:

| Metric | T+24h | T+7d | T+30d |
|--------|-------|------|-------|
| LinkedIn impressions | | | |
| LinkedIn comments | | | |
| LinkedIn DMs | | | |
| IG reach | | | |
| IG saves | | | |
| Blog pageviews (GA4) | | | |
| Blog unique visitors | | | |
| GitHub repo stars | | | |
| Inbound client DMs | | | |

**At T+7 days**, write 3-bullet retrospective:
- What worked
- What didn't
- What to try next time

---

## Weekly cadence summary

| Day | Stage | Time |
|-----|-------|------|
| Monday | 1 (FETCH) + 2 (READ start) | 3-4 hrs |
| Tuesday | 2 (READ end) + 3 (IDEATE) + 4 (BUILD start) | 4-5 hrs |
| Wednesday | 4 (BUILD end) | 3-5 hrs |
| Thursday | 5 (WRITE) | 3-4 hrs |
| Friday | 6 (SHIP) + 7 (MEASURE start) | 2-3 hrs |
| Saturday | Catch-up / certifications | flexible |
| Sunday | Rest / read newsletters | 1 hr |

**Total weekly commitment:** ~16-22 hrs of project work + ~20 hrs of curriculum = **~40 hrs/week**. Matches your stated budget.

---

## Emergency shortcuts (when life happens)

- **Behind on paper reading?** → Pick a paper Claude has seen before. Lower understanding bar.
- **Build failed?** → Ship the failure. *"I tried X. It didn't work. Here's why."* is excellent content.
- **No time for full blog?** → LinkedIn-only episode. Note in journal.
- **Zero engagement on last 3 episodes?** → Pause. Audit voice + cover design. Talk to Claude before shipping next.

## Anti-patterns (do NOT do these)

- ❌ Summarize the paper without trying anything (boring, no differentiation)
- ❌ Pick safe/boring use cases (defeats the entire premise)
- ❌ Skip the build stage (it's where the content magic is)
- ❌ Ghost LinkedIn comments in first hour (kills algorithm reach)
- ❌ Use hype voice ("THIS CHANGES EVERYTHING") — destroys trust
- ❌ Skip the weekly journal entry (you lose the learning)

---

*This pipeline is the spine. Every other curriculum track exists to level up one of these 7 stages.*
