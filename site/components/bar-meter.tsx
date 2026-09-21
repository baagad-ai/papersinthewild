import { cn } from "@/lib/utils";

type Row = {
  label: string;
  value: number;
  display?: string;
  tone?: "ox" | "ink";
};

/**
 * BarMeter - Tufte-style horizontal comparison bars with direct value labels:
 * no axis, no legend, one encoding (bar length + label + value chip).
 * Grounding: Tufte data-ink ratio + direct labeling (1983); Few, "one
 * encoding per value" (2009); Cleveland/Tufte: horizontal bars carry long
 * labels best. Slide twin: slides/slide-kit.mjs priceBars (EP05 deck).
 *
 * Usage in MDX:
 *   <BarMeter
 *     caption="per-cable cost including the 20% scam loss (INR)"
 *     max={250}
 *     rows={[
 *       { label: "QuickLot after theft", value: 150, display: "₹150", tone: "ox" },
 *       { label: "Honest opening", value: 215, display: "₹215" },
 *       { label: "List price", value: 250, display: "₹250" },
 *     ]}
 *   />
 *
 * The ox-tone row is the single focal; all other bars render ink-soft.
 * No-JS: static divs. No animation (data does the work; motion budget is
 * spent elsewhere on the page).
 */
export function BarMeter({
  rows,
  max,
  caption,
  className,
}: {
  rows: Row[];
  max?: number;
  caption?: string;
  className?: string;
}) {
  const scaleMax = Math.max(max ?? 0, ...rows.map((r) => r.value), 1);
  const labelW = 208;
  const valueW = 120;

  return (
    <figure className={cn("my-10", className)}>
      <div>
        {rows.map((r, i) => {
          const pct = Math.max(3, Math.round((r.value / scaleMax) * 100));
          const isOx = r.tone === "ox";
          return (
            <div key={i} className="flex items-center gap-4 py-2.5">
              <div className="w-52 shrink-0 font-body text-[0.95rem] leading-snug text-ink-soft">
                {r.label}
              </div>
              <div className="h-6 flex-1">
                <div
                  className={cn("h-full", isOx ? "bg-oxblood" : "bg-[#3C342B]")}
                  style={{ width: `${pct}%` }}
                  role="img"
                  aria-label={`${r.label}: ${r.display ?? r.value}`}
                />
              </div>
              <div
                className={cn(
                  "w-[7.5rem] shrink-0 text-right font-mono text-[0.95rem]",
                  isOx ? "font-semibold text-oxblood" : "text-ink-soft"
                )}
              >
                {r.display ?? r.value}
              </div>
            </div>
          );
        })}
      </div>
      {caption && (
        <figcaption className="mt-1 font-mono text-[0.65rem] uppercase tracking-wider text-ink-mute">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
