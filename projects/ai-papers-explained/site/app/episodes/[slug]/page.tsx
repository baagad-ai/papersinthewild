import { notFound } from "next/navigation";
import { getEpisode, episodes } from "@/content/episodes";
import { episodeContent } from "@/content/episode-content";
import { InkRule } from "@/components/ink-rule";
import { Ep } from "@/components/ep";
import Link from "next/link";

export async function generateStaticParams() {
  return episodes.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ep = getEpisode(slug);
  if (!ep) return {};
  return {
    title: `${ep.title} — Papers in the Wild`,
    description: ep.teaser,
    openGraph: {
      title: ep.title,
      description: ep.teaser,
      type: "article",
      publishedTime: ep.date,
      authors: ["Baagad"],
    },
  };
}

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ep = getEpisode(slug);
  if (!ep) notFound();

  const Content = episodeContent[ep.slug];
  if (!Content) {
    return (
      <article className="mx-auto px-6 py-16" style={{ maxWidth: "var(--article-width)" }}>
        <p className="font-body italic text-ink-mute">
          Episode content not registered for slug &quot;{ep.slug}&quot;.
        </p>
      </article>
    );
  }

  // Find prev/next
  const idx = episodes.findIndex((e) => e.slug === ep.slug);
  const prev = idx > 0 ? episodes[idx - 1] : null;
  const next = idx < episodes.length - 1 ? episodes[idx + 1] : null;

  return (
    <article
      className="mx-auto px-6 py-16"
      style={{ maxWidth: "var(--article-width)" }}
    >
      {/* Meta strip */}
      <div className="mb-8 flex items-center justify-between font-mono text-meta uppercase tracking-wider text-ink-mute">
        <Ep n={ep.episode} />
        <span>{ep.date}</span>
      </div>

      {/* Title */}
      <h1 className="mb-4 font-display text-display leading-[1.05] text-ink">
        {ep.title}
      </h1>

      {/* Subtitle */}
      {ep.subtitle && (
        <p className="mb-6 max-w-[42rem] font-display text-h3 italic text-ink-soft">
          {ep.subtitle}
        </p>
      )}

      {/* Byline */}
      <div className="mb-4 font-mono text-meta uppercase tracking-wider text-ink-mute">
        By Baagad · {ep.readingTime} · {ep.tags.join(" · ")}
      </div>

      {/* Paper attribution */}
      <p className="mb-4 font-body italic text-meta text-ink-mute">
        Paper:{" "}
        <a
          href={ep.paperUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-rule underline-offset-4 hover:text-oxblood"
        >
          {ep.paper}
        </a>
      </p>

      <InkRule />

      {/* MDX content */}
      <div className="episode-content">
        <Content />
      </div>

      <InkRule />

      {/* Footer nav */}
      <nav className="mt-8 grid gap-6 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/episodes/${prev.slug}`}
            className="group border border-rule bg-paper-deep p-5 hover:border-l-oxblood hover:bg-paper transition-colors duration-base"
          >
            <div className="mb-2 font-mono text-[0.7rem] uppercase tracking-wider text-ink-mute">
              ← Previous
            </div>
            <div className="font-display text-body text-ink group-hover:text-oxblood">
              {prev.title}
            </div>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/episodes/${next.slug}`}
            className="group border border-rule bg-paper-deep p-5 text-right hover:border-r-oxblood hover:bg-paper transition-colors duration-base"
          >
            <div className="mb-2 font-mono text-[0.7rem] uppercase tracking-wider text-ink-mute">
              Next →
            </div>
            <div className="font-display text-body text-ink group-hover:text-oxblood">
              {next.title}
            </div>
          </Link>
        ) : (
          <div className="border border-dashed border-rule bg-paper-deep p-5 text-right">
            <div className="mb-2 font-mono text-[0.7rem] uppercase tracking-wider text-ink-mute">
              Next →
            </div>
            <div className="font-display italic text-body text-ink-mute">
              Friday. Subscribe.
            </div>
          </div>
        )}
      </nav>
    </article>
  );
}
