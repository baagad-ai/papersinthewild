import { cn } from "@/lib/utils";

/**
 * StepChart - multi-series step line chart (hand-rolled SVG, server component).
 *
 * Usage in MDX:
 *   <StepChart
 *     series={[
 *       { label: "Heartfelt", color: "rule", data: [1,1,1,1,1,1] },
 *       { label: "Fine print", color: "oxblood", data: [1,2,2,2,4,5] },
 *     ]}
 *     caption="Infected agents per round"
 *   />
 *
 * Values are discrete counts, so lines are step-after (horizontal then vertical).
 * Zero client JS: pure build-time SVG. Accessibility: each series is also listed
 * in a text legend, and the caption carries the source.
 */

type ColorToken = "oxblood" | "moss" | "rule" | "ink";

const STROKE: Record<ColorToken, string> = {
  oxblood: "var(--oxblood)",
  moss: "var(--moss)",
  rule: "var(--rule)",
  ink: "var(--ink)",
};

export type ChartSeries = {
  label: string;
  color: ColorToken;
  data: number[];
  dashed?: boolean;
};

export function StepChart({
  series,
  caption,
  yMax,
  xLabel = "Round",
  className,
}: {
  series: ChartSeries[];
  caption?: string;
  yMax?: number;
  xLabel?: string;
  className?: string;
}) {
  const W = 640;
  const H = 320;
  const PAD = { top: 16, right: 16, bottom: 40, left: 40 };
  const iw = W - PAD.left - PAD.right;
  const ih = H - PAD.top - PAD.bottom;

  const rounds = Math.max(...series.map((s) => s.data.length));
  const maxVal = yMax ?? Math.max(...series.flatMap((s) => s.data), 1);
  const x = (i: number) => PAD.left + (rounds <= 1 ? 0 : (i / (rounds - 1)) * iw);
  const y = (v: number) => PAD.top + ih - (v / maxVal) * ih;

  // step-after path: horizontal to next x, then vertical
  const stepPath = (data: number[]) =>
    data
      .map((v, i) => {
        if (i === 0) return `M ${x(i)} ${y(v)}`;
        return `H ${x(i)} V ${y(v)}`;
      })
      .join(" ");

  const yTicks = Array.from({ length: maxVal + 1 }, (_, v) => v).filter(
    (v) => maxVal <= 8 || v % Math.ceil(maxVal / 6) === 0
  );

  return (
    <figure className={cn("my-8", className)}>
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={
            caption ??
            `Step chart: ${series.map((s) => `${s.label} ${s.data.join(", ")}`).join("; ")}`
          }
          className="h-auto w-full min-w-[480px]"
        >
          {/* gridlines + y ticks */}
          {yTicks.map((v) => (
            <g key={v}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={y(v)}
                y2={y(v)}
                stroke="var(--rule)"
                strokeWidth={v === 0 ? 1.5 : 0.5}
                strokeDasharray={v === 0 ? undefined : "2 4"}
              />
              <text
                x={PAD.left - 8}
                y={y(v) + 4}
                textAnchor="end"
                className="fill-ink-mute"
                style={{ font: "400 12px var(--font-mono)" }}
              >
                {v}
              </text>
            </g>
          ))}
          {/* x ticks */}
          {series[0]?.data.map((_, i) => (
            <text
              key={i}
              x={x(i)}
              y={H - PAD.bottom + 18}
              textAnchor="middle"
              className="fill-ink-mute"
              style={{ font: "400 12px var(--font-mono)" }}
            >
              {i + 1}
            </text>
          ))}
          <text
            x={PAD.left + iw / 2}
            y={H - 6}
            textAnchor="middle"
            className="fill-ink-mute"
            style={{ font: "400 11px var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em" }}
          >
            {xLabel}
          </text>
          {/* series */}
          {series.map((s) => (
            <g key={s.label}>
              <path
                d={stepPath(s.data)}
                fill="none"
                stroke={STROKE[s.color]}
                strokeWidth={s.color === "rule" ? 1.5 : 2.5}
                strokeDasharray={s.dashed ? "5 4" : undefined}
                strokeLinejoin="round"
              />
              {s.data.map((v, i) => (
                <circle
                  key={i}
                  cx={x(i)}
                  cy={y(v)}
                  r={2.5}
                  fill={s.color === "rule" ? "var(--paper)" : STROKE[s.color]}
                  stroke={STROKE[s.color]}
                  strokeWidth={1.5}
                />
              ))}
            </g>
          ))}
        </svg>
      </div>
      {/* text legend (also the no-JS / screen-reader story) */}
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
        {series.map((s) => (
          <span key={s.label} className="flex items-center gap-2 font-mono text-[0.78rem] text-ink-soft">
            <span
              aria-hidden
              className="inline-block h-[3px] w-5"
              style={{ background: STROKE[s.color] }}
            />
            {s.label}: {s.data.join(" → ")}
          </span>
        ))}
      </div>
      {caption && (
        <figcaption className="mt-3 font-body italic text-meta text-ink-mute">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
