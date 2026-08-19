import { cn } from "@/lib/utils";

/**
 * ProportionBar — single stacked horizontal bar for splits (88% vs 12%).
 *
 * Usage in MDX:
 *   <ProportionBar
 *     segments={[
 *     { label: "Identity file", value: 88, color: "oxblood" },
 *     { label: "Ordinary file", value: 12, color: "rule" },
 *   ]}
 *     caption="Infection rate by file type (paper, Table 3)"
 *   />
 *
 * Server component, pure HTML/CSS (no SVG needed). Labels also render as text
 * below the bar so the split survives without styles.
 */

const FILL: Record<string, string> = {
  oxblood: "var(--oxblood)",
  moss: "var(--moss)",
  rule: "var(--rule)",
  ink: "var(--ink)",
};

export function ProportionBar({
  segments,
  caption,
  className,
}: {
  segments: Array<{ label: string; value: number; color?: "oxblood" | "moss" | "rule" | "ink" }>;
  caption?: string;
  className?: string;
}) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  return (
    <figure className={cn("my-8", className)}>
      <div
        role="img"
        aria-label={segments.map((s) => `${s.label} ${Math.round((s.value / total) * 100)}%`).join(", ")}
        className="flex h-10 w-full overflow-hidden border border-rule"
      >
        {segments.map((s) => (
          <div
            key={s.label}
            className="flex items-center justify-center transition-[flex-grow]"
            style={{
              flexGrow: s.value,
              background: FILL[s.color ?? (s === segments[0] ? "oxblood" : "rule")],
              minWidth: 2,
            }}
          >
            {s.value / total >= 0.14 && (
              <span
                className="px-1 font-mono text-[0.8rem] font-medium"
                style={{
                  color: s.color === "rule" || s.color === "ink" ? "var(--ink)" : "var(--paper)",
                }}
              >
                {Math.round((s.value / total) * 100)}%
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
        {segments.map((s) => (
          <span key={s.label} className="flex items-center gap-2 font-mono text-[0.78rem] text-ink-soft">
            <span
              aria-hidden
              className="inline-block h-3 w-3 border border-rule"
              style={{ background: FILL[s.color ?? (s === segments[0] ? "oxblood" : "rule")] }}
            />
            {s.label}
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
