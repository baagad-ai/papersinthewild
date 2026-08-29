"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * AgentInspector - click an agent, see inside its head (v5.1 World tier; the
 * Smallville replay-viewer pattern). The inspector shows the agent's actual
 * prompt/thought and its memory stream: what it still holds (filled dot) vs
 * what it dropped (struck through, hollow dot). The paper's mechanism, poked
 * by the reader.
 *
 * Usage in MDX:
 *   <AgentInspector
 *     caption="Day 5: who still remembers the dough?"
 *     agents={[
 *       {
 *         name: "Chef Mira", model: "phi4-mini",
 *         thought: "I start with the sauce. That feels right.",
 *         memory: [
 *           { text: "Base: 300g flour, knead 10 min", held: false },
 *           { text: "Sauce: crush, garlic, salt", held: true },
 *         ],
 *       },
 *     ]}
 *   />
 *
 * No-JS: the first agent's panel is fully server-rendered (a complete
 * inspection on its own); the chips switch panels with JS. All agents'
 * verbatim material also lives in the receipts, so nothing is lost.
 */
export function AgentInspector({
  agents,
  caption,
  className,
}: {
  agents: {
    name: string;
    model: string;
    thought: string;
    memory: { text: string; held: boolean }[];
  }[];
  caption?: string;
  className?: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <figure className={cn("my-8", className)}>
      <div className="border-y border-rule py-5">
        {/* cast chips */}
        <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Pick an agent to inspect">
          {agents.map((a, i) => (
            <button
              key={`${a.name}-${i}`}
              type="button"
              role="tab"
              aria-selected={active === i}
              onClick={() => setActive(i)}
              className={cn(
                "border px-2.5 py-1 font-mono text-[0.75rem] transition-colors duration-[var(--motion-fast)]",
                active === i
                  ? "border-oxblood bg-oxblood text-paper"
                  : "border-rule bg-paper-deep text-ink hover:border-oxblood hover:text-oxblood"
              )}
            >
              {a.name}
              <span className={cn("ml-1.5 text-[0.65rem] uppercase tracking-wider", active === i ? "text-paper/80" : "text-oxblood")}>
                {a.model}
              </span>
            </button>
          ))}
        </div>

        {/* inspector panel for the active agent */}
        <div>
          {agents.map((a, i) => (
            <div
              key={`${a.name}-${i}`}
              role="tabpanel"
              hidden={active !== i}
              className={cn(active !== i && "hidden")}
            >
              <div className="border border-rule bg-paper-deep">
                <div className="border-b border-rule px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-mute">
                  {a.name} · runs on {a.model} · current thought
                </div>
                <blockquote className="px-4 py-3 font-mono text-[0.95rem] leading-[1.6] text-ink">
                  &ldquo;{a.thought}&rdquo;
                </blockquote>
                <div className="border-t border-rule px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-mute">
                  memory stream
                </div>
                <ul className="space-y-1.5 px-4 py-3">
                  {a.memory.map((mem, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <span
                        aria-hidden
                        className={cn(
                          "mt-[7px] inline-block h-2 w-2 shrink-0 rounded-full",
                          mem.held ? "bg-moss" : "border border-ink-mute bg-transparent"
                        )}
                      />
                      <span
                        className={cn(
                          "font-body text-body",
                          mem.held ? "text-ink-soft" : "text-ink-mute line-through"
                        )}
                      >
                        {mem.text}
                      </span>
                      {!mem.held && (
                        <span className="shrink-0 font-mono text-[0.65rem] uppercase tracking-wider text-oxblood">
                          dropped
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      {caption && (
        <figcaption className="mt-2 font-mono text-meta uppercase tracking-wider text-ink-mute">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
