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
  {
    slug: "2026-w35-terminal-intent-facet",
    episode: 4,
    slot: "b",
    archetype: "trial_ledger",
    title: "Desynced.",
    subtitle:
      "I bent the answer key and kept the questions perfect. Across 96 graded runs, every failure I can fully receipt was loud. The one silent misgrade on record destroyed its own evidence.",
    hook: "Ninety-six graded runs against bent answer keys produced failures that all yelled. The single silent misgrade erased its own evidence before lunch.",
    date: "2026-08-25",
    paper: "FACET",
    paperUrl: "https://arxiv.org/abs/2608.18580",
    tags: ["evals", "coding-agents", "verification"],
    readingTime: "8 min read",
    teaser:
      "Four toy terminal jobs, four models, one answer key quietly bent so anything passes. Every provable failure was loud, on camera, with error messages. The only silent misgrade came from my own rig, which overwrote its tally before any transcript existed. Invoice: ₹0.99 ($0.01).",
  },
  {
    slug: "2026-w35-adaptive-gym",
    episode: 5,
    slot: "a",
    archetype: "field_trip",
    title: "Open-Book.",
    subtitle:
      "Four AI students carried their own notes into two exams: one drilled, one never seen. Answer-sheets aced the homework and taught nothing. Written rules helped a little. Nobody beat walking in cold.",
    hook: "Handing an AI the perfect answer key made the best student in the room 19 points worse at new questions.",
    date: "2026-08-28",
    paper: "EnvHarness",
    paperUrl: "https://arxiv.org/abs/2608.19880",
    tags: ["llm-agents", "evals", "local-models"],
    readingTime: "8 min read",
    teaser:
      "Three notebooks, two exams: answers aced the homework at 100% and transferred almost nothing; self-written rules helped only the students who could write them; and the cold-walk-in girl outscored every notebook in the room. ₹30.15 ($0.315), three grids, all receipts.",
  },

];

export function getEpisode(slug: string): Episode | undefined {
  return episodes.find((e) => e.slug === slug);
}

export function getLatestEpisode(): Episode {
  return episodes[episodes.length - 1];
}
