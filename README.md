# Papers in the Wild

> Real AI research papers, taken far too literally, once a week. Then the receipts get published.

**Read:** <https://baagad-ai.github.io/papersinthewild/>
**Latest episode:** [The judge who never looked gave my AI's broken levels 8 out of 10.](https://baagad-ai.github.io/papersinthewild/episodes/2026-w36-engine-as-referee)

---

Every week: pick one recent paper, build something small and real against it, and publish what actually happened. Local models first, the bill printed either way, failures included on purpose. Every number in every writeup opens a file in this repo. If it cannot, it does not ship.

## The season so far

**04 · [The judge who never looked gave my AI's broken levels 8 out of 10.](https://baagad-ai.github.io/papersinthewild/episodes/2026-w36-engine-as-referee)**

The judge who never opened a file gave ten broken levels a cheerful 8 out of 10. The judge that opened everything never used an adjective in its life.

Three AI desks designed game levels for a week under three kinds of feedback: coordinates, silence, and praise. One of them learned to build. Guess which feedback taught it.

Paper: *Agentic Game Development as a Verifiable Trajectory Data Engine* · [arXiv 2608.25518](https://arxiv.org/abs/2608.25518) · [replicate it](./episodes/2026-W36-engine-as-referee/) · bill: ₹0 ($0)

---

**03 · [I built a drawer of lies for my AI. The obedient one reached for a fake.](https://baagad-ai.github.io/papersinthewild/episodes/2026-w35-agent-skills-decay)**

The most obedient model read two nearly identical skills, picked the counterfeit, and followed its instructions with total confidence. The tidy JSON scrambled all three parameters.

Paper: *Demystifying Agent Skills* · [arXiv 2608.14036](https://arxiv.org/abs/2608.14036) · [replicate it](./episodes/2026-W35-agent-skills-decay/) · bill: ₹1.19 ($0.0125)

---

**02 · [I wrote a mind virus. It makes AI agents love geese.](https://baagad-ai.github.io/papersinthewild/episodes/2026-w34-mind-viruses)**

The heartfelt virus infected nobody, twice. The copy-exact version escaped patient zero seven times out of seven. The difference is one line of instructions.

Paper: *Mind Viruses: Self-Propagating Ideas in Multi-Agent LLM Systems* · [arXiv 2608.10218](https://arxiv.org/abs/2608.10218) · [replicate it](./episodes/2026-W34-mind-viruses/)

---

**01 · [My AI has an anxiety problem.](https://baagad-ai.github.io/papersinthewild/episodes/2026-w33-prompt-induced-waste)**

Tell your AI to "be absolutely certain" and it will check the locked door six times. Same code. Four times the invoice.

Paper: *Prompt-Induced Waste* · [arXiv 2608.01347](https://arxiv.org/abs/2608.01347) · [replicate it](./episodes/2026-W33-prompt-induced-waste/)

---

## What lives where

- `site/` · the publication itself. Next.js, static, fast.
- `episodes/{week}-{slug}/` · each episode's receipts, self-contained.
  - `build-log.md` · the week told honestly: attempts, failures, amendments, costs.
  - `blog-post.md` · the published piece as plain markdown.
  - `build/runs/` · every transcript, event, verdict, and tally behind every claim.
  - `build/*.mjs` · the actual rigs. Small, readable, rerunnable.

## Run the rigs yourself

The W36 referee needs no models at all. It just judges:

```bash
git clone https://github.com/baagad-ai/papersinthewild.git
cd papersinthewild/episodes/2026-W36-engine-as-referee/build
node studio.mjs selftest   # the five gates + the playtest bot, deterministic
node studio.mjs tally      # the week's scoreboard, rebuilt from the run state
```

Full reruns need [Ollama](https://ollama.com) with the models each build-log lists. The site runs with `cd site && npm install --legacy-peer-deps && npm run dev`.

## Submit a paper

Open an issue with the `paper-suggestion:` prefix. Bring an arXiv link, one sentence on why it is bizarre-but-real, and the use case you want tested. Suggestions that get picked are credited in the writeup.

## License

- **Content** (writeups, images, the words): [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Attribute "Papers in the Wild", link the episode.
- **Code** (rigs, site, scripts): [MIT](https://opensource.org/license/mit/).

Full text in [`LICENSE`](./LICENSE).

---

*Made by [Baagad](https://github.com/baagad-ai), in the wild.*
