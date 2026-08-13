import Link from "next/link";
import { cn } from "@/lib/utils";
import { Ep } from "./ep";

/**
 * PaperCard — episode preview card for the index page.
 */
export function PaperCard({
  slug,
  episode,
  title,
  date,
  teaser,
  readingTime,
  className,
}: {
  slug: string;
  episode: number;
  title: string;
  date: string;
  teaser: string;
  readingTime: string;
  className?: string;
}) {
  return (
    <Link
      href={`/episodes/${slug}`}
      className={cn(
        "group block border border-rule bg-paper-deep p-6",
        "hover:border-l-[3px] hover:border-l-oxblood hover:bg-paper",
        "transition-colors duration-base",
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between font-mono text-[0.75rem] uppercase tracking-wider text-ink-mute">
        <Ep n={episode} />
        <span>{date}</span>
      </div>
      <h3 className="mb-3 font-display text-h3 leading-tight text-ink group-hover:text-oxblood transition-colors duration-base">
        {title}
      </h3>
      <p className="mb-4 text-[1rem] text-ink-soft line-clamp-2">{teaser}</p>
      <div className="flex items-center justify-between font-mono text-[0.75rem] uppercase tracking-wider text-ink-mute">
        <span>{readingTime}</span>
        <span className="text-oxblood group-hover:translate-x-1 transition-transform duration-base">
          read →
        </span>
      </div>
    </Link>
  );
}
