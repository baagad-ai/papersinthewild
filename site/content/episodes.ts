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
];

export function getEpisode(slug: string): Episode | undefined {
  return episodes.find((e) => e.slug === slug);
}

export function getLatestEpisode(): Episode {
  return episodes[episodes.length - 1];
}
