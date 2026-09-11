import Link from "next/link";
import { Ep } from "@/components/ep";
import { InkRule } from "@/components/ink-rule";
import { PlaybackStreet } from "@/components/playback-street";
import playback from "@/content/playback/market-street.json";

export const metadata = {
  title: "Market Street: the full 30-day playback: Papers in the Wild",
  description:
    "Every day of the Market Street simulation, from the season's own receipts: deals, sales, scams, bankruptcies, and the closing bell. Twelve AI models, one street, pokeable.",
};

export default function PlaybackPage() {
  const ep = { n: 5, slug: "2026-w37-market-street" };
  return (
    <article
      className="mx-auto px-6 py-16"
      style={{ maxWidth: "var(--article-width)" }}
    >
      <div className="mb-8 flex items-center justify-between font-mono text-meta uppercase tracking-wider text-ink-mute">
        <Ep n={ep.n} />
        <span>simulation playback</span>
      </div>

      <h1 className="mb-4 font-display text-display leading-[1.05] text-ink">
        Market Street, every day
      </h1>
      <p className="mb-2 max-w-[42rem] font-body text-body text-ink-soft">
        The whole 30-day season, replayed from its own receipts: what every stall
        bought, sold, paid to scammers, and lost to the clock. Press play, or
        walk the days yourself. Click a stall to follow only its month.
      </p>
      <p className="mb-6 font-mono text-meta uppercase tracking-wider text-ink-mute">
        <Link
          href={`/episodes/${playback.slug}`}
          className="underline decoration-rule underline-offset-4 hover:text-oxblood"
        >
          ← back to the article
        </Link>
      </p>

      <InkRule />

      <PlaybackStreet data={playback} />

      <InkRule />

      <p className="font-body text-body text-ink-soft">
        Twelve models opened stalls with ₹100,000 each on the same deterministic
        street: same weather, same customers, same scammers for everyone. Four
        stalls went bankrupt, the frontier guest finished second, a stall that
        never chose what to sell finished third, and the winner spent the season
        buying from a supplier that kept a fifth of every order. The full story
        is in{" "}
        <Link
          href={`/episodes/${playback.slug}`}
          className="underline decoration-rule underline-offset-4 hover:text-oxblood"
        >
          the article
        </Link>
        ; the paper behind it is E-Commerce Bench (arXiv 2608.30730).
      </p>
    </article>
  );
}
