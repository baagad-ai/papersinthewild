import Link from "next/link";
import { PaperCard } from "@/components/paper-card";
import { InkRule } from "@/components/ink-rule";
import { SealMark } from "@/components/seal-mark";
import { episodes } from "@/content/episodes";

export default function Home() {
  const latest = episodes[episodes.length - 1];
  const rest = episodes.slice(0, -1).reverse();

  return (
    <div className="mx-auto px-6" style={{ maxWidth: "var(--page-width)" }}>
      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr] md:items-end">
          <div>
            <div className="mb-6 font-mono text-meta uppercase tracking-wider text-ink-mute">
              Weekly experiments on real AI papers
            </div>
            <h1 className="font-display text-display text-ink">
              Papers in the Wild
            </h1>
            <p className="mt-6 max-w-[28rem] font-body text-h3 italic text-ink-soft">
              I read a paper. I tried it. Here are the receipts.
            </p>
          </div>
          <div className="hidden justify-self-end md:block">
            <SealMark className="h-28 w-28" />
          </div>
        </div>
        <InkRule />
      </section>

      {/* Latest */}
      <section className="pb-16">
        <div className="mb-8 font-mono text-meta uppercase tracking-wider text-ink-mute">
          Latest episode
        </div>
        <Link
          href={`/episodes/${latest.slug}`}
          className="group block border border-rule bg-paper-deep p-10 hover:border-l-[3px] hover:border-l-oxblood hover:bg-paper transition-colors duration-base"
        >
          <div className="mb-4 flex items-center justify-between font-mono text-meta uppercase tracking-wider text-ink-mute">
            <span className="text-oxblood">EP. {String(latest.episode).padStart(2, "0")}</span>
            <span>{latest.date}</span>
          </div>
          <h2 className="mb-4 max-w-[42rem] font-display text-h1 leading-tight text-ink group-hover:text-oxblood transition-colors duration-base">
            {latest.title}
          </h2>
          <p className="mb-6 max-w-[42rem] text-h3 text-ink-soft">
            {latest.teaser}
          </p>
          <div className="flex items-center gap-6 font-mono text-meta uppercase tracking-wider text-ink-mute">
            <span>{latest.readingTime}</span>
            <span className="text-oxblood group-hover:translate-x-1 transition-transform duration-base inline-block">
              read →
            </span>
          </div>
        </Link>
      </section>

      {/* Past episodes (empty for now) */}
      {rest.length > 0 && (
        <section className="pb-24">
          <div className="mb-8 font-mono text-meta uppercase tracking-wider text-ink-mute">
            Previous episodes
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((ep) => (
              <PaperCard
                key={ep.slug}
                slug={ep.slug}
                episode={ep.episode}
                title={ep.title}
                date={ep.date}
                teaser={ep.teaser}
                readingTime={ep.readingTime}
              />
            ))}
          </div>
        </section>
      )}

      {/* About blurb */}
      <section className="border-t border-rule py-24">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <div className="font-mono text-meta uppercase tracking-wider text-ink-mute">
            About
          </div>
          <div className="max-w-[36rem]">
            <p className="mb-4 text-h3 text-ink">
              Every week I pick a recent AI paper, try something real with it,
              and publish the receipts.
            </p>
            <p className="text-body text-ink-soft">
              Curious explorer, not guru. Failures are content. Citations or it
              didn&apos;t happen. Sourced from{" "}
              <a
                href="https://github.com/dair-ai/AI-Papers-of-the-Week"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-rule underline-offset-4 hover:text-oxblood"
              >
                dair-ai/AI-Papers-of-the-Week
              </a>
              . Built in the open by{" "}
              <Link
                href="/about"
                className="underline decoration-rule underline-offset-4 hover:text-oxblood"
              >
                Baagad
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
