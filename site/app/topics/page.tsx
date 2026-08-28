import type { Metadata } from "next";
import Link from "next/link";
import { episodes } from "@/content/episodes";
import { InkRule } from "@/components/ink-rule";

/**
 * Topic index: one bordered card per tag, derived from episode metadata.
 */

export const metadata: Metadata = {
  title: "Topics: Papers in the Wild",
  description: "Every topic covered across the Papers in the Wild episodes.",
};

export default function TopicsPage() {
  const tags = [...new Set(episodes.flatMap((ep) => ep.tags))].sort();

  return (
    <div className="mx-auto px-6 py-24" style={{ maxWidth: "var(--page-width)" }}>
      <div className="mb-6 font-mono text-meta uppercase tracking-wider text-ink-mute">
        Browse by topic
      </div>
      <h1 className="mb-4 font-display text-display text-ink">Topics</h1>
      <p className="mb-8 max-w-[36rem] text-h3 italic text-ink-soft">
        Every tag in the wild, and the episodes that carry it.
      </p>

      <InkRule />

      <div className="grid gap-6 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {tags.map((tag) => {
          const count = episodes.filter((ep) => ep.tags.includes(tag)).length;
          return (
            <Link
              key={tag}
              href={`/topics/${tag}`}
              className="group border border-rule bg-paper-deep p-6 hover:border-l-[3px] hover:border-l-oxblood hover:bg-paper transition-colors duration-base"
            >
              <div className="font-display text-body text-ink group-hover:text-oxblood transition-colors duration-base">
                #{tag}
              </div>
              <div className="mt-2 font-mono text-[0.75rem] uppercase tracking-wider text-ink-mute">
                {count} {count === 1 ? "episode" : "episodes"}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
