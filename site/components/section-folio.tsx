import { cn } from "@/lib/utils";

/**
 * SectionFolio - ghost section numeral for long episodes.
 * Outlined display numeral (transparent fill, rule-color stroke),
 * aria-hidden because it is decoration, not structure.
 * Static, no motion, reduced-motion safe.
 *
 * Usage in MDX:
 *   <SectionFolio n={2} label="the setup" />
 */
export function SectionFolio({
  n,
  label,
  className,
}: {
  n: number | string;
  label?: string;
  className?: string;
}) {
  return (
    <div aria-hidden className={cn("my-10 select-none", className)}>
      <span
        className="block font-display"
        style={{
          fontSize: "clamp(4rem, 12vw, 8rem)",
          lineHeight: 1,
          color: "transparent",
          WebkitTextStroke: "1px var(--rule)",
          opacity: 0.6,
        }}
      >
        {n}
      </span>
      {label && (
        <span className="mt-1 block font-mono text-meta uppercase tracking-widest text-ink-mute">
          {label}
        </span>
      )}
    </div>
  );
}
