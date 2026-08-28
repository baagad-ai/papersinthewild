/**
 * Site URL constants.
 *
 * The site is statically exported to GitHub Pages project pages, so every
 * hand-written absolute URL (RSS, sitemap, JSON-LD, OG images) must include
 * the basePath. metadataBase stays origin-only so Next can still resolve
 * relative metadata entries itself.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://baagad-ai.github.io";

export const BASE_PATH = "/papersinthewild";

export const SITE_ORIGIN_URL = `${SITE_URL}${BASE_PATH}`;

/** Build an absolute site URL from a root-relative path like "/feed.xml". */
export function absUrl(path: string): string {
  return `${SITE_ORIGIN_URL}${path}`;
}
