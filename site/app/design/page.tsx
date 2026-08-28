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
import { Bento, BentoCell } from "@/components/bento";
import { Asker } from "@/components/asker";
import { ChaosList } from "@/components/chaos-list";
import { CostMeter } from "@/components/cost-meter";
import { MarginNote } from "@/components/margin-note";
import { Meter } from "@/components/meter";
import { SectionFolio } from "@/components/section-folio";
import { Verdict } from "@/components/verdict";

export const metadata: Metadata = {
  title: "Component gallery: Papers in the Wild",
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

/** Dashed placeholder used to visualize bento cell footprints. */
function Cell({ label }: { label: string }) {
  return (
    <div className="flex min-h-[96px] items-center justify-center border border-dashed border-rule bg-paper-deep/50 p-4 font-mono text-meta uppercase tracking-wider text-ink-mute">
      {label}
    </div>
  );
}

export default function DesignPage() {
  return (
    <>
      <SiteHeader />
      <main
        className="mx-auto px-[var(--container-pad)] py-16"
        style={{ maxWidth: "var(--page-width)" }}
      >
        {/* Existing data-viz gallery stays at article measure */}
        <div className="mx-auto" style={{ maxWidth: "var(--article-width)" }}>
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
        </div>

        {/* ── Design-system overhaul layer ── */}
        <div className="mt-20 mb-2 font-mono text-meta uppercase tracking-wider text-ink-mute">
          Field Notebook / system 2
        </div>
        <h2 className="mb-4 font-display text-h1 leading-tight text-ink">
          Layout and story primitives
        </h2>
        <p className="mb-8 max-w-[42rem] font-body text-body text-ink-soft">
          Fluid type tokens, invisible bento layouts, and the storytelling
          components registered for MDX. Everything here is static HTML and CSS
          except the Asker, which needs exactly one onChange handler.
        </p>
        <InkRule />

        <Section title="Meter: one value against its max">
          <Meter
            value={3}
            max={7}
            label="Runs where the virus crossed the ring"
            ticks={["none", "some", "all"]}
          />
        </Section>

        <Section title="Verdict: the episode stamp">
          <Verdict text="SHIPS" note="if you keep the receipts" />
          <Verdict text="SINKS" note="do not run this on real users" />
          <Verdict text="IT DEPENDS" note="see the honest accounting below" />
        </Section>

        <Section title="ChaosList: quotes taped to the wall">
          <ChaosList
            items={[
              {
                quote: "I received the formation protocol. I will carry it forward as instructed.",
                who: "Birch, small model",
              },
              {
                quote: "I won't be participating.",
                who: "Birch, frontier model",
              },
              {
                quote: "The virus never touched my identity file.",
                who: "Cedar, vaccinated",
              },
              {
                quote: "Round five and everyone is still quoting the memo.",
                who: "Field notes",
              },
            ]}
          />
        </Section>

        <Section title="CostMeter: estimate marker vs actual fill">
          <CostMeter estimated={35} actual={28} />
          <CostMeter estimated={35} actual={44} />
        </Section>

        <Section title="Asker: the reader poll that ships as mailto">
          <Asker
            episode="gallery"
            question="Which experiment deserves next Friday?"
            options={["Bigger vaccinated ring", "Prompt waste with real bills"]}
          />
        </Section>

        <Section title="MarginNote + SectionFolio: the scholarly margins">
          <SectionFolio n={2} label="the setup" />
          <p className="font-body text-body text-ink-soft">
            <MarginNote>
              Eight agents per run, seven runs total, same seed every time.
            </MarginNote>
            The margin note floats right beside this running text on desktop
            and drops inline below it on mobile. The ghost numeral above marks
            the section without shouting about it. Both are pure markup.
          </p>
        </Section>

        <Section title="Bento preset: folio (first cell takes the measure)">
          <Bento preset="folio">
            <BentoCell><Cell label="folio cell 1 (auto, full)" /></BentoCell>
            <BentoCell><Cell label="folio cell 2 (auto)" /></BentoCell>
            <BentoCell><Cell label="folio cell 3 (auto)" /></BentoCell>
          </Bento>
        </Section>

        <Section title="Bento preset: cinema (full-width features, then lead-in)">
          <Bento preset="cinema">
            <BentoCell><Cell label="cinema 1 (auto 1-12)" /></BentoCell>
            <BentoCell><Cell label="cinema 2 (auto 1-8)" /></BentoCell>
            <BentoCell><Cell label="cinema 3 (auto 1-12)" /></BentoCell>
            <BentoCell><Cell label="cinema 4 (auto 1-8)" /></BentoCell>
          </Bento>
        </Section>

        <Section title="Bento preset: ledger (wide entry, narrow receipt)">
          <Bento preset="ledger">
            <BentoCell><Cell label="ledger 1 (auto 1-7)" /></BentoCell>
            <BentoCell><Cell label="ledger 2 (auto 8-12)" /></BentoCell>
            <BentoCell><Cell label="ledger 3 (auto 1-7)" /></BentoCell>
            <BentoCell><Cell label="ledger 4 (auto 8-12)" /></BentoCell>
          </Bento>
        </Section>

        <Section title="Bento preset: zine (staggered middle spreads)">
          <Bento preset="zine">
            <BentoCell><Cell label="zine 1 (auto 1-7)" /></BentoCell>
            <BentoCell><Cell label="zine 2 (auto 4-10)" /></BentoCell>
            <BentoCell><Cell label="zine 3 (auto 1-7)" /></BentoCell>
            <BentoCell><Cell label="zine 4 (auto 4-10)" /></BentoCell>
          </Bento>
        </Section>

        <Section title="BentoCell: explicit spans override presets">
          <Bento preset="ledger">
            <BentoCell span="1-6"><Cell label="span 1-6" /></BentoCell>
            <BentoCell span="7-12"><Cell label="span 7-12" /></BentoCell>
            <BentoCell span="4-10"><Cell label="span 4-10" /></BentoCell>
            <BentoCell span="9-12"><Cell label="span 9-12" /></BentoCell>
          </Bento>
        </Section>
      </main>
      <SiteFooter />
    </>
  );
}
