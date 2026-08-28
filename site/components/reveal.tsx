"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Reveal - scroll-arrival wrapper for major figures (BLOG-FLOW.md).
 * Fade + 12px rise once, via IntersectionObserver + CSS transitions.
 * No animation library, prefers-reduced-motion respected, and the content
 * renders immediately if JS never runs (opacity handled by a class, so the
 * static export shows everything).
 *
 * Usage in MDX:
 *   <Reveal><BigStat value="7 for 7" label="..." /></Reveal>
 */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // "init": server render, fully visible (no-JS safe). "hidden": JS armed the
  // reveal. "shown": revealed (or never armed).
  const [state, setState] = useState<"init" | "hidden" | "shown">("init");

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState("shown");
      return;
    }
    setState("hidden");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState("shown");
          io.disconnect();
        }
      },
      { rootMargin: "-60px 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-[opacity,transform] duration-[400ms] ease-out",
        state === "hidden" && "translate-y-3 opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}
