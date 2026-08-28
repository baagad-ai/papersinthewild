import type { Metadata } from "next";
import Link from "next/link";
import { getEpisode } from "@/content/episodes";
import { InkRule } from "@/components/ink-rule";
import { Subscribe } from "@/components/subscribe";

/**
 * Start here: the curated reading path for first-time visitors.
 * Three episodes, in a deliberate order, with a reason for each.
 */

export const metadata: Metadata = {
  title: "Start here: Papers in the Wild",
  description:
    "New here? Each episode takes one real AI paper, tries something absurd-but-real with it, and publishes the receipts.",
};

const readingPath = [
  {
    slug: "2026-w34-mind-viruses",
    reason: "the party trick: watch a mind virus spread",
  },
  {
    slug: "2026-w33-prompt-induced-waste",
    reason: "where the receipts habit started",
  },
  {
    slug: "2026-w35-agent-skills-decay",
    reason: "the one with the sabotage, verbatim",
  },
];

export default function StartHerePage() {
  const stops = readingPath.flatMap((stop, i) => {
    const ep = getEpisode(stop.slug);
    if (!ep) return [];
    return [{ ...ep, order: i + 1, reason: stop.reason }];
  });

  return (
    <div className="mx-auto px-6 py-24" style={{ maxWidth: "var(--page-width)" }}>
      <div className="mb-6 font-mono text-meta uppercase tracking-wider text-ink-mute">
        The short path
      </div>
      <h1 className="mb-4 font-display text-display text-ink">Start here</h1>

      <p className="mb-8 max-w-[36rem] text-h3 italic text-ink-soft">
        New here? Each episode takes one real AI paper, tries something
        absurd-but-real with it, and publishes the receipts. These three are
        the fastest way to see what that means.
      </p>

      <InkRule />

      {/* Curated reading path */}
      <ol className="mb-24">
        {stops.map((stop) => (
          <li
            key={stop.slug}
            className="flex items-baseline gap-6 border-b border-rule py-8 last:border-b-0"
          >
            <span className="shrink-0 font-mono text-meta uppercase tracking-wider text-oxblood">
              {String(stop.order).padStart(2, "0")}
            </span>
            <div>
              <Link
                href={`/episodes/${stop.slug}`}
                className="font-display text-h2 leading-tight text-ink hover:text-oxblood transition-colors duration-base"
              >
                {stop.title}
              </Link>
              <p className="mt-2 max-w-[38rem] text-body text-ink-soft">
                {stop.reason}
              </p>
            </div>
          </li>
        ))}
      </ol>

      {/* Follow */}
      <section className="border border-rule bg-paper-deep p-8 md:p-10">
        <div className="mb-6 font-mono text-meta uppercase tracking-wider text-ink-mute">
          Get every Friday episode
        </div>
        <Subscribe variant="form" />

        {/* Zero-signup alternatives */}
        <ul className="mt-10 list-disc space-y-2 border-t border-rule pt-8 pl-6 text-body text-ink-soft marker:text-oxblood">
          <li>
            <span className="font-mono text-meta uppercase tracking-wider text-ink">
              RSS:
            </span>{" "}
            point any reader at{" "}
            <Link
              href="/feed.xml"
              className="underline decoration-rule underline-offset-4 hover:text-oxblood"
            >
              /feed.xml
            </Link>{" "}
            and every episode lands the moment it ships.
          </li>
          <li>
            <span className="font-mono text-meta uppercase tracking-wider text-ink">
              GitHub:
            </span>{" "}
            watch{" "}
            <a
              href="https://github.com/baagad-ai/papersinthewild/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-rule underline-offset-4 hover:text-oxblood"
            >
              Releases on the repo ↗
            </a>{" "}
            and get a notification per episode.
          </li>
          <li>
            <span className="font-mono text-meta uppercase tracking-wider text-ink">
              Email:
            </span>{" "}
            questions, receipts, paper tips to{" "}
            <a
              href="mailto:baagad.ai@gmail.com"
              className="underline decoration-rule underline-offset-4 hover:text-oxblood"
            >
              baagad.ai@gmail.com
            </a>
            . The form above is the only signup; everything else is optional.
          </li>
        </ul>
      </section>
    </div>
  );
}
