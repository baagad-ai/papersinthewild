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
    title: "I built a drawer of lies for my AI. The obedient one reached for a fake.",
    subtitle:
      "Four AI models, a drawer of one-line skills, two counterfeit entries. One model picked the fake and executed it perfectly. One quit picking entirely. And the grader failed the only immaculate answer.",
    hook: "The most obedient model read two nearly identical skills, picked the counterfeit, and followed its instructions with total confidence. The tidy JSON scrambled all three parameters.",
    date: "2026-08-29",
    paper: "Demystifying Agent Skills",
    paperUrl: "https://arxiv.org/abs/2608.14036",
    tags: ["llm-agents", "retrieval", "local-models"],
    readingTime: "9 min read",
    teaser:
      "I put two fake skills in my AI's drawer. The most obedient model grabbed one and followed it perfectly, scrambling every parameter in tidy JSON. The smallest model stopped picking altogether. And the regex grader failed the one answer that was completely correct. 72 graded runs, total invoice ₹1.19 ($0.0125).",
  },
  {
    slug: "2026-w36-engine-as-referee",
    episode: 4,
    title: "The judge who never looked gave my AI's broken levels 8 out of 10.",
    subtitle:
      "Three AI desks designed game levels for a week. The judge who read only the pitches scored every broken level 8 out of 10. The judge who opened the files answered in coordinates, and taught the only desk that listened.",
    hook: "The judge who never opened a file gave ten broken levels a cheerful 8 out of 10. The judge that opened everything never used an adjective in its life.",
    date: "2026-09-04",
    paper: "Agentic Game Development as a Verifiable Trajectory Data Engine for Scaling World Models",
    paperUrl: "https://arxiv.org/abs/2608.25518",
    tags: ["llm-agents", "reinforcement-learning", "local-models"],
    readingTime: "11 min read",
    teaser:
      "I ran an AI game studio with two judges: one opened every file and answered in coordinates, one read only the pitches and scored every broken level 8 out of 10. The desk that listened to the coordinates learned to build. The desk that listened to the praise learned to write better praise. 49 submissions, 16 verdicts, ₹0 ($0).",
  },

];

export function getEpisode(slug: string): Episode | undefined {
  return episodes.find((e) => e.slug === slug);
}

export function getLatestEpisode(): Episode {
  return episodes[episodes.length - 1];
}
