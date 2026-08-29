"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { MOTION_BASE, EASE_OUT_SOFT } from "./motion-tokens";

/**
 * ChronicleTimeline - the world's days as a scroll spine (v5.1 World tier).
 * A horizontal rail of day nodes (incidents pinned in oxblood); selecting a
 * day opens the readout panel: title + detail + optional verbatim quote.
 * The story's spine made navigable; the scrollytelling alternative to
 * StickyStep when the world has too many days for steps.
 *
 * Usage in MDX:
 *   <ChronicleTimeline
 *     caption="The kitchen's week"
 *     days={[
 *       { day: "D1", title: "The kitchen opens", detail: "Five kitchens, five complete recipe books." },
 *       { day: "D3", title: "The first baseless pizza", detail: "Mira's kitchen serves it anyway.", quote: "I could not find the dough step.", kind: "incident" },
 *     ]}
 *   />
 *
 * No-JS: every day, title and detail is in the HTML (the rail stacks
 * vertically); selection only emphasizes. prefers-reduced-motion: no stagger.
 */
export function ChronicleTimeline({
  days,
  caption,
  className,
}: {
  days: {
    day: string;
    title: string;
    detail?: string;
    quote?: string;
    kind?: "incident" | "day";
  }[];
  caption?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const current = days[Math.min(active, days.length - 1)];

  return (
    <figure className={cn("my-8", className)}>
      <div className="relative">
        <div aria-hidden className="absolute left-0 right-0 top-[5px] hidden h-px bg-rule sm:block" />
        <ol className="relative flex flex-col gap-4 sm:flex-row sm:gap-0">
          {days.map((d, i) => (
            <motion.li
              key={`${d.day}-${i}`}
              className="min-w-0 flex-1"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: MOTION_BASE, ease: EASE_OUT_SOFT, delay: reduced ? 0 : i * 0.06 }}
            >
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className="group flex w-full items-start gap-3 text-left sm:flex-col sm:gap-2 sm:pr-4"
              >
                <span
                  aria-hidden
                  className={cn(
                    "mt-[3px] inline-block h-[11px] w-[11px] shrink-0 border transition-colors duration-[var(--motion-fast)]",
                    d.kind === "incident" ? "rotate-45 rounded-none" : "rounded-full",
                    active === i
                      ? "border-oxblood bg-oxblood"
                      : "border-ink-mute bg-paper group-hover:border-oxblood"
                  )}
                />
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block font-mono text-[0.7rem] uppercase tracking-wider",
                      d.kind === "incident" ? "text-oxblood" : "text-ink-mute"
                    )}
                  >
                    {d.day}
                  </span>
                  <span
                    className={cn(
                      "block font-display text-body leading-snug transition-colors duration-[var(--motion-fast)]",
                      active === i ? "text-oxblood" : "text-ink group-hover:text-oxblood"
                    )}
                  >
                    {d.title}
                  </span>
                </span>
              </button>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* readout panel */}
      {current && (
        <div className="mt-5 border border-rule bg-paper-deep px-4 py-3">
          <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-mute">
            {current.day} {current.kind === "incident" ? "· incident" : ""}
          </div>
          <div className="mt-1 font-display text-h3 text-ink">{current.title}</div>
          {current.detail && (
            <p className="mt-1.5 font-body text-body text-ink-soft">{current.detail}</p>
          )}
          {current.quote && (
            <blockquote className="mt-2 border-l-[3px] border-oxblood pl-3 font-mono text-[0.9rem] leading-[1.6] text-ink">
              &ldquo;{current.quote}&rdquo;
            </blockquote>
          )}
        </div>
      )}

      {caption && (
        <figcaption className="mt-2 font-mono text-meta uppercase tracking-wider text-ink-mute">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
