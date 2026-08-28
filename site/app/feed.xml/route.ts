import { episodes } from "@/content/episodes";
import { SITE_ORIGIN_URL, absUrl } from "@/app/lib/site";

/**
 * RSS 2.0 feed, statically generated at build time.
 *
 * Served at /feed.xml (under basePath: /papersinthewild/feed.xml).
 * Buttondown's RSS-to-email can point at this URL so the Friday
 * newsletter drafts itself from new episodes.
 */

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function GET() {
  const items = episodes
    .map((ep) => {
      const link = absUrl(`/episodes/${ep.slug}`);
      return [
        "    <item>",
        `      <title>${escapeXml(ep.title)}</title>`,
        `      <link>${link}</link>`,
        `      <guid>${link}</guid>`,
        `      <pubDate>${new Date(ep.date).toUTCString()}</pubDate>`,
        `      <description>${escapeXml(ep.teaser)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Papers in the Wild</title>
    <link>${SITE_ORIGIN_URL}</link>
    <description>I read a paper. I tried it. Here are the receipts.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
