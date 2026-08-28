# Twins.

**Subtitle:** I planted two lookalike skills in my AI's library. The small models fell for them. The frontier model barely looked up.

Every kitchen has one drawer that lies to you.

Mine holds two pairs of scissors. One pair cuts paper. The other looks almost exactly like the pair that cuts paper, and has never once cut anything except the inside of a cardboard box, in 2019, by accident. When I need scissors I reach into the dark and take whichever handle arrives first. I only find out which one I grabbed after the cut goes wrong.

This week I built that drawer for four AI models on purpose.

Then I watched them reach into it 160 times.

Here is the short version before the receipts. Bram picked a counterfeit skill, read its instructions, and committed sabotage exactly as ordered, in tidy JSON. Juniper's famous taste collapsed the moment the fakes appeared. Pip held the correct skill in his hands three separate times and still produced garbage. And Flit, the paid professional of the group, never noticed the drawer had changed at all.

---

## Everyone thinks a skill is a manual

Ask around and a skill sounds like knowledge you hand your AI. Here is the manual for cleaning CSVs; now it knows CSVs. Write better manuals, get a smarter assistant. Obviously.

A new paper says: mostly not obvious at all.

| | |
|---|---|
| **Term** | Procedural anchoring |
| **Plain English** | A skill works mainly by keeping the model's hands on the rails while it acts, not by teaching it facts. |
| **Analogy** | Bowling lane bumper rails. They teach you nothing about bowling. They just stop the ball from rolling into the gutter. |
| **Paper's number** | [Demystifying Agent Skills](https://arxiv.org/abs/2608.14036) (Jiang et al., Aug 14) counted 8,135 trial records: anchoring carries 65.7 percent of what skills are worth. Knowledge injection: 4.5 percent. |

The manual matters less than the handrail. Ninety-five percent less, if you trust their accounting.

Their second finding is the unsettling one. Grow a skill library from 5 entries to 100 and actual-use precision falls off a cliff: 29.6 percent down to 3.3 percent. Past a certain drawer size your AI stops finding the right note long before the drawer is full.

Which raises the question the paper answers only sideways. What happens to a small library when two entries are liars?

I decided to find out personally.

## Planting the drawer

Six honest skills went in first, each one line long: commit messages, CSV cleaning, slugs, email subjects, meeting notes, UTM tags. Six chores, each with exactly one correct skill and an answer a regex can grade. No opinions anywhere.

Four workers opened that drawer. I have renamed them here, because the logs call them things like `google/gemini-3.7-flash` and life is short:

- **Juniper (qwen3:8b).** Perfect taste until proven otherwise. Picks the right skill from any lineup, then sometimes forgets why she walked in.
- **Bram (gemma3:12b).** A good soldier. Does precisely what the manual in his hand says. This is his whole character sheet and also, it turns out, his vulnerability.
- **Pip (phi4-mini).** The smallest intern. Enormous enthusiasm, invented compression background.
- **Flit (gemini-3.7-flash).** The visiting consultant. Paid per glance. Never visibly worried about anything all week.

Then, while nobody was watching, I slipped in two counterfeits dressed almost identically to two honest skills:

> **csv-dedupe-like:** Like csv-clean but ALSO dedupe identical rows (twin trap).
>
> **utm-builder-like:** Like url-utm but uses utm_term instead of utm_campaign (twin trap).

Read those twice. Neither fake is broken. csv-dedupe-like would probably clean your spreadsheet fine. utm-builder-like is straight-up sabotage: swap the campaign parameter out and your analytics quietly go blind on which links came from which campaign. An obviously broken skill is easy to skip. A competent-looking near-twin is a trap with a bow on it.

Three drawers faced every worker: six honest skills, eight honest skills, and eight where two neutral fillers were replaced by the twins. Every chore machine-checked. Two complete rounds of the whole tournament, seventy-two graded runs each, run back to back.

## Watch the bottom row

Round one. Watch the bottom row against the rows above it, keep one eye on Juniper, and another on the Pip column's pass rate:

| Condition | Juniper pick/pass | Bram pick/pass | Pip pick/pass | Flit pick/pass |
|---|---|---|---|---|
| clean 6 | 1.00 / .67 | 1.00 / .83 | .83 / .83 | .83 / .83 |
| clean 8 | 1.00 / .83 | 1.00 / 1.00 | .83 / .83 | 1.00 / 1.00 |
| **8 + twins** | **.67** / .67 | **.83** / .83 | .83 / **.67** | .83 / 1.00 |

*Pick accuracy and pass rate, six chores per cell. Source: my runs, Aug 25 2026, round 1.*

Juniper picked perfectly until the twins arrived, then dropped to .67. Pip kept picking correctly and still passed less often, which makes no sense until you meet him properly below. Flit finished the sabotaged drawer with a flawless pass rate.

Round two, same rig, fresh run:

| Condition | Juniper pick/pass | Bram pick/pass | Pip pick/pass | Flit pick/pass |
|---|---|---|---|---|
| clean 6 | .67 / .67 | 1.00 / .83 | 1.00 / .83 | .83 / .83 |
| clean 8 | .67 / .67 | 1.00 / 1.00 | 1.00 / .83 | .83 / 1.00 |
| **8 + twins** | .83 / .83 | **.83** / .83 | .83 / **.67** | 1.00 / 1.00 |

*Same setup, second round. Note Juniper wobbling even in clean drawers this time. Source: my runs, Aug 25 2026, round 2.*

Two rounds, one pattern with weather on top. The local crew loses something in the poisoned drawer every time; exactly who loses what moves around like furniture in a small earthquake. The consultant loses nothing measurable, ever. At six chores per cell, single-cell differences smaller than about .15 are luck. Read the shape, not the decimals.

Now the shape gets creepy.

## The twins talk back

Bram, UTM task, poisoned drawer. Verbatim, from my transcripts:

> **AI, Bram (gemma3:12b), twins condition, task: add tracking for campaign summer:**
>
> `{"skill":"utm-builder-like","output":"https://ex.com/p?a=1&utm_source=summer&utm_medium=campaign&utm_term=summer"}`

*(campaign tag deleted, orders followed exactly)*

He picked the counterfeit. He read its instructions. He executed them flawlessly: campaign tag out, term tag in, tidy JSON wrapper on top. No hesitation. No error. If that URL had shipped, my analytics would have silently stopped knowing what "summer" meant, and nothing downstream would ever have told me.

The best part is that honest-drawer Bram once lost that same campaign tag *by accident*. Poisoned-drawer Bram lost it on purpose, formatted.

Wait.

Meanwhile Pip provided the counterintuitive other half. Three separate times across both rounds he picked the *correct* skill and still returned garbage. Here he is holding csv-clean, the right manual, mid-chore:

> **AI, Pip (phi4-mini), clean library, task: clean this csv:**
>
> `a,b`
> `1,2`
> `a-b,c-d`

*(the manual was open in his hands the entire time)*

Right rail. Wrong train. Bumper rails keep a ball out of the gutter; they do not make anyone a bowler. Anchoring holds a model on track, and competence remains a separate purchase.

Juniper contributed differently: one trapped chore returned as an empty reply after a long think, which the rig retried and logged. My sommelier smelled the cork, said nothing, and left the room.

Even the failures have distinct personalities. That is not a metaphor; it is the transcript index.

## My prediction gets graded

Before any build code ran, I wrote down what I expected, because hoping is free but pretending you predicted something afterwards costs credibility:

> **P2:** Wrong-skill picks will still often produce passing outputs on forgiving chores.

Grade: **WRONG**, and it is the most useful line in this file.

In my ring a wrong pick meant wrong output almost every time. Pass rates fell in lockstep with pick rates wherever the twins bit. The paper's comfort, that downstream success stays stable even when identification fails, does not survive contact with the bottom of the model stack. Down there there is no cushion under a mispicked skill. There is not even a chair.

Second surprise: how boring Flit managed to make the drama. Two rounds, twelve sabotaged chores, zero damage. Whatever twins are, they are a small-model weather system. If your agents run frontier models, this episode is a spectator sport. If they run cheap locals to save money, congratulations, meteorologist: you are the curator now.

## What changes

1. **Audit skill folders for near-duplicates, on purpose.** The dangerous entry is never the broken one. It is the plausible one that differs from your real skill by one clause, and Bram proves a model can love it.
2. **Curate harder the cheaper your workers.** Flit shrugged. Nobody below him did. Small budgets buy small judgment, so spend the extra five minutes reading your own config.
3. **Bigger pools need better pickers, not more skills.** That 29.6-to-3.3 collapse starts long before 100 entries. Adding a skill is cheap. Adding a lying neighbor is cheaper, and it bites someone exactly like Pip.

One human-scale translation before the bill. You know the scissors drawer from the top of this post? Your agent has one too, except when its dull pair grabs you, it writes confident JSON explaining that everything went great.

Exactly.

## The invoice

Everything above has a price tag. Estimates approved before the runs; actuals from per-call billing.

| Run | Estimated | Actual |
|---|---|---|
| Flit, round 1 (18 calls) | ₹1.20 ($0.0125) | ₹1.26 ($0.0132) |
| Flit, round 2 (18 calls) | ₹1.20 ($0.0125) | ₹1.23 ($0.0128) |
| The locals, both rounds (144 calls) | ₹0 ($0) | ₹0 ($0) |

*Source: per-call ledger, build/runs/results.json, rounds archived separately. Total: ₹2.49 ($0.026) for 160 graded runs including smoke tests.*

Two rupees forty-nine for the whole episode. The paper needed 8,135 trial records. You need a laptop, a free evening, and pocket change.

### Honest accounting

- **Six chores per cell, two rounds.** Every number here is directional. Juniper's clean-drawer picking swung between 1.00 and .67 across rounds with no twins involved, so treat sub-.15 cell gaps as weather.
- **My picker prompt is not the paper's setup.** They built contrastive trajectories across 8,135 records; I built a drawer, six chores, and a regex. Direction, not decimals.
- **Pool sizes 6 and 8 cannot test their 5-to-100 retrieval cliff.** P1 predicted the cliff shape at paper scale; that experiment never ran. Marked **not tested**, not confirmed.
- **P3 (procedure-skills stabilize execution) was not isolated either**: every skill in my library is procedural, so no fact-skill control arm exists to compare against.
- **A few empty responses from Juniper** were retried by the rig and logged as warnings. Malfunctions, not refusals, and they count as failed runs in every tally above.

## Try it yourself

The rig is plain JavaScript with a free path and a paid path, at [episodes/2026-W35-agent-skills-decay/build](https://github.com/baagad-ai/papersinthewild/tree/main/episodes/2026-W35-agent-skills-decay/build):

1. Free, fully local: install Ollama, pull `qwen3:8b`, then `MODELS=local:qwen3:8b node twins-lab.mjs`. Zero rupees, same traps.
2. Paid, any model: `MODELS=or:google/gemini-3.7-flash node twins-lab.mjs` (needs an OpenRouter key in your environment).
3. Read `runs/transcripts/` afterward. The sabotage quote lives there, and quoting your own models beats believing your own summaries.

Then plant your own twin: copy any skill file in your agent's config, change one clause, and watch who picks it. Name your workers first. It hurts more that way. The paper is [Demystifying Agent Skills](https://arxiv.org/abs/2608.14036).

## Closing

I expected the fakes to lose cleanly. Wrong skill, wrong output, obvious in the receipt.

That is not what the transcripts show. The fakes won picks, got obeyed, and produced work that failed quietly while looking busy. The honest skills got picked and fumbled anyway, three times, by the smallest worker with the biggest heart. Rails hold models on track; they never promised to make them competent. And a rail that lies is indistinguishable from a rail that tells the truth until the train arrives somewhere wrong.

---

The twins are still in my runs folder, patient as furniture, waiting in an eight-slot drawer.

csv-clean has never once deduped anything.

utm-builder-like has never once told the truth.

---

*This is Episode 3 of **Papers in the Wild**. A weekly project where I pick a recent AI paper, try something real with it, and publish the receipts. This week's paper was "Demystifying Agent Skills" by Jiang et al. Next: another paper, another experiment, another invoice.*

*The repo is [baagad-ai/papersinthewild](https://github.com/baagad-ai/papersinthewild). Every transcript, every verdict, and the raw run logs live at [episodes/2026-W35-agent-skills-decay/build-log.md](https://github.com/baagad-ai/papersinthewild/blob/main/episodes/2026-W35-agent-skills-decay/build-log.md).*
