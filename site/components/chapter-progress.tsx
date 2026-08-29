"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * ChapterProgress - thin oxblood reading-progress bar, driven by Motion's
 * useScroll. Scoped to the episode <article> when one exists (progress runs
 * from the article top hitting the viewport top to the article bottom hitting
 * the viewport bottom), with page-level scroll as fallback. Supersedes
 * ScrollProgress (kept for compatibility).
 *
 * Pure client chrome; renders a hairline that fills left to right, springed
 * so fast scrolls do not twitch. No-JS: an empty transparent bar, nothing
 * lost.
 */
export function ChapterProgress({ className }: { className?: string }) {
  const nodeRef = useRef<HTMLElement | null>(null);
  const [found, setFound] = useState(false);

  useEffect(() => {
    const article = document.querySelector("article");
    if (article) {
      nodeRef.current = article;
      setFound(true);
    }
  }, []);

  // Rebuild the ref object once the article is found so useScroll re-reads it.
  const targetRef = useMemo(() => ({ current: nodeRef.current }), [found]);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 380,
    damping: 42,
    mass: 0.6,
  });

  return (
    <motion.div
      aria-hidden
      role="presentation"
      className={cn(
        "fixed left-0 top-0 z-50 h-[2px] w-full origin-left bg-oxblood",
        className
      )}
      style={{ scaleX }}
    />
  );
}
