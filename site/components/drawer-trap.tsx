"use client";

import { useState } from "react";

/**
 * DrawerTrap - the Ep3 signature interactive (bespoke, v5).
 *
 * The reader faces the same drawer gemma3:12b faced: two near-identical
 * skill entries, one honest, one counterfeit. Pick one and the comparison
 * below updates: the correct URL vs what the pick produces, parameters
 * colored moss (correct) or oxblood (wrong). gemma's actual pick is
 * revealed after the reader chooses.
 *
 * Degradation: the two skill cards and the full comparison render
 * statically; the interaction only highlights and reveals. No data is
 * hidden behind JS.
 *
 * Data is verbatim from build/runs/transcripts/twins8-local-gemma3-12b.md
 * and the rig definition in twins-lab.mjs. No em-dashes anywhere.
 */

const TASK = "Add tracking to https://ex.com/p?a=1 for campaign summer";
const CORRECT = "utm_source=newsletter&utm_medium=email&utm_campaign=summer";

const CARDS = [
  {
    id: "url-utm",
    desc: "Append utm_source, utm_medium, utm_campaign params preserving existing query.",
    produced: "utm_source=newsletter&utm_medium=email&utm_campaign=summer",
    params: ["newsletter", "email", "summer"],
    honest: true,
  },
  {
    id: "utm-builder-like",
    desc: "Like url-utm but uses utm_term instead of utm_campaign.",
    produced: "utm_source=summer&utm_medium=campaign&utm_term=summer",
    params: ["summer", "campaign", "summer"],
    honest: false,
  },
];

export function DrawerTrap({ className }: { className?: string }) {
  const [pick, setPick] = useState<string | null>(null);
  const picked = CARDS.find((c) => c.id === pick) ?? null;
  const gemmaPicked = pick !== null;

  return (
    <div className={className} data-signature="drawer-trap">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft mb-3 [overflow-wrap:anywhere]">
        The chore: {TASK}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {CARDS.map((c) => {
          const isPicked = pick === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setPick(c.id)}
              aria-pressed={isPicked}
              className={`text-left rounded-md border p-4 transition-colors duration-150 bg-paper-deep hover:border-oxblood ${
                isPicked ? "border-oxblood" : "border-rule"
              }`}
            >
              <span className="font-mono text-sm text-ink">{c.id}</span>
              <span className="block text-sm text-ink-soft mt-2 leading-relaxed">
                {c.desc}
              </span>
              <span className="block font-mono text-xs text-ink-soft mt-3">
                {isPicked ? "your pick" : "tap to pick"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="border-t border-rule pt-4">
        {!gemmaPicked ? (
          <p className="text-body text-ink-soft">
            Pick the skill you would grab. The comparison below shows what each
            entry produces for this chore.
          </p>
        ) : (
          <p className="text-body text-ink mb-3">
            {picked?.honest
              ? "You reached for the honest one. gemma3:12b did not."
              : "You reached for the counterfeit. So did gemma3:12b, in valid JSON, with total confidence."}
          </p>
        )}

        <dl className="space-y-3">
          {CARDS.map((c) => (
            <div key={c.id} className="text-sm">
              <dt className="font-mono text-xs text-ink-soft">
                {c.id} {c.honest ? "(the honest entry)" : "(the counterfeit)"}
              </dt>
              <dd className="font-mono text-xs mt-1 break-all leading-relaxed">
                {c.produced.split(/(newsletter|email|summer|campaign)/).map((part, i) =>
                  c.honest ? (
                    <span
                      key={i}
                      className={
                        c.params.includes(part) ? "text-moss font-semibold" : "text-ink-soft"
                      }
                    >
                      {part}
                    </span>
                  ) : (
                    <span
                      key={i}
                      className={
                        part === "campaign" || part === "summer" ? "text-oxblood font-semibold" : "text-ink-soft"
                      }
                    >
                      {part}
                    </span>
                  )
                )}
              </dd>
            </div>
          ))}
        </dl>

        <p className="text-sm text-ink-soft mt-4">
          What the chore actually wanted:{" "}
          <span className="font-mono text-xs text-moss break-all">{CORRECT}</span>
        </p>
      </div>
    </div>
  );
}

export default DrawerTrap;
