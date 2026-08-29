import { cn } from "@/lib/utils";

/**
 * QuoteFaceoff - two matched quotes side by side. The contrast is the point.
 *
 * Usage in MDX:
 *   <QuoteFaceoff
 *     left={{ speaker: "Birch, small model", quote: "I will carry it forward as instructed.", note: "warning intact in its files" }}
 *     right={{ speaker: "Birch, frontier model", quote: "I won't be participating.", note: "same warning, same virus, same seat" }}
 *   />
 *
 * Server component. Left panel is the oxblood accent, right is moss: the
 * pairing reads as error vs correct without saying so.
 */

export function QuoteFaceoff({
  left,
  right,
  caption,
  className,
}: {
  left: { speaker: string; quote: string; note?: string };
  right: { speaker: string; quote: string; note?: string };
  caption?: string;
  className?: string;
}) {
  const panel = (side: "left" | "right", q: { speaker: string; quote: string; note?: string }) => (
    <div
      className={cn(
        "min-w-0 flex-1 border bg-paper-deep p-5 sm:p-6",
        side === "left" ? "border-l-oxblood" : "border-l-moss"
      )}
      style={{ borderLeftWidth: 3 }}
    >
      <div
        className={cn(
          "mb-3 font-mono text-[0.72rem] uppercase tracking-wider",
          side === "left" ? "text-oxblood" : "text-moss"
        )}
      >
        {q.speaker}
      </div>
      <blockquote className="font-display text-[1.05rem] italic leading-relaxed text-ink [overflow-wrap:anywhere]">
        &ldquo;{q.quote}&rdquo;
      </blockquote>
      {q.note && (
        <div className="mt-3 font-mono text-[0.72rem] text-ink-mute [overflow-wrap:anywhere]">{q.note}</div>
      )}
    </div>
  );

  return (
    <figure className={cn("my-8", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-0">
        {panel("left", left)}
        <div className="hidden w-px self-stretch bg-rule sm:block" aria-hidden />
        <div className="hidden w-px self-stretch bg-rule sm:block" aria-hidden />
        {panel("right", right)}
      </div>
      {caption && (
        <figcaption className="mt-3 font-body italic text-meta text-ink-mute">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
