import type { ComponentType } from "react";
import Episode1 from "./episodes/2026-w33-prompt-induced-waste.mdx";
import Episode2 from "./episodes/2026-w34-mind-viruses.mdx";

/**
 * Episode content registry.
 *
 * Each MDX file is imported as a React component and registered here.
 * To add an episode:
 *   1. Write content/episodes/{slug}.mdx
 *   2. Import it here and add to the map.
 *   3. Also add metadata to content/episodes.ts
 */
export const episodeContent: Record<string, ComponentType> = {
  "2026-w33-prompt-induced-waste": Episode1,
  "2026-w34-mind-viruses": Episode2,
};
