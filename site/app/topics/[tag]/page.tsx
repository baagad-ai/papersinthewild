import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { episodes } from "@/content/episodes";
import { InkRule } from "@/components/ink-rule";
import { PaperCard } from "@/components/paper-card";

/**
 * Topic archive: every episode touching a given tag.
 * Tags are derived from content/episodes.ts, never hard-coded.
 */

export function generateStaticParams() {
  return [...new Set(episodes.flatMap((ep) => ep.tags))].map((tag) => ({
    tag,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  return {
    title: `${tag}: Papers in the Wild`,
    description: `Episodes touching ${tag}.`,
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const matching = episodes.filter((ep) => ep.tags.includes(tag));
  if (matching.length === 0) notFound();

  // Newest first, matching the home page ordering
  const sorted = [...matching].reverse();

  return (
    <div className="mx-auto px-6 py-24" style={{ maxWidth: "var(--page-width)" }}>
      <div className="mb-6 font-mono text-meta uppercase tracking-wider text-ink-mute">
        Topic
      </div>
      <h1 className="mb-4 font-display text-display text-ink">{tag}</h1>
      <p className="mb-8 text-h3 italic text-ink-soft">
        Episodes touching {tag}
      </p>

      <InkRule />

      <div className="grid gap-6 pb-24 md:grid-cols-2 lg:grid-cols-3">
        {sorted.map((ep) => (
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

      <p className="pb-24 font-mono text-meta uppercase tracking-wider text-ink-mute">
        <Link
          href="/topics"
          className="hover:text-oxblood transition-colors duration-base"
        >
          ← All topics
        </Link>
      </p>
    </div>
  );
}
