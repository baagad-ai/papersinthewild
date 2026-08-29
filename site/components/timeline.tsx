"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { MOTION_BASE, EASE_OUT_SOFT } from "./motion-tokens";

/**
 * Timeline - the experiment's arc as a scrubbable event timeline.
 * Events arrive with an in-view stagger; clicking an event (or dragging the
 * scrubber) selects it, and the active event carries the oxblood dot.
 *
 * Usage in MDX:
 *   <Timeline
 *     events={[
 *       { ts: "R1", label: "Patient zero", detail: "Ash shares the memo." },
 *       { ts: "R2", label: "First believer" },
 *     ]}
 *     caption="Run log, fine-print arm"
 *   />
 *
 * No-JS: every event, timestamp and detail renders statically (the full arc
 * survives without JavaScript); selection only adds emphasis. Horizontal
 * track on sm+ screens, stacked vertical column on mobile.
 */
export function Timeline({
  events,
  caption,
  className,
}: {
  events: { ts: string; label: string; detail?: string }[];
  caption?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  return (
    <figure className={cn("my-8", className)}>
      <div className="relative">
        {/* Connecting rule (horizontal track only) */}
        <div
          aria-hidden
          className="absolute left-0 right-0 top-[5px] hidden h-px bg-rule sm:block"
        />
        <ol className="relative flex flex-col gap-6 sm:flex-row sm:gap-0">
          {events.map((ev, i) => (
            <motion.li
              key={i}
              className="min-w-0 flex-1"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: MOTION_BASE,
                ease: EASE_OUT_SOFT,
                delay: reduced ? 0 : i * 0.07,
              }}
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
                    "mt-[3px] inline-block h-[11px] w-[11px] shrink-0 rounded-full border transition-colors duration-[var(--motion-fast)]",
                    active === i
                      ? "border-oxblood bg-oxblood"
                      : "border-ink-mute bg-paper group-hover:border-oxblood"
                  )}
                />
                <span className="min-w-0">
                  <span className="block font-mono text-[0.7rem] uppercase tracking-wider text-ink-mute">
                    {ev.ts}
                  </span>
                  <span
                    className={cn(
                      "block font-display text-body transition-colors duration-[var(--motion-fast)]",
                      active === i
                        ? "text-oxblood"
                        : "text-ink group-hover:text-oxblood"
                    )}
                  >
                    {ev.label}
                  </span>
                  {ev.detail && (
                    <span className="mt-1 block font-body text-meta leading-snug text-ink-soft">
                      {ev.detail}
                    </span>
                  )}
                </span>
              </button>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* Scrubber: the same selection state, draggable */}
      <div className="mt-6 flex items-center gap-3">
        <label
          htmlFor="pitw-timeline-scrub"
          className="font-mono text-[0.7rem] uppercase tracking-wider text-ink-mute"
        >
          Scrub
        </label>
        <input
          id="pitw-timeline-scrub"
          type="range"
          min={0}
          max={Math.max(events.length - 1, 0)}
          value={Math.min(active, events.length - 1)}
          onChange={(e) => setActive(Number(e.target.value))}
          className="h-1 w-full max-w-[16rem] accent-oxblood"
        />
      </div>

      {caption && (
        <figcaption className="mt-2 font-mono text-meta uppercase tracking-wider text-ink-mute">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
