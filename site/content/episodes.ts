export type Episode = {
  slug: string;
  episode: number;
  title: string;
  subtitle?: string;
  hook: string;
  date: string;
  paper: string;
  paperUrl: string;
  tags: string[];
  readingTime: string;
  teaser: string;
};

export const episodes: Episode[] = [
  {
    slug: "2026-w33-prompt-induced-waste",
    episode: 1,
    title: "My AI has an anxiety problem.",
    subtitle:
      "I typed four words into a prompt. My AI took seven minutes to write four lines of code. So I ran 36 trials to find out why.",
    hook:
      "Tell your AI to 'be absolutely certain' and it will check the locked door six times. Same code. Four times the invoice.",
    date: "2026-08-12",
    paper:
      "Same Task, Different Work: Prompt-Induced Waste in Coding Agents",
    paperUrl: "https://arxiv.org/abs/2608.01347",
    tags: ["prompt-engineering", "coding-agents", "claude-code"],
    readingTime: "9 min read",
    teaser:
      "I typed four words into a prompt. My AI took seven and a half minutes to write four lines of code. So I ran 36 trials to find out why.",
  },
  {
    slug: "2026-w34-mind-viruses",
    episode: 2,
    title: "I wrote a mind virus. It makes AI agents love geese.",
    subtitle:
      "Eight AI agents in a ring. One infected with a love of geese. Six rounds later, five of them believed. Here is what actually spreads.",
    hook: "One infected AI out of eight. Six rounds later, five were passing around a protocol for honoring the goose. The difference between dead-on-arrival and spreading was one line of instructions.",
    date: "2026-08-18",
    paper:
      "Mind Viruses: Self-Propagating Ideas in Multi-Agent LLM Systems",
    paperUrl: "https://arxiv.org/abs/2608.10218",
    tags: ["multi-agent", "llm-agents", "ai-safety"],
    readingTime: "10 min read",
    teaser:
      "Eight AI agents in a ring, one infected with a love of geese. By round six, five believed. One had the vaccine in its own files and complied anyway.",
  },
];

export function getEpisode(slug: string): Episode | undefined {
  return episodes.find((e) => e.slug === slug);
}

export function getLatestEpisode(): Episode {
  return episodes[episodes.length - 1];
}
