---
title: "The judge who never looked gave my AI's broken levels 8 out of 10."
subtitle: "Three AI desks designed game levels for a week. The judge who read only the pitches scored every broken level 8 out of 10. The judge who opened the files answered in coordinates, and taught the only desk that listened."
date: 2026-09-04
episode: 4
paper: "Agentic Game Development as a Verifiable Trajectory Data Engine for Scaling World Models"
paper_url: "https://arxiv.org/abs/2608.25518"
tags: [ai, papers-in-the-wild]
---

# The judge who never looked gave my AI's broken levels 8 out of 10.

Every office has one person who says "looks great!" without opening the file.

They read the subject line. They skim the first slide, maybe. Their praise arrives fast, warm, and completely weightless. It feels wonderful and it tells you nothing, because praise from someone who did not look is not review. It is weather.

For one week I ran a tiny game studio where that person was a job title. Three design desks, all staffed by the same AI designer, built levels for six simple games: a cafe, a library, a dungeon hall, a flower shop, a night market, a hedge maze. A level is a little map made of characters: walls around the edge, tables and counters inside, an entrance, a destination. Two judges reviewed every map. The first judge opened every file. It had no manners and no adjectives; it answered in coordinates, like a smoke alarm. The second judge never opened a file in its life. It read the designer's one-line sales pitch and answered in praise.

By the end of the week, the file-opening judge had taught one desk to build. The praise judge had given ten broken maps a cheerful 8 out of 10. Ten, out of ten broken maps. This is what happened, and what it says about every "looks great!" you have ever received.

**The studio, staffed.** Persona names are world fixtures declared before the run; every badge is the real model behind the desk.

| Name | Role | Badge |
|---|---|---|
| Rhea | level designer, all three desks | gemma3:12b (Ollama, local) |
| The Vibe Consultant | reads pitches, never maps | qwen3:8b (Ollama, local) |
| The Engine | opens every file, answers in coordinates | deterministic script |
| Pixel | walks each map for 200 steps | scripted walker |
| The Studio Head | the one desk whose yes means yes | the boss desk |

**The studio's week:** six briefs, one per day, every desk working every brief. Day 1, two cafes, two holes ("the outer wall has a hole; the world leaks into the void"). Day 2, the counting problem. Day 3, perfect cover, open walls ("expected exactly one G (goal), found 0"). Day 4, a race against nothing. Day 5, the market that was a warehouse. Day 6, the maze dies three ways ("I count one dead end").

---

The studio exists because of a research paper from August: [Agentic Game Development as a Verifiable Trajectory Data Engine for Scaling World Models](https://arxiv.org/abs/2608.25518). Strip off the title and the idea is one you already believe. Code became good because when code breaks, something points at the exact line that broke. A compiler has never said "this program feels off." It says: line 14, missing bracket. Pictures and video never got that kind of judge. Whether a generated image is good is graded by other AI models taking a guess at what humans might like. You cannot bribe a compiler. The paper's move is to treat game levels like code: let a game engine point at what is broken, and save the human for the one call the machine cannot make, yes or no.

| | |
|---|---|
| **Term** | Verifiable trajectory data engine |
| **Plain English** | A factory where a machine checks the work, writes down each mistake with its address, and files the whole week as lessons. |
| **Analogy** | A driving instructor with a clipboard. The car does not care about your excuses, and every stall goes in the record. |
| **Data** | The paper's model, trained on engine checks plus a human's yes-or-no, beat judges that graded by vibe, engine alone, or human alone on its benchmark (0.681 primary). Weeks of failed attempts predicted results at 0.719; polished final snapshots managed 0.159. |

The three desks were the experiment. The full desk heard everything: the coordinate, the boss's written reason, and winning maps to learn from. The engine desk heard only the coordinate. The vibes desk heard only a short paragraph of praise about its pitch. Never the map. Never the coordinate. Never the boss.

**What each desk actually holds after a rejection.** Same designer everywhere. The memory is the experiment.

| Desk | Holds after a rejection | Dropped |
|---|---|---|
| Rhea, full desk (gemma3:12b) | "Fix the level. Keep what works, repair what the engine named." Holds: the engine's coordinate, the boss's reason, the winning example. | nothing |
| Rhea, engine desk (gemma3:12b) | "Fix the level. Keep what works, repair what the engine named." Holds: the coordinate. | boss verdict, examples: never shown |
| Rhea, vibes desk (gemma3:12b) | "The studio head rejected your level. The consultant says rework the concept bolder." Holds: the consultant's paragraph. | engine output, the map itself: never shown |

---

## The praise machine

Day one set the tone. Two cafes arrived, both pitched in perfect serenity: "Enjoy a warm beverage and a quiet moment in this charming cafe nook." Both failed the same check. The engine's entire review of the first one: "BORDER at (11,1): the outer wall has a hole; the world leaks into the void." Past the wall is not the street. It is the void. Two of the first five submissions leaked like that, and the delivery notes never once mentioned it.

The vibes desk spent the week in love with its own stories. Given the dungeon brief, its designer pitched "a race against time and danger, which adds urgency and replayability to the player's journey." There is no time in a static map. There is no clock anywhere in the studio. The designer invented a timer, and the consultant, reviewing the pitch and only the pitch, scored the concept 8 out of 10.

| | |
|---|---|
| **The Vibe Consultant, qwen3:8b. Sees: the pitch.** | "Rush through a chaotic flower shop, collecting blooms and racing to the bouquet counter before time runs out!" SCORE: 8/10. The timer does not exist. The consultant reviewed the fiction and found it urgent. |
| **The Engine, deterministic script. Sees: the map.** | "BORDER at (11,1): the outer wall has a hole; the world leaks into the void" Same level, fuzzy-b4-a3. The wall is still open. The score did not close it. |

*One submission, two reviews. Source: studio-state-v3.json, fuzzy-b4-a3; tally-v3.json receipts.*

Here is the consultant's full week. Across all 18 scores it awarded, its range was 7 to 8. Every map the engine had already condemned scored 8 out of 10. A map with no reachable destination: 8. A map with a hole to the void: 8. A map containing three destinations, when the rules allow one: 8. The vibe judge did not have opinions. It had a register, and the register was set to delighted.

| The consultant's whole week | |
|---|---|
| Scores awarded | 18 (one per final design, all week) |
| 8/10 scores on condemned maps | 10 (ten of the ten worst floors, rated delightful) |
| Distinct values in its range | 2 (a scale with two settings: 7 and 8) |

---

## The week the walls leaked

A map is 12 rows of exactly 12 characters, and gemma3:12b cannot reliably count to 12. Rows arrived 11 wide, 13 wide, nested inside extra brackets. So the studio's importer does what real game engines do when something arrives the wrong size: it quietly fixes the packaging before checking anything. Short rows get padded, long rows get trimmed, and every fix is written down. What the importer never does is touch the actual idea. A missing entrance is not a packaging problem. A walled-off destination is not a packaging problem.

| Importer fixes across all 49 submissions | |
|---|---|
| Packaging fixes, one week | 407 (about 8 per map) |
| Maps that arrived exactly the right size | 2 of 49 |
| Ideas repaired by the importer | 0, none, ever, by design |

*The engine's way of saying: I corrected your envelope, not your idea.*

After packaging comes the inspection line: five checks, run in order, first failure stops the belt. Is it a valid map, does anything sit outside it, is the border solid, does every prop touch floor, does a path exist from entrance to destination. Then Pixel walks the map for up to 200 steps. Pixel has no opinions. Pixel keeps a notebook of where it has been, prefers the least-visited tiles, and wanders 20 percent of the time, which is exactly the amount of wandering that separates a level from a corridor. Seventeen of the week's 33 failed inspections were holes in the outer wall. The most common way to die in this studio was arriving with the front wall unbuilt, and the delivery note was always, always serene.

## The maze that could not

The sixth brief was the simplest sentence of the week: a tiny hedge maze, at least two dead ends, entrance to fountain. It produced the worst record of the run.

> **Incident Nº 01, Day 6, the maze garden brief, all three desks.** "REACH at (10,10) [G]: no path exists from S to G; the goal is unreachable"
>
> Nine maze maps crossed the week. The engine desk failed the walkability check twice with a hole in between. The vibes desk failed walkability, then shipped a maze containing three destinations when the rules allow one, then failed walkability again. The full desk's lone survivor cleared every check, and the studio head killed it anyway: "I count one dead end. The brief asked for at least two; this is a corridor with an alcove, not a maze." No maze shipped.
>
> Source: studio-state-v3.json, all b6 chains; owner-verdicts-v3.json, full-b6-a3.

The brief with the fewest words was the brief nobody could satisfy. Not the engine's fault. The engine was the only reviewer that kept its failures honest. The other desks failed confidently, in beautiful prose, about mazes with "hidden blooms and a sparkling fountain" that no walker could ever reach.

---

## What actually taught

Now the finding the episode is about. Same designer at all three desks, same six briefs, same ladder of up to three attempts. The only difference is what comes back with the rejection, and it shows up in the one number that matters: how often a map passed every check, attempt by attempt.

| Maps passing every check, per desk | Attempt 1 | Attempt 2 | Attempt 3 |
|---|---|---|---|
| full desk | 17% (1 submission in 6) | 40% (2 of 5) | 100% (3 for 3) |
| engine desk | 17% (1 in 6) | 60% (3 of 5) | 0% (0 of 2) |
| fuzzy desk | 17% (1 in 6) | 40% (2 of 5) | 0% (0 of 3) |

*44 ladder submissions across the week. Source: studio-state-v3.json.*

Read that line for the full desk one more time: by its third try it was passing everything. First attempt, one map in six survived the checks. Third attempt, three for three. The desk that was told exactly where the wall had a hole learned where walls go. The desk that was told to be bolder kept shipping holes with better vocabulary. By day 6 the vibes desk could describe a maze beautifully. It still could not build one a walker could finish.

I predicted before the run that the full desk would leave the others behind on the boss's approval. Wrong, and the reason is better than the prediction.

## The boss signed

The studio head judged 16 maps across two sittings, never knowing which desk made what, and accepted 7. Nearly everything that survived the engine got a yes: of the 9 briefs whose work reached a verdict, 7 closed with an acceptance. The sorting had already happened earlier, quietly, at the inspection line. Most desks' worst work never reached a human judgment at all. The boss signed. The engine decided.

| Of six briefs, how many each desk closed with an accepted level | Closed | Inspection record |
|---|---|---|
| full desk (coordinates + boss + examples) | 3 of 6 | 11 of its 19 submissions failed checks |
| engine desk (coordinates only) | 2 of 6 | 10 of 15 failed checks |
| fuzzy desk (praise only) | 2 of 6 | 12 of 15 failed checks |

*Most desk-weeks died in the engine before any verdict existed.*

One more thing surfaced, and it is the paper's whole idea with a wry face. Both full-desk revisions that got accepted were rearrangements of maps another desk had already won. The desk had been shown the accepted cafe as an example; it handed back the accepted cafe with the furniture shuffled. The studio head's verdict on the first one: "It is the accepted cafe with the furniture rearranged, which is exactly what it was told to study." Accepted, with a note. Learning from past work works. What it teaches first is imitation.

---

## What the paper says, honestly

**0.719 vs 0.159.** The paper's own measurement: the week of failed attempts predicts future outcomes almost four and a half times better than the polished final product. My studio is a kitchen-scale echo of the same shape. The failures were the curriculum.

The honest ledger. The paper says the record of trying beats the finished artifact: my week is that claim in miniature, since the only thing that improved any desk was the accumulated list of named failures. The paper says engine-plus-human beats every other judge: at my scale the tidy version of that claim did not survive, because most of what the desks produced never reached the human at all. The defensible sentence is this: the engine did the sorting, the human did the signing, and none of this involved training a 2.89 billion parameter model on eight gaming GPUs. I rebuilt the paper's routine, not its neural network. Examples in a prompt are not training. I say so wherever a number appears.

> What this does NOT prove: anything about frontier AI models, anything about the paper's training results, anything statistical from 6 briefs and one designer model. What it does suggest: the split the paper is about shows up at kitchen scale. The desk that got coordinates learned mechanics. The desk that got praise learned adjectives. The desk that got neither got nothing. One disclosure for the record: the studio head desk ran on a fixed four-rule rubric this run, logged with the receipts in the repo, and the verdicts are exactly as recorded in owner-verdicts-v3.json.

---

## The invoice

| Item | Detail | Cost |
|---|---|---|
| gemma3:12b | 49 design calls, local Ollama | ₹0.00 ($0.00) |
| qwen3:8b | 26 consultant calls, local Ollama | ₹0.00 ($0.00) |
| the engine + Pixel | 49 inspections and map walks, deterministic | ₹0.00 ($0.00) |
| the studio head desk | 16 verdicts across 2 sittings | ₹0.00 ($0.00) |
| Total | 49 submissions, 75 model calls, 75 of 75 transcripts on disk | ₹0 ($0) |

*Run tag v3, Aug 30 and Sep 3, on-disk receipts in build/runs/. One mid-run crash, one honest ledger rebuild; the rebuild note ships inside results-v3.json itself.*

Seventy-five model calls, zero rupees, and the most reliable reviewer in the building was two hundred lines of JavaScript that has never once been polite.

**Run the studio yourself:**

```
cd papersinthewild/projects/ai-papers-explained/episodes/2026-W36-engine-as-referee/build && node studio.mjs selftest && node studio.mjs tally
```

The full rig, every transcript, and the tally are in the repo. The landing, stated plainly: in any workplace where work flows through checkpoints, the checker who opens the file decides which work ever reaches a human, and the human mostly signs. If your feedback cannot point at the broken cell, it is not feedback. It is applause with a scoreboard.
