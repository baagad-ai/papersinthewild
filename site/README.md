# Papers in the Wild — Site

> Next.js 15 + shadcn + MDX. Static-exported to GitHub Pages.
> Brand: **Papers in the Wild** / Field Notebook aesthetic.
> See [../BRAND.md](../BRAND.md) and [../DESIGN-SYSTEM.md](../DESIGN-SYSTEM.md) for the canonical spec.

## Quickstart

```bash
cd site
npm install
npm run dev    # http://localhost:3000
```

## Build & export

```bash
npm run build  # produces out/
```

The `out/` directory is fully static and can be deployed to GitHub Pages, Netlify, or any static host.

## Architecture

```
site/
├── app/
│   ├── layout.tsx              # Root layout with fonts + header + footer
│   ├── page.tsx                # Home (hero + latest episode + about blurb)
│   ├── globals.css             # Design tokens (CSS variables)
│   ├── about/page.tsx          # Colophon page
│   └── episodes/[slug]/page.tsx  # Episode template (renders MDX)
├── components/
│   ├── site-header.tsx         # Sticky nav
│   ├── site-footer.tsx         # Three-column footer
│   ├── seal-mark.tsx           # PITW circular ink seal
│   ├── paper-card.tsx          # Episode preview card
│   ├── receipt-table.tsx       # THE signature component
│   ├── drop-cap.tsx            # Opening paragraph flourish
│   ├── pull-quote.tsx          # Oxblood-bordered blockquote
│   ├── ink-rule.tsx            # Section divider with oxblood seal
│   ├── code-block.tsx          # Code with optional filename header
│   ├── num.tsx                 # Inline number in Plex Mono / oxblood
│   ├── ep.tsx                  # "EP. 01" reference
│   └── cite.tsx                # Citation link
├── content/
│   ├── episodes.ts             # Episode metadata registry
│   └── episodes/*.mdx          # The actual episode posts
├── public/
│   ├── favicon.svg
│   ├── seal.svg
│   └── wordmark.svg
├── lib/
│   └── utils.ts                # cn() helper
├── mdx-components.tsx          # Global MDX mapping
├── tailwind.config.ts          # Field Notebook tokens
├── next.config.mjs             # MDX + rehype-pretty-code + static export
└── package.json
```

## Adding a new episode

1. Write the MDX file: `content/episodes/YYYY-WW-{slug}.mdx`
2. Register metadata in `content/episodes.ts`
3. (Optional) Drop episode screenshots into `public/episodes/{slug}/`
4. (Optional) Generate OG image to `public/og/{slug}.png`

The site auto-builds the route `/episodes/{slug}`.

## Design system

For the canonical spec, see:
- [BRAND.md](../BRAND.md) — voice, palette, type, anti-voice
- [DESIGN-SYSTEM.md](../DESIGN-SYSTEM.md) — tokens, components, MDX mapping

**Non-negotiable:**
- Use `<ReceiptTable>` for every quantitative result
- Use `<DropCap>` for the opening paragraph of every episode
- Use `<PullQuote>` for the one quote per episode that matters
- Use `<Num>` for every inline number
- Citations are always `<Cite>` (oxblood on hover, never blue)
- "Honest accounting" + "Try it yourself" sections are required in every episode

## Deployment (GitHub Pages)

When ready, add a GitHub Actions workflow at `.github/workflows/deploy-site.yml` that:
1. Checks out the repo
2. Runs `cd site && npm install && npm run build`
3. Uploads `site/out/` to GitHub Pages

Configure Pages to deploy from the workflow artifact.

---

*Made by Baagad, in the wild.*
