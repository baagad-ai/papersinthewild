# Papers in the Wild

> I read an AI paper. I try something real with it. I publish the receipts. Every Friday.

[**Read the latest episode →**](https://papersinthewild.io)

---

## What this is

A weekly publication of experiments on real AI research papers. Each episode:

1. **Pick** one paper from [dair-ai/AI-Papers-of-the-Week](https://github.com/dair-ai/AI-Papers-of-the-Week)
2. **Understand** it deeply enough to explain in plain English
3. **Find** a bizarre-but-real use case (funny, pointed, or genuinely useful)
4. **Build** it — code runs, screenshots captured, failures documented
5. **Write** the story — for non-technical readers, with the receipts
6. **Ship** — blog post, LinkedIn, Instagram carousel
7. **Measure** — T+24h, T+7d, T+30d metrics, honest retrospective

The work lives in this repo. You can replicate any episode from the artifacts here.

## The voice

**`build_to_think`** — curious explorer reporting from the field. Never a guru. Never "10 secrets to…". Always: *"I got curious about X. So I tried Y. Here's what I found."*

Receipts over rhetoric. Every number has a source. Failures are content.

Full brand identity: [`projects/ai-papers-explained/BRAND.md`](./projects/ai-papers-explained/BRAND.md)
Writing manual: [`projects/ai-papers-explained/STYLE-GUIDE.md`](./projects/ai-papers-explained/STYLE-GUIDE.md)

## Episode index

| # | Week | Title | Paper |
|---|------|-------|-------|
| 01 | 2026-W33 | *Be absolutely certain.* | [Prompt-Induced Waste (arXiv 2608.01347)](https://arxiv.org/abs/2608.01347) |

Full index: [`projects/ai-papers-explained/index.md`](./projects/ai-papers-explained/index.md)

## Repository layout (public)

```
papersinthewild/
├── README.md                              ← you are here
├── LICENSE
└── projects/
    └── ai-papers-explained/
        ├── BRAND.md                       ← identity, voice, palette, type
        ├── DESIGN-SYSTEM.md               ← tokens, components, MDX mapping
        ├── STYLE-GUIDE.md                 ← writing manual (canonical)
        ├── pipeline.md                    ← 7-stage production workflow
        ├── index.md                       ← episode registry
        ├── episodes/
        │   └── YYYY-WW-{slug}/            ← one folder per paper
        │       ├── paper.md               ← arXiv link + why this paper
        │       ├── notes.md               ← Claude's structured understanding
        │       ├── use-cases.md           ← 3 candidates, scored
        │       ├── build-log.md           ← what was built, with screenshots
        │       ├── blog-post.md           ← the story (plain MD mirror)
        │       ├── linkedin.md            ← LinkedIn post + first comment
        │       └── instagram.md           ← 10-slide IG carousel script
        └── site/                          ← Next.js 15 + shadcn + MDX
            ├── app/                       ← routes (home, episodes/[slug], about)
            ├── components/                ← InkRule, ReceiptTable, DropCap, PullQuote…
            ├── content/
            │   ├── episodes.ts            ← episode metadata registry
            │   └── episodes/*.mdx         ← canonical episode MDX
            └── public/                    ← seal.svg, favicon.svg, wordmark.svg
```

## Tech stack

- **Next.js 15** (App Router, static export) → GitHub Pages
- **shadcn/ui** for component primitives
- **MDX** via `next-mdx-remote-client` for episode content
- **Fraunces** (display) + **Source Serif 4** (body) + **IBM Plex Mono** (numbers, code)
- **Field Notebook** palette: cream paper `#F5EFE0`, deep ink `#1A1612`, oxblood accent `#7C2D2D`

Full design system: [`projects/ai-papers-explained/DESIGN-SYSTEM.md`](./projects/ai-papers-explained/DESIGN-SYSTEM.md)

## Build the site locally

```bash
cd projects/ai-papers-explained/site
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to out/
```

## Replicate an episode

Each episode folder contains everything you need to reproduce the work:

- The exact prompts used (in `build-log.md`)
- The trial data and analysis scripts
- The test harness
- Screenshots and outputs in `assets/`

Start with [`episodes/2026-W33-prompt-induced-waste/build-log.md`](./projects/ai-papers-explained/episodes/2026-W33-prompt-induced-waste/build-log.md) for a worked example.

## Submit a paper

Open an issue with `paper-suggestion:` prefix. Include arXiv link + one sentence on why it's bizarre-but-real.

## License

Content (blog posts, episodes, images): **CC BY 4.0** — credit "Papers in the Wild by Baagad", link back to the episode.
Code (experiment scripts, site): **MIT**.

---

*Made by Baagad, in the wild.*
