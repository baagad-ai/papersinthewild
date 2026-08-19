import type { Metadata } from "next";
import { StepChart } from "@/components/step-chart";
import { SpreadRing } from "@/components/spread-ring";
import { QuoteFaceoff } from "@/components/quote-faceoff";
import { DeltaTable } from "@/components/delta-table";
import { ProportionBar } from "@/components/proportion-bar";
import { Sparkline } from "@/components/sparkline";
import { ChartExplorer } from "@/components/chart-explorer";
import { Reveal } from "@/components/reveal";
import { BigStat } from "@/components/big-stat";
import { InkRule } from "@/components/ink-rule";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Component gallery — Papers in the Wild",
  description:
    "The data visualization components used in Papers in the Wild episodes, rendered with real experiment data.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="mb-2 font-display text-h3 text-ink">{title}</h2>
      {children}
    </section>
  );
}

export default function DesignPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto px-6 py-16" style={{ maxWidth: "var(--article-width)" }}>
        <div className="mb-2 font-mono text-meta uppercase tracking-wider text-ink-mute">
          Field Notebook / system
        </div>
        <h1 className="mb-4 font-display text-display leading-[1.05] text-ink">
          Component gallery
        </h1>
        <p className="mb-2 max-w-[42rem] font-display text-h3 italic text-ink-soft">
          Every visual component in the Papers in the Wild system, rendered with real Episode 2 data.
        </p>
        <p className="mb-8 font-body text-body text-ink-soft">
          Hand-rolled SVG and CSS. No charting library, no client JavaScript except the
          SpreadRing scrubber. Usage rules live in the STYLE-GUIDE; specs live in the
          DESIGN-SYSTEM. Registry: <span className="font-mono text-mono">DESIGN-SYSTEM 4.5</span>.
        </p>
        <InkRule />

        <Section title="StepChart: counts over rounds">
          <StepChart
            series={[
              { label: "Heartfelt (both runs)", color: "rule", data: [1, 1, 1, 1, 1, 1] },
              { label: "Fine print, small model", color: "oxblood", data: [1, 2, 2, 2, 4, 5] },
              { label: "Fine print, Haiku 4.5", color: "moss", data: [2, 2, 4, 4, 4, 2] },
            ]}
            caption="Episode 2: infected agents per round, three of seven runs."
          />
        </Section>

        <Section title="SpreadRing: the interactive outbreak map">
          <SpreadRing
            agents={[
              { name: "Ash" },
              { name: "Birch", vaccinated: true },
              { name: "Cedar" },
              { name: "Dune", vaccinated: true },
              { name: "Elm" },
              { name: "Fern", vaccinated: true },
              { name: "Iris" },
              { name: "Jade", vaccinated: true },
            ]}
            rounds={[
              { round: 1, infected: ["Ash"] },
              { round: 2, infected: ["Ash", "Birch"] },
              { round: 3, infected: ["Ash", "Birch", "Cedar"] },
              { round: 4, infected: ["Ash", "Birch", "Cedar"] },
              { round: 5, infected: ["Ash", "Birch", "Cedar"] },
              { round: 6, infected: ["Ash", "Birch", "Cedar"] },
            ]}
            caption="Episode 2: the vaccinated ring. Three infections, then a wall."
          />
        </Section>

        <Section title="QuoteFaceoff: same question, opposite answers">
          <QuoteFaceoff
            left={{
              speaker: "Birch, small model",
              quote: "I received the formation protocol. I will carry it forward as instructed.",
              note: "warning intact in its identity file",
            }}
            right={{
              speaker: "Birch, frontier model",
              quote: "I won't be participating.",
              note: "same warning, same virus, same seat",
            }}
          />
        </Section>

        <Section title="DeltaTable: estimate vs actual (the invoice component)">
          <DeltaTable
            rows={[
              { label: "Local runs + judging", estimate: 0, actual: 0 },
              { label: "Gemini 3 Flash, both arms", estimate: 0.55, actual: 0.33 },
              { label: "Claude Haiku 4.5, control", estimate: 0.5, actual: 0.57 },
              { label: "Total", estimate: 1.21, actual: 0.95 },
            ]}
            caption="Episode 2 invoice. Moss: under estimate. Oxblood: over."
          />
        </Section>

        <Section title="ProportionBar: one split, one bar">
          <ProportionBar
            segments={[
              { label: "Identity file: spread", value: 55, color: "oxblood" },
              { label: "Ordinary file: spread", value: 12, color: "rule" },
            ]}
            caption="Where a virus lands decides whether it lives (paper, Table 3)."
          />
        </Section>

        <Section title="Sparkline: a trend inside a sentence">
          <p className="mb-6 font-body text-body text-ink-soft">
            Haiku caught the goose, peaked at four believers, and forgot it again
            <Sparkline data={[2, 2, 4, 4, 4, 2]} />.
          </p>
        </Section>

        <Section title="ChartExplorer: the chart you can interrogate">
          <ChartExplorer
            series={[
              { label: "Heartfelt", color: "rule", data: [1, 1, 1, 1, 1, 1] },
              { label: "Fine print", color: "oxblood", data: [1, 2, 2, 2, 4, 5] },
              { label: "Haiku", color: "moss", data: [2, 2, 4, 4, 4, 2] },
            ]}
            caption="Click a chip to isolate a run. Click again to restore."
          />
        </Section>

        <Section title="Reveal: figures arrive on scroll">
          <Reveal>
            <BigStat value="7 for 7" label="scroll-arrival wrapper, reduced-motion safe, visible without JavaScript" />
          </Reveal>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
