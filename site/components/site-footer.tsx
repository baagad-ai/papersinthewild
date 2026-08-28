import Link from "next/link";
import { SealMark } from "./seal-mark";
import { Subscribe } from "./subscribe";

/**
 * SiteFooter - brand left, nav middle, seal + subscribe right.
 */
export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-rule bg-paper">
      <div
        className="mx-auto px-6 py-16"
        style={{ maxWidth: "var(--page-width)" }}
      >
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-3 font-display text-h3 text-ink">
              Papers in the Wild
            </div>
            <p className="font-body italic text-meta text-ink-mute">
              One paper, every Friday. The receipts.
            </p>
            <p className="mt-4 font-mono text-meta text-ink-mute">
              Questions, receipts, paper tips:{" "}
              <a
                href="mailto:baagad.ai@gmail.com"
                className="underline decoration-rule underline-offset-4 hover:text-oxblood transition-colors duration-base"
              >
                baagad.ai@gmail.com
              </a>
            </p>
          </div>

          {/* Nav */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="mb-3 font-mono text-[0.7rem] uppercase tracking-wider text-ink-mute">
                Read
              </div>
              <ul className="space-y-2 font-body text-body text-ink-soft">
                <li>
                  <Link href="/" className="hover:text-oxblood">
                    Latest episode
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-oxblood">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/sources" className="hover:text-oxblood">
                    Sources
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="mb-3 font-mono text-[0.7rem] uppercase tracking-wider text-ink-mute">
                Elsewhere
              </div>
              <ul className="space-y-2 font-body text-body text-ink-soft">
                <li>
                  <a
                    href="https://github.com/baagad-ai/papersinthewild"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-oxblood"
                  >
                    GitHub ↗
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/baagad-ai/papersinthewild"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-oxblood"
                  >
                    Watch for new episodes ↗
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Seal + tagline */}
          <div className="flex flex-col items-start gap-4 md:items-end">
            <SealMark className="h-16 w-16" />
            <p className="font-mono text-[0.7rem] uppercase tracking-wider text-ink-mute">
              papers in the wild · est. 2026
            </p>
          </div>
        </div>

        {/* Subscribe form, full width below the grid */}
        <div className="mt-16 border-t border-rule pt-12">
          <Subscribe variant="form" />
        </div>
      </div>
    </footer>
  );
}
