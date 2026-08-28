import Link from "next/link";
import { Subscribe } from "@/components/subscribe";

/**
 * SiteHeader - sticky top navigation.
 * Compact wordmark left; on desktop the full nav sits inline right.
 * Below 1024px the brand and "Start here" stay visible and the rest
 * of the nav collapses into a <details> burger drawer anchored
 * under the header bar (pure CSS, no client JS).
 */
export function SiteHeader() {
  const linkClass =
    "hover:text-oxblood transition-colors duration-base";

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/95 backdrop-blur-sm">
      <div
        className="relative mx-auto flex items-center justify-between px-[var(--container-pad)]"
        style={{ height: "var(--nav-height)", maxWidth: "var(--page-width)" }}
      >
        <Link
          href="/"
          className="font-mono text-[0.95rem] lowercase tracking-tight text-ink hover:text-oxblood transition-colors duration-base"
        >
          papers in the wild
        </Link>

        {/* Desktop nav: drawer dissolves into this row via display:contents */}
        <nav className="hidden items-center gap-8 font-mono text-[0.75rem] uppercase tracking-wider text-ink-mute lg:flex">
          <Link href="/start-here" className={linkClass}>
            Start here
          </Link>
          <details className="nav-drawer">
            <summary aria-label="Menu" className="text-ink-mute hover:text-ink transition-colors duration-base">
              <span className="burger" aria-hidden>
                <span />
                <span />
                <span />
              </span>
            </summary>
            <div className="nav-drawer-panel">
              <Link href="/" className={linkClass}>
                Episodes
              </Link>
              <Link href="/about" className={linkClass}>
                About
              </Link>
              <Link href="/sources" className={linkClass}>
                Sources
              </Link>
              <a
                href="https://github.com/baagad-ai/papersinthewild"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Repo ↗
              </a>
              <span className="nav-divider h-4 w-px bg-rule" aria-hidden />
              <Subscribe variant="link" />
            </div>
          </details>
        </nav>

        {/* Mobile cluster: Start here stays visible, rest goes in the drawer */}
        <div className="flex items-center gap-5 lg:hidden">
          <Link
            href="/start-here"
            className={`font-mono text-[0.75rem] uppercase tracking-wider ${linkClass}`}
          >
            Start here
          </Link>
          <details className="nav-drawer text-ink-mute">
            <summary aria-label="Menu" className="hover:text-ink transition-colors duration-base">
              <span className="burger" aria-hidden>
                <span />
                <span />
                <span />
              </span>
            </summary>
            <div className="nav-drawer-panel font-mono text-[0.75rem] uppercase tracking-wider text-ink-mute">
              <Link href="/" className={linkClass}>
                Episodes
              </Link>
              <Link href="/about" className={linkClass}>
                About
              </Link>
              <Link href="/sources" className={linkClass}>
                Sources
              </Link>
              <a
                href="https://github.com/baagad-ai/papersinthewild"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Repo ↗
              </a>
              <Subscribe variant="link" />
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
