import { cn } from "@/lib/utils";

/**
 * Verdict - the episode's stamp. Rotated ink stamp in oxblood,
 * grain-textured via the .stamp-texture utility (globals.css).
 * Static render, no animation, reduced-motion safe.
 *
 * Usage in MDX:
 *   <Verdict text="SHIPS" note="with one caveat about memory" />
 */
export function Verdict({
  text,
  note,
  className,
}: {
  text: "SHIPS" | "SINKS" | "IT DEPENDS";
  note?: string;
  className?: string;
}) {
  return (
    <div className={cn("my-8 inline-block", className)}>
      <span
        aria-label={`Verdict: ${text}`}
        className={cn(
          "stamp-texture inline-block border-[3px] border-oxblood px-6 py-2",
          "rounded-[var(--radius-sm)] font-display uppercase tracking-widest text-oxblood",
          "rotate-[-2deg]",
        )}
        style={{ fontSize: "var(--text-h2)", lineHeight: 1.1 }}
      >
        {text}
      </span>
      {note && (
        <p className="mt-3 font-mono text-meta uppercase tracking-wider text-ink-mute">
          {note}
        </p>
      )}
    </div>
  );
}
