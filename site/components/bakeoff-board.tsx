"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { MOTION_SLOW, EASE_OUT_SOFT } from "./motion-tokens";

/**
 * BakeoffBoard - same world, models compared (v5.1 World tier; the Emergence
 * pattern). A leaderboard of model rows with animated bars, scaled to the row
 * max. The top row renders in oxblood; every row carries its real-model name
 * and an optional note (what that model's world did).
 *
 * Usage in MDX:
 *   <BakeoffBoard
 *     caption="Wrong pizzas per kitchen, day 1 to 7"
 *     rows={[
 *       { model: "phi4-mini", value: 31, note: "the book was gone by day 3" },
 *       { model: "qwen3:8b", value: 12, note: "re-read the book nightly" },
 *       { model: "gemma3:12b", value: 8 },
 *     ]}
 *   />
 *
 * No-JS / server render: bars sit at their final widths, numbers final.
 * JS arms the bar-grow + count-up on first in-view. Reduced motion: static.
 */
export function BakeoffBoard({
  rows,
  caption,
  className,
}: {
  rows: { model: string; label?: string; value: number; decimals?: number; suffix?: string; note?: string }[];
  caption?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const rowsKey = JSON.stringify(rows);
  const parsed: { model: string; label?: string; value: number; decimals?: number; suffix?: string; note?: string }[] =
    JSON.parse(rowsKey);

  const max = Math.max(...parsed.map((r) => r.value), 1);
  const topIndex = parsed.findIndex((r) => r.value === max);

  // Server render (and reduced motion) shows the final values and widths.
  const [values, setValues] = useState<number[]>(parsed.map((r) => r.value));
  const [widths, setWidths] = useState<number[]>(parsed.map((r) => (r.value / max) * 100));
  const played = useRef(false);

  useEffect(() => {
    if (reduced) return;
    played.current = false;
    setValues(parsed.map(() => 0));
    setWidths(parsed.map(() => 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsKey, reduced]);

  useEffect(() => {
    if (!inView || reduced || played.current) return;
    played.current = true;
    const valueControls = parsed.map((r, i) =>
      animate(0, r.value, {
        duration: MOTION_SLOW,
        ease: EASE_OUT_SOFT,
        onUpdate: (v) =>
          setValues((prev) => {
            const next = [...prev];
            next[i] = v;
            return next;
          }),
      })
    );
    const widthControls = parsed.map((r, i) =>
      animate(0, (r.value / max) * 100, {
        duration: MOTION_SLOW,
        ease: EASE_OUT_SOFT,
        onUpdate: (v) =>
          setWidths((prev) => {
            const next = [...prev];
            next[i] = v;
            return next;
          }),
      })
    );
    return () => [...valueControls, ...widthControls].forEach((c) => c.stop());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced, rowsKey]);

  const format = (v: number, decimals?: number) =>
    decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString("en-US");

  return (
    <figure className={cn("my-8", className)}>
      <div ref={ref} className="space-y-4 border-y border-rule py-6">
        {parsed.map((r, i) => (
          <div key={`${r.model}-${i}`}>
            <div className="mb-1 flex items-baseline justify-between gap-3">
              <span className="font-mono text-mono text-ink">
                {r.model}
                {r.label ? <span className="ml-2 text-[0.7rem] uppercase tracking-wider text-ink-mute">{r.label}</span> : null}
              </span>
              <span
                className={cn(
                  "font-display text-[1.4rem] leading-none tabular-nums",
                  i === topIndex ? "text-oxblood" : "text-ink"
                )}
              >
                {format(values[i] ?? r.value, r.decimals)}
                {r.suffix ?? ""}
              </span>
            </div>
            <div className="h-2.5 w-full bg-paper-deep">
              <div
                className={cn("h-full", i === topIndex ? "bg-oxblood" : "bg-ink-mute/60")}
                style={{ width: `${widths[i] ?? (r.value / max) * 100}%` }}
              />
            </div>
            {r.note && (
              <div className="mt-1 font-body italic text-meta text-ink-mute">{r.note}</div>
            )}
          </div>
        ))}
      </div>
      {caption && (
        <figcaption className="mt-2 font-mono text-meta uppercase tracking-wider text-ink-mute">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
