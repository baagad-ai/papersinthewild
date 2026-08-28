import { cn } from "@/lib/utils";

/**
 * CostMeter - one bar, two truths: the G3-approved estimate as a
 * marker line, the actual spend as the fill. Moss when under
 * budget, oxblood when over (matches DeltaTable semantics).
 * INR-first labels per the money protocol. Server component.
 *
 * Usage in MDX:
 *   <CostMeter estimated={35} actual={41} />
 */
const fmtINR = (n: number, currency: string) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(n);

export function CostMeter({
  estimated,
  actual,
  currency = "INR",
  className,
}: {
  estimated: number;
  actual: number;
  currency?: string;
  className?: string;
}) {
  const over = actual > estimated;
  // Both figures must fit on one track, with headroom for the marker.
  const scale = Math.max(estimated, actual, 0.01) * 1.1;
  const fillPct = Math.min(Math.max((actual / scale) * 100, 0), 100);
  const markPct = Math.min(Math.max((estimated / scale) * 100, 0), 100);

  return (
    <figure className={cn("my-8", className)}>
      <div
        role="img"
        aria-label={`Estimate ${fmtINR(estimated, currency)}, actual ${fmtINR(
          actual,
          currency,
        )}`}
      >
        <div className="mb-2 flex items-baseline justify-between gap-4 font-mono text-meta">
          <span className="uppercase tracking-wider text-ink-mute">
            Estimate {fmtINR(estimated, currency)}
          </span>
          <span className={cn("font-bold", over ? "text-oxblood" : "text-moss")}>
            Actual {fmtINR(actual, currency)}
          </span>
        </div>
        <div className="relative h-[10px] w-full rounded-full bg-rule">
          <div
            className={cn(
              "h-full rounded-full",
              over ? "bg-oxblood" : "bg-moss",
            )}
            style={{ width: `${fillPct}%` }}
          />
          {/* Estimate marker */}
          <div
            className="absolute top-[-4px] bottom-[-4px] w-0 border-l-2 border-dashed border-ink"
            style={{ left: `${markPct}%` }}
            aria-hidden
          />
        </div>
      </div>
      <figcaption className="mt-2 font-body italic text-meta text-ink-mute">
        Dashed line: approved estimate. Bar: what actually happened.
      </figcaption>
    </figure>
  );
}
