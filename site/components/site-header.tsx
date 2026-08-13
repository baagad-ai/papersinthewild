import Link from "next/link";
import { Subscribe } from "@/components/subscribe";

/**
 * SiteHeader — sticky top navigation.
 * Compact wordmark left, nav right, Subscribe as the final CTA.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/95 backdrop-blur-sm">
      <div
        className="mx-auto flex items-center justify-between px-6"
        style={{ height: "var(--nav-height)", maxWidth: "var(--page-width)" }}
      >
        <Link
          href="/"
          className="font-mono text-[0.95rem] lowercase tracking-tight text-ink hover:text-oxblood transition-colors duration-base"
        >
          papers in the wild
        </Link>
        <nav className="flex items-center gap-8 font-mono text-[0.75rem] uppercase tracking-wider text-ink-mute">
          <Link
            href="/"
            className="hover:text-oxblood transition-colors duration-base"
          >
            Episodes
          </Link>
          <Link
            href="/about"
            className="hover:text-oxblood transition-colors duration-base"
          >
            About
          </Link>
          <Link
            href="/sources"
            className="hover:text-oxblood transition-colors duration-base"
          >
            Sources
          </Link>
          <a
            href="https://github.com/baagad-ai/papersinthewild"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-oxblood transition-colors duration-base"
          >
            Repo ↗
          </a>
          <span className="h-4 w-px bg-rule" aria-hidden />
          <Subscribe variant="link" />
        </nav>
      </div>
    </header>
  );
}
