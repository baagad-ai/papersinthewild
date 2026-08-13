import { InkRule } from "@/components/ink-rule";
import { SealMark } from "@/components/seal-mark";

export const metadata = {
  title: "About — Papers in the Wild",
  description:
    "A weekly publication of experiments on real AI research papers. Curious explorer, not guru.",
};

export default function AboutPage() {
  return (
    <div
      className="mx-auto px-6 py-24"
      style={{ maxWidth: "var(--article-width)" }}
    >
      <div className="mb-6 font-mono text-meta uppercase tracking-wider text-ink-mute">
        Colophon
      </div>
      <h1 className="mb-8 font-display text-display text-ink">
        About Papers in the Wild
      </h1>
      <InkRule />

      <p className="mb-6 text-h3 text-ink">
        A weekly publication of experiments on real AI research papers.
        Every Friday: one paper, one real test, the receipts.
      </p>

      <p className="mb-6 text-body text-ink-soft">
        Papers in the Wild sits between two common kinds of AI writing. On
        one side: the explainer post, a dry summary that never tries anything
        with the paper. On the other: the hype thread, big claims with no
        specifics and no source. Neither teaches the reader anything they
        can use.
      </p>

      <p className="mb-6 text-body text-ink-soft">
        This publication is the third thing. Each episode takes a recent AI
        paper, finds a use case worth testing for real, builds it, and writes
        up what happened. Failures are content. Numbers are sourced. Every
        claim is cited. The work is replicable from the artifacts in the
        repository.
      </p>

      <h2 className="mt-16 mb-4 font-display text-h2 text-ink">
        Editorial commitments
      </h2>
      <ul className="mb-6 list-disc space-y-2 pl-6 text-body text-ink-soft marker:text-oxblood">
        <li>Curious explorer, not guru on a stage.</li>
        <li>Receipts over rhetoric. Every number has a source.</li>
        <li>Honest about failures. They teach more than wins.</li>
        <li>Cite every paper. Link every repo. Show every diff.</li>
        <li>Terser, not longer. Cut anything that does not carry weight.</li>
      </ul>

      <h2 className="mt-16 mb-4 font-display text-h2 text-ink">
        How papers are picked
      </h2>
      <p className="mb-6 text-body text-ink-soft">
        From{" "}
        <a
          href="https://github.com/dair-ai/AI-Papers-of-the-Week"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-rule underline-offset-4 hover:text-oxblood"
        >
          dair-ai/AI-Papers-of-the-Week
        </a>
        , a community-curated weekly list. Filters: free arXiv link, accessible
        topic, bonus points for memeable or culturally relevant. If a paper
        looks worth a real-world test, it goes in.
      </p>

      <h2 className="mt-16 mb-4 font-display text-h2 text-ink">Colophon</h2>
      <p className="mb-6 text-body text-ink-soft">
        Set in <strong className="text-ink">Fraunces</strong> (display),{" "}
        <strong className="text-ink">Source Serif 4</strong> (body), and{" "}
        <strong className="text-ink">IBM Plex Mono</strong> (numbers, code,
        timestamps). Built on Next.js 15 with owned shadcn-style components.
        Static-exported to GitHub Pages. The site code is in the{" "}
        <a
          href="https://github.com/baagad-ai/papersinthewild/tree/main/site"
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-rule underline-offset-4 hover:text-oxblood"
        >
          site/
        </a>{" "}
        directory of the public repository.
      </p>

      <h2 className="mt-16 mb-4 font-display text-h2 text-ink">Cadence</h2>
      <p className="mb-6 text-body text-ink-soft">
        One episode every Friday. Source list, experiment code, raw trial
        data, and an honest writeup ship together in the same commit.
      </p>

      <div className="mt-16 flex justify-center">
        <SealMark className="h-24 w-24" />
      </div>
      <p className="mt-4 text-center font-mono text-meta uppercase tracking-wider text-ink-mute">
        papers in the wild · est. 2026
      </p>
    </div>
  );
}
