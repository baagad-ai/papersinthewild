import { cn } from "@/lib/utils";

/**
 * PromptBlock - display a verbatim prompt with tone context.
 *
 * Used when the post needs to show the exact wording that triggers
 * a behavior (wasteful) or fixes it (bounded). The reader needs to
 * be able to copy-paste.
 *
 * Usage in MDX:
 *   <PromptBlock label="The wasteful version" tone="bad">
 *     Be absolutely certain. Re-verify your work repeatedly.
 *   </PromptBlock>
 *
 *   <PromptBlock label="The fix (free, identical success rate)" tone="good">
 *     Work efficiently: begin with the failing test and the most
 *     likely implementation files...
 *   </PromptBlock>
 *
 * Design: terminal-paper hybrid. Paper-deep bg, Plex Mono body, small
 * uppercase label. Left bar is oxblood for "bad", moss for "good".
 * Tone is semantic, never decorative.
 */
export function PromptBlock({
  label,
  tone = "neutral",
  children,
  className,
}: {
  label: string;
  tone?: "bad" | "good" | "neutral";
  children: React.ReactNode;
  className?: string;
}) {
  const barColor =
    tone === "bad"
      ? "border-oxblood"
      : tone === "good"
        ? "border-moss"
        : "border-rule";

  const labelText =
    tone === "bad"
      ? "WASTEFUL"
      : tone === "good"
        ? "FIX"
        : "PROMPT";

  return (
    <figure className={cn("my-8", className)}>
      <div className="mb-2 flex items-center gap-2">
        <span
          className={cn(
            "inline-block h-1.5 w-1.5",
            tone === "bad"
              ? "bg-oxblood"
              : tone === "good"
                ? "bg-moss"
                : "bg-rule"
          )}
          aria-hidden
        />
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-mute">
          {labelText}
        </span>
        <span className="font-body italic text-meta text-ink-mute">
          {label}
        </span>
      </div>
      <div
        className={cn(
          "border-l-[3px] bg-paper-deep px-5 py-4 font-mono text-[0.95rem] leading-[1.6] text-ink",
          barColor
        )}
      >
        <pre className="whitespace-pre-wrap [overflow-wrap:anywhere] font-[inherit]">
          {children}
        </pre>
      </div>
    </figure>
  );
}
