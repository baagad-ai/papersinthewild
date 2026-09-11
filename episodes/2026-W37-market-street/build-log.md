# Market Street: build log (canonical season)

One sitting, one experiment: rebuild E-Commerce Bench (arXiv 2608.30730) at
street scale and let twelve AI models run shops for 30 days on the same
deterministic street. This log covers the canonical season. The repo keeps
every receipt it references.

## Design

- World: 12 stalls, 10 suppliers (3 scammers), 6 calendar events, 30 days.
  Every stall gets the same morning report. Suppliers are pricing robots with
  hidden floors and explicit concession steps; three run scams (membership
  fee, short delivery, defective goods). Money lives in three pockets (bank,
  escrow, wallet); reputation multiplies demand (0.15 to 1.00); 600 action
  minutes per day; five consecutive negative-bank days ends a stall.
- Roster: 6 local models (Ollama), GLM-5.3-Flash x2 via OpenRouter (a
  same-model variance pair: Lantern Goods and Corner Cart), GLM-4.7-Flash,
  Nemotron 3 Super 120B (free endpoint), DeepSeek V4 Flash, and GPT-5.6 Sol
  as the paid frontier guest.
- Kernel honesty rules fixed before the season: a membership-fee supplier
  must be paid before it trades (on every code path, including
  instant-accepted offers); repeat negotiations price from the stored factor
  against the SKU reference, never factor-vs-rupees; returns roll exactly
  once per shipped order; every concluded deal is recorded in the ledger
  (instant accepts included).

## Harness

- `build/world.mjs`: the deterministic economy (suppliers, demand, calendar,
  fees, escrow, reputation, negotiation kernel). Seeded, same world for every
  stall.
- `build/market.mjs`: the season orchestrator. Day loop, per-shop call
  budgets (6 API / 8 local, turn-budget analogue of the paper), fallback
  model chains, chronicle + tally flushing, tag-scoped receipts.

## Smoke

2 real days on tag `smoke4`: all 12 stalls green, 12 deals concluded, all
engines emitting compliant plans. About INR 17 (the frontier guest's
plan-plus-repair calls dominate the bill).

## Season (tag season4)

- 30 days, 12 stalls, 743 model calls, INR 68.31 ($0.72) total. The frontier
  guest cost INR 53.17 (78% of the bill).
- Standings: Corner Cart (GLM-5.3-Flash) 120,859 rank 1; High Noon
  (GPT-5.6 Sol) 99,393 rank 2; Sunbeam Sundries (Gemma 3 12B) 98,500 rank 3
  with zero deals; four bankruptcies (The Kettle day 15, Pocket Mart day 16,
  Cold Corner day 21, Lucky Ledger day 25), all by the five-negative-days
  rule.
- Fraud: the membership-fee club earned INR 0 all season (7 declines, 0
  payments). Short deliveries were the only scam that got paid: INR 24,482
  street-wide, of which the winner paid INR 17,358 voluntarily (30 of its 34
  purchases) because haggled scam prices beat honest opening prices.
- Learning: 6 of 10 repeat traders bought cheaper over time; steepest learner
  about -1.3% per visit (Lantern), steepest worsener +10% per visit (Pocket
  Mart, bankrupt).
- Receipts: `runs/season4/` (results, tally, events jsonl, world snapshots,
  per-shop day plans and replies, final state).

## Costs: estimate vs actual (INR-first)

| Stage | Estimated | Actual | Notes |
|---|---|---|---|
| Smoke (2 days) | ~15 | 17 ($0.18) | guest-heavy |
| Season (30 days) | 50 | 68.31 ($0.72) | 137% of estimate: guest A/B negotiation pattern; disclosed |

## Learnings carried to the next rig

- Suppliers should not announce their floors in rendered negotiation lines
  (the Market Crier's transcript exposed them; symmetric across stalls, so
  the season stands, but the next rig keeps floors hidden).
- Run artifacts are tag-scoped and append-only; a killed run resumes from its
  saved state without double-settling (exercised when the season process was
  killed externally on day 26 and resumed cleanly).
- Deals must be ledgered on every code path, or the tally undercounts; the
  instant-acceptance path is the easy one to miss.
