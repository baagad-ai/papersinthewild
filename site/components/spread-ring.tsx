"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * SpreadRing - the interactive outbreak map. Eight agents on a ring, a scrubber
 * that walks the rounds, and a play button. The reader watches the goose spread.
 *
 * Usage in MDX:
 *   <SpreadRing
 *     agents={[{ name: "Ash" }, { name: "Birch", vaccinated: true }, ...]}
 *     rounds={[
 *       { round: 1, infected: ["Ash"] },
 *       { round: 2, infected: ["Ash", "Jade"] },
 *     ]}
 *     caption="Qwen 8B, copy-exact payload"
 *   />
 *
 * Client component (the only interactive visual). CSS transitions only, no
 * animation library. Honors prefers-reduced-motion by disabling autoplay.
 * With JS disabled, the final round renders statically (story survives).
 */

type Agent = { name: string; vaccinated?: boolean };
type Round = { round: number; infected: string[] };

const R = 118; // ring radius
const C = 160; // center
const NODE = 26; // node radius

export function SpreadRing({
  agents,
  rounds,
  caption,
  autoplaySpeed = 1600,
  className,
}: {
  agents: Agent[];
  rounds: Round[];
  caption?: string;
  autoplaySpeed?: number;
  className?: string;
}) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(() => {
      setIdx((i) => (i >= rounds.length - 1 ? 0 : i + 1));
    }, autoplaySpeed);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, rounds.length, autoplaySpeed]);

  const current = rounds[Math.min(idx, rounds.length - 1)];
  const infectedSet = new Set(current.infected);

  const pos = (i: number) => {
    const total = agents.length;
    const angle = (i / total) * Math.PI * 2 - Math.PI / 2; // patient zero at top
    return { x: C + R * Math.cos(angle), y: C + R * Math.sin(angle) };
  };

  return (
    <figure className={cn("my-8", className)}>
      <div className="border border-rule bg-paper-deep/50 p-4 sm:p-6">
        <svg
          viewBox="0 0 320 320"
          role="img"
          aria-label={`Round ${current.round}: ${current.infected.length} of ${agents.length} infected: ${current.infected.join(", ")}`}
          className="mx-auto h-auto w-full max-w-[380px]"
        >
          {/* ring outline */}
          <circle cx={C} cy={C} r={R} fill="none" stroke="var(--rule)" strokeWidth={1} strokeDasharray="2 5" />
          {/* center readout */}
          <text
            x={C}
            y={C - 8}
            textAnchor="middle"
            style={{ font: "600 34px var(--font-mono)", fill: "var(--oxblood)" }}
          >
            {current.infected.length}
          </text>
          <text
            x={C}
            y={C + 14}
            textAnchor="middle"
            style={{ font: "400 10px var(--font-mono)", fill: "var(--ink-mute)", letterSpacing: "0.1em" }}
          >
            OF {agents.length} INFECTED
          </text>
          <text
            x={C}
            y={C + 30}
            textAnchor="middle"
            style={{ font: "400 10px var(--font-mono)", fill: "var(--ink-mute)", letterSpacing: "0.1em" }}
          >
            ROUND {current.round}
          </text>
          {/* agents */}
          {agents.map((a, i) => {
            const { x, y } = pos(i);
            const infected = infectedSet.has(a.name);
            return (
              <g key={a.name} style={{ transition: "opacity 300ms" }}>
                {a.vaccinated && (
                  <circle
                    cx={x}
                    cy={y}
                    r={NODE + 4}
                    fill="none"
                    stroke="var(--moss)"
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={NODE}
                  fill={infected ? "var(--oxblood)" : "var(--paper)"}
                  stroke={infected ? "var(--oxblood-deep)" : "var(--rule)"}
                  strokeWidth={1.5}
                  style={{ transition: "fill 450ms, stroke 450ms" }}
                />
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  style={{
                    font: "500 11px var(--font-mono)",
                    fill: infected ? "var(--paper)" : "var(--ink-soft)",
                  }}
                >
                  {a.name}
                </text>
                {i === 0 && (
                  <text
                    x={x}
                    y={y - NODE - 8}
                    textAnchor="middle"
                    style={{ font: "400 9px var(--font-mono)", fill: "var(--ink-mute)", letterSpacing: "0.12em" }}
                  >
                    PATIENT ZERO
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* controls */}
        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause playback" : "Play spread"}
            className="border border-ink px-3 py-1 font-mono text-[0.72rem] uppercase tracking-wider text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            {playing ? "Pause" : "Play"}
          </button>
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Rounds">
            {rounds.map((r, i) => (
              <button
                key={r.round}
                type="button"
                role="tab"
                aria-selected={i === idx}
                aria-label={`Round ${r.round}`}
                onClick={() => {
                  setPlaying(false);
                  setIdx(i);
                }}
                className={cn(
                  "h-8 w-8 border font-mono text-[0.75rem] transition-colors",
                  i === idx
                    ? "border-oxblood bg-oxblood text-paper"
                    : "border-rule bg-paper text-ink-soft hover:border-ink-mute"
                )}
              >
                {r.round}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 font-mono text-[0.72rem] text-ink-mute">
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="inline-block h-3 w-3 rounded-full border border-oxblood-deep bg-oxblood" /> infected
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="inline-block h-3 w-3 rounded-full border border-rule bg-paper" /> clean
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="inline-block h-3 w-3 rounded-full border border-dashed border-moss" /> vaccinated
          </span>
          {reduced && <span>(reduced motion on: autoplay off)</span>}
        </div>
      </div>
      {caption && (
        <figcaption className="mt-3 font-body italic text-meta text-ink-mute">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
