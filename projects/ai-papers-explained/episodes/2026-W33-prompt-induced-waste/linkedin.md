# LinkedIn Post 1 — Episode 1 LAUNCH

> Published Friday 2026-08-14, ~8:30 AM IST.
> Voice: dry, specific, Levine-style understatement. The absurdity lands because it's understated.
> Link goes in FIRST COMMENT (LinkedIn algorithm rule).

---

## Final post (paste verbatim)

Last week I typed the words "be absolutely certain" into a Claude Code prompt.

The task was a 4-line Python function. Any junior dev finishes it in thirty seconds.

My AI took seven and a half minutes.

It wrote 32 lines of code instead of 4. Re-read its own writing. Invented nine extra tests to check itself. None caught a bug, because there was no bug. Ran the test suite twice. Added a TypeError check for a case no test exercised.

The answer was the same as if it had just written the 4 lines.

Anyway, here's a paper.

"Same Task, Different Work: Prompt-Induced Waste in Coding Agents" (arXiv, Aug 2026) ran 4,644 trials across 7 models. Their finding: prompt wording alone causes 5 to 30 times cost variance. Same correct result. Different bill.

I didn't believe the 5 to 30× number. So I ran 36 more trials. The pattern held. Max-certainty prompts averaged 4× more work than the fix. On harder tasks, the multiplier grew to 4.6×.

The wasteful phrases to delete from your prompt templates today:

→ "think very deeply"
→ "be absolutely certain"
→ "develop several distinct approaches"
→ "explore every possibility"

The fix is one sentence:

"Work efficiently: begin with the failing test and the most likely implementation files; inspect additional files only when evidence requires it; make the smallest sufficient change."

Cost: free. Success: identical. The paper measured this on 4,644 trials. I measured it on 36. Both came to the same conclusion.

Your prompt templates are silently setting your invoice on fire.

Episode 1 of Papers in the Wild is live. Full writeup with the 36-trial data in the first comment ↓

#promptengineering #ai #codingagents #papersinthewild

---

## First comment (paste immediately after posting)

Episode 1: "My AI has an anxiety problem."

Full writeup (the fun version, written for non-technical readers):
https://papersinthewild.io

GitHub (the actual code, all 36 trial outputs, replication protocol):
https://github.com/baagad-ai/papersinthewild/tree/main/projects/ai-papers-explained/episodes/2026-W33-prompt-induced-waste

Paper: https://arxiv.org/abs/2608.01347

If you replicate on your own repo, send me the numbers. I'll collate.

---

## Why this hook works (for future reference)

- **Opens with a scene** ("Last week I typed the words...") — personal memory, not "I have a confession"
- **"Anyway, here's a paper."** — Levine-style dry pivot. The absurdity lands without signposting.
- **Specific absurd detail** (TypeError check that no test exercised) — humor through specificity
- **Numbers do the heavy lifting** — 32 lines vs 4, 7.5 minutes, 9 extra tests
- **No hype words.** No emoji. No "game-changer." The receipt is the drama.
- **The fix is concretely stated** — readers can copy-paste the bounded-efficiency sentence.
- **Ends on the launch CTA** — "Episode 1 of Papers in the Wild is live" — implicit "go read it"

## Engagement protocol (first 60 min)

1. Don't edit the post in the first hour (algorithm penalty).
2. Refresh every 5 min for the first 30 min. Reply to every comment.
3. If a comment is interesting, reply with a question, not a statement.
4. DM anyone who likes but doesn't comment. Ask what their default prompt looks like.
5. After 60 min: check `/cost`-style comments. Engage with skepticism honestly.

## Self-audit (run before posting)

- [ ] Opening uses a Karpathy / Levine move (not Substack-template)
- [ ] No item from STYLE-GUIDE never-use list
- [ ] No links in body ✓
- [ ] 4 hashtags, calm ✓
- [ ] Bounded-efficiency prompt quoted exactly ✓
- [ ] Wasteful phrases listed verbatim ✓
- [ ] 130-300 words (this draft is ~240 ✓)
- [ ] Specific absurd detail in first 3 lines ✓ (TypeError check / 32 lines vs 4)
