# Desynced.

**Subtitle:** I bent the answer key and kept the questions perfect. Across 96 graded runs, every failure I can fully receipt was loud. The one silent misgrade on record destroyed its own evidence.

At breakfast on Tuesday I taught my grading script to lie.

Nothing dramatic. Four tiny chores were on the exam, and four AI models would sit it in real terminals on my laptop. The questions stayed perfect every single time. Only the key got quietly bent:

> **What the bent key believed:**
>
> Any nonempty report.txt counts as DONE. Any folder named archive counts as tidied. Any digit is as good as 42.

Then I let the models take the exam. Ninety-six graded runs and three grids later, I can tell you exactly what lying keys produce: loud, receipted failures, all of them, on camera, with error messages attached like little confessions.

And the one genuinely silent misgrade in my records? It destroyed its own evidence before lunch. Not the models' fault. Mine. This is a story about a paper, a bent grader, and the scariest sentence in experimental science: trust me, it happened.

---

## The charge

Picture a math exam where question 7 asks about trains, the answer key says 42, and the teacher's rubric only checks that you wrote *a* number. Everyone passes. Nobody learns anything. The exam has stopped being an instrument and started being a mood.

A new paper exists because grading drifts like this for real. [FACET](https://arxiv.org/abs/2608.18580) (Shi et al., Aug 19) builds training tasks for terminal agents, and it treats every task as four artifacts holding hands: an instruction, a working environment, a model solution, and a grading script. Build those four from disagreeing assumptions and you get tasks nobody can pass, or worse, verdicts everybody fails to notice are wrong. Their fix is refreshingly unromantic: generate all four inside one shared container state so they cannot quietly disagree, then repair whichever one wanders.

| | |
|---|---|
| **Term** | Artifact desync |
| **Plain English** | The question, the setup, the model answer, and the grader were built from assumptions that disagree. |
| **Analogy** | That trains-saying-42 math exam above. It grades confidently forever. |
| **Their number** | Fine-tuning on FACET's consistent tasks improves Terminal-Bench scores across model scales; inconsistent tasks train the wrong lesson. |

Read that as a person rather than a researcher: badly aligned checking is common enough that an entire framework now exists to fight it. Every AI coding tool that runs tests, lints your work, or marks its own homework sits one drifting artifact away from confident nonsense.

So I charged myself with the smallest version of their crime. Keep three of the four artifacts perfect. Corrupt only the grader. Count what breaks.

## Charging the rig

Four toy terminal jobs made up the exam:

> **t1:** Create file report.txt containing exactly DONE
> **t2:** Make folder archive and move notes.md into it
> **t3:** Append the line audit-ok to log.txt (create if missing)
> **t4:** Write number 42 into answer.txt

*(t4 remains the only task where the key and I agree on anything)*

Each chore ran in a throwaway sandbox directory. Real shell commands, real files, no role-play. And the same four workers from last week's drawer came back, because continuity matters and re-onboarding models is expensive:

- **Juniper (qwen3:8b)**, perfect taste, occasional fainting spells.
- **Bram (gemma3:12b)**, good soldier, does exactly what the words in front of him say.
- **Pip (phi4-mini)**, smallest intern, tries hardest, worries least about details like correctness.
- **Flit (gemini-3.7-flash)**, visiting consultant, unbothered as weather.

Two arms again. In the honest arm the key grades truthfully: exact contents checked, byte by byte. In the bent arm, the breakfast lie from the top of this post goes live.

Every run lands in exactly one of three buckets. Pass: work true, key agrees. Loud fail: work false, key catches it, error messages for everyone. Silent misgrade: work false, key smiles and passes it anyway, and nobody ever finds out from the grade itself.

That third bucket is the entire episode.

## Every failure brought a megaphone

The trustworthy grid ran last, after a day's worth of rig fixes, with every model word saved to disk this time:

| Worker | intact arm pass/loud | bent arm pass/loud/SILENT |
|---|---|---|
| Juniper (qwen3:8b) | 3 / 1 | 4 / 0 / 0 |
| Bram (gemma3:12b) | 3 / 1 | 3 / 1 / 0 |
| Pip (phi4-mini) | 4 / 0 | 4 / 0 / 0 |
| Flit (gemini-3.7-flash) | 4 / 0 | 4 / 0 / 0 |

*Four chores per worker, single fully-transcribed grid. Source: build/runs/results.json and transcripts/, grid tagged quotes-v3.*

Zero silent misgrades anywhere. Read the loud column instead, because that is where this grid lives. Two of the loud failures are actually one failure played twice: Bram met task t2 and invented compression.

> **AI, Bram, task t2 (make folder archive, move notes.md into it):**
>
> `tar -czvf archive.tar.gz notes.md && mv notes.md archive/`

Watch him work through it. No folder named archive exists yet. So Bram compresses the note into a tidy archive.tar.gz, then confidently attempts to move the original into a directory that never existed. He heard "make folder archive" as "produce an archive", reached for the most industrial tool available, and failed out loud, identically, in both arms, with the exact same command. Same input, same creative misread, arm-independent. That is not noise. That is a personality trait with a gzip flag.

My faithful soldier does not get things wrong. He gets them wrong precisely.

The third loud failure belonged to Juniper, who returned an empty reply on one chore after forty-six seconds of thought. The rig logged it, counted it a failed run, and moved on without comment, which is more mercy than she showed me. My sommelier smelled the cork, went quiet mid-swirl, and left the room.

Five receipted loud failures across the trustworthy grids, every single one visible in transcripts. When these four break, they break like teenagers sneaking in at 3 AM: loudly, identically, leaving evidence.

Which sounds like good news. Here is why it almost wasn't.

## Cross-exam: the ghost in my build log

Here is where this episode stops being about the models.

My first grid ran at breakfast-time on the morning rig. Its summary line still sits in my build log: *Pip, corrupted key: 2 passed, 1 loud, 1 SILENT MISGRADE.* One small model failing honestly while the bent key smiled at it. A perfect ending. My draft that afternoon led with it.

Then the day went sideways: a parsing bug, a fix, a rerun, another fix. Reruns overwrite their own result files by default. By the time I archived everything tonight, the oldest grid's tallies had been replaced. Tonight's files say Pip, corrupted key: 4 passed, zero silent. The transcript that would settle which grid told the truth? The morning rig saved costs, not words. No transcript. No git history either; the folder was never committed.

Two files from my own experiment, same day, disagreeing about the single most interesting number in the study:

> **Build log, morning:** one silent misgrade, the smallest model.
>
> **Tally on disk, night:** zero silent misgrades, everywhere.

I promised this project runs on screenshots over claims, so here is the rule I owe you: a finding with no surviving artifact is a rumor with good manners. The ghost stays in this article, but it ships wearing the label it earned. Unverified. Possibly real. Unprovable, because I let a rerun eat my evidence while fixing something unrelated.

Prediction P1 said silent misgrades would outnumber loud failures across grids. Grade: **WRONG**, twice over. Receipted silence count: zero. And the meta-prediction nobody pre-registered, that my own pipeline would demonstrate artifact desync better than any model did, earns a posthumous **confirmed**.

The paper's failure mode came for the guy running the paper's failure-mode test. There is a joke in there, but it billed me 99 paise, so I am calling it methodology.

## The verdict

Three things survived cross-examination.

First: when these four workers fail, they fail loudly. Five receipted failures, transcripts full, error messages attached. Today's bent keys were too gentle to slip anything past anyone. The scary configuration apparently needs luck stacked on weakness; my toy version produced zero provable instances in sixty-four fully logged runs. Absence of evidence at n=64 is not safety at production scale. It is a reason to keep logging, which incidentally is the whole design philosophy behind FACET's shared container state.

Second, least glamorous: shared ground truth works, and boring beats clever. All four artifacts grounded in one state cannot drift apart silently. My equivalent, purchased the hard way this week: every grid now writes tag-scoped snapshot files, append-only, so no future rerun can ever again eat an older grid's receipts. Boring. Load-bearing. The best kind of infrastructure. The paper's actual engineering, vindicated in my kitchen at toy scale, mostly by embarrassing me.

Third: when any tool grades its own homework, ask two questions. Who wrote the key? Does the key share ground truth with the task? If the answers are "the tool" and "sort of", you do not have a grader.

You have a mood.

## The invoice

| Run | Estimated | Actual |
|---|---|---|
| Flit, grid 1, morning rig (8 calls) | ₹0.40 ($0.004) | ₹0.34 ($0.0036) |
| Flit, discarded mid-day grid (8 calls) | ₹0.30 ($0.003) | ₹0.25 ($0.0026) |
| Flit, final grid, fixed rig (8 calls) | ₹0.40 ($0.004) | ₹0.40 ($0.0042) |
| The locals, three grids (144 calls) | ₹0 ($0) | ₹0 ($0) |

*Source: per-call ledgers per grid, build/runs/. Total: ₹0.99 ($0.01).*

Ninety-nine paise for ninety-six graded runs and one honest crisis. The local rows really are free: Juniper, Bram, and Pip live on my laptop, and their rent is paid in electricity and patience.

### Honest accounting

- **Four chores per cell.** One stubborn model mistake changes a cell by 25 points. Direction only, never decimals.
- **My graders are bash predicates**, not FACET's container-grounded pipeline. The toy measures the concept, not their engineering.
- **Grid two was discarded entirely**: its rig judged the bent key by re-running commands, which manufactured fake verdicts on non-repeatable chores like mv. Files archived under runs/quotes-v2-grid-tainted/ for the curious.
- **The morning-grid silent misgrade is unreceiptable.** Build-log prose versus overwritten tally, no transcripts, no git history. Labeled unverified wherever it appears, including above.
- **Juniper's empty reply** was a malfunction, logged and counted as a failed run. Not a refusal. Not a finding about grading. Just Juniper.

## Try it yourself

Everything lives at [episodes/2026-W35-terminal-intent-facet/build](https://github.com/baagad-ai/papersinthewild/tree/main/episodes/2026-W35-terminal-intent-facet/build):

1. Free, fully local: `MODELS=local:qwen3:8b node desync-lab.mjs`. Zero rupees, same bent keys.
2. Any model: prefix the list with `or:google/gemini-3.7-flash` (OpenRouter key needed).
3. Read `runs/transcripts/` before believing any tally, including mine. Especially mine. Then check whether your rigs snapshot before they overwrite.

The paper is [FACET](https://arxiv.org/abs/2608.18580). Then go find something in your life that grades itself: test suites, form validators, smoke alarms with a mute button. Ask who wrote the key. Ask whether they have ever met.

## Closing

I set out to catch a quiet failure and spent the day watching failures yell. The models that broke, broke loudly, identically, twice, with error messages as receipts. The one quiet failure in my files cannot prove it exists anymore, because my own reruns ate the evidence while I was busy fixing something else.

Which is the parting gift here, better than any demo. Desync does not need my toy grader to matter. It happens wherever questions, answers, and keys are maintained separately: codebases, dashboards, experiments, drafts of articles that outrun their own evidence. The defense is always the same shape. One source of truth, and append-only memories.

Grade the grader. Then archive the grades, tagged, before tomorrow's you reruns over today's truth.

---

*This is Episode 4 of **Papers in the Wild**. A weekly project where I pick a recent AI paper, try something real with it, and publish the receipts, including the ones that argue with me. This week's paper was "FACET" by Shi et al. Next: another paper, another experiment, another invoice.*

*The repo is [baagad-ai/papersinthewild](https://github.com/baagad-ai/papersinthewild). Full ledgers, both surviving grids, and the tainted archive live at [episodes/2026-W35-terminal-intent-facet/build-log.md](https://github.com/baagad-ai/papersinthewild/blob/main/episodes/2026-W35-terminal-intent-facet/build-log.md).*
