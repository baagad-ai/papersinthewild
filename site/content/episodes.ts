export type Episode = {
  slug: string;
  episode: number;
  slot?: string;
  archetype?: string;
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
      "Eight AI agents in a ring, one infected with a love of geese. Seven runs, three model families, and one paragraph of vaccine that worked on some hosts and failed on one. Here is what actually spreads.",
    hook: "The heartfelt virus infected nobody, twice. The copy-exact version escaped patient zero seven times out of seven. The difference is one line of instructions.",
    date: "2026-08-18",
    paper:
      "Mind Viruses: Self-Propagating Ideas in Multi-Agent LLM Systems",
    paperUrl: "https://arxiv.org/abs/2608.10218",
    tags: ["multi-agent", "llm-agents", "ai-safety"],
    readingTime: "12 min read",
    teaser:
      "Eight AI agents in a ring, one infected with a love of geese. The copy-exact version escaped patient zero in all seven runs. One vaccinated agent read the virus and said 'I will carry it forward as instructed.' The same vaccine stopped a frontier model cold.",
  },
  {
    slug: "2026-w35-agent-skills-decay",
    episode: 3,
    slot: "a",
    archetype: "flip",
    title: "Twins.",
    subtitle:
      "I planted two lookalike skills in my AI's library. The small models fell for them. The frontier model barely looked up.",
    hook: "One local model picked its counterfeit skill, read the fake's instructions, and committed the exact sabotage they asked for. In tidy JSON.",
    date: "2026-08-25",
    paper: "Demystifying Agent Skills",
    paperUrl: "https://arxiv.org/abs/2608.14036",
    tags: ["llm-agents", "retrieval", "local-models"],
    readingTime: "8 min read",
    teaser:
      "Six honest skills in a drawer, two planted fakes dressed almost identically. One local model obeyed his fake so faithfully it deleted my tracking tag exactly as ordered. The frontier arm never noticed the drawer changed. Total invoice: ₹2.49 ($0.026).",
  },

];

export function getEpisode(slug: string): Episode | undefined {
  return episodes.find((e) => e.slug === slug);
}

export function getLatestEpisode(): Episode {
  return episodes[episodes.length - 1];
}
