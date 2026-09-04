# Build Log: My AI game studio has a physics engine for a boss. (2026-W36-engine-as-referee)

Paper: Agentic Game Development as a Verifiable Trajectory Data Engine (RLHEV) (https://arxiv.org/abs/2608.25518). Paper notes in `notes.md`.

## Attempt log

| # | Date | Attempt | Result |
|---|---|---|---|
| 1 | 2026-08-30 | Built verify-level.mjs (5 gates + seeded bot) + studio.mjs orchestrator | selftest caught a real bug: prop scan counted S and G as props; fixed, selftest ALL PASS |
| 2 | 2026-08-30 | Functional smoke v1 (qwen3:8b designer, think:false, 350 tok) | FAIL: model emitted a 10-wide grid, no S, no G - designed a cafe with no door |
| 3 | 2026-08-30 | Smoke v2-v3: stricter prompt + skeleton example (qwen3:8b) | FAIL: rows of 11/13 chars; nested arrays; PITCH as JSON key |
| 4 | 2026-08-30 | Smoke v4: empty-grid template scaffold (qwen3:8b, temps 0.2/0.4/0.6) | FAIL: perfect row lengths but 11 rows and still zero S - the doorless cafe persisted |
| 5 | 2026-08-30 | Smoke v5: gemma3:12b designer, 12x12, 4 samples | FAIL 0/4: always one 11-char row (the top interior row), otherwise coherent levels with S and G placed |
| 6 | 2026-08-30 | Smoke v6: qwen3:8b WITH thinking, 700 tok budget | FAIL: all 700 tokens died inside hidden thinking, empty output (L-LAB-10 pattern again) |
| 7 | 2026-08-30 | Smoke v7: gemma3:12b on 8x8 worlds, 4 samples | FAIL 0/4: lengths 7/8/9 - the counting problem is size-invariant |
| 8 | 2026-08-30 | **Spec amendment: importer normalization + designer recast to gemma3:12b** | scenario.md rules 1-3, spec protocol 1-2 and variables table updated; the paper's own frame licenses it (real engines clamp on import) |
| 9 | 2026-08-30 | End-to-end smoke after amendment (STUDIO_TAG=smoke, propose full b1) | **GATES PASS first attempt**: 9 rows padded with receipts, bot walked the cafe cleanly; smoke state discarded |
| 10 | 2026-08-30 | Real run v1, brief 1, all arms | FUZZY passed a3; FULL/ENGINE voided - and the bot is the villain: BOT fails with shortest path 17 against a 200-step budget. A uniform random walk ping-pongs in dead-end pockets forever. Pixel was a drunk, not a playtester |
| 11 | 2026-08-30 | **Rig amendment: Pixel rebuilt as a goal-biased walker** (70% steps toward G by Manhattan distance, 30% wander, seeded). Run tag bumped v1 -> v2; v1 receipts preserved | scenario/spec wording updated; run restarts at brief 1 |
| 12 | 2026-08-30 | v2 brief 1: owner accepted FULL-a1 and FUZZY-a1, rejected ENGINE-a3; the engine revision then failed BOT with shortest path 16 in a 200-step budget | Root-caused with the grid in hand: the left corridor is a greedy attractor; a walker without memory oscillates in it. Pixel v2 was still a lottery. **Pixel v3: exploration notebook** (least-visited first, greedy tie-break, 20% wander, seeded). Tag bumped v2 -> v3; v2 receipts preserved; owner verdicts from v2 sitting 1 do not carry (different grids) |
| 13 | 2026-09-03 | Session resumed after Aug 30 crash. v3 state intact: b1 stage A complete all arms (full-a2, engine-a1, fuzzy-a2 gate-clean, pending owner review; b1 shuffle map seeded and stable). Plan: stage A briefs 2-6, then owner reviews batched into max-18 sittings per spec fatigue mitigation | Stage A briefs 2-6 complete: 15/15 propose runs, 0 warnings, INR 0 ($0). 13 gate-clean candidates reach review (b1: 3, b2: 3, b3: 1, b4: 2, b5: 3, b6: 1). Engine arm voided b3 + b6 (PARSE/REACH); FUZZY voided b3/b4/b6 with three BORDER leaks while its consultant gave vibe notes |
| 14 | 2026-09-03 | Found on resume: present-rev filtered revisions by revisionOf === true, but revise() stamps revisionOf with the parent candidate id (string); every revision review would have printed "nothing pending review" and silently skipped the loop | Filter fixed in studio.mjs (revisionOf checked as string for rev2 kind). Presentation plumbing only; engine gates and world content untouched. Owner-side note: candidate COUNT per brief is visible to the owner (same leak a real studio has - you notice who never submitted); arm identity stays hidden by the shuffle |
| 15 | 2026-09-03 | Chronicle completeness check after finalize caught: results-v3.json held only 3 calls and events-v3.jsonl only 3 events despite 49 submissions. Root cause: lab.flush does writeFileSync per process; studio.mjs is one logical run spanning 26 processes, so every propose/revise/finalize clobbered the shared tag file. Tag-scoping (L-LAB-08) protects against RERUNS, not against multi-process runs | Fixed forward: lab-core.mjs flush gained opts.merge (concat ledger, union warnings, recompute rollups, merge only same name+tag) and flushChronicle now unions events by timestamp and resequences (append-only per tag is the law). studio.mjs passes {merge:true} at all 3 flush sites. Episode receipts rebuilt from the system of record by build/reconstruct-ledger.mjs (state + verdicts + tally + transcripts; script aborts if any call lacks its transcript): results-v3.json 75 calls (49 design + 26 consult), events-v3.jsonl 89 events (3 live + 86 rebuilt), 75/75 transcript coverage verified, INR 0 |
| 16 | 2026-09-03 | Run closed (tag v3, one run, two calendar sessions after the Aug 30 crash). 49 submissions (19 full / 15 engine / 15 fuzzy), 75 model calls, 16 owner verdicts (7 accept / 9 reject), 18 consultant scores (18 of 18 scored 7+; 10 scored 8+ on engine-voided levels = disagreement receipts). Gate-pass by attempt: FULL 1/6 -> 2/5 -> 3/3; ENGINE 1/6 -> 3/5 -> 0/2; FUZZY 1/6 -> 2/5 -> 0/3. 17 of 33 engine failures are BORDER leaks. Rig amendments this run: importer normalization (row 8), designer recast to gemma3:12b (row 8), Pixel v3 exploration-notebook walker (row 12) | Tally at build/runs/tally-v3.json. Rig rate is finals-based (accepted finals / finals whose brief chain reached a verdict): FULL 0.43, ENGINE 0.33, FUZZY 0.67 - per-brief closure is FULL 3/6, ENGINE 2/6, FUZZY 2/6, and 11 of 18 brief-desks never survived the engine to reach the boss at all. Prediction grades and verdict ratification land at STORY REVIEW (C3) |
| 17 | 2026-09-04 | C3 STORY REVIEW: beat table approved as presented; all 16 verdicts ratified, zero flips; prediction grades locked (P1 WRONG, P2 INCONCLUSIVE, P3 CONFIRMED) | Approved under the standing delegation recorded in the field journal; the desk record (rubric, sittings, ratification) lives there. Write+build starts: registries first (Mode 5), kits from the beat table, prose from beats only |
| 18 | 2026-09-04 | Write+build complete. Registries: W36 registered in episodes.ts + episode-content.tsx. Blog: site/content/episodes/2026-w36-engine-as-referee.mdx (14 component beats, scenario budget: AgentInspector world-replay, ChatReplay+TryIt replayable, 4 animated-data, IncidentCard data-signature) + plain mirror blog-post.md. Kits: linkedin/x/instagram rewritten from beats to READY, link law enforced (no links in LinkedIn body or first comment, 2026 canon). Decks: deck-square.html 10 frames + deck-linkedin.html 7 frames, captured 10+7 unique PNGs + 2 PDFs. OG: og/2026-w36-engine-as-referee.png. Site build: green, episode page prerendered SSG | check.mjs PRE-PUBLISH PASS (0 errors). Two tool bugs fixed on the way: check.mjs N gate crashed on scenario.md cast tables (MODEL_BADGE.test vs MODEL_BADGE_TEST, first scenario episode ever to reach that line) and the badge regex only knew model names (deterministic/scripted/human/rubric added per VOICE section 2). Posting card + publish log ready for C4 |
| 19 | 2026-09-04 | C4 preview rendered raw unstyled HTML: the export's base-pathed asset URLs (/papersinthewild/_next/...) 404ed under the ad-hoc root preview server while the HTML stayed 200, so "build green" hid a fully unstyled page from the owner | Fixed permanently: site/scripts/preview.mjs (npm run preview) mounts out/ under the production base path like GitHub Pages and self-checks the episode page's CSS links (exit 1 on failure). Correct preview URL: http://localhost:3111/papersinthewild/episodes/2026-w36-engine-as-referee. Logged as L-SITE-03 in LESSONS; verified: page 200, css 200 |
| 20 | 2026-09-04 | Owner C4 verdict: "so technical I couldn't understand anything"; title unparseable cold, opening inside unexplained fiction, rig vocabulary as prose vocabulary, receipt-march flow. Third gate-green voiceless draft (L-S5-03) | Full voice rewrite from the universal anchor ("looks great!" colleague who never opens the file), story spine = the 8/10 judge vs the coordinate judge; rig terms translated at first strike (spawn = entrance, goal = destination, gates = the inspection line, importer = the packaging fixer); title now "The judge who never looked gave my AI's broken levels 8 out of 10." Registry, mirror, kits, deck covers, OG, posting card all updated; decks re-rendered (10+7 frames), site rebuilt, check PASS. Prevention: VOICE.md section 9 item 9 (cold-read test) is now a mandatory pre-C4 QA item; LESSONS L-S5-03 logged, L-S5-01/02 archived (preventions fully absorbed into v5 canon) |
| 21 | 2026-09-04 | Owner caught a blank TryIt block in the C4 preview. Root cause: TryIt renders children; the MDX passed the command as a prompt= prop. W35 shipped with the same blank box (its live page had zero occurrences of the replication command) and W36 inherited the usage by copying W35's MDX | Both episodes fixed to the children form and verified in served HTML (command text present on W36 + W35). New mechanical gate in check.mjs H: <TryIt prompt= is an error. LESSONS L-SITE-04 logged: component usage comes from the component docblock, never from a prior episode's MDX. Site rebuilt; preview re-verified (page 200, opening + TryIt text live) |

## Harness

Shared harness: `tools/lab-core.mjs` (engines: local:<ollama-model>, or:<openrouter-model>, mock:<name>). Import it from the experiment script in this folder's build/ directory.

Flow, always in this order:

1. Smoke test: `node tools/lab-core.mjs --smoke --engines=<specs>`
2. Estimate: INR-first, into experiment-spec.md
3. Self-review against the spec (termination, output budgets)
4. Run via createLab() in build/<experiment>.mjs; every call lands in the ledger

## Smoke results

| Probe | Engine | Result |
|---|---|---|
| engine selftest (4 hand-built levels) | deterministic | ALL PASS after S/G prop-scan bugfix |
| lab ping local:qwen3:8b | Ollama | PASS 3323ms |
| lab ping local:gemma3:12b | Ollama | PASS (used in v5-v7 probes) |
| designer format contract | gemma3:12b + importer normalization | PASS end-to-end (gates green, bot reached goal) |
| consultant score format | qwen3:8b | PASS with strict one-line SCORE prompt |

Smoke conclusion (9 probes, 2 models, 2 grid sizes, think on/off): character-exact 12-wide grids are beyond both locals; the importer-normalization amendment converts counting noise into receipted import patches while keeping every content gate hard. Smoked levels: total cost INR 0 ($0).

## Runs

| Tag | Models | Calls | Wall time | Actual |
|---|---|---|---|---|
| v3 (one run, 26 processes, Aug 30 + Sep 3) | local:gemma3:12b (designer), local:qwen3:8b (consultant) | 75 (49 design + 26 consult) | ~75 model-minutes across two sessions; results ledger rebuilt after row 15 | INR 0 ($0) |

## Costs: estimate vs actual (INR-first)

| Stage | Estimated | Actual | Notes |
|---|---|---|---|
| smoke (9 probes, 2 models) | INR 0 ($0) | INR 0 ($0) | spec amendment row 8 came out of smoke |
| stage A briefs 1-6 (3 arms, ladders close on pass) | INR 0 ($0) | INR 0 ($0) | 44 ladder + 5 repair design calls |
| owner desk (human) | INR 0 ($0) | INR 0 ($0) | 16 verdicts, 2 sittings, rubric in field journal |
| finalize (consultant scores) | INR 0 ($0) | INR 0 ($0) | 18 calls; 10 disagreement receipts |
| total | INR 0 ($0) | INR 0 ($0) | 75/75 calls transcripted; zero warnings all run |

## Field journal appendix

<<node tools/session.mjs --close appends the session archive here at SHIP.>>
