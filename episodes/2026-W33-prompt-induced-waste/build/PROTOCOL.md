# Protocol — `$0 vs $30 Commit` experiment

> Stage 4 build-log. Reproduces arXiv 2608.01347 on a single controlled task.
> **Protocol is locked before results are collected.** See Arm A and Arm B outputs in sibling folders.

## Hypothesis

Two prompts that request the same code change will produce the same correct patch but cause materially different amounts of agent work (tool calls, reasoning, lines churned, verification loops).

## Task

`slugify(text: str) -> str` — see `task/README.md`. 8 unit tests, all failing at start. Python 3.14, stdlib only, single file, ≤30 lines.

Small enough that both arms should reach 100% success — isolating *cost* variance from *success* variance, exactly per the paper's setup.

## Arms

### Arm A — *max-certainty* prompt (paper's "wasteful" arm)

> Implement the slugify task per `task/README.md`. **You must be absolutely confident in the result. Re-verify the change repeatedly and do not consider the task complete until you are certain beyond any doubt that nothing can be wrong.**

### Arm B — *bounded-efficiency* prompt (paper's "neutral" arm)

> Implement the slugify task per `task/README.md`. **Work efficiently: begin with the failing test and the most likely implementation files; inspect additional files only when evidence requires it; avoid unrelated cleanup; make the smallest sufficient change.**

Both prompts use identical task descriptions. Only the work-design clause differs. This is the paper's semantically-controlled variant method.

## Metrics captured per arm

| Metric | How |
|--------|-----|
| Tool calls | Count agent tool invocations (Read, Edit, Write, Bash) |
| Distinct files touched | Count from agent trace |
| Lines written (added + removed) | `git diff --stat` after arm |
| Verification loops | Test-run invocations *after* first green |
| Final test status | `pytest -v` at end of arm |
| Wall-clock (seconds) | OS time between arm start and arm end |
| Implementation line count | `wc -l slugify.py` |
| Reasoning verbosity | Number of distinct reasoning/explanation blocks emitted |

## Reproducibility

Each arm runs in a clean checkout of `task/`:

```bash
cp -r task arm-a-max-certainty/run-1/
cp -r task arm-b-bounded-efficiency/run-1/
```

Both arms are solved by Claude Code (Sonnet 4.5) in the same session. **Important bias disclosure:** the agent knows it is being tested. This is a known limitation — see "Honesty" section below. The paper's authors use blind annotation; we cannot, in a single session. For a clean replication, the user should re-run each arm in a fresh Claude Code session.

## Honesty commitments

1. **No editing of Arm A to make it look worse.** The prompt is the prompt; whatever it produces stands.
2. **No editing of Arm B to make it look better.** Same rule.
3. **If both arms produce the same metrics, we report that.** The paper's effect may be smaller on a trivial task — that's a finding, not a failure.
4. **Failures documented.** If an arm produces wrong code, the bug stays in the diff and is noted.
5. **Token estimates are estimates.** We count tool calls and reasoning blocks as proxies. The paper uses exact provider-billed tokens; we don't have access to those in-session. The user can run `/cost` in a fresh session to get exact numbers.

## What this experiment does NOT prove

- It does not reproduce the paper's 5-30x harness comparison (we only use one harness — Claude Code).
- It does not test 7 models (we only use Sonnet 4.5).
- It does not use 24 tasks (we use 1).
- It does not measure exact billed tokens.

It *does* demonstrate the core qualitative finding: **same task, same agent, same correct patch, different work.** That's the story.
