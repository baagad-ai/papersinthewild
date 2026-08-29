"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { MOTION_BASE, EASE_OUT_SOFT } from "./motion-tokens";

/**
 * CastBoard - the world's fixtures as specimen cards (v5.1 World tier).
 * Each card: persona name (the rig label), role in the world, and the
 * real-model badge, always visible. The badge is the honesty card: a real
 * model is under the hat. Optional status chip: standing / faded / gone.
 *
 * Usage in MDX:
 *   <CastBoard
 *     caption="The kitchen brigade"
 *     members={[
 *       { name: "Chef Mira", role: "runs the pass", model: "phi4-mini", status: "faded" },
 *       { name: "Chef Rao", role: "owns the oven", model: "qwen3:8b" },
 *       { name: "Chef Okoye", role: "plates everything", model: "gemma3:12b", status: "gone" },
 *     ]}
 *   />
 *
 * No-JS: the full cast renders statically; motion only styles the arrival.
 * prefers-reduced-motion: cards render without entrance.
 */
const STATUS_STYLES: Record<string, string> = {
  standing: "border-moss text-moss",
  faded: "border-highlight text-ink-soft",
  gone: "border-oxblood text-oxblood",
};

export function CastBoard({
  members,
  caption,
  className,
}: {
  members: {
    name: string;
    role?: string;
    model: string;
    status?: "standing" | "faded" | "gone";
  }[];
  caption?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <figure className={cn("my-8", className)}>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m, i) => (
          <motion.li
            key={`${m.name}-${i}`}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: MOTION_BASE,
              ease: EASE_OUT_SOFT,
              delay: reduced ? 0 : i * 0.06,
            }}
            className="flex flex-col gap-1 border border-rule bg-paper-deep px-4 py-3"
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-display text-h3 leading-tight text-ink">
                {m.name}
              </span>
              {m.status && (
                <span
                  className={cn(
                    "shrink-0 border px-1.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider",
                    STATUS_STYLES[m.status] ?? "border-rule text-ink-mute"
                  )}
                >
                  {m.status}
                </span>
              )}
            </div>
            {m.role && (
              <span className="font-body text-meta italic text-ink-soft">
                {m.role}
              </span>
            )}
            <span className="mt-auto border-t border-rule pt-1.5 font-mono text-[0.7rem] uppercase tracking-wider text-oxblood">
              runs on {m.model}
            </span>
          </motion.li>
        ))}
      </ul>
      {caption && (
        <figcaption className="mt-2 font-mono text-meta uppercase tracking-wider text-ink-mute">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
