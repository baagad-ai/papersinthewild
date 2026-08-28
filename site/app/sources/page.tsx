import type { Metadata } from "next";
import { InkRule } from "@/components/ink-rule";

export const metadata: Metadata = {
  title: "Sources: Papers in the Wild",
  description:
    "Where the papers come from: dair-ai's AI-Papers-of-the-Week, Hugging Face Daily Papers, and arXiv. Every claim in every episode is traceable.",
};

const sources = [
  {
    name: "dair-ai/AI-Papers-of-the-Week",
    url: "https://github.com/dair-ai/AI-Papers-of-the-Week",
    role: "The community radar",
    note: "A community-curated weekly shortlist of AI research. Most episodes start here, because a human-filtered list beats a raw firehose for finding papers worth a real-world test.",
  },
  {
    name: "Hugging Face Daily Papers",
    url: "https://huggingface.co/papers",
    role: "The heat check",
    note: "What the field is actually reading and discussing today. Used to cross-check momentum and to catch papers the weekly lists missed.",
  },
  {
    name: "arXiv",
    url: "https://arxiv.org/",
    role: "The primary text",
    note: "Every episode reads the full paper on arXiv, not a summary of a summary. Claims tables cite sections and table numbers so you can check the receipts yourself.",
  },
];

export default function SourcesPage() {
  return (
    <div
      className="mx-auto px-6 py-24"
      style={{ maxWidth: "var(--article-width)" }}
    >
      <div className="mb-6 font-mono text-meta uppercase tracking-wider text-ink-mute">
        Receipts about receipts
      </div>
      <h1 className="mb-8 font-display text-display leading-[1.05] text-ink">
        Sources
      </h1>
      <InkRule />

      <p className="mb-6 text-h3 text-ink">
        Every episode takes one real paper, tries something with it, and shows
        the work. This page is where the paper comes from.
      </p>

      <p className="mb-6 text-body text-ink-soft">
        The selection radar merges two public feeds, dedupes them, and risk
        screens each finalist before anything gets read in full: replication
        cost in rupees, moderation risk, and distance from recent episodes.
        Free arXiv link required; accessible topic preferred; bonus points for
        papers that survive contact with an absurd-but-real use case. The
        backlog lives in the repository next to everything else.
      </p>

      <ul className="mb-6 list-disc space-y-2 pl-6 text-body text-ink-soft marker:text-oxblood">
        <li>Free arXiv link, always. No paywalled primary text.</li>
        <li>Read fully before building. No skimming, no summary-of-summary.</li>
        <li>Pre-registered predictions written down before any code runs.</li>
      </ul>

      {sources.map((source) => (
        <section key={source.name} className="mt-10 border-t border-rule pt-8">
          <div className="mb-1 font-mono text-[0.7rem] uppercase tracking-wider text-ink-mute">
            {source.role}
          </div>
          <h2 className="mb-3 font-display text-h3 text-ink">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-rule underline-offset-4 hover:text-oxblood"
            >
              {source.name}
            </a>
          </h2>
          <p className="text-body text-ink-soft">{source.note}</p>
        </section>
      ))}

      <InkRule />

      <p className="font-mono text-meta uppercase tracking-wider text-ink-mute">
        Questions, corrections, paper tips:{" "}
        <a
          href="mailto:baagad.ai@gmail.com"
          className="normal-case underline decoration-rule underline-offset-4 hover:text-oxblood"
        >
          baagad.ai@gmail.com
        </a>
      </p>
    </div>
  );
}
