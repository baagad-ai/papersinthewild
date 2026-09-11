"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { MOTION_BASE, EASE_OUT_SOFT } from "./motion-tokens";

/**
 * ChronicleTimeline - the world's days as a scrubber (v5.1 World tier).
 * A horizontal rail of compact, fixed-width day chips (scroll-snap, never
 * overlapping no matter how many days); selecting a chip opens the readout
 * panel: title + detail + optional verbatim quote. Prev/next arrows walk
 * the season. Built for 12+ days; the rail scrolls, chips never squeeze.
 *
 * Usage in MDX:
 *   <ChronicleTimeline
 *     caption="The street's month"
 *     days={[
 *       { day: "Day 1", title: "The street opens", detail: "..." },
 *       { day: "Day 9", title: "Rain spell", detail: "...", kind: "incident" },
 *     ]}
 *   />
 *
 * No-JS: a <noscript> block renders every day stacked with full details.
 * prefers-reduced-motion: no stagger.
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
  const railRef = useRef<HTMLOListElement>(null);
  const current = days[Math.min(active, days.length - 1)];

  // keep the active chip in view when selection changes (incl. prev/next)
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const chip = rail.children[active] as HTMLElement | undefined;
    if (chip) {
      chip.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest", inline: "center" });
    }
  }, [active, reduced]);

  return (
    <figure className={cn("my-8", className)}>
      {/* day chip rail: fixed-width chips in a scroll-snap strip */}
      <ol
        ref={railRef}
        className="relative -mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-2"
        aria-label="Season days; pick one to read what happened"
      >
        {days.map((d, i) => (
          <li key={`${d.day}-${i}`} className="snap-start shrink-0">
            <motion.button
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={active === i}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: MOTION_BASE, ease: EASE_OUT_SOFT, delay: reduced ? 0 : Math.min(i, 8) * 0.04 }}
              className={cn(
                "flex w-[104px] flex-col gap-1.5 border p-2.5 text-left transition-colors duration-[var(--motion-fast)]",
                active === i
                  ? "border-oxblood bg-oxblood text-paper"
                  : "border-rule bg-paper-deep hover:border-oxblood"
              )}
            >
              <span className="flex items-center justify-between">
                <span
                  className={cn(
                    "font-mono text-[0.7rem] uppercase tracking-wider",
                    active === i ? "text-paper/85" : d.kind === "incident" ? "text-oxblood" : "text-ink-mute"
                  )}
                >
                  {d.day}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "inline-block h-[7px] w-[7px] shrink-0",
                    d.kind === "incident" ? "rotate-45" : "rounded-full",
                    active === i
                      ? "bg-paper"
                      : d.kind === "incident"
                        ? "bg-oxblood"
                        : "border border-ink-mute bg-transparent"
                  )}
                />
              </span>
              <span
                className={cn(
                  "line-clamp-2 font-display text-[0.8rem] leading-[1.25]",
                  active === i ? "text-paper" : "text-ink"
                )}
              >
                {d.title}
              </span>
            </motion.button>
          </li>
        ))}
      </ol>

      {/* readout panel */}
      {current && (
        <div className="mt-3 border border-rule bg-paper-deep">
          <div className="flex items-center justify-between border-b border-rule px-4 py-2">
            <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-mute">
              {current.day}
              {current.kind === "incident" ? " · incident" : ""}
              <span className="ml-2 text-ink-mute/70">
                {String(active + 1).padStart(2, "0")}/{days.length}
              </span>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setActive((a) => Math.max(0, a - 1))}
                disabled={active === 0}
                aria-label="Previous day"
                className="border border-rule px-2 py-0.5 font-mono text-[0.7rem] text-ink transition-colors duration-[var(--motion-fast)] hover:border-oxblood hover:text-oxblood disabled:opacity-30 disabled:hover:border-rule disabled:hover:text-ink"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => setActive((a) => Math.min(days.length - 1, a + 1))}
                disabled={active === days.length - 1}
                aria-label="Next day"
                className="border border-rule px-2 py-0.5 font-mono text-[0.7rem] text-ink transition-colors duration-[var(--motion-fast)] hover:border-oxblood hover:text-oxblood disabled:opacity-30 disabled:hover:border-rule disabled:hover:text-ink"
              >
                →
              </button>
            </div>
          </div>
          <div className="px-4 py-3">
            <div className="font-display text-h3 text-ink">{current.title}</div>
            {current.detail && (
              <p className="mt-1.5 font-body text-body text-ink-soft">{current.detail}</p>
            )}
            {current.quote && (
              <blockquote className="mt-2 border-l-[3px] border-oxblood pl-3 font-mono text-[0.9rem] leading-[1.6] text-ink">
                &ldquo;{current.quote}&rdquo;
              </blockquote>
            )}
          </div>
        </div>
      )}

      {/* no-JS: every day, stacked, full details */}
      <noscript>
        <ol className="mt-3 space-y-3">
          {days.map((d, i) => (
            <li key={`ns-${i}`} className="border border-rule bg-paper-deep px-4 py-3">
              <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-mute">
                {d.day}
                {d.kind === "incident" ? " · incident" : ""}
              </div>
              <div className="mt-1 font-display text-h3 text-ink">{d.title}</div>
              {d.detail && <p className="mt-1.5 font-body text-body text-ink-soft">{d.detail}</p>}
              {d.quote && (
                <blockquote className="mt-2 border-l-[3px] border-oxblood pl-3 font-mono text-[0.9rem] leading-[1.6] text-ink">
                  &ldquo;{d.quote}&rdquo;
                </blockquote>
              )}
            </li>
          ))}
        </ol>
      </noscript>

      {caption && (
        <figcaption className="mt-2 font-mono text-meta uppercase tracking-wider text-ink-mute">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
