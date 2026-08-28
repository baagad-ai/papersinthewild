"use client";

import { useState } from "react";
import { StepChart, type ChartSeries } from "@/components/step-chart";
import { cn } from "@/lib/utils";

/**
 * ChartExplorer - StepChart plus a clickable legend: click a run chip to
 * isolate it, click again to restore all. The light interaction for the
 * chart-of-record moment (BLOG-FLOW.md interaction budget: light tier).
 *
 * Usage in MDX: identical props to StepChart.
 *   <ChartExplorer series={[...]} caption="..." />
 */
export function ChartExplorer({
  series,
  caption,
  yMax,
  xLabel,
  className,
}: {
  series: ChartSeries[];
  caption?: string;
  yMax?: number;
  xLabel?: string;
  className?: string;
}) {
  const [isolated, setIsolated] = useState<string | null>(null);
  const shown = isolated ? series.filter((s) => s.label === isolated) : series;

  return (
    <figure className={cn("my-8", className)}>
      <div className="mb-4 flex flex-wrap gap-2">
        {series.map((s) => {
          const active = isolated === null || isolated === s.label;
          return (
            <button
              key={s.label}
              type="button"
              aria-pressed={isolated === s.label}
              onClick={() => setIsolated((prev) => (prev === s.label ? null : s.label))}
              className={cn(
                "border px-3 py-1.5 font-mono text-[0.75rem] uppercase tracking-wider transition-colors",
                isolated === s.label
                  ? "border-oxblood bg-oxblood text-paper"
                  : active
                    ? "border-rule bg-paper text-ink-soft hover:border-ink-mute"
                    : "border-rule bg-paper-deep text-ink-mute hover:border-ink-mute"
              )}
            >
              {s.label}
            </button>
          );
        })}
      </div>
      <StepChart series={shown} caption={caption} yMax={yMax} xLabel={xLabel} className="my-0" />
      <figcaption className="mt-3 font-body text-[0.8rem] text-ink-mute">
        Click a run to isolate it. Click again to compare all.
      </figcaption>
    </figure>
  );
}
