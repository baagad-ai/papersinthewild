# Papers in the Wild

> Every week: take one AI research paper → understand it → find a bizarre-but-real use case → build it → ship a blog post + LinkedIn + Instagram carousel. The spine of this entire repo.
>
> **Brand locked 2026-08-12.** Identity, voice, palette, type, components are in [`BRAND.md`](./BRAND.md) and [`DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md). Field Notebook aesthetic. Don't reinvent — reference.

## The concept, in one paragraph

[dair-ai/AI-Papers-of-the-Week](https://github.com/dair-ai/AI-Papers-of-the-Week) publishes the top AI research papers weekly. Most people can't read them. Most explainers are dry academic summaries. **Papers in the Wild** takes a different angle: *I got curious about this paper. So I tried [bizarre real application]. Here's what happened.* Think Tom Scott meets Two Minute Papers meets Mark Rober — for AI research. The voice is `build_to_think`: curious explorer, not guru.

## Why this project IS the curriculum

Every episode exercises real digital marketing skills:

| Episode stage | Marketing skill practiced |
|---------------|---------------------------|
| Read paper + understand | Research, technical reading, content sourcing |
| Find use cases | Ideation, audience empathy, trend-spotting |
| Build it + capture | Documentation, screenshot production, tutorial writing |
| Write blog post | Long-form copywriting, narrative structure, SEO |
| Publish on GitHub Pages | Technical SEO, site architecture, page speed |
| LinkedIn post | Short-form B2B copywriting, hook writing, distribution |
| Instagram carousel | Visual design, slide copy, scroll-stopping hooks |
| Cross-promote + engage | Community management, influencer interaction |
| Track analytics | GA4, content performance, iteration |
| Optionally amplify with ads | Performance ads, audience targeting, ROAS |

**There is no other project that exercises all 3 niches (ads, SEO, social) simultaneously, with weekly ship cadence, while building a real portfolio and personal brand.**

## The production pipeline

See [`pipeline.md`](./pipeline.md) for the full 7-stage workflow. Summary:

```
Stage 1: FETCH       → pull this week's papers from dair-ai
Stage 2: READ        → Claude reads the paper, teaches user (Mode 2)
Stage 3: IDEATE      → 3 fun/bizarre/real use cases (Mode 3)
Stage 4: BUILD       → try the use case, capture screenshots (Mode 4)
Stage 5: WRITE       → blog post + LinkedIn + IG carousel (Mode 5)
Stage 6: SHIP        → publish to GitHub Pages + LinkedIn + Instagram
Stage 7: MEASURE     → track engagement, plan next week
```

## Folder structure

```
ai-papers-explained/
├── README.md            ← you are here
├── pipeline.md          ← 7-stage workflow
├── episodes/
│   ├── YYYY-WW-{slug}/  ← one folder per episode
│   │   ├── paper.md     ← paper link + metadata
│   │   ├── notes.md     ← Claude's structured understanding
│   │   ├── use-cases.md ← 3 candidates with feasibility scores
│   │   ├── build-log.md ← what we tried, what happened
│   │   ├── blog-post.md ← the long-form post
│   │   ├── linkedin.md  ← LinkedIn promo
│   │   ├── instagram.md ← IG carousel source
│   │   └── assets/      ← screenshots, recordings
│   └── ...
├── site/                ← GitHub Pages source
│   └── index.html       ← landing page (TODO: build in week 2)
└── analytics.md         ← per-episode performance tracker
```

## Voice — non-negotiable

`build_to_think`: curious explorer reporting from the field. Hook formula:
> *"I got curious about [paper claim]. So I tried [bizarre application]. Here's what happened."*

**Anti-voice**: "10 mind-blowing AI papers", "this paper changes everything", "researchers just discovered", emoji spam.

## What makes an episode land

Per feedback memory: Instagram throttled the user's first creative carousel at 99 reach. The flag combo (Hindu + weapons + bare-chest + roar) likely triggered AI+content moderation. Lessons baked in:
- **Softer cover image** — no flags, weapons, blood, bare skin, aggressive imagery
- **Trimmed hashtags** — 3-5 max, all calm/descriptive (not #ai #viral)
- **Calmer caption** — curiosity hook, not hype

## Source — dair-ai/AI-Papers-of-the-Week

- **Repo:** https://github.com/dair-ai/AI-Papers-of-the-Week
- **Cadence:** weekly
- **Archive:** 2023-2026 in `/years/` folder
- **Format:** paper title + authors + arXiv link + sometimes code/demo

## Success metrics — 6 months

- **24-26 episodes shipped** (1 per week, 4-6 month runway)
- **1-3 episodes with >10K aggregate reach** (LinkedIn + IG + blog)
- **500+ LinkedIn followers** gained through this project alone
- **Portfolio site live** at `username.github.io/papers-in-the-wild` (or similar)
- **2-3 episodes cited by larger creators** (the dream)
- **Inbound DMs from potential clients** (the monetization)

## TODO (next session)

- [x] ~~Set up GitHub Pages site skeleton~~ — done, see `site/` (Next.js 15 + shadcn + MDX)
- [x] ~~Design brand identity (logo, colors, typography)~~ — done, see `BRAND.md` + `DESIGN-SYSTEM.md`
- [x] ~~Pick first paper + run full pipeline~~ — done, see `episodes/2026-W33-prompt-induced-waste/`
- [ ] Buy domain `papersinthewild.io` (optional, can stay on github.io)
- [ ] Wire GitHub Actions for `site/` → Pages deployment
- [ ] Generate Episode 1 OG image (1200×630)
- [ ] Render IG carousel via `slide-wand --square`
- [ ] Write `analytics.md` template

---

*This project is the spine. Every other track exists to make these episodes better.*
