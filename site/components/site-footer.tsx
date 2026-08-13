import Link from "next/link";
import { SealMark } from "./seal-mark";

/**
 * SiteFooter — three-column footer.
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
              I read a paper. I tried it. Here are the receipts.
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
                  <a href="#" className="hover:text-oxblood">
                    LinkedIn ↗
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-oxblood">
                    Subscribe (soon)
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Seal */}
          <div className="flex flex-col items-start gap-4 md:items-end">
            <SealMark className="h-16 w-16" />
            <p className="font-mono text-[0.7rem] uppercase tracking-wider text-ink-mute">
              made by Baagad, in the wild
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
