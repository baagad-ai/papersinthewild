"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * StickyStep - scrollytelling: a sticky figure column + scrolling step texts.
 * An IntersectionObserver watches each step and activates the one crossing
 * the viewport's reading band; inactive steps dim. The callback form lets a
 * parent figure react to the active step.
 *
 * Usage in MDX (figure is any static visual, e.g. Meter, SpreadRing, big SVG):
 *   <StickyStep
 *     figure={<Meter value={3} max={7} label="Crossings" />}
 *     steps={[
 *       { title: "Round 1", text: "Patient zero speaks." },
 *       { title: "Round 2", text: "The neighbor believes it." },
 *     ]}
 *     caption="The spread, step by step"
 *   />
 *
 * No-JS: the figure stays sticky (pure CSS) and every step renders fully
 * visible and stacked; activation styling only arms with JavaScript.
 * prefers-reduced-motion: no dimming, steps read as plain stacked text.
 */
export function StickyStep({
  figure,
  steps,
  caption,
  onStepChange,
  className,
}: {
  figure: ReactNode;
  steps: { title?: string; text: string }[];
  caption?: string;
  onStepChange?: (index: number) => void;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // -1 = not armed (server render / no-JS): every step fully visible.
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const nodes = Array.from(
      container.querySelectorAll<HTMLElement>("[data-step]")
    );
    if (nodes.length === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(0);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = Number((entry.target as HTMLElement).dataset.step);
          setActive(idx);
          onStepChange?.(idx);
        }
      },
      // Activate when a step enters the band just above the viewport middle.
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
    // onStepChange is read via closure at arm time; steps is static content.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <figure className={cn("my-10", className)}>
      <div
        ref={containerRef}
        className="lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-10"
      >
        <div className="lg:sticky lg:top-[calc(var(--nav-height)+2rem)] lg:self-start">
          {figure}
          {caption && (
            <figcaption className="mt-2 font-mono text-meta uppercase tracking-wider text-ink-mute">
              {caption}
            </figcaption>
          )}
        </div>
        <ol className="mt-8 space-y-16 lg:mt-0 lg:space-y-[45vh]">
          {steps.map((step, i) => (
            <li
              key={i}
              data-step={i}
              className={cn(
                "transition-opacity duration-[var(--motion-slow)] ease-[var(--ease-out-soft)]",
                active === -1 || active === i ? "opacity-100" : "opacity-40"
              )}
            >
              {step.title && (
                <div className="mb-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-oxblood">
                  {step.title}
                </div>
              )}
              <p className="max-w-[38ch] font-body text-body text-ink-soft">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}
