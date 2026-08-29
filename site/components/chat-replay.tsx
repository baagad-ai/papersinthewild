"use client";

import { useEffect, useRef, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * ChatReplay - the flagship replayable moment: a real transcript rendered as
 * an interactive chat the reader steps through.
 *
 * Usage in MDX:
 *   <ChatReplay
 *     caption="Run 4, the moment it went wrong"
 *     messages={[
 *       { role: "user", text: "Find the failing test and fix it." },
 *       { role: "model", modelId: "pixel-8b", text: "All 7 tests pass." },
 *       { role: "system", text: "3 tests exist. 2 are failing." },
 *     ]}
 *   />
 *
 * Controls: Prev / Play / Next / Reset plus a step indicator. Auto-play
 * advances one message at a time and stops at the end.
 *
 * Degradation contract (BLOG-FLOW §2):
 *   - No-JS: the full transcript renders statically (server render starts at
 *     "all revealed"; JS arms the step-through).
 *   - prefers-reduced-motion: every message stays visible; the controls keep
 *     working as jump links that move an outline to the active message.
 *   - The auto-animate list micro-motion is disabled under reduced motion.
 */
export function ChatReplay({
  messages,
  caption,
  autoplayMs = 1400,
  className,
}: {
  messages: {
    role: "user" | "system" | "model";
    modelId?: string;
    text: string;
    ts?: string;
  }[];
  caption?: string;
  autoplayMs?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  // Server render (and no-JS): the whole transcript is visible.
  const [step, setStep] = useState(messages.length);
  const [playing, setPlaying] = useState(false);
  const [armed, setArmed] = useState(false);
  const [listRef, enableAutoAnimate] = useAutoAnimate<HTMLUListElement>();
  const activeRef = useRef<HTMLLIElement>(null);

  // Arm the step-through once JS is alive (unless reduced motion).
  useEffect(() => {
    setArmed(true);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(1);
    }
  }, []);

  // auto-animate for the reveal micro-motion; off under reduced motion.
  useEffect(() => {
    enableAutoAnimate(!reduced);
  }, [enableAutoAnimate, reduced]);

  // Auto-play: one timeout per step, stops at the end.
  useEffect(() => {
    if (!playing) return;
    if (step >= messages.length) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(
      () => setStep((s) => Math.min(s + 1, messages.length)),
      autoplayMs
    );
    return () => clearTimeout(t);
  }, [playing, step, messages.length, autoplayMs]);

  // Reduced motion: controls act as jump links; keep the active one in view.
  useEffect(() => {
    if (!reduced || !armed) return;
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [step, reduced, armed]);

  const revealed = !armed || reduced ? messages.length : step;
  const activeIdx = step - 1;
  const atStart = step <= 1;
  const atEnd = step >= messages.length;

  const goTo = (n: number) => {
    setStep(Math.max(1, Math.min(n, messages.length)));
  };

  return (
    <figure className={cn("my-8", className)}>
      <div className="border border-rule bg-paper-deep/40">
        {/* Transcript */}
        <ul ref={listRef} className="flex flex-col gap-3 p-4 sm:p-5">
          {messages.slice(0, revealed).map((m, i) => (
            <li
              key={i}
              ref={reduced && i === activeIdx ? activeRef : undefined}
              className={cn(
                "border bg-paper px-4 py-3 transition-[border-color,outline-color] duration-[var(--motion-fast)]",
                m.role === "user" && "border-l-[3px] border-l-oxblood",
                m.role === "model" && "border-l-[3px] border-l-moss",
                m.role === "system" && "border-dashed",
                reduced && i === activeIdx && "outline outline-1 outline-oxblood"
              )}
            >
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "font-mono text-[0.65rem] uppercase tracking-[0.16em]",
                    m.role === "user" && "text-oxblood",
                    m.role === "model" && "text-moss",
                    m.role === "system" && "text-ink-mute"
                  )}
                >
                  {m.role === "model" ? (m.modelId ?? "model") : m.role}
                </span>
                {m.ts && (
                  <span className="font-mono text-[0.65rem] tracking-wider text-ink-mute">
                    {m.ts}
                  </span>
                )}
              </div>
              <p
                className={cn(
                  "whitespace-pre-wrap break-words [overflow-wrap:anywhere]",
                  m.role === "system"
                    ? "font-body italic text-meta text-ink-mute"
                    : "font-mono text-[0.9rem] leading-[1.55] text-ink"
                )}
              >
                {m.text}
              </p>
            </li>
          ))}
        </ul>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2 border-t border-rule px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              goTo(step - 1);
            }}
            disabled={atStart}
            className="border border-rule bg-paper px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-ink transition-colors hover:border-oxblood hover:text-oxblood disabled:opacity-40 disabled:hover:border-rule disabled:hover:text-ink"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => {
              if (atEnd) goTo(1);
              setPlaying((p) => !p);
            }}
            className="border border-oxblood bg-paper px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-oxblood transition-colors hover:bg-oxblood hover:text-paper"
          >
            {playing ? "Pause" : atEnd ? "Replay" : "Play"}
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              goTo(step + 1);
            }}
            disabled={atEnd}
            className="border border-rule bg-paper px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-ink transition-colors hover:border-oxblood hover:text-oxblood disabled:opacity-40 disabled:hover:border-rule disabled:hover:text-ink"
          >
            Next
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              goTo(1);
            }}
            className="border border-rule bg-paper px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-ink-mute transition-colors hover:border-oxblood hover:text-oxblood"
          >
            Reset
          </button>
          <span
            aria-live="polite"
            className="ml-auto font-mono text-[0.7rem] uppercase tracking-wider text-ink-mute tabular-nums"
          >
            {Math.min(Math.max(step, 1), messages.length)} / {messages.length}
          </span>
        </div>
      </div>
      {/* Segmented progress */}
      <div aria-hidden className="mt-2 flex gap-1">
        {messages.map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-[3px] flex-1 transition-colors duration-[var(--motion-fast)]",
              i < step ? "bg-oxblood" : "bg-rule"
            )}
          />
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
