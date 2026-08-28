# Open-Book.

**Subtitle:** I let four AI students carry their own notes into two exams: one they had drilled, one they had never seen. The answer-sheets aced the homework and taught nothing. The written rules helped a little. Nobody beat the girl who walked in cold.

So, four AI models sat an exam with their own notes allowed. The three who carried answer sheets scored 100% on the homework and learned almost nothing usable anywhere else. One of them got WORSE at new questions because of her perfect answer sheet. The most expensive student failed a sorting game a 2.5-gigabyte intern passed, then aced the homework by copying his own notebook. And the only notes that helped at all were ones they wrote themselves, in words, badly. This is normal now.

---

## Someone built a tutor that studies you

The pitch that hooked me, from a paper called [EnvHarness](https://arxiv.org/abs/2608.19880) (Aug 2026): a gym that watches which exercises you fail, then invents new ones aimed exactly at your weakness.

| | |
|---|---|
| **Term** | Adaptive environment |
| **Plain English** | A practice world that changes itself to target one specific learner's mistakes, instead of staying frozen forever. |
| **Analogy** | A boxing coach who watches you drop your left hand, then spends the whole week throwing jabs at it. A punchbag cannot do that. The coach is the product. |
| **Their number** | Across five benchmarks, wrapping a static environment in their adaptive layer beat plain practice on held-out tasks, for example +9 points on ALFWorld (Table 2), and their scaling curve kept climbing where static environments went flat (Figure 5). |

The authors' deeper point is what made me spend a week here: environments, like agents, usually get built once and never learn. They upgrade the WORLD per-student instead of upgrading the student, and the world does it by writing new rules and scenarios as code.

Which raises the smallest possible version of their question. If practice has to be aimed at the student to work, how much of that survives in a toy I can run on a laptop? So I built one.

## Three notebooks

The Gym (mine) teaches a sorting office: lowercase strings arrive, four shelves wait, each shelf hides one secret rule. Does the string hide a doubled letter like "ll"? Do first and last letters match? Is the vowel count even? Is every character unique? Verdicts are exact, graded by code, no opinions anywhere.

Four students enrolled, the same crew from the last two episodes: Juniper (qwen3:8b), Bram (gemma3:12b), Pip (phi4-mini), and Flit (gemini-3.7-flash), the paid consultant.

Then three kinds of "before":

- **Nothing.** Walk in cold.
- **The answer sheet.** Drill the same ten flashcards five rounds in a row, verdicts attached. On exam day you may carry those ten cards, with their right answers, as notes.
- **The tutor's way.** Fresh cards every round, automatically biased toward whichever shelf you keep failing, difficulty nudged toward the edge of what you can do. Your exam notes: the last eight cards you practiced, verdicts attached.

And two exams for everyone. **The novel exam:** sixteen brand-new strings, never practiced. **The sting:** those same ten flashcard strings again, but as exam questions.

One design note before the receipts, because it is the whole spine of this episode. In the first grid I built, the exams came back byte-for-byte identical across all three conditions, for every student. Of course they did: these models have no memory between chats, and I never let practice touch the exam page. Three arms of expensive theater. That grid died so you would not have to trust me when I say the notebook is not a detail. It is the only channel practice has.

So: notebook rules. Exams open-book. Same ten homework strings for everyone. Roll tape.

## The homework they aced

Read the middle column against the left first, then the right column against both. Novel exam on the left of each slash, homework on the right:

| Student | cold (novel / homework) | answer-sheet (novel / homework) | tutor's-way (novel / homework) |
|---|---|---|---|
| Juniper | 69% / 40% | 50% / **100%** | 50% / 60% |
| Bram | 50% / 40% | 69% / **100%** | 50% / 40% |
| Pip | 44% / 40% | 50% / **100%** | 50% / 40% |
| Flit | 31% / 60% | 50% / **100%** | 38% / 30% |

*Four right-hand 100s in a row. Source: my runs, Aug 28 2026, tag g2, n=16 novel and n=10 homework per cell, temperature 0. Total spend so far this episode: ₹30.15 ($0.315).*

Every student who drilled the answer sheet aced the homework. All ten. Perfect recall of strings they had seen five times each.

And the fresh-material column barely moved, or moved the wrong way. The homework 100% bought Bram and Flit +19 points of new-question performance each, bought Pip +6, and cost Juniper **nineteen points**. She walked in as the best cold student in the room, picked up a perfect answer key, and got worse.

The tutor's-way column is the one that hurt to read. Fresh targeted cards, miss-weighted shelves, edge-of-ability difficulty, eight examples in the notebook: and it matched walking in cold, almost everywhere. My prediction, written before the first call, said the tutor's arm would beat drilling on new material. Grade: **WRONG**. The tutor the paper promises did not show up at toy scale, and I will get to why.

But first, the funniest student of the week.

## Pip writes his rulebook

Between grids I added one more condition, the R1 of my own episode: the tutor's practice, plus one extra step. After practice, the tutor asks each student to write the secret rule of each shelf, in one plain sentence, in their own words. The exam notebook now carries RULES and zero answers. If rules really transfer better than answers, this is where it should show.

Read the rulebooks. Juniper, first, cold prose:

> **Juniper's rulebook, shelf "even vowels":**
>
> "The string must contain an even number of vowels."

All four of hers were like that. Textbook-clean. Flit's four were equally beautiful. And then Pip's:

> **Pip's rulebook, shelf "no repeats":**
>
> "No consecutive characters should appear more than once."

That is not the rule. The rule is no repeated characters anywhere; Pip wrote a rule about neighbors only. His vowel rule was even worse, something about strings containing only vowels. His shelf scores afterwards matched his rulebook, roughly rule for rule.

Here is the whole third grid, strategy column fresh from tag g3:

| Student | cold | answer-sheet | rules-written |
|---|---|---|---|
| Juniper | **69%** / 40% | 50% / 100% | 56% / 40% |
| Bram | 50% / 40% | 69% / 100% | **63%** / 40% |
| Pip | 44% / 40% | 50% / 100% | 50% / 40% |
| Flit | 31% / 60% | 50% / 100% | **50%** / 70% |

*Novel exam / homework, tag g3, same exams, same seed, n as above. Strategies were elicited per shelf; examples above are verbatim from events-g3.jsonl.*

Written rules did what written rules do. Bram, who needed a nudge, took +13. Flit, who had been an embarrassment all day, doubled his cold score and became the only student whose homework-after-rules score ALSO rose (60 to 70), because his notebook finally contained something true instead of something memorized. Juniper, perfection incarnate, wrote a flawless rulebook and still landed ten points under her own cold score. Rules helped the students who needed help, in the hands of the students who could write them.

And the sting column, the ten homework strings asked as exam questions under a rules-only notebook? Barely moved for the locals, even with perfect rules in hand. Because those ten cards are rigged with boundary cases, and a sentence like "even number of vowels" does not arm you for a five-letter monster with exactly one vowel sitting next to a doubled consonant. The cliff questions ate the rules and asked for seconds.

## What I predicted, graded

- **P1** - the tutor's arm beats drilling on fresh material: **WRONG.** Item-level targeting with example-notes transfers nothing here. In the paper, the environment writes new scenarios and rules as CODE after diagnosing aggregate failures. My gym re-aimed the item stream; it never wrote a component. That difference appears to be the entire mechanism.
- **P2** - drilling is flat-or-worse on fresh material: **half right, surprised.** Juniper dropped 19 as predicted; the answer sheet also doubled as ten worked examples, and that accidentally helped the other three a little. A cheat sheet is also, weakly, a textbook.
- **P3** - everyone improves more on trained items than fresh ones, worst for drilling: **CONFIRMED, four for four, by miles.** This is the control the source paper never ran, and it is the sharpest number in the episode.

## What this means if you run AI agents

1. **Test your evals for the photograph problem.** If your agent's score on practiced items is much higher than on untouched ones, you are measuring its notebook, not its brain. The two-exam pattern here (trained set vs untouched set, same session) is a five-line addition to any harness and it is the most honest number you will ever print.
2. **Notes are a channel, so design what travels through it.** Answers travel only to identical questions. Random examples are noise. One sentence of self-written rule, right or wrong, carried more transfer than eight worked examples. When you give an agent a memory or a skill file, ask whether it stores answers or rules.
3. **Grade the rulebook, not just the score.** Pip's 50% was written in his own notebook beforehand. If your agent writes down how it thinks it works, you can grade the writing against the doing and watch them diverge.

One human translation before the bill. You already know a Juniper: the kid who aces every past paper and falls apart when question 7 changes shape, because what she studied was the answers, not the shape. The gym says the fix is not more past papers. It is being made to say the rule out loud, in your own words, and then being handed a question that argues with you.

## The invoice

| Run | Estimated | Actual |
|---|---|---|
| g1, zero-channel control, locals only (killed early) | ₹0 ($0) | ₹0 ($0) |
| g2, answer-notebook grid, 712 calls | ₹5.88 ($0.06) | ₹20.00 ($0.21) |
| g3, rule-notebook grid, 320 calls | ₹1.20 ($0.01) | ₹10.15 ($0.11) |
| Locals, all grids (Juniper, Bram, Pip) | ₹0 ($0) | ₹0 ($0) |

*Source: per-call ledgers results-gym-g2.json and results-gym-g3-FATAL.json (the "FATAL" filename is a crash in my summary code AFTER all data landed; events hold every row). Total: ₹30.15 ($0.315).*

Two escalations of the money protocol fired and were taken: OpenRouter's gemini-3.7-flash now reasons on every call whether you like it or not, about 500 output tokens per answer, and my estimator budgets 24. The estimator has been taught; the receipt stands.

### Honest accounting

- **n=1 grid per condition, one seed, one toy domain.** Every number is directional; the 100s are exempt, ten-for-ten is ten-for-ten.
- **Notebooks differ by design** (10 cards vs 8 examples vs 4 rules), so cross-arm effects mix content and length. The direction of the conclusion survives that; the decimals do not.
- **My tutor is not EnvRIGGER.** No code-writing, no component repair, no five-round validation loop. This episode measures the shadow of their mechanism, not the thing.
- **Juniper's "worse" is one cell.** Directional, memorable, not proof. It would be the first thing I re-run with n=3.
- **Flit's reasoning could not be switched off.** Every consultant answer includes hidden thinking I paid for; there is no arm where it behaves like the August-before-last model.

## Try it yourself

The Gym is plain JavaScript with a free path and a paid path, at [episodes/2026-W35-adaptive-gym/build](https://github.com/baagad-ai/papersinthewild/tree/main/projects/ai-papers-explained/episodes/2026-W35-adaptive-gym/build):

1. Free, fully local: install Ollama, pull `qwen3:8b`, then `MODELS=local:qwen3:8b node tutor-gym.mjs --tag yourname`. Zero rupees, same shelves.
2. Any model: add `or:google/gemini-3.7-flash` to MODELS (OpenRouter key). Budget for its reasoning; it will think whether you ask or not.
3. Open `runs/events-yourname.jsonl` afterward. Every card, every verdict, every rulebook, one JSON per line. Then make your eval sit its own homework twice: once practiced, once cold. The gap is your photograph number.

The paper is [EnvHarness](https://arxiv.org/abs/2608.19880). Then go find your own flashcards: the docs you re-read, the checklist you recite. Ask whether you know the answers or the rule.

## Closing

I came to test a tutor and left with a museum of notebooks.

The answer sheet aced everything it recognized and bought almost nothing else, and it quietly cost the best student in the room nineteen points of herself. Eight random examples did nothing at all. Four sentences in the student's own words did more than both, but only for students who could write them, and even the perfect rulebook surrendered to genuinely unfair questions.

Which is the parting gift. The notebook is the only place practice ever lives, so the only question that matters is what you put in it. Answers are a photograph of yesterday. Rules are a pair of glasses.

Grade the rulebook. Then hand the student a question that argues with it.

---

*This is Episode 5 of **Papers in the Wild**. A weekly project where I pick a recent AI paper, try something real with it, and publish the receipts, including the ones that flunk their own homework. This week's paper was "EnvHarness" by Shi et al. Next: another paper, another experiment, another invoice.*

*The repo is [baagad-ai/papersinthewild](https://github.com/baagad-ai/papersinthewild). Full grids, both notebooks, every rulebook verbatim, and the ghost grid that started it all live at [episodes/2026-W35-adaptive-gym/build-log.md](https://github.com/baagad-ai/papersinthewild/blob/main/projects/ai-papers-explained/episodes/2026-W35-adaptive-gym/build-log.md).*
