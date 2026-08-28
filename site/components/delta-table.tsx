import { cn } from "@/lib/utils";

/**
 * DeltaTable - ReceiptTable variant with embedded estimate-vs-actual bars.
 * The canonical component for "The invoice" (STYLE-GUIDE §12 beat 7).
 *
 * Usage in MDX:
 *   <DeltaTable
 *     rows={[
 *       { label: "Gemini 3 Flash, both arms", estimate: 0.55, actual: 0.33 },
 *       { label: "Claude Haiku 4.5", estimate: 0.50, actual: 0.57 },
 *     ]}
 *     unit="$"
 *     caption="Source: OpenRouter per-call billing"
 *   />
 *
 * Bars are sized relative to the row max. Moss bar (under budget) vs oxblood
 * bar (over). Server component, pure HTML/CSS.
 */

const fmt = (v: number, unit: string) =>
  `${unit}${v === 0 ? "0.00" : v.toFixed(2)}`;

export function DeltaTable({
  rows,
  unit = "$",
  caption,
  className,
}: {
  rows: Array<{ label: string; estimate: number; actual: number }>;
  unit?: string;
  caption?: string;
  className?: string;
}) {
  const max = Math.max(...rows.flatMap((r) => [r.estimate, r.actual]), 0.000001);
  return (
    <figure className={cn("my-8", className)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-mono">
          <thead>
            <tr className="border-y border-rule">
              <th className="py-2 px-3 text-left uppercase text-ink-mute text-[0.75rem] tracking-wider">Run</th>
              <th className="py-2 px-3 text-right uppercase text-ink-mute text-[0.75rem] tracking-wider">Est.</th>
              <th className="py-2 px-3 text-left uppercase text-ink-mute text-[0.75rem] tracking-wider">Actual</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const over = r.actual > r.estimate;
              return (
                <tr key={r.label} className={i % 2 ? "bg-paper-deep" : "bg-paper"}>
                  <td className="py-3 px-3 text-ink">{r.label}</td>
                  <td className="py-3 px-3 text-right text-ink-mute">{fmt(r.estimate, unit)}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="h-[14px] flex-1 border border-rule bg-paper" style={{ maxWidth: 220 }}>
                        <div
                          className="h-full"
                          style={{
                            width: `${(r.actual / max) * 100}%`,
                            background: over ? "var(--oxblood)" : "var(--moss)",
                          }}
                        />
                      </div>
                      <span className={cn("font-bold", over ? "text-oxblood" : "text-moss")}>
                        {fmt(r.actual, unit)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {caption && (
        <figcaption className="mt-3 font-body italic text-meta text-ink-mute">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
