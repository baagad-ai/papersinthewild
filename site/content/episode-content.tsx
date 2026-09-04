import type { ComponentType } from "react";
import Episode1 from "./episodes/2026-w33-prompt-induced-waste.mdx";
import Episode2 from "./episodes/2026-w34-mind-viruses.mdx";
import Episode3 from "./episodes/2026-w35-agent-skills-decay.mdx";
import Episode4 from "./episodes/2026-w36-engine-as-referee.mdx";

/**
 * Episode content registry.
 *
 * Each MDX file is imported as a React component and registered here.
 * To add an episode:
 *   1. Write content/episodes/{slug}.mdx
 *   2. Import it here and add to the map.
 *   3. Also add metadata to content/episodes.ts
 *
 * 2026-08-28: former Episode 3 (catastrophic-remembering) removed entirely
 * by user decision; Episodes 4-6 renumbered to 3-5. Slugs unchanged.
 */
export const episodeContent: Record<string, ComponentType> = {
  "2026-w33-prompt-induced-waste": Episode1,
  "2026-w34-mind-viruses": Episode2,
  "2026-w35-agent-skills-decay": Episode3,
  "2026-w36-engine-as-referee": Episode4,
};
