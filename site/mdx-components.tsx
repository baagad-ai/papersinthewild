import type { MDXComponents } from "mdx/types";
import { AgentLine } from "@/components/agent-line";
import { Asker } from "@/components/asker";
import { BigStat } from "@/components/big-stat";
import { Bento, BentoCell } from "@/components/bento";
import { Callout } from "@/components/callout";
import { ChaosList } from "@/components/chaos-list";
import { ChartExplorer } from "@/components/chart-explorer";
import { CostMeter } from "@/components/cost-meter";
import { Cite } from "@/components/cite";
import { CodeBlock } from "@/components/code-block";
import { DeltaTable } from "@/components/delta-table";
import { DropCap } from "@/components/drop-cap";
import { Ep } from "@/components/ep";
import { InkRule } from "@/components/ink-rule";
import { MarginNote } from "@/components/margin-note";
import { Meter } from "@/components/meter";
import { Num } from "@/components/num";
import { Subscribe } from "@/components/subscribe";
import { PromptBlock } from "@/components/prompt-block";
import { ProportionBar } from "@/components/proportion-bar";
import { PullQuote } from "@/components/pull-quote";
import { QuoteFaceoff } from "@/components/quote-faceoff";
import { Reveal } from "@/components/reveal";
import { ReceiptTable } from "@/components/receipt-table";
import { Scene } from "@/components/scene";
import { SectionFolio } from "@/components/section-folio";
import { Sparkline } from "@/components/sparkline";
import { SpreadRing } from "@/components/spread-ring";
import { StepChart } from "@/components/step-chart";
import { Translation } from "@/components/translation";
import { Verdict } from "@/components/verdict";

/**
 * mdx-components - global MDX mapping for App Router.
 * Every element used inside episode MDX files routes through here.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="mt-12 mb-6 font-display text-h1 text-ink">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-16 mb-4 font-display text-h2 text-ink">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-12 mb-3 font-display text-h3 text-ink">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="mb-6 text-body text-ink-soft">{children}</p>
    ),
    a: ({ href, children }) => <Cite href={href ?? "#"}>{children}</Cite>,
    strong: ({ children }) => (
      <strong className="font-semibold text-ink">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="font-display italic">{children}</em>
    ),
    ul: ({ children }) => (
      <ul className="mb-6 list-disc space-y-2 pl-6 text-body text-ink-soft marker:text-oxblood">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-6 list-decimal space-y-2 pl-6 font-mono text-mono text-ink-soft marker:text-oxblood">
        {children}
      </ol>
    ),
    li: ({ children }) => <li>{children}</li>,
    code: ({ children }) => (
      <code className="rounded-sm bg-paper-deep px-1.5 py-0.5 font-mono text-[0.9em] text-ink">
        {children}
      </code>
    ),
    pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
    blockquote: ({ children }) => <PullQuote>{children}</PullQuote>,
    hr: () => <InkRule />,
    // Custom components available inline in MDX (PascalCase):
    Num,
    DropCap,
    PullQuote,
    InkRule,
    Cite,
    Ep,
    CodeBlock,
    ReceiptTable,
    Subscribe, // inline subscribe CTA inside episode MDX
    // Audience-optimised storytelling components (added 2026-08-13):
    BigStat, // punchy display number for key findings
    Scene, // boxed analogy / story scene for non-technical readers
    PromptBlock, // verbatim prompt display with tone (bad / good / neutral)
    Callout, // semantic callout (try / honest / warn / info)
    Translation, // visual 4-step translation ladder for technical terms
    AgentLine, // AI character quote (real agent output rendered as dialogue)
    // Data visualization components (added 2026-08-19, per STYLE-GUIDE 12b discipline):
    StepChart, // multi-series step line chart (infection curves)
    SpreadRing, // interactive ring map with round scrubber (client)
    QuoteFaceoff, // two matched quotes side by side (the contrast is the point)
    DeltaTable, // estimate vs actual with embedded bars (The invoice)
    ProportionBar, // single stacked bar for splits (88% vs 12%)
    Sparkline, // inline trend inside a sentence
    // Fun-scroller layer (BLOG-FLOW.md, added 2026-08-19):
    Reveal, // scroll-arrival wrapper for major figures (reduced-motion safe)
    ChartExplorer, // StepChart + clickable legend to isolate runs (client)
    // Design-system overhaul layer (added 2026-08-25):
    Bento, // invisible bento grid container (folio / cinema / ledger / zine presets)
    BentoCell, // explicit-span cell inside a Bento grid
    Meter, // single-value horizontal gauge with tick labels
    Verdict, // rotated ink stamp: SHIPS / SINKS / IT DEPENDS
    ChaosList, // scattered quote cards, taped to the wall
    CostMeter, // estimate marker vs actual spend bar, INR-first
    Asker, // reader poll as a prefilled mailto (client)
    MarginNote, // floating margin whisper (float-right desktop, aside mobile)
    SectionFolio, // ghost outlined section numeral
    ...components,
  };
}

