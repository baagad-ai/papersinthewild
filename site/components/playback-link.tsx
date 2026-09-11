import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * PlaybackLink - a ruled band inviting the reader into the episode's
 * simulation playback page. Static, no JS. The arrow is typographic, the
 * label is the promise: the whole season, pokeable.
 *
 * Usage in MDX:
 *   <PlaybackLink href="/playback/2026-w37-market-street" />
 */
export function PlaybackLink({
  href,
  label = "The full 30-day playback",
  note = "Every deal, sale, scam, and bankruptcy, day by day, straight from the season's receipts.",
  className,
}: {
  href: string;
  label?: string;
  note?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group my-10 block border border-rule bg-paper-deep px-5 py-4 transition-colors duration-[var(--motion-fast)] hover:border-oxblood",
        className
      )}
    >
      <span className="flex items-baseline justify-between gap-4">
        <span>
          <span className="block font-display text-[1.15rem] text-ink group-hover:text-oxblood">
            {label}
          </span>
          <span className="mt-0.5 block font-body text-[0.85rem] text-ink-soft">
            {note}
          </span>
        </span>
        <span
          aria-hidden
          className="shrink-0 font-mono text-[1.1rem] text-oxblood transition-transform duration-[var(--motion-fast)] group-hover:translate-x-1"
        >
          →
        </span>
      </span>
    </Link>
  );
}
