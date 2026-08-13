# Papers in the Wild — Design System

> Technical implementation of [BRAND.md](./BRAND.md). Tokens, components, MDX mappings, code conventions. If BRAND.md is the *what*, this is the *how*.

---

## 1. Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 15 (App Router)** | Static export to GitHub Pages; native MDX; shadcn ecosystem |
| Components | **shadcn/ui** (copy-paste, owned) | User-mandated; composability; CSS-var theming |
| Styling | **Tailwind CSS v3.4** | Aligns with shadcn; token-friendly |
| Type | **next/font** with Google Fonts | Zero CLS, self-hosted |
| Content | **MDX** via `@next/mdx` | Markdown + components in episodes |
| Icons | **lucide-react** | Default shadcn icon set |
| Motion | **framer-motion** (sparingly) | Only for fade-on-scroll + ink-underline hover |
| Deploy | **GitHub Pages** (via `next export`) | Free, matches repo host |

**Not used:** storybook (overkill for a single blog), styled-components (Tailwind covers it), react-aria (Radix covers it via shadcn).

---

## 2. Design Tokens (CSS Variables)

Define in `app/globals.css` under `:root`. Tailwind reads them via `tailwind.config.ts`.

```css
:root {
  /* ── Color ── */
  --paper:        #F5EFE0;   /* page bg */
  --paper-deep:   #EDE5D2;   /* alt panel bg */
  --ink:          #1A1612;   /* primary text */
  --ink-soft:     #3C342B;   /* body text */
  --ink-mute:     #6B5F4F;   /* meta / captions */
  --rule:         #C9BFA7;   /* dividers, borders */
  --oxblood:      #7C2D2D;   /* primary accent */
  --oxblood-deep: #5A1F1F;   /* hover */
  --moss:         #3A4A2E;   /* positive-result semantic */
  --highlight:    #E8C46C;   /* pencil-highlight marker */

  /* ── Typography ── */
  --font-display: "Fraunces", Georgia, serif;
  --font-body:    "Source Serif 4", Georgia, serif;
  --font-mono:    "IBM Plex Mono", "JetBrains Mono", monospace;

  /* ── Spacing (8px grid) ── */
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.5rem;   /* 24px */
  --space-6: 2rem;     /* 32px */
  --space-7: 3rem;     /* 48px */
  --space-8: 4rem;     /* 64px */
  --space-9: 6rem;     /* 96px */

  /* ── Layout ── */
  --article-width: 680px;
  --page-width: 1080px;
  --nav-height: 64px;

  /* ── Type scale ── */
  --text-display: 3.5rem;     /* 56px / 1.05 */
  --text-h1: 2.5rem;          /* 40px / 1.1  */
  --text-h2: 1.875rem;        /* 30px / 1.2  */
  --text-h3: 1.375rem;        /* 22px / 1.3  */
  --text-body: 1.125rem;      /* 18px / 1.65 */
  --text-meta: 0.875rem;      /* 14px / 1.4  */
  --text-mono: 0.9375rem;     /* 15px / 1.5  */

  /* ── Motion ── */
  --ease-ink: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-fast: 120ms;
  --duration-base: 200ms;
  --duration-slow: 400ms;
}
```

---

## 3. Tailwind Config

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx,mdx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        "paper-deep": "var(--paper-deep)",
        ink: {
          DEFAULT: "var(--ink)",
          soft: "var(--ink-soft)",
          mute: "var(--ink-mute)",
        },
        rule: "var(--rule)",
        oxblood: {
          DEFAULT: "var(--oxblood)",
          deep: "var(--oxblood-deep)",
        },
        moss: "var(--moss)",
        highlight: "var(--highlight)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      maxWidth: {
        article: "var(--article-width)",
        page: "var(--page-width)",
      },
      fontSize: {
        display: ["var(--text-display)", { lineHeight: "1.05" }],
        h1: ["var(--text-h1)", { lineHeight: "1.1" }],
        h2: ["var(--text-h2)", { lineHeight: "1.2" }],
        h3: ["var(--text-h3)", { lineHeight: "1.3" }],
        body: ["var(--text-body)", { lineHeight: "1.65" }],
        meta: ["var(--text-meta)", { lineHeight: "1.4" }],
        mono: ["var(--text-mono)", { lineHeight: "1.5" }],
      },
      transitionTimingFunction: { ink: "var(--ease-ink)" },
      transitionDuration: {
        fast: "var(--duration-fast)",
        base: "var(--duration-base)",
        slow: "var(--duration-slow)",
      },
    },
  },
  plugins: [],
} satisfies Config;
```

---

## 4. Component Library

All components live in `components/` and are owned (not npm-installed). Shadcn-style: copy-paste, Radix primitives where they help.

### 4.1 Layout primitives

#### `<SiteHeader />`
Sticky top, paper background, 1px rule bottom border. Left: compact wordmark `papers in the wild` (Plex Mono). Right: nav (Episodes, About, Sources, Subscribe).

#### `<SiteFooter />`
Three columns. Left: wordmark + tagline. Center: link groups (Episodes / Brand / Sources). Right: PITW seal + "made by Baagad in the wild" + license.

#### `<EpisodeLayout slug={...} />`
Wraps every MDX episode. Renders meta strip, title, byline, ink-rule, MDX content, footer nav.

### 4.2 Editorial components

#### `<InkRule />` — signature divider
```tsx
<div className="flex items-center gap-2 py-6" aria-hidden>
  <span className="h-px bg-rule flex-1" />
  <span className="h-1.5 w-1.5 bg-oxblood" />
</div>
```
Used between major sections. The small oxblood square is the **seal mark** — the single most recognisable brand artifact.

#### `<DropCap />` — opening flourish
Wraps the first paragraph. Fraunces 500, oxblood, 4 lines tall, float-left.

```tsx
<p className="text-body text-ink-soft first-letter:float-left
   first-letter:mr-3 first-letter:font-display first-letter:text-[5.5rem]
   first-letter:leading-[0.85] first-letter:text-oxblood">
  {children}
</p>
```

#### `<PullQuote>` — emphasis block
```tsx
<blockquote className="my-12 border-l-[3px] border-oxblood pl-6
   font-display text-h3 italic text-ink">
  {children}
</blockquote>
```

#### `<ReceiptTable>` — **the signature component**
Implements the Receipt Table spec from BRAND.md §7.

```tsx
<table className="my-8 w-full border-collapse font-mono text-mono">
  <thead>
    <tr className="border-y border-rule">
      {headers.map(h => (
        <th key={h} className="py-2 px-3 text-left uppercase text-ink-mute
           text-[0.75rem] tracking-wider">{h}</th>
      ))}
    </tr>
  </thead>
  <tbody>
    {rows.map((row, i) => (
      <tr key={i} className={i % 2 ? "bg-paper-deep" : "bg-paper"}>
        {row.cells.map((c, j) => (
          <td key={j} className={cn(
            "py-3 px-3 text-ink",
            j === row.cells.length - 1 && "font-bold text-oxblood"
          )}>{c}</td>
        ))}
      </tr>
    ))}
  </tbody>
</table>
<Caption>{caption}</Caption>
```

#### `<CodeBlock>` — code with receipts
Syntax: `rehype-pretty-code` (Shikiji). Theme: custom `papers-in-the-wild` (paper bg, ink text, oxblood tokens for keywords). Always show file path header in Plex Mono.

#### `<PaperCard>` — episode link from index
Paper-deep background, 1px rule border, hover: bg fade to paper + slight oxblood left-border (3px). Contains: ep number, title, date, 1-line teaser, "read →" link.

### 4.4 Audience-Optimised Storytelling Components (added 2026-08-13)

For the voice shift to "fun, casual, simple for non-technical readers" (per L934 directive). All sit on the existing Field Notebook palette. All available inline in MDX via PascalCase.

#### `<BigStat>` — punchy display number
Use when a single number deserves to break out of body text. Fraunces display, ~5rem, oxblood. Small uppercase caption beneath in Source Serif meta.

```mdx
<BigStat value="4×" label="more work, same correct answer" />
<BigStat value="0" label="bugs caught by the extra work, across 36 trials" />
```

One per key finding. Never two in a row. If the post has three BigStats, it has too many "key" findings.

#### `<Scene>` — boxed analogy or story scene
For non-technical readers, the analogy arrives BEFORE the data. Scene is the visual cue: "slow down, this is the picture to hold in your head."

```mdx
<Scene title="The anxious friend at the door">
  Telling an AI to "be absolutely certain" is like telling your most anxious
  friend that you "just want to make sure" the door is locked. They will
  check it. Check it again. Ask you if they checked it. The door was locked
  the first time.
</Scene>
```

Paper-deep bg, oxblood left bar, small uppercase mono title. Distinct from `PullQuote` (which is for paper one-liners).

#### `<PromptBlock>` — verbatim prompt with tone context
For showing the exact wording that triggers a behavior (wasteful) or fixes it (bounded). Copy-pasteable. Tone is semantic.

```mdx
<PromptBlock label="The wasteful version" tone="bad">
  Be absolutely certain. Re-verify your work repeatedly before completing.
</PromptBlock>

<PromptBlock label="The fix (free, identical success rate)" tone="good">
  Work efficiently: begin with the failing test and the most likely files.
</PromptBlock>
```

Tone drives the left bar color: `bad` = oxblood, `good` = moss, `neutral` = rule.

#### `<Callout>` — semantic callout with four variants
The brand requires "Honest accounting" + "Try it yourself" sections in every episode. Callout makes them visually distinct without being shouty.

```mdx
<Callout variant="try" label="Try it yourself">
  1. Pick a small coding task with a test suite.
  2. Open a fresh Claude Code session.
  3. Paste the max-certainty prompt. Run to green. Run /cost.
</Callout>

<Callout variant="honest" label="Honest accounting">
  N=2 per cell is small. The direction is clear, the magnitude has wide
  error bars.
</Callout>
```

Variants: `try` (moss-tinted), `honest` (paper-deep), `warn` (oxblood-tinted), `info` (paper-deep neutral).

#### `<Translation>` — the four-step translation ladder
For every technical term in a non-technical-audience post, the ladder has to be VISIBLE: jargon, plain English, analogy, data.

```mdx
<Translation
  term="Level 3+ redundant verification"
  plain="The AI re-verified work it had already verified."
  analogy="Like asking your anxious friend if they locked the door. They check it. Check it again. Write a note. The door was locked the first time."
  data="Across 6 max-certainty trials, the AI wrote an average of 10 extra probe tests per run. Every probe passed. None caught a bug."
/>
```

Renders as a 4-row visual stack with hairline dividers. The "data" row uses oxblood label to signal the receipt.

#### `<AgentLine>` — AI character quote
When the AI is anthropomorphised in the scene, its literal output reads as dialogue. `PullQuote` is for paper quotes; `AgentLine` is for the AI speaking.

```mdx
<AgentLine task="after writing the implementation">
  I'll write nine probe tests covering edge cases the original suite didn't
  exercise, then re-run the full suite to confirm everything still passes.
</AgentLine>
```

Small "AI" tag in oxblood, paper-deep bg, Plex Mono body (because it is real agent output).

#### Component selection rules

| You want to... | Use |
|---|---|
| Show a paper's one-line quote | `PullQuote` |
| Show the AI's literal output as dialogue | `AgentLine` |
| Show a verbatim prompt | `PromptBlock` |
| Show a key dramatic number | `BigStat` |
| Show a story analogy / scene | `Scene` |
| Show a technical term + its translation | `Translation` |
| Show the receipt (data table) | `ReceiptTable` |
| Show a Try-It / Honest-Accounting / Note block | `Callout` |
| Show a section divider | `InkRule` |
| Inline numbers in body text | `Num` |

### 4.3 Inline primitives

#### `<Num>` — inline number
Wraps any number in body text to render in IBM Plex Mono with oxblood-tinted color.
```tsx
<span className="font-mono text-[0.95em] text-oxblood">{children}</span>
```

#### `<Ep>` — episode-number reference
e.g. `<Ep n={1} />` renders `EP. 01` in Plex Mono uppercase.

#### `<Cite>` — citation link
```tsx
<a href={href} className="text-ink underline decoration-rule
  decoration-1 underline-offset-4 hover:text-oxblood
  hover:decoration-oxblood transition-colors duration-base">
  {children}
</a>
```
Never use Tailwind's `text-blue-600` default. Links are ink → oxblood on hover.

---

## 5. MDX Component Mapping

`content/episodes/*.mdx` files use these directly:

```tsx
// mdx-components.tsx
export const mdxComponents = {
  h1: ({ children }) => <h1 className="font-display text-h1 text-ink mt-12 mb-6">{children}</h1>,
  h2: ({ children }) => <h2 className="font-display text-h2 text-ink mt-16 mb-4">{children}</h2>,
  h3: ({ children }) => <h3 className="font-display text-h3 text-ink mt-12 mb-3">{children}</h3>,
  p:  ({ children }) => <p className="text-body text-ink-soft mb-6">{children}</p>,
  a:  ({ href, children }) => <Cite href={href}>{children}</Cite>,
  strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
  em: ({ children }) => <em className="font-display italic">{children}</em>,
  ul: ({ children }) => <ul className="mb-6 pl-6 text-body text-ink-soft space-y-2 list-disc marker:text-oxblood">{children}</ul>,
  ol: ({ children }) => <ol className="mb-6 pl-6 text-body text-ink-soft space-y-2 list-decimal marker:text-oxblood marker:font-mono">{children}</ol>,
  code: ({ children }) => <code className="font-mono text-[0.9em] bg-paper-deep px-1.5 py-0.5 rounded-sm">{children}</code>,
  pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
  blockquote: ({ children }) => <PullQuote>{children}</PullQuote>,
  table: ({ children }) => <ReceiptTable>{children}</ReceiptTable>,
  hr: () => <InkRule />,
  // custom components available inline:
  Num, Ep, Cite, InkRule, DropCap, PullQuote, ReceiptTable, PaperCard,
  // audience-optimised storytelling (added 2026-08-13):
  BigStat, Scene, PromptBlock, Callout, Translation, AgentLine,
};
```

---

## 6. Page Templates

### Home (`/`)
- Header + wordmark + tagline
- Latest episode card (large)
- "About Papers in the Wild" (short paragraph)
- Episode index (PaperCard grid, 3 columns desktop)
- Footer

### Episode (`/episodes/[slug]`)
- Meta strip: `EP. XX · PAPER TITLE · DATE`
- Display title (hook)
- Byline + reading time + tags
- InkRule
- MDX content
- Receipt table embedded in MDX
- "Try it yourself" repo link callout
- Footer nav: prev / next / subscribe

### About (`/about`)
- Brand pitch
- Voice commitments
- Source attribution (dair-ai)
- Author bio (Baagad)

### Sources (`/sources`)
- How papers are picked (Stage 1 protocol)
- Link to dair-ai
- Past sources

---

## 7. Motion Rules (RESTRAINED)

Per taste dials (MOTION_INTENSITY: 4), motion is **subtle and rare**:

| Element | Motion |
|---------|--------|
| Page load | None. Static HTML. |
| Headings | None. |
| Body text | None. |
| Images | Soft fade-in on first scroll-into-view (200ms, ink easing) |
| Links | Color transition ink → oxblood (120ms) |
| Buttons | Same as links + 1px translateY on active |
| PaperCard | Border + bg-color transition on hover (200ms) |
| Receipt table rows | None |
| Code blocks | None |

**Never:** parallax, GSAP ScrollTrigger pinning, autoplay video, looping micro-animations, marquee, count-up animations.

---

## 8. Accessibility

- **Color contrast:** ink on paper = 14.5:1 (AAA). Oxblood on paper = 7.2:1 (AAA for large, AA for body). Never put `ink-mute` on `paper` for body text — only for meta ≤ 14px.
- **Focus rings:** 2px oxblood outline, 2px offset. Visible on all interactive elements.
- **Type sizes:** body min 18px. Meta min 14px.
- **Alt text:** every screenshot has descriptive alt. Decorative SVGs: `aria-hidden`.
- **Motion preference:** `@media (prefers-reduced-motion: reduce)` disables all transitions.
- **Semantic HTML:** MDX components use proper `<h1>` → `<h6>`, `<blockquote>`, `<table>`, `<cite>`.

---

## 9. Asset Conventions

| Asset | Format | Size | Location |
|-------|--------|------|----------|
| Screenshots in episodes | PNG (retina 2x) | max 1600px wide | `site/public/episodes/{slug}/img-NN.png` |
| OG image | PNG | 1200×630 | `site/public/og/{slug}.png` |
| Favicon | SVG + ICO fallback | scalable | `site/public/favicon.svg` |
| Wordmark | SVG | scalable | `site/public/wordmark.svg` |
| Seal | SVG | scalable | `site/public/seal.svg` |

**File naming:** `kebab-case-no-numbers` for slugs. Episode images numbered `01-`, `02-` left-padded.

---

## 10. Build & Deploy

```bash
# Develop
cd site
npm install
npm run dev    # localhost:3000

# Build static
npm run build  # produces out/ directory

# Deploy (manual for now; CI later)
# Push to main → GitHub Actions builds → deploys to Pages
```

**GitHub Pages config:** root = `/site`, artifact = `out/`, custom domain = `papersinthewild.io` (target).

---

## 11. Quality Bar (Pre-Ship Checklist)

Every episode blog page MUST pass:

- [ ] Renders correctly at 360px, 768px, 1280px widths
- [ ] Fraunces + Source Serif + IBM Plex Mono all loaded (no fallback flash)
- [ ] Receipt table is readable on mobile (scrolls horizontally if needed)
- [ ] OG image generated, 1200×630
- [ ] All citations resolve (no broken links)
- [ ] Lighthouse score ≥ 95 on Performance, Accessibility, Best Practices, SEO
- [ ] No hype words from BRAND.md anti-voice list
- [ ] Honest Accounting + Try It Yourself sections present
- [ ] Footer prev/next nav correct

---

## 12. When to Update This Document

- **Token change** → update globals.css + tailwind.config.ts + this doc in same commit
- **New component** → add to §4 with full Tailwind classes + usage example
- **Motion rule** → require explicit justification ("we need this because…")
- **Voice change** → goes in BRAND.md, not here

---

*This is a living system. Last updated 2026-08-12.*
