import { cn } from "@/lib/utils";

/**
 * IncidentCard - one spectacular world moment, forensic framing (v5.1 World
 * tier). The card reads like an evidence bag: incident number, world-day chip,
 * the verbatim quote in mono, and the receipt line (number + household twin).
 *
 * Usage in MDX:
 *   <IncidentCard
 *     n={3}
 *     day="Day 4"
 *     who="Chef Mira, running on phi4-mini"
 *     quote="I could not find the dough step, so I skipped it."
 *     receipt="3 of 5 orders wrong that day, which is most of a dinner rush"
 *     source="events-r1.jsonl #41"
 *   />
 *
 * Server component: static markup only, no JS, no motion. The moment is the
 * design; evidence does not animate.
 */
export function IncidentCard({
  n,
  day,
  who,
  quote,
  receipt,
  source,
  className,
}: {
  n?: number;
  day?: string;
  who?: string;
  quote: string;
  receipt?: string;
  source?: string;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "my-8 border-l-[3px] border-oxblood border-y border-r border-rule bg-paper-deep px-5 py-4",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rule pb-2">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-oxblood">
          Incident{n !== undefined ? ` Nº ${String(n).padStart(2, "0")}` : ""}
        </span>
        {day && (
          <span className="border border-oxblood px-1.5 py-0.5 font-mono text-[0.7rem] tracking-wider text-oxblood">
            {day}
          </span>
        )}
      </div>
      <blockquote className="py-3 font-mono text-[0.95rem] leading-[1.6] text-ink [overflow-wrap:anywhere]">
        &ldquo;{quote}&rdquo;
      </blockquote>
      {(who || receipt || source) && (
        <figcaption className="space-y-1 border-t border-rule pt-2 font-body text-meta text-ink-mute">
          {who && <div className="not-italic">{who}</div>}
          {receipt && <div className="italic text-ink-soft">{receipt}</div>}
          {source && <div className="font-mono not-italic text-[0.7rem]">{source}</div>}
        </figcaption>
      )}
    </figure>
  );
}
