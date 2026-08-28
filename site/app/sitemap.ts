import type { MetadataRoute } from "next";
import { episodes } from "@/content/episodes";
import { absUrl } from "@/app/lib/site";

/**
 * Static sitemap. Next writes <loc> values verbatim (it does not prepend
 * the basePath), so every URL goes through absUrl().
 */

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/about", "/design", "/start-here"];

  const topicPaths = [
    ...new Set(episodes.flatMap((ep) => ep.tags)),
  ].map((tag) => `/topics/${tag}`);

  const episodePaths = episodes.map((ep) => `/episodes/${ep.slug}`);

  return [...staticPaths, ...topicPaths, ...episodePaths].map((path) => ({
    url: absUrl(path),
    lastModified: new Date(),
  }));
}
