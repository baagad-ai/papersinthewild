# Instagram Carousel — Episode 1

> 10 slides, square 1080×1080.
> Cover MUST be calm — no flags, weapons, blood, bare skin, aggressive imagery.
> Voice: dry, specific, Levine-style understatement. Receipts over rhetoric.
> Source for Stage 6: pass to `slide-wand --square` for HTML rendering.

---

## Visual identity per slide

- **Background:** cream `#F5EFE0`
- **Foreground text:** deep ink `#1A1612`
- **Accent:** oxblood `#7C2D2D` (single accent — used for key numbers, the seal, dividers)
- **Display font:** Fraunces (titles, hooks)
- **Mono font:** IBM Plex Mono (numbers, metadata, captions)
- **Body:** Source Serif 4 (longer prose, rare)
- **Slide corner mark:** small PITW seal (top-right, 80×80px, 30% opacity)
- **Slide footer:** "EP. 01 · papers in the wild" in Plex Mono uppercase, 14px, ink-mute

## Slide-by-slide script

### Slide 1 — Cover (scroll-stopper)

```
[layout: left-aligned, generous whitespace, single accent]

My AI has an
anxiety
problem.

[ink-rule with small oxblood seal]

I typed four words
into a prompt.
My AI took seven minutes
to write four lines of code.

[bottom-right: PITW seal]
[bottom-left tiny: EP. 01 · 2026-08-12 · papers in the wild]
```

**Design notes:** Fraunces 500 italic for "anxiety problem". Big. The subtitle smaller, in Source Serif. Lots of whitespace. The title sets up a character (the anxious AI) before any data lands. Reader curiosity: why does the AI have anxiety? Swipe to find out. Calm cover per feedback memory (no flags, weapons, bare skin, aggressive imagery).

---

### Slide 2 — The scene

```
[layout: centered, two short paragraphs]

Some weeks ago I typed
"be absolutely certain"
into a Claude Code prompt.

The task: write a 4-line
Python function.

THIN OXBLOOD RULE

Any junior dev finishes this
in thirty seconds.

My AI took seven and
a half minutes.
```

**Design notes:** Source Serif throughout, Fraunces only for "seven and a half minutes" in oxblood. The contrast is the joke.

---

### Slide 3 — What my AI did

```
[layout: list, monospace]

WHAT MY AI DID
(with the "be certain" prompt)

→ wrote 32 lines of code (4 were needed)
→ re-read its own implementation
→ invented 9 extra tests
→ ran the test suite twice
→ added a TypeError check
   that no test ever exercised

ALL OF THIS BOUGHT:
   nothing.
   the answer was the same
   as the 4-line version.

Anyway, here's a paper.
```

**Design notes:** "WHAT MY AI DID" eyebrow in Plex Mono uppercase oxblood. List in Source Serif with oxblood arrows. The "Anyway, here's a paper" closer in Fraunces 500 italic — Levine-style dry pivot.

---

### Slide 4 — The paper

```
[layout: top-aligned, structured]

THIS ISN'T JUST ME.

Same Task, Different Work:
Prompt-Induced Waste in Coding Agents

Weinberger & Hozez · arXiv:2608.01347 · Aug 2026

[thin oxblood rule]

They ran 4,644 trials.
Across 24 tasks. 7 models. 2 harnesses.

Finding: 5-30× cost variance
from prompt wording alone.
Zero success difference.
```

**Design notes:** Title in Fraunces 500 italic. Numbers in Plex Mono oxblood. The parenthetical "(I ran 36. We are not the same.)" — actually skip this on the slide, too inside-baseball.

---

### Slide 5 — Two traps

```
[layout: split horizontally]

TRAP 1: "MULTIPLE APPROACHES"
tell the AI to compare options.
it drafts 3 solutions in its head,
throws 2 away, implements the 3rd.
you pay for all 3.

↑ up to 16.6× more reasoning tokens

THIN OXBLOOD RULE

TRAP 2: "BE ABSOLUTELY CERTAIN"
tell the AI to be sure.
it spirals. re-reads its own code.
writes new tests to check the tests
it already ran. runs the suite again.

↑ up to 18.25× the cost of a clean run
```

**Design notes:** Section headers in Plex Mono uppercase oxblood. Bodies in Source Serif. The two big multipliers at the bottom of each section in giant Plex Mono oxblood.

---

### Slide 6 — THE RECEIPT (mandatory slide)

```
[layout: full-bleed table]

THE RECEIPT
36 trials · 3 task tiers · 6 prompt variants

┌────────────────────────┬──────────┬──────────┐
│ PROMPT                 │ TOOL CALL│ WALL (s) │
├────────────────────────┼──────────┼──────────┤
│ baseline               │   3.7    │    12    │
│ bounded-efficiency ←   │   5.0    │    15    │
│ exhaustive-exploration │   6.3    │    24    │
│ multiple-approaches    │   6.2    │    30    │
│ deep-thinking          │   7.7    │    32    │
│ MAX CERTAINTY          │  20.2    │    42    │
└────────────────────────┴──────────┴──────────┘

100% success rate. all 36 trials passed.
```

**Design notes:** "THE RECEIPT" header in Fraunces 500, oxblood. Table in Plex Mono. The "bounded-efficiency ←" row highlighted with oxblood left-border. The "MAX CERTAINTY" row in bold. Caption in Source Serif italic, ink-mute.

---

### Slide 7 — The fix

```
[layout: centered]

THE FIX IS ONE SENTENCE

[ink-rule with oxblood seal]

Work efficiently: begin with
the failing test and the most
likely implementation files;
inspect additional files only
when evidence requires it;
make the smallest sufficient change.

[ink-rule with oxblood seal]

measured: 0.89-1.02× baseline cost
success: identical
cost: FREE.
```

**Design notes:** Eyebrow in Plex Mono uppercase oxblood. The quoted sentence in Fraunces 500 italic. Metrics at bottom in Plex Mono oxblood.

---

### Slide 8 — The finding I didn't expect

```
[layout: numbered, with mini-chart]

THE WASTE SCALES WITH DIFFICULTY

tool-call ratio: max-certainty vs bounded-efficiency

trivial task     ▓▓▓▓▓▓▓  3.3×
medium task      ▓▓▓▓▓▓▓▓▓  4.2×
harder task      ▓▓▓▓▓▓▓▓▓▓ 4.6×

a bad prompt isn't a constant tax.
it's a tax that scales
with your problem.
```

**Design notes:** Each row in Plex Mono with the bar charts aligned. The "4.6×" in the harder-task row is the punchline — bigger, oxblood. Closing line in Fraunces 500 italic.

---

### Slide 9 — The analogy

```
[layout: two panels]

"BE ABSOLUTELY CERTAIN" IS LIKE
TELLING YOUR MOST ANXIOUS FRIEND
TO "JUST MAKE SURE" THE DOOR
IS LOCKED.

They will check the door.
They will check it again.
They will ask if they checked it.
They might write a note
confirming they checked it.

The door was locked
the first time.

THIN OXBLOOD RULE

"WORK EFFICIENTLY" IS LIKE
SAYING: "LOCK THE DOOR,
CONFIRM IT'S LOCKED,
WALK AWAY."

Not less careful.
Appropriately careful.
```

**Design notes:** Two clear panels with the oxblood rule between. Each panel header in Plex Mono uppercase. The contrast is the joke. Final line in Fraunces 500 italic oxblood.

---

### Slide 10 — CTA + seal

```
[layout: centered]

[large PITW seal centered]

Papers in the Wild

I read a paper.
I tried it.
Here are the receipts.

[next episode Friday]

[bottom strip]
EP. 01 · papers in the wild · @baagad.ai
```

**Design notes:** Seal at ~280px diameter, centered. Wordmark in Fraunces 500. Tagline in Source Serif italic, ink-mute. "next episode Friday" in Plex Mono uppercase.

---

## Caption (the IG post itself)

Some weeks ago I typed the words "be absolutely certain" into a Claude Code prompt. The task was a 4-line Python function. My AI took seven and a half minutes.

It wrote 32 lines, re-read its own implementation, invented 9 extra tests, ran the suite twice, and added a TypeError check that no test exercised. The answer was the same as the 4-line version.

Anyway, here's a paper. The receipt is in the carousel.

Full writeup + 36-trial data — link in bio.

#promptengineering #ai #codingagents #papersinthewild

---

## Pre-flight checklist (per BRAND.md anti-throttling rules)

- [ ] Cover slide: no flags, weapons, blood, bare skin, aggressive imagery ✓
- [ ] Cover slide: no AI-spam patterns (sparkles, robots, brains) ✓
- [ ] Hashtags: 4, all calm/descriptive ✓
- [ ] Caption: under 200 words, hook in first line ✓
- [ ] No external links in caption (link in bio only) ✓
- [ ] At least one specific number in the first 3 slides ✓ (7.5 minutes, 4-line, 32 lines)
- [ ] Slide 6 has the receipt table ✓
- [ ] Slide 10 has CTA + seal ✓
- [ ] All numbers in Plex Mono ✓
- [ ] All accents in oxblood, single color ✓
- [ ] No emoji spam (zero in this carousel) ✓
- [ ] Voice matches STYLE-GUIDE: dry, specific, Levine-style understatement ✓

## Rendering (Stage 6)

Pass to `slide-wand --square`:

```bash
slide-wand \
  --input episodes/2026-w33-prompt-induced-waste/instagram.md \
  --format square \
  --design-system ~/.claude/content-wand/slides/design-system-square.json \
  --output episodes/2026-W33-prompt-induced-waste/assets/
```

Produces 10 PNGs at 1080×1080 + 1 PDF.
