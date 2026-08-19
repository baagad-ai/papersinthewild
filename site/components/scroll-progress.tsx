"use client";

import { useEffect, useState } from "react";

/**
 * ScrollProgress — 3px oxblood reading-progress bar for episode pages.
 * Fixed under the site header; measures the article element's scroll extent.
 * Client-only chrome; no MDX usage. Pure display, works from first paint.
 */
export function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;
    const onScroll = () => {
      const rect = article.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const done = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      setPct(total > 0 ? (done / total) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed left-0 top-[64px] z-40 h-[3px] w-full bg-transparent"
      role="presentation"
    >
      <div
        className="h-full bg-oxblood transition-[width] duration-150"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
