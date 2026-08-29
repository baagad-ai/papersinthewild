"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * MemoryBook - the mechanism as a tangible object (v5.1 World tier; the
 * default signature interactive for decay/rehearsal/memory papers). The
 * world's book renders page by page; a day scrubber fades the pages whose
 * `fadesAt` day has passed. What the world forgot, the reader watches
 * forget. The last page state (max day) is the server render, so no-JS
 * readers see the end state of the book.
 *
 * Usage in MDX:
 *   <MemoryBook
 *     caption="Mira's recipe book, as the days pass"
 *     book="The Kitchen Codex"
 *     maxDay={7}
 *     pages={[
 *       { label: "The base", text: "300g flour. Knead 10 minutes. Rest 1 hour.", fadesAt: 3 },
 *       { label: "The sauce", text: "Crush tomatoes. Garlic. Salt. Slow fire.", fadesAt: 6 },
 *       { label: "The finish", text: "Basil after the oven, never before.", fadesAt: 9 },
 *     ]}
 *   />
 *
 * No-JS: the book renders at maxDay (the final state, the finding).
 * prefers-reduced-motion: pages switch without the fade transition.
 */
export function MemoryBook({
  pages,
  book,
  maxDay,
  caption,
  className,
}: {
  pages: { label: string; text: string; fadesAt?: number }[];
  book?: string;
  maxDay?: number;
  caption?: string;
  className?: string;
}) {
  const computedMax =
    maxDay ?? Math.max(1, ...pages.map((p) => p.fadesAt ?? 1));
  const [day, setDay] = useState(computedMax);
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const isGone = (p: { fadesAt?: number }) =>
    p.fadesAt !== undefined && day >= p.fadesAt;
  const goneCount = pages.filter(isGone).length;

  return (
    <figure className={cn("my-8", className)}>
      <div className="border border-rule bg-paper-deep">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule px-4 py-2">
          <span className="font-display text-h3 italic text-ink">
            {book ?? "The book"}
          </span>
          <span className="font-mono text-[0.7rem] uppercase tracking-wider text-ink-mute">
            day {day} · {goneCount} of {pages.length} pages faded
          </span>
        </div>
        <ul className="divide-y divide-rule">
          {pages.map((p, i) => {
            const gone = isGone(p);
            return (
              <li
                key={i}
                className={cn(
                  "px-4 py-3 transition-opacity",
                  reduced ? "" : "duration-[var(--motion-slow)]",
                  gone ? "opacity-35" : "opacity-100"
                )}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span
                    className={cn(
                      "font-mono text-[0.7rem] uppercase tracking-wider",
                      gone ? "text-ink-mute line-through" : "text-oxblood"
                    )}
                  >
                    {p.label}
                  </span>
                  {gone && p.fadesAt !== undefined && (
                    <span className="shrink-0 font-mono text-[0.65rem] uppercase tracking-wider text-oxblood">
                      faded by day {p.fadesAt}
                    </span>
                  )}
                </div>
                <p
                  className={cn(
                    "mt-1 font-body text-body",
                    gone ? "text-ink-mute line-through" : "text-ink-soft"
                  )}
                >
                  {p.text}
                </p>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <label
          htmlFor="pitw-memorybook-day"
          className="font-mono text-[0.7rem] uppercase tracking-wider text-ink-mute"
        >
          Day
        </label>
        <input
          id="pitw-memorybook-day"
          type="range"
          min={1}
          max={computedMax}
          value={day}
          onChange={(e) => setDay(Number(e.target.value))}
          className="h-1 w-full max-w-[16rem] accent-oxblood"
        />
        <span className="font-mono text-mono tabular-nums text-ink">{day}</span>
      </div>

      {caption && (
        <figcaption className="mt-2 font-mono text-meta uppercase tracking-wider text-ink-mute">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
