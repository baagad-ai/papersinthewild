import { notFound } from "next/navigation";
import { getEpisode, episodes } from "@/content/episodes";
import { episodeContent } from "@/content/episode-content";
import { InkRule } from "@/components/ink-rule";
import { Ep } from "@/components/ep";
import { PaperCard } from "@/components/paper-card";
import { ChapterProgress } from "@/components/chapter-progress";
import { absUrl } from "@/app/lib/site";
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
    title: `${ep.title}: Papers in the Wild`,
    description: ep.teaser,
    openGraph: {
      title: ep.title,
      description: ep.teaser,
      type: "article",
      publishedTime: ep.date,
      authors: ["Baagad"],
      images: [
        {
          url: absUrl(`/og/${ep.slug}.png`),
          width: 1200,
          height: 630,
          alt: ep.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ep.title,
      description: ep.teaser,
      images: [absUrl(`/og/${ep.slug}.png`)],
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

  // Related: episodes sharing at least one tag, excluding this one
  const related = episodes
    .filter((e) => e.slug !== ep.slug && e.tags.some((t) => ep.tags.includes(t)))
    .slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: ep.title,
    description: ep.teaser,
    datePublished: ep.date,
    author: { "@type": "Person", name: "Baagad" },
    mainEntityOfPage: absUrl(`/episodes/${ep.slug}`),
    image: absUrl(`/og/${ep.slug}.png`),
    keywords: ep.tags.join(", "),
  };

  return (
    <article
      className="mx-auto px-6 py-16"
      style={{ maxWidth: "var(--article-width)" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ChapterProgress />
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

      {/* Footer nav: bento-style prev / next cards */}
      <nav className="mt-8 grid gap-6 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/episodes/${prev.slug}`}
            className="group border border-rule bg-paper-deep p-5 shadow-[var(--shadow-ink)] transition-all duration-base hover:-translate-y-0.5 hover:border-l-oxblood hover:bg-paper"
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
            className="group border border-rule bg-paper-deep p-5 text-right shadow-[var(--shadow-ink)] transition-all duration-base hover:-translate-y-0.5 hover:border-r-oxblood hover:bg-paper"
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

      {/* Related episodes */}
      {related.length > 0 && (
        <section className="mt-16">
          <div className="mb-8 font-mono text-meta uppercase tracking-wider text-ink-mute">
            Related experiments
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {related.map((rel) => (
              <PaperCard
                key={rel.slug}
                slug={rel.slug}
                episode={rel.episode}
                title={rel.title}
                date={rel.date}
                teaser={rel.teaser}
                readingTime={rel.readingTime}
              />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
