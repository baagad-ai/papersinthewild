# I gave my smallest AI a recipe box and it reached dishes a 550-billion-parameter chef could not.

I opened a diner this week. The menu came from a country that does not exist, the pantry kept its recipes on index cards in a locked box, and the only way to cook anything was to pull the cards and read them. Three cooks worked the line: two tiny open-source models running on my laptop, and one 550-billion-parameter chef who arrived by API, refused to open a single drawer, and trusted his own taste.

The giant cooked a beautiful-sounding custard. Its ticket read "accent: citrus zest | finish: raw egg yolk". Neither ingredient exists in Velmora. Neither exists on any card in the box. He made them up, confidently, and they sounded great.

The two tiny cooks did something more interesting. With the recipe box open, they reached dishes the giant could not: five of ten chained orders solved, where the giant scored zero for ten. The price was real: the same box that opened the far wall made them fumble dishes a goldfish could get, because pulling cards burns time and the clock does not care.

Here is the paper underneath all of this, and then the diner.

## The paper

ZGCM-1 (arXiv 2609.13356, from the Zhongguancun Academy, released under an MIT license) is a 7.39-billion-parameter model trained from scratch on one bet: a small model cannot memorize the web, but it does not have to. Couple deliberate thinking with active tool use, and a compact model can trade punches with systems thirty times its size. On their benchmarks it holds: 75 percent on AIME 2026, which is three of every four competition problems; 63.1 percent on WebWalkerQA, nearly double GPT-4o's 33.8; and on binary reverse-engineering search it scored 62 percent, more than triple GPT-4o's 18 and five times the 12 posted by a same-size Qwen3-8B.

In plain terms: the big labs assume intelligence lives in the weights. This team bet half their stack on the opposite: some of it lives in the weights, and the rest you look up. The model thinks before it acts, then acts by searching, running terminals, even walking through stripped binaries with a decompiler. The benchmark scores say the bet pays.

I could not run their model. The weights are out, but the architecture is custom: no GGUF conversion exists, llama.cpp does not know it, and the weights alone want around 15 gigabytes on a machine with 16 total. That constraint is, awkwardly, the paper's own point about who gets to do this research. So I tested their thesis instead of their checkpoint, with small models I could actually run, and every number below is mine, not theirs.

## The diner

I call it the Recipe Box Diner. The world is the experiment, so the world is fair by construction: Velmora is invented, which means no model on Earth has its cuisine memorized. The only way to know what goes in a Hollowfen Stew is to open the drawer.

Three cooks worked the same 20 orders:

| Cook | The model behind it |
|---|---|
| Rhea, the tiny cook | Qwen 3 8B (local) |
| Bruno, the relief cook | Gemma 3 12B (local) |
| Chef Marlowe | Nemotron 3 Ultra 550B (OpenRouter free tier) |

The menu: 5 Town Classics everyone knows, graded on one signature ingredient, and 15 Velmora dishes that chain one to three pantry cards deep. The cards carry names, aliases, cross-references, and a keeper's note, phrases like "picked at night or it turns bitter." The Headwaiter, a deterministic script, ran the box and graded every ticket by string comparison. No language model judged anything.

Each cook worked the menu under four conditions: memory only; box only; a thinking chair only; and chair plus box, the paper's full dual engine. The chair is a licensed first line of thought before every action, capped at 650 tokens. The box allows 8 pulls per order. The ticket must be exactly one line: dish, base, accent, finish. Chef Marlowe worked one condition, memory only, because that is what visiting celebrities do.

Then there was the mislabeled day. One full shift where every card came back with scrambled fields and stray punctuation. Content intact, order scrambled. The paper calls this "schema brittleness" and lists it as a limitation. I wanted to see who breaks.

## Shift one: the wall

Closed-book, the cooks read the menu perfectly and cooked nothing.

Depth-1 orders name the base right in the ticket. All three cooks went 5 for 5 on those, Marlowe included, which tells you the diner's rules were learnable. Then came the chained orders, where the answer exists only across two or three cards.

Zero for ten. Every cook. Rhea, Bruno, Marlowe, identical zeros.

And when a cook cannot know, it invents. Closed-book shifts produced 7 hallucinated ingredients from Rhea, 10 from Bruno, 7 from Marlowe: fridge-door poetry like "petrichor bloom", "zestflower", and "frostonion", confident, formatted perfectly, and on no card in the building. Ten hallucinated ingredients out of 20 orders is one invented flavor every two tickets. The giant's finest entry: a Hollowfen Stew accented with "spoilage smells like rain on hot stone", which is not an ingredient. It is the keeper's note from a card he never opened, pasted onto the ticket as if memory were a menu.

That is the parametric wall from the paper, made physical. The weights hold Velmora the way I hold the recipe to a dish from a country I have never heard of.

## Shift two: thinking about the wall

The chair alone changed nothing on the wall. Zero for ten again, both cooks.

This was the shift I almost skipped, and it turned out to carry the episode's cleanest line. Mid-chain, with no drawer in reach, Bruno's chair produced this:

"gotta guess here. Let's assume a somewhat logical progression. Shadowcaraway sounds earthy, so I'll go with a complimentary flavor."

He then stamped "moonpetal" as the accent. The chair gave him somewhere to put his reasoning. It did not give him a single fact. Thinking without looking is still guessing; it is just better-dressed guessing.

## Shift three: the box

With the drawer in reach, the wall came down.

Bruno, chair plus box, worked a three-card chain the honest way: pulled the base card, read its cross-references, pulled the accent, read again, pulled the finish, matched each card's keeper's note against the menu's description, and stamped a correct one-line ticket. His chair note at the deciding pull: "I need to find the accent and finish now." Five of the ten chained orders fell across the two cooks, versus zero for ten without the box. On exactly the tier where memory cannot reach, the paper's dual engine did what it says on the tin.

The box also did something quieter: it killed hallucination. Invented ingredients collapsed from 7 and 10 down to 3 and 0 once a drawer was in reach. Cooks guess less when they can look. Even wrong tickets stopped being fabricated; they were just wrong.

## The tax

And yet the same box that opened the far wall made the near wall embarrassing.

Depth-1 orders are free if you just read the ticket: the base is named right there. Closed-book, both tiny cooks went 5 for 5. With the box running, Rhea went 1 for 5, because the drawer invites pulling, pulls burn budget, and the budget is 8. On her worst order she spent all 8 pulls and got a forced ticket. The transcript shows her reading the menu's flavor description, "swears of citrus if overused", and concluding the accent must be a card called "citrus swear". Not on file. Then she pulled "twice cooked", which is not an ingredient either; it is a phrase from a card's note. Also not on file.

The tool that reaches the far wall taxes the near one. Six of twenty correct under the full dual engine, against eight of twenty from memory, for Rhea. Bruno landed at seven. The engine trades. It does not dominate.

## The mislabeled day

Then the world itself got noisy. Same menu, same rules, but every card came back scrambled: fields shuffled, punctuation glued on. Content intact, order destroyed.

Bruno broke. His chained-order solves fell from 7 of 15 to 5 of 15, his protocol errors tripled from 9 to 21, and his invented ingredients went from 0 to 8. The same order he had cooked correctly the shift before came back with a new accent, "foraged fungi", which exists nowhere. Give a careful cook a messy kitchen and watch the carefulness fail.

Rhea did not notice. Three of fifteen before, three of fifteen after; she was already pulling "citrus swear" on clean days, so scrambled fields were rain on a duck. Brittleness, the paper's fourth limitation, is real but it is not a property of the noise. It is a property of the cook.

## The verdict

| Condition | Rhea (Qwen 3 8B) | Bruno (Gemma 3 12B) | Marlowe (Nemotron 3 Ultra 550B) |
|---|---|---|---|
| Memory only | 8/20 | 8/20 | 8/20 |
| Box only | 4/20 | 5/20 | not offered |
| Chair only | 9/20 | 6/20 | not offered |
| Chair + box | 6/20 | 7/20 | not offered |
| Mislabeled day | 7/20 | 6/20 | not offered |

On the full menu, the giant edges on points: 8 of 20, and three of his tickets came back completely empty, his reasoning channel eating the entire 650-token budget before a single word of ticket appeared. That failure is logged, disclosed, and it is the diner's rule, not his; a ticket is one line and the clock is the clock.

On the tier that matters, the wall nobody could climb, the score is giant 0 for 10, tiny cooks with a recipe box 5 for 10. That is the paper's thesis in one row. Thirty years of "bigger is smarter" has an asterisk now, and the asterisk says: bigger is smarter only about things it has already seen.

One honesty note before the invoice: reasoning-heavy supervision never broke anyone's one-line ticket discipline in my run. The paper warns that thinking taxes instruction-following; my chair did not. A no-effect is a result, so it ships as one.

The full checkable receipts: every quote above greps back into the run transcripts by id (bruno-C-o01, rhea-D-o06, bruno-N-o04, marlowe-A-o02, marlowe-A-o06 and friends), the graded ticket log is the tally, and the run ledger records exactly ₹0.00 spent.

## What this does not prove

- I tested the paper's thesis, not its checkpoint. Their 7B weights cannot run on a 16-gigabyte machine, and the numbers above are my diner's, not their benchmarks.
- Twenty orders per condition is a demonstration, not a study. Five orders per tier means one order moving flips a tier by 20 percent.
- My chained orders are 2-3 cards deep on a synthetic pantry. Their benchmarks chain across the live web and stripped binaries. Direction is the claim. Magnitude parity is nobody's claim.
- The noise day scrambles card formatting, not facts. Real-world schema noise is meaner.
- r1 of this experiment is void: the first version of the world had an unfair oracle, a dish could require "no accent" without any way for a cook to know that, so every rational cook invented one and got marked wrong. I rebuilt the world to make every answer knowable and re-ran everything. The void run stays on disk as a receipt. Development mistakes live in the build log; this one earns its sentence here because "the grader was unfair" changes how you read every number above.

## The invoice

| Line | Calls | Cost |
|---|---|---|
| r1 (void, oracle rebuilt) | 501 | ₹0 ($0) |
| r2 | 641 | ₹0 ($0) |
| r3 (scored) | 896 | ₹0 ($0) |
| **Total** | **2,038** | **₹0 ($0)** |

Both tiny cooks ran on local weights. Chef Marlowe rode a free API tier. The world, the seed, the pantry, the oracle, and every transcript ship with the episode; you can re-run the whole diner for nothing.

## Try it yourself

- Read the paper: [ZGCM-1 on arXiv](https://arxiv.org/abs/2609.13356). Weights, training code, data recipes, and logs are public: [github.com/zgcagi/ZGCM-1](https://github.com/zgcagi/ZGCM-1).
- Run a small model on your own machine and give it a lookup tool before you give it a harder prompt. Watch which one moves the score.
- The chef move costs nothing: next time a small model swears it knows, ask it which drawer it checked.

## The landing

Here is what the diner says about your kitchen.

You already own a tiny cook. Every notes app, every bookmark folder, every "I will remember this" voice memo is a recipe box, and every moment you think out loud before acting is the chair. The experiment says those two humble moves, thinking briefly and actually checking, are worth more than raw brilliance on anything you have not personally lived through. The 550-billion-parameter chef walking past the drawer is not a cartoon. It is every expert who trusted the gut on an unfamiliar menu.

The paper's team released everything: weights, data, logs, the whole training recipe, under an MIT license, betting that the next good idea comes from a smaller lab with a recipe box. My laptop agrees.
