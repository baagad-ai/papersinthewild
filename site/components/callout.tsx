import { cn } from "@/lib/utils";

/**
 * Callout — versatile callout with semantic variants.
 *
 * The brand requires two sections in every episode:
 *   - "Honest accounting" (caveats, biases, N counts)
 *   - "Try it yourself" (replication steps)
 *
 * Both deserve to be visually distinct from the body without being
 * shouty. Callout is also used for inline notes and asides.
 *
 * Usage in MDX:
 *   <Callout variant="try" label="Try it yourself">
 *     1. Pick a small coding task...
 *     2. Open a fresh Claude Code session...
 *   </Callout>
 *
 *   <Callout variant="honest" label="Honest accounting">
 *     N=2 per cell is small. The direction is clear, the magnitude
 *     has wide error bars.
 *   </Callout>
 *
 * Design: tinted background (very subtle), small mono uppercase label
 * in oxblood, body text. Variants:
 *   - try:      moss-tinted background, "action" feel
 *   - honest:   paper-deep background, "ledger" feel
 *   - warn:     oxblood-tinted background
 *   - info:     paper-deep background, neutral
 */
const variantStyles = {
  try: "bg-[#EDF0E8] border-l-[3px] border-moss",
  honest: "bg-paper-deep border-l-[3px] border-ink-mute",
  warn: "bg-[#F4E0E0] border-l-[3px] border-oxblood",
  info: "bg-paper-deep border-l-[3px] border-rule",
} as const;

const variantLabelColor = {
  try: "text-moss",
  honest: "text-ink-mute",
  warn: "text-oxblood",
  info: "text-ink-mute",
} as const;

export function Callout({
  variant = "info",
  label,
  children,
  className,
}: {
  variant?: "try" | "honest" | "warn" | "info";
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const defaultLabel =
    variant === "try"
      ? "Try it yourself"
      : variant === "honest"
        ? "Honest accounting"
        : variant === "warn"
          ? "Heads up"
          : "Note";

  return (
    <aside
      className={cn(
        "my-10 px-6 py-6 sm:px-7 sm:py-6",
        variantStyles[variant],
        className
      )}
    >
      <div
        className={cn(
          "mb-3 font-mono text-[0.72rem] uppercase tracking-[0.18em]",
          variantLabelColor[variant]
        )}
      >
        {label ?? defaultLabel}
      </div>
      <div className="text-body leading-relaxed text-ink-soft">
        {children}
      </div>
    </aside>
  );
}
