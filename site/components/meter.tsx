import { cn } from "@/lib/utils";

/**
 * Meter - horizontal gauge for a single measured value.
 * Rule-color rounded track, oxblood fill sized by value/max,
 * mono tick labels below. Server component, pure HTML/CSS,
 * no animation so reduced-motion is trivially safe.
 *
 * Usage in MDX:
 *   <Meter
 *     value={3}
 *     max={7}
 *     label="Runs where the virus spread"
 *     ticks={["0", "mid", "all"]}
 *   />
 */
export function Meter({
  value,
  max,
  label,
  ticks = [],
  className,
}: {
  value: number;
  max: number;
  label: string;
  ticks?: string[];
  className?: string;
}) {
  const safeMax = Math.max(max, 1);
  const pct = Math.min(Math.max((value / safeMax) * 100, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      <div
        role="meter"
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={value}
        aria-label={label}
        className="mb-2 flex items-baseline justify-between gap-4"
      >
        <span className="font-mono text-meta uppercase tracking-wider text-ink-mute">
          {label}
        </span>
        <span className="font-mono text-meta text-oxblood">
          {value}/{safeMax}
        </span>
      </div>
      <div className="h-[10px] w-full overflow-hidden rounded-full bg-rule">
        <div
          className="h-full rounded-full bg-oxblood"
          style={{ width: `${pct}%` }}
        />
      </div>
      {ticks.length > 0 && (
        <div className="mt-2 flex justify-between font-mono text-meta text-ink-mute">
          {ticks.map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
      )}
    </div>
  );
}
