# Papers in the Wild

> Weekly experiments on real AI research papers. Read the paper. Try something. Ship the receipts.

**Live site:** <https://baagad-ai.github.io/papersinthewild/>
**Latest episode:** [My AI has an anxiety problem.](https://baagad-ai.github.io/papersinthewild/episodes/2026-w33-prompt-induced-waste)

---

## What this is

A weekly publication. Each episode:

1. **Pick** a recent AI paper (usually from [dair-ai/AI-Papers-of-the-Week](https://github.com/dair-ai/AI-Papers-of-the-Week))
2. **Try** something real with it. Reproduce a result. Build a small experiment. Test a claim against a different setup.
3. **Ship** the receipts: code, raw data, screenshots, an honest writeup of what worked and what didn't.

The work lives in this repo. Every episode is replicable from the artifacts here.

## Episodes

| # | Week | Title | Paper |
|---|------|-------|-------|
| 01 | 2026-W33 | [My AI has an anxiety problem.](./episodes/2026-w33-prompt-induced-waste/blog-post.md) | [Prompt-Induced Waste (arXiv 2608.01347)](https://arxiv.org/abs/2608.01347) |

Each episode folder contains:

| File | Purpose |
|---|---|
| `paper.md` | Link to the paper, one-line "why this one" |
| `build-log.md` | Step-by-step build with screenshots, the human-readable story |
| `build/` | Original trial code + outputs (smaller reproduction) |
| `build-deeper/` | Larger reproduction code, raw trial data, analysis scripts |
| `blog-post.md` | Plain-markdown mirror of the published blog post |
| `assets/` | Screenshots and images |

## Repository layout

```
papersinthewild/
├── README.md                           You are here
├── LICENSE                             CC BY 4.0 (content) + MIT (code)
├── CONTRIBUTING.md                     How to suggest a paper or contribute
├── .github/workflows/deploy.yml        Auto-deploys site to GitHub Pages
├── site/                               Next.js 15 + MDX static site
│   ├── app/                            Routes: home, episodes/[slug], about
│   ├── components/                     Owned shadcn-style components
│   ├── content/
│   │   ├── episodes.ts                 Episode metadata registry
│   │   └── episodes/*.mdx              Canonical episode content
│   ├── public/                         seal.svg, favicon.svg, wordmark.svg
│   └── next.config.mjs                 Static export + basePath for Pages
└── episodes/
    └── {year}-w{week}-{slug}/          Per-episode artifacts (see above)
```

## Build the site locally

Requirements: Node.js 20+ and npm.

```bash
git clone https://github.com/baagad-ai/papersinthewild.git
cd papersinthewild/site
npm install --legacy-peer-deps    # see note below
npm run dev                       # http://localhost:3000/papersinthewild
npm run build                     # static export to site/out/
```

The `--legacy-peer-deps` flag is needed because `framer-motion@11` peer-deps React 18 while the project is on React 19. The lockfile is already resolved correctly; this flag just unblocks `npm install`'s strict peer check.

## Replicate an episode

Each episode folder is self-contained. A good starting point: [`episodes/2026-w33-prompt-induced-waste/`](./episodes/2026-w33-prompt-induced-waste/). Read `build-log.md` first, then poke around `build-deeper/` for the trial data.

## Tech stack

- **[Next.js 15](https://nextjs.org/)** (App Router, static export) on GitHub Pages
- **[shadcn/ui](https://ui.shadcn.com/)** patterns (owned, copy-paste components, no UI kit dependency)
- **[MDX](https://mdxjs.com/)** via `@next/mdx` for episode content
- **[Fraunces](https://fonts.google.com/specimen/Fraunces)** (display) + **[Source Serif 4](https://fonts.google.com/specimen/Source+Serif+4)** (body) + **[IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono)** (numbers, code)
- **[Tailwind CSS](https://tailwindcss.com/)** with CSS-variable design tokens

## Submit a paper

Open an issue with the `paper-suggestion:` prefix. Include:

- arXiv link
- One sentence on why it is bizarre-but-real
- (Optional) A use case you would like to see tested

Every suggestion is read. Suggestions that get picked are credited in the episode writeup.

## License

This repository contains two kinds of work, licensed separately:

- **Content** (blog posts, episode writeups, images, any creative work): **[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)**. Attribute "Papers in the Wild", link back to the source episode.
- **Code** (the site, experiment scripts, test harnesses, analysis code): **[MIT](https://opensource.org/license/mit/)**.

See [`LICENSE`](./LICENSE) for the full text.

## Acknowledgments

- Episode papers sourced from [`dair-ai/AI-Papers-of-the-Week`](https://github.com/dair-ai/AI-Papers-of-the-Week)
- Fonts by Stephen Nixon (Fraunces), Frank Grießhammer (Source Serif 4), and IBM (Plex Mono)
- Component primitives inspired by [shadcn/ui](https://ui.shadcn.com/)

---

*Made by [Baagad](https://github.com/baagad-ai), in the wild.*
