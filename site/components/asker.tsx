"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Asker - a one-tap reader poll that ships as a mailto link.
 * Static fallback first: a fieldset of radios rendered on the
 * server with the first option preselected, so the export works
 * with JS disabled. A tiny onChange updates the prefilled mailto
 * body: "<question> -> <choice>". No network, no tracking.
 *
 * Usage in MDX:
 *   <Asker
 *     episode="2026-w34-mind-viruses"
 *     question="Which experiment should we run next?"
 *     options={["Vaccinated ring, bigger", "Prompt waste, real bills"]}
 *   />
 */
export function Asker({
  question,
  options,
  mailto = "baagad.ai@gmail.com",
  episode,
  className,
}: {
  question: string;
  options: string[];
  mailto?: string;
  episode: string;
  className?: string;
}) {
  // Server render and initial client state agree on option[0].
  const [choice, setChoice] = useState(options[0] ?? "");

  const subject = encodeURIComponent(`Asker (${episode}): ${question}`);
  const body = encodeURIComponent(`${question} -> ${choice}`);
  const href = `mailto:${mailto}?subject=${subject}&body=${body}`;

  return (
    <fieldset
      className={cn(
        "my-8 border border-rule bg-paper-deep p-6",
        className,
      )}
    >
      <legend className="px-2 font-mono text-meta uppercase tracking-wider text-oxblood">
        Asker
      </legend>
      <p className="mb-4 font-display text-h3 text-ink">{question}</p>
      <div className="mb-5 space-y-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-3 font-body text-body text-ink-soft"
          >
            <input
              type="radio"
              name={`asker-${episode}`}
              value={option}
              checked={choice === option}
              onChange={() => setChoice(option)}
              className="accent-[var(--oxblood)]"
            />
            {option}
          </label>
        ))}
      </div>
      <a
        href={href}
        className={cn(
          "inline-block bg-oxblood px-5 py-2.5 font-mono text-meta uppercase tracking-wider text-paper",
          "rounded-[var(--radius-sm)] hover:bg-oxblood-deep transition-colors duration-base",
          "active:translate-y-px",
        )}
      >
        Send your answer
      </a>
    </fieldset>
  );
}
