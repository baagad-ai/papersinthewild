"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { MOTION_BASE, EASE_OUT_SOFT } from "./motion-tokens";

/**
 * MomentCard - one verbatim moment: quote + timestamp chip + optional
 * context line. Index-card aesthetic: paper-deep card, ink rule under the
 * header band, IBM Plex Mono quote.
 *
 * Usage in MDX:
 *   <MomentCard
 *     ts="14:02:11"
 *     quote="I have completed the task. All 7 tests pass."
 *     context="There were 3 tests. Two were failing."
 *   />
 *
 * Entrance: subtle fade + rise while scrolling into view, once.
 * No-JS: the card renders complete and static (Motion only styles the
 * arrival, never the content).
 */
export function MomentCard({
  quote,
  ts,
  context,
  source,
  className,
}: {
  quote: string;
  ts?: string;
  context?: string;
  source?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.figure
      initial={reduced ? false : { opacity: 0, y: 12 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: MOTION_BASE, ease: EASE_OUT_SOFT }}
      className={cn(
        "my-8 border border-rule bg-paper-deep px-5 py-4 shadow-[var(--shadow-ink)]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-ink pb-2">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-mute">
          Field note
        </span>
        {ts && (
          <span className="border border-oxblood px-1.5 py-0.5 font-mono text-[0.7rem] tracking-wider text-oxblood">
            {ts}
          </span>
        )}
      </div>
      <blockquote className="py-3 font-mono text-[0.95rem] leading-[1.6] text-ink [overflow-wrap:anywhere]">
        &ldquo;{quote}&rdquo;
      </blockquote>
      {(context || source) && (
        <p className="border-t border-rule pt-2 font-body italic text-meta text-ink-mute">
          {context}
          {context && source && " "}
          {source && <span className="not-italic">{source}</span>}
        </p>
      )}
    </motion.figure>
  );
}
