"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { MOTION_SLOW, EASE_OUT_SOFT } from "./motion-tokens";

/**
 * TallyBoard - animated count-up numbers, triggered once on scroll into view.
 * Each item renders a display number, an optional mono label, and an
 * optional "household" phrase: the human-twin translation rendered smaller
 * in serif italic (e.g. value 1.21x, household "a weekend of work").
 *
 * Usage in MDX:
 *   <TallyBoard
 *     items={[
 *       { value: 47, suffix: "s", label: "With the fine print", household: "one coffee" },
 *       { value: 452, suffix: "s", label: "Without", household: "a whole lunch break" },
 *     ]}
 *     caption="Same task, same model"
 *   />
 *
 * No-JS / server render: the final numbers print immediately, so the story
 * is complete without JavaScript. JS arms the count-up (reset to zero, then
 * animate on first in-view). prefers-reduced-motion: numbers stay static.
 */
export function TallyBoard({
  items,
  caption,
  className,
}: {
  items: {
    value: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
    label?: string;
    household?: string;
  }[];
  caption?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  // Server render (and reduced motion) shows the final values.
  const [values, setValues] = useState<number[]>(items.map((it) => it.value));
  const played = useRef(false);

  const itemsKey = JSON.stringify(items);

  // Arm: with JS and motion allowed, restart from zero so the count-up runs.
  useEffect(() => {
    if (reduced) return;
    played.current = false;
    setValues(JSON.parse(itemsKey).map(() => 0));
  }, [itemsKey, reduced]);

  useEffect(() => {
    if (!inView || reduced || played.current) return;
    played.current = true;
    const targets: { value: number; decimals?: number }[] =
      JSON.parse(itemsKey);
    const controls = targets.map((it, i) =>
      animate(0, it.value, {
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
    return () => controls.forEach((c) => c.stop());
  }, [inView, reduced, itemsKey]);

  const format = (v: number, decimals?: number) =>
    decimals
      ? v.toFixed(decimals)
      : Math.round(v).toLocaleString("en-US");

  return (
    <figure className={cn("my-10", className)}>
      <div
        ref={ref}
        className="flex flex-wrap items-start gap-x-10 gap-y-6 border-y border-rule py-6"
      >
        {items.map((it, i) => (
          <div key={i} className="min-w-0">
            <div className="font-display text-[2.75rem] leading-none tracking-tight text-oxblood tabular-nums">
              {it.prefix}
              {format(values[i] ?? it.value, it.decimals)}
              {it.suffix}
            </div>
            {it.label && (
              <div className="mt-2 font-mono text-[0.7rem] uppercase tracking-wider text-ink-mute">
                {it.label}
              </div>
            )}
            {it.household && (
              <div className="font-body italic text-meta text-ink-soft">
                {it.household}
              </div>
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
