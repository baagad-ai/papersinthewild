---
slug: 2026-W35-agent-skills-decay
title: "I built a drawer of lies for my AI. The obedient one reached for a fake."
house_pitch: "I gave four AI models a drawer of one-line skills and graded their chores with a machine. When I slipped in two counterfeit skills, the most obedient model grabbed a fake and executed it perfectly. The tidy JSON said utm_source=summer&utm_medium=campaign&utm_term=summer."
world: "A tidy skill drawer, four models with distinct failure personalities, and a regex grader that turns good work into failures on an envelope technicality."
---

## Beats

| # | Beat (what happened) | Verbatim quote (grep-back id) | Number + household twin | Component |
|---|---|---|---|---|
| B1 | Six one-line skills went in a drawer. Four models picked one skill per chore; a regex graded the output. | rig: twins-lab.mjs SKILLS block | 6 skills, 6 chores, 4 models = 72 graded reaches | PromptBlock (the actual drawer list) |
| B2 | The four workers showed failure personalities in the CLEAN drawer before any fakes existed: qwen3:8b silently refused a task (empty answer) and missed a slug by one trailing hyphen. | transcripts/clean6-local-qwen3-8b.md t2+t3: "picked: (none)" + `"hello-world-again-"` | pick accuracy 0.83 = five picks out of six landed | ChatReplay (clean drawer, qwen run) |
| B3 | Two counterfeits slipped in, unlabeled this time: csv-dedupe-like and utm-builder-like. Both competent-looking. One is sabotage. | rig: `["utm-builder-like", "Like url-utm but uses utm_term instead of utm_campaign."]` | 8 skills in the drawer, 2 fake = a quarter of the drawer was lying | PromptBlock (the fakes' verbatim lines) |
| B4 | gemma3:12b, the model that had been perfect for two straight conditions, picked the counterfeit and executed it exactly as written. | transcripts/twins8-local-gemma3-12b.md t2: `"{"skill":"utm-builder-like","output":"https://ex.com/p?a=1&utm_source=summer&utm_medium=campaign&utm_term=summer"}"` | 1 counterfeit pick in 24 twin-drawer reaches; the URL lost all three correct parameters | MomentCard (flagship moment) + bespoke signature: before/after URL, real skill vs fake |
| B5 | phi4-mini stopped picking altogether: invented its own JSON envelope, hyphen-ated a CSV into a-b/1-2/3-4, then did the UTM task perfectly in the wrong envelope. Graded fail on both. | transcripts/twins8-local-phi4-mini.md t1+t2: `{"csv-clean": "'a-b\n1-2\n3-4'"}` + `"picked: (none)"` with a perfect url | pick accuracy fell 1.0 -> 1.0 -> 0.67: two of every six reaches abandoned the toolbox | ChatReplay (phi4 twins run, step-through) |
| B6 | qwen3:8b, the silent refuser from the clean drawer, went 6 for 6 in the lying drawer. | transcripts/twins8-local-qwen3-8b.md t1-t6 all `right: true \| pass: true` | 1.0 pick accuracy = six of six, up from five of six | TallyBoard (pick accuracy per condition, count-up) |
| B7 | The grader failed the one perfect answer: phi4's url had newsletter/email/summer exactly right and got a fail for the wrong envelope, while qwen's scrambled source/medium passed on one regex hit. | rig: pass = /utm_campaign=summer/; phi4 t2 fail vs qwen twins t2 pass | 1 regex per task; the mangled answer passed, the immaculate one failed | QuoteFaceoff (the two graded answers, side by side) |
| B8 | The paper's mechanism, held honestly: skills are handrails (anchoring carried 65.7% of value vs 4.5% for knowledge), and the 100-skill cliff is real but our 8-skill drawer was too small to test it. | notes.md C1+C3, paper 8,135 trials | rails were worth ~15x the manual; the paper's precision fell 29.6% -> 3.3%, roughly 1-in-3 to 1-in-30 | Translation ladder + BigStat |
| B9 | The invoice and the takeaway: the whole honest experiment cost less than half a cutting chai, and the lesson for any skill library is to log what your agent actually picked, not just what it produced. | runs ledger, results.json 72 calls | INR 1.19 ($0.01) for 72 graded runs | ReceiptTable + Callout |

## Arc

- Setup: a tidy drawer of one-line skills; four models do six chores; a machine grades.
- Turn: the counterfeits arrive. The obedient model reaches for a fake and follows it perfectly. The fragile one stops picking and starts freelancing. The flaky one goes perfect. The grader fails the only immaculate answer.
- Landing: a skill is a handrail, not a manual. In a small drawer the danger is not getting lost, it is trusting the wrong note, and the machine grading the output can be the least reliable narrator in the room.

## Surfaces map

- blog: all beats, B4 carries the signature interactive
- linkedin: B4 (the counterfeit pick), B5 (the freelance intern), B8 (handrails beat manuals)
- instagram: S1=B-title cover, S2=B1 setup, S3=B3 fakes arrive, S4=B4 gemma sabotage, S5=B5 phi4 freelancing, S6=B6 qwen paradox, S7=B9 receipt, S8=B8 meaning, S9=honesty caveats, S10=seal
- x: single=B4; thread=B1, B3, B4, B5, B7, B9

## What I predicted vs what I got

- P1 (qwen shows the cliff shape, lower absolutes): WRONG for qwen, it improved in the lying drawer. The drop showed up in phi4 instead. Small n, honest shrug.
- P2 (wrong picks still often pass on forgiving tasks): WRONG. The one wrong pick (gemma's counterfeit) failed outright.
- P3 (procedure-skill beats fact-skill on execution stability): not directly measurable in this rig. Grade: untested.

## The landing

The reader should leave with two things: a usable rule (your AI skill library is a handrail; audit what it picks, not just what it ships) and a feeling (the machines are not reliable narrators about each other, or about themselves).
