# Papers in the Wild — Brand Identity

> Canonical brand document. Every artifact (blog, LinkedIn, IG, OG image, components) derives from this. If it's not in this file, it's not in the brand.

---

## 1. Identity at a Glance

| Field | Value |
|-------|-------|
| **Name** | Papers in the Wild |
| **Short mark** | PITW (mono, in IBM Plex Mono — used as the seal/signature, not as the primary wordmark) |
| **Type** | Weekly editorial publication + experimental notebook |
| **Tagline** | *I read a paper. I tried it. Here are the receipts.* |
| **Long pitch** | Weekly experiments on real AI research papers. Curious explorer, not guru. Every claim gets a receipt. |
| **Cadence** | 1 episode/week, shipped Friday |
| **Home** | `papersinthewild.io` *(target)* — currently `baagad-ai.github.io/papers-in-the-wild` |
| **Source** | Curated from [dair-ai/AI-Papers-of-the-Week](https://github.com/dair-ai/AI-Papers-of-the-Week) |

---

## 2. Audience

**Primary:** Founders, indie builders, PMs, designers, technical-yet-curious non-researchers who want to understand AI papers without reading them.

**Secondary:** AI engineers, applied researchers, marketing/comms folks at AI companies who need to translate research into product narratives.

**Anti-audience (do not write for):** Hype-chasers, "10 secrets to…" readers, anyone who wants shortcuts over understanding.

**Audience signal to honor:** They are smart, busy, allergic to bullshit. They will close the tab the second they smell hype. They reward specificity, citations, and honest failure.

---

## 3. Voice — build_to_think (non-negotiable)

### Hook formula
> *"I got curious about [paper claim]. So I tried [bizarre real application]. Here's what happened."*

### Voice pillars
1. **Curious, not authoritative.** Explorer reporting from the field. Never the guru on the stage.
2. **Specific, not vague.** Real numbers. Real timestamps. Real diffs. "9.62×" beats "way more" every time.
3. **Honest, not polished.** Failures are content. Wrong guesses are content. "I expected X. I got Y" is the most honest sentence in the language.
4. **Cited, not asserted.** Every claim links to its source. Receipts > rhetoric.
5. **Terser, not longer.** If a sentence doesn't carry weight, cut it. No preamble. No "in today's rapidly evolving landscape."

### Anti-voice (instant kill words)
- "Game-changer", "revolutionary", "mind-blowing", "10x", "this changes everything"
- "In today's rapidly evolving…"
- "I'm excited to announce…"
- "Leveraging synergies…"
- Emoji spam (max 1 emoji per post, only if it earns its spot)
- Hashtag stuffing (3-5 calm hashtags max)

### Voice check (paste any draft, ask)
1. Does it sound like a curious explorer or a marketing intern?
2. Does every number have a source?
3. Could a hostile reader call bullshit on any claim — and would I survive that?
4. Is there one specific, surprising detail in the first 3 lines?
5. Could this be rewritten in 60% of the words?

If any answer is bad, rewrite.

---

## 4. Visual Language — Field Notebook

### Design read
> Editorial blog for technical-yet-curious readers, with a field-notebook language. Cream paper background, deep ink foreground, oxblood accent. Serif display type paired with mono accents. Ink-press dividers. Archival feel — like a researcher's leather-bound notebook scanned at high resolution.

### Taste dials (from `design-taste-frontend` skill)
- **DESIGN_VARIANCE: 6** — Composed, intentional, never chaotic. Grid holds.
- **MOTION_INTENSITY: 4** — Subtle: fade-in on scroll, ink-underline on hover. No parallax, no GSAP.
- **VISUAL_DENSITY: 3** — Generous whitespace. Let the type breathe.

### Color palette

| Token | Hex | Use |
|-------|-----|-----|
| `paper` | `#F5EFE0` | Page background (warm cream, slightly aged) |
| `paper-deep` | `#EDE5D2` | Card/panel background, slight contrast on cream |
| `ink` | `#1A1612` | Primary text, deep warm black (not pure black) |
| `ink-soft` | `#3C342B` | Secondary text, less contrast for body running text |
| `ink-mute` | `#6B5F4F` | Tertiary text, captions, metadata |
| `rule` | `#C9BFA7` | Dividers, ink-press rules, table borders |
| `oxblood` | `#7C2D2D` | Single accent color — links, marks, seals, key numbers |
| `oxblood-deep` | `#5A1F1F` | Hover state for accent |
| `moss` | `#3A4A2E` | Used ONLY for "success/positive result" markers in receipt tables |
| `highlight` | `#E8C46C` | Used SPARINGLY for marker-highlight behind key phrases (think: yellow pencil highlight) |

**Rule:** oxblood is the only accent that appears in body UI. Moss + highlight are reserved for explicit semantic purposes (positive result / called out). Never use both moss and oxblood in the same paragraph.

### Typography

| Role | Family | Weight / style | Notes |
|------|--------|----------------|-------|
| Display (titles, H1, hero) | **Fraunces** | 500–600, optical size 72, slight negative tracking | Free Google Font, variable |
| Body long-form | **Source Serif 4** | 400 / 500 | Free Google Font; softer than Fraunces for sustained reading |
| UI / labels | **Source Serif 4** | 600 small caps OR IBM Plex Mono 500 uppercase | Used for nav, badges, breadcrumbs |
| Code / numbers / timestamps | **IBM Plex Mono** | 400 / 500 | All numbers in body text (e.g. "9.62×") should be Plex Mono inline |
| Italic (rare, for emphasis) | **Fraunces** italic | 500 | Use sparingly — once per article max |

**Type scale (Tailwind tokens, rem-based):**
- `--text-display`: 3.5rem (56px) / 1.05 line-height
- `--text-h1`: 2.5rem (40px) / 1.1
- `--text-h2`: 1.875rem (30px) / 1.2
- `--text-h3`: 1.375rem (22px) / 1.3
- `--text-body`: 1.125rem (18px) / 1.65
- `--text-meta`: 0.875rem (14px) / 1.4
- `--text-mono`: 0.9375rem (15px) / 1.5 (for inline numbers, timestamps)

### Spacing

8px base grid. Generous:
- Article max-width: **680px** (long-form reading width)
- Article padding (desktop): 64px top, 96px bottom
- Section vertical rhythm: 48px between H2 sections
- Paragraph spacing: 24px
- Line-height: 1.65 for body, 1.2 for headings

### Texture & detail
- **Subtle paper grain** — very faint SVG noise overlay (3% opacity, fixed position). Optional; can be omitted for performance.
- **Ink-press rules** — horizontal dividers are 1px solid `rule` color, with a tiny 6×6px oxblood square at the start (the "seal").
- **Drop caps** — first paragraph of each episode has a Fraunces 600 drop cap, oxblood color, 4 lines tall.
- **Pull quotes** — Fraunces 600 italic, 1.5× body size, oxblood left border (3px).

---

## 5. Logo & Wordmark

### Primary wordmark
```
Papers in the Wild
```
Set in **Fraunces 500**, all lowercase NOT allowed — title case only. Optical size 72. Negative tracking (-0.01em).

### Compact wordmark (for nav, footer, small spaces)
```
papers in the wild
```
Set in **IBM Plex Mono 500**, lowercase. Used at sizes ≤ 20px.

### Seal mark (favicon, social, ink-stamp)
A 64×64px SVG of a **circular ink seal** with:
- Outer ring: 2px solid oxblood
- Inner text: "PITW" in IBM Plex Mono 500 uppercase, oxblood
- Tiny crosshair + at center top (the registration mark of a printed form)

Used as: favicon, OG image corner, IG highlight cover, LinkedIn banner accent. Never scaled below 24×24px.

### Color usage rule
- Wordmark: ink on paper (default)
- Seal: oxblood on paper (always — never inverted)
- On dark backgrounds (rare): paper on ink, seal stays oxblood

---

## 6. Episode Anatomy (canonical blog structure)

Every episode published from this brand MUST follow:

```
┌──────────────────────────────────────────────┐
│ EPISODE NUM  ·  PAPER TITLE  ·  DATE          │  ← Plex Mono meta strip
├──────────────────────────────────────────────┤
│                                              │
│  [Hook title — curious, not hype]            │  ← Fraunces 500 display
│                                              │
│  By Baagad  ·  X min read  ·  [tags]         │  ← Plex Mono meta
│  ───── ▪                                     │  ← ink-press rule
│                                              │
│  [Drop-cap opening — "I got curious..."]     │  ← Source Serif body
│                                              │
│  ## What the paper actually claims           │  ← Fraunces H2
│  [body + pull quote + receipt tables]        │
│                                              │
│  ## The bizarre idea                         │
│  [body]                                      │
│                                              │
│  ## What I built                              │
│  [body + code blocks + screenshots]          │
│                                              │
│  ## What happened                            │
│  [body + THE RECEIPT TABLE]                  │
│                                              │
│  ## So what?                                 │
│  [body + takeaways]                          │
│                                              │
│  ## Honest accounting                        │  ← required section
│  [caveats, biases, limitations]              │
│                                              │
│  ## Try it yourself                          │
│  [repo link + replication steps]             │
│                                              │
│  ───── ▪                                     │
│  FOOTER: prev episode · next episode ·       │
│          subscribe · credit · license        │
└──────────────────────────────────────────────┘
```

**Non-negotiable sections:** Honest accounting + Try it yourself. Episodes without these are off-brand.

---

## 7. Receipt Table (signature component)

Every episode includes at least one **Receipt Table** — the artifact that distinguishes this brand from explainer blogs. It is always:

- Set in **IBM Plex Mono 500** for all numbers
- Header row in `ink-mute` background, uppercase Plex Mono
- Body rows alternating `paper` / `paper-deep`
- Right-most column is the **delta/multiplier**, set in oxblood, bold
- No gridlines except a 1px top + bottom border in `rule`
- Caption below in italic Source Serif, attributing the source

Example:
```
┌─────────────────────┬──────────────┬──────────────┬──────────┐
│ METRIC              │ ARM A        │ ARM B        │ DELTA    │
├─────────────────────┼──────────────┼──────────────┼──────────┤
│ Wall-clock (sec)    │ 452          │ 47           │ 9.62×    │
│ Lines churned       │ 75           │ 4            │ 18.75×   │
│ Success             │ 17/17 pass   │ 8/8 pass     │ same     │
└─────────────────────┴──────────────┴──────────────┴──────────┘
   Source: in-session Claude Code runs, 2026-08-12
```

---

## 8. Channel Adaptations

### Blog (canonical)
Full structure above. 1500-2500 words. The blog is the source of truth; everything else is excerpt.

### LinkedIn post (130-300 words)
- Hook = first line of the blog's hook, rewritten to stand alone
- Insight = the single most surprising number from the receipt table
- CTA = "Full breakdown in comments ↓" (link in first comment, per LinkedIn algorithm rules)
- 3-5 calm hashtags, lowercase (#promptengineering #ai #codingagents #papersinthewild)
- NEVER paste the blog URL in the post body — algorithm penalty

### Instagram carousel (max 10 slides, square 1080×1080)
1. Cover: hook title in Fraunces + small PITW seal in corner
2-3. Paper setup (what it claims)
4-7. The experiment + receipt (numbers BIG in Plex Mono)
8-9. What it means
10. CTA + PITW seal + "Next episode Friday"

### Newsletter (future — not yet)
Plain-text email, 600-800 words. Subset of blog. Signoff: "— Baagad, in the wild".

---

## 9. Do / Don't

### Do
- ✅ Cite every paper with arXiv link
- ✅ Show actual numbers, timestamps, line counts in body
- ✅ Admit when an experiment fails or the result was smaller than expected
- ✅ Use the receipt table component on every episode
- ✅ Link to the GitHub folder with full build log
- ✅ Credit dair-ai for paper discovery
- ✅ Use Fraunces + Source Serif + IBM Plex Mono — never substitute

### Don't
- ❌ Use hype words (game-changer, revolutionary, mind-blowing)
- ❌ Use the word "delve" or "leverage"
- ❌ Publish without a receipt table
- ❌ Use emoji except one per post (max), earned
- ❌ Use generic AI imagery (sparkles, brains, robots)
- ❌ Use purple gradients, glassmorphism, or dark mode by default
- ❌ Put external links in LinkedIn main post (algorithm penalty)
- ❌ Use hashtag stuffing (>5 hashtags)

---

## 10. Brand Artifacts Manifest

Artifacts that exist or should exist (in priority order):

| Artifact | Status | Location |
|----------|--------|----------|
| This BRAND.md | ✓ | `projects/ai-papers-explained/BRAND.md` |
| DESIGN-SYSTEM.md (tokens + components) | next | `projects/ai-papers-explained/DESIGN-SYSTEM.md` |
| Wordmark SVG | TODO | `site/public/wordmark.svg` |
| Seal SVG (favicon, OG corner) | TODO | `site/public/seal.svg` |
| Favicon set | TODO | `site/public/favicon.ico`, `apple-touch-icon.png` |
| OG image template | TODO | `site/public/og-default.png` + per-episode generator |
| LinkedIn banner | TODO | `assets/linkedin-banner.png` |
| IG highlight covers | TODO | `assets/ig-highlights/` |
| Email footer | TODO | `assets/email-footer.html` |

---

## 11. Evolution Rules

- This brand is a living document. Edit freely as we learn what works.
- **Changes that need journal entry:** voice changes, palette changes, tagline changes.
- **Changes that need retro:** any time an episode underperforms, audit voice + cover design before shipping next.
- **Do not split-test brand early.** Commit to this for at least 8 episodes before considering a pivot. Brand needs repetition to land.

---

*Last updated: 2026-08-12. Brand owner: Baagad.*
