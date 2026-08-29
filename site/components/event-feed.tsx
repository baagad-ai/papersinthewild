"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { MOTION_BASE, EASE_OUT_SOFT } from "./motion-tokens";

/**
 * EventFeed - the world's log, live-feeling and receipted (v5.1 World tier).
 * Each row: world-day/time chip, actor with real-model badge, and the event
 * text. kind="incident" rows carry an oxblood left bar. The feed renders the
 * full log statically; motion only staggers the arrival.
 *
 * Usage in MDX:
 *   <EventFeed
 *     caption="The first three days"
 *     events={[
 *       { day: "D1", actor: "Chef Rao", model: "qwen3:8b", text: "Opened the kitchen. Book intact." },
 *       { day: "D3", actor: "Chef Mira", model: "phi4-mini", text: "Served a pizza with no base.", kind: "incident" },
 *     ]}
 *   />
 *
 * No-JS: the complete log is in the HTML. prefers-reduced-motion: no stagger.
 */
export function EventFeed({
  events,
  caption,
  className,
}: {
  events: {
    day?: string;
    ts?: string;
    actor: string;
    model?: string;
    text: string;
    kind?: "incident" | "event";
  }[];
  caption?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <figure className={cn("my-8", className)}>
      <ol className="border-y border-rule">
        {events.map((ev, i) => (
          <motion.li
            key={i}
            initial={reduced ? false : { opacity: 0, x: -8 }}
            whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{
              duration: MOTION_BASE,
              ease: EASE_OUT_SOFT,
              delay: reduced ? 0 : Math.min(i * 0.05, 0.4),
            }}
            className={cn(
              "flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-rule px-2 py-2.5 last:border-b-0",
              ev.kind === "incident" && "border-l-[3px] border-l-oxblood bg-paper-deep"
            )}
          >
            {(ev.day || ev.ts) && (
              <span className="shrink-0 font-mono text-[0.7rem] uppercase tracking-wider text-ink-mute">
                {ev.day ?? ""}{ev.day && ev.ts ? " " : ""}{ev.ts ?? ""}
              </span>
            )}
            <span className="font-mono text-mono text-ink">
              {ev.actor}
              {ev.model && (
                <span className="ml-1.5 text-[0.7rem] uppercase tracking-wider text-oxblood">
                  [{ev.model}]
                </span>
              )}
            </span>
            <span className="min-w-0 flex-1 font-body text-body text-ink-soft">
              {ev.text}
            </span>
          </motion.li>
        ))}
      </ol>
      {caption && (
        <figcaption className="mt-2 font-mono text-meta uppercase tracking-wider text-ink-mute">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
