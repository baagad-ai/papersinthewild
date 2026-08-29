"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { MOTION_FAST, EASE_OUT_SOFT } from "./motion-tokens";

/**
 * ModelExplorer - side-by-side model behavior picker. Tabs across models
 * (animated underline via Motion layoutId), each model's runs rendered as
 * receipt-styled blocks: dashed rules, mono text, INPUT and OUTPUT sections.
 *
 * Usage in MDX:
 *   <ModelExplorer
 *     models={[
 *       { id: "pixel-8b", label: "Pixel 8B", runs: [{ input: "...", output: "..." }] },
 *       { id: "atlas", label: "Atlas", runs: [{ input: "...", output: "..." }] },
 *     ]}
 *     caption="Same prompt, two models, two different wrongs"
 *   />
 *
 * No-JS: the first model's receipts render statically (all content is plain
 * markup; the tabs only switch which model is shown). prefers-reduced-motion:
 * the underline jumps without animation and the content swap is instant.
 */
export function ModelExplorer({
  models,
  caption,
  className,
}: {
  models: { id: string; label: string; runs: { input: string; output: string }[] }[];
  caption?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [activeId, setActiveId] = useState(models[0]?.id);
  const active = models.find((m) => m.id === activeId) ?? models[0];

  return (
    <figure className={cn("my-8", className)}>
      {/* Tabs */}
      <div className="flex flex-wrap border-b border-rule" role="tablist">
        {models.map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={active?.id === m.id}
            onClick={() => setActiveId(m.id)}
            className={cn(
              "relative px-3 py-2 font-mono text-[0.7rem] uppercase tracking-wider transition-colors duration-[var(--motion-fast)]",
              active?.id === m.id
                ? "text-oxblood"
                : "text-ink-mute hover:text-ink"
            )}
          >
            {m.label}
            {active?.id === m.id &&
              (reduced ? (
                <span
                  aria-hidden
                  className="absolute inset-x-2 -bottom-px h-[2px] bg-oxblood"
                />
              ) : (
                <motion.span
                  aria-hidden
                  layoutId="pitw-model-explorer-tab-rule"
                  className="absolute inset-x-2 -bottom-px h-[2px] bg-oxblood"
                  transition={{ duration: MOTION_FAST, ease: EASE_OUT_SOFT }}
                />
              ))}
          </button>
        ))}
      </div>

      {/* Runs for the active model */}
      {active && (
        <motion.div
          key={active.id}
          initial={reduced ? false : { opacity: 0, y: 6 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: MOTION_FAST, ease: EASE_OUT_SOFT }}
        >
          {active.runs.map((run, i) => (
            <div
              key={i}
              className="mt-4 border border-dashed border-rule bg-paper shadow-[var(--shadow-ink)]"
            >
              <div className="border-b border-dashed border-rule px-4 py-2 text-center font-mono text-[0.65rem] uppercase tracking-[0.18em] text-ink-mute">
                Run {i + 1} of {active.runs.length} &middot; {active.label}
              </div>
              <div className="px-4 py-3">
                <div className="mb-1 font-mono text-[0.65rem] uppercase tracking-wider text-ink-mute">
                  Input
                </div>
                <p className="whitespace-pre-wrap font-mono text-[0.85rem] leading-[1.55] text-ink-soft">
                  {run.input}
                </p>
              </div>
              <div className="border-t border-dashed border-rule px-4 py-3">
                <div className="mb-1 font-mono text-[0.65rem] uppercase tracking-wider text-ink-mute">
                  Output
                </div>
                <p className="whitespace-pre-wrap font-mono text-[0.85rem] leading-[1.55] text-ink">
                  {run.output}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {caption && (
        <figcaption className="mt-2 font-mono text-meta uppercase tracking-wider text-ink-mute">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
