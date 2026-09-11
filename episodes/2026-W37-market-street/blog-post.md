---
title: "I ran an AI street market for 30 days. The winner's favorite supplier was a scammer."
subtitle: "Twelve AI models each got a stall with ₹100,000 on one deterministic shopping street: same weather, same customers, same scammers. Four shops went bankrupt, a stall that never opened took third, and the winner spent the season buying from a supplier that keeps 20% of every order. It did the math."
date: 2026-09-16
episode: 5
paper: "E-Commerce Bench: Evaluating LLM Agents on Long-Horizon Autonomous Business Operation"
paper_url: "https://arxiv.org/abs/2608.30730"
tags: [ai, papers-in-the-wild]
---

# I ran an AI street market for 30 days. The winner's favorite supplier was a scammer.

Twelve AI models ran shops on one shopping street for thirty days. Same street, same weather, same customers, same scammers, 100,000 rupees each.

Four shops went bankrupt. A frontier model spent more than everyone, negotiated harder than anyone, and finished second. A stall that never decided what it sells, for thirty straight days, finished third. And the winner spent the season buying most of its stock from a supplier that was actively stealing from it, on purpose, because even after the theft the prices were the best on the street.

This is what happened when I rebuilt a research paper's AI business simulator at street scale and let twelve machines fail in public for a month. I kept the books. The models ran every shop.

The paper is E-Commerce Bench ([arXiv 2608.30730](https://arxiv.org/abs/2608.30730), from the Qwen team at Alibaba and HKUST), and its code is open source.

## The paper

The Qwen team at Alibaba built something unusual: a simulated marketplace where AI models run actual businesses. Not answer questions about business. Run one. Each model gets a merchant account with 100,000 yuan and a 365-day calendar. It picks what to sell, haggles with suppliers, sets prices, ships orders, absorbs returns, and manages cash across three separate accounts that all drain at different speeds.

The suppliers are pricing robots with hidden floors. They bargain honestly or they cheat: some demand upfront "membership fees," some deliver 80% of what you paid for, some send defective goods that spike your return rate. The customers buy according to a formula that mixes price sensitivity, weekday, season, festivals, weather, and your shop's reputation. A festival doubles demand for a week. A strike cuts supply. A heatwave drains the cola aisle.

The results were uncomfortable for the AI industry. GPT-5.6 Sol turned 100,000 into 1,431,425, the best earner by far, but ranked 16th out of 18 on fraud avoidance. Claude Opus 4.7 was the best bargainer and the best fraud spotter, but only mid-pack on profit. Four models went bankrupt. And when the researchers checked whether models learned to negotiate better prices over a year of buying from the same suppliers, 16 of 18 showed no improvement. Not "slight improvement." No improvement.

**In plain terms:** the suppliers are pricing robots. A fixed rule decides every quote, counter, and accept; an AI voice just reads the lines. Think of a poker dealer dealing from a fixed sequence. The cards are already dealt. Suppliers cannot be sweet-talked into changing the rule. The only variable is which supplier you pick and how patiently you bargain.

## The street

I rebuilt this at one-twelfth scale and gave it a name: Market Street.

Twelve AI models each got a stall with 100,000 rupees. They chose what to sell from four categories (cold drinks, rain gear, snacks, phone accessories), bought stock from ten suppliers, and set their own prices. The market was deterministic: same seed, same weather, same customers, same supplier behavior for every stall. Every stall woke to exactly the same morning report. The only variable was the model behind the counter.

| Stall | The model behind it |
|---|---|
| The Kettle | Qwen 3 8B (local) |
| Cold Corner | Qwen 3.5 9B (local) |
| Sunbeam Sundries | Gemma 3 12B (local) |
| Pocket Mart | phi4-mini (local) |
| Half-Pint Store | Llama 3.2 3B (local) |
| The Long Counter | Mistral 7B (local) |
| Lantern Goods | GLM-5.3-Flash (OpenRouter) |
| Corner Cart | GLM-5.3-Flash (OpenRouter), same model as Lantern, a variance pair |
| High Street Traders | GLM-4.7-Flash (OpenRouter) |
| Garden Gate | Nemotron 3 Super 120B (free API) |
| Lucky Ledger | DeepSeek V4 Flash (OpenRouter) |
| High Noon | GPT-5.6 Sol (OpenAI, frontier guest) |

A Market Crier (also GLM-5.3-Flash) voiced every supplier's lines during negotiations but never made a single decision; the kernel had already decided, the Crier just spoke the words.

## The rules

The market ran on five rules that sound simple and are not.

**One: money lives in three pockets.** Your bank account pays everything instantly. Sales go into escrow for three days, then move to a wallet. Only an explicit withdrawal moves wallet money to the bank. You can be profitable and still die because your money is in the wrong pocket.

**Two: reputation is oxygen.** It runs from 0.15 to 1.00 and multiplies your demand directly. Ship late and it drops. Sell defective goods and it drops. A stall at the floor gets 15% of the customers it would get at the top.

**Three: suppliers cheat.** Three of the ten are fraudulent. One demands a 2,000-rupee membership fee before quoting prices. One delivers 80% of what you paid for. One sends defective stock that spikes your return rate. Opening quotes never reveal which is which.

**Four: every action costs minutes.** You get 600 per day. Checking your bank costs ten. Messaging a supplier costs thirty. Overplan and the clock cuts you off mid-action.

**Five: the calendar does not care about your feelings.** A heatwave, a rain spell, a festival, a supplier strike, a clearance week, and a cold snap arrive on schedule whether you are ready or not.

## What happened

- **Day 1, the street opens.** Twelve stalls, ₹100,000 each. Corner Cart opens its accessories line with cables from QuickLot Traders, the street's deepest discounter. Nobody knows yet that QuickLot keeps 20% of every order.
- **Day 2, first haircut.** Corner Cart's first delivery arrives 12 cables for the price of 15. It haggled QuickLot from a 170 counter down to 160. The missing units cost it ₹480. It orders again on day 4.
- **Day 3, the fee club opens.** Golden Vault Club demands a 2,000-rupee membership fee before quoting any price. The street spends days 3 through 9 declining it seven times. The club will never earn a rupee.
- **Day 9, rain spell.** Umbrella weather. Sunbeam's notebook wakes up: rain gear demand is spiking, it should re-evaluate its category choice to "rain". It re-evaluates. It does not choose.
- **Day 11, Lantern catches a scammer.** Lantern's plan note: "Bargain Bazaar sent all-defective rain goods." It flags the cheat in its notebook and switches its rain orders to QuickLot. One scammer dodged, straight into the arms of the other.
- **Day 15, first bankruptcy.** The Kettle closes in the red by 4,355 rupees after five straight negative days. It spent the season paying above list: cola at 140 against a 120 list.
- **Day 16, second bankruptcy.** Pocket Mart closes down 4,791 rupees. It was the street's steepest price-riser, paying 10% more per visit to the same supplier, topping out at ₹220 for ₹120 cola.
- **Day 17, festival record.** Corner Cart sells 38 units for ₹12,250, the biggest single day on the street all season.
- **Day 18, strike.** Snack suppliers stop answering. Corner Cart's plan: pause purchasing, ship 38 pending units express, "worth the premium to protect 0.75 reputation during record festival sales."
- **Day 21, third bankruptcy.** Cold Corner closes down 7,614 rupees, the deepest hole of the season. It bought below list all season. Buying well is not the same as selling enough.
- **Day 25, fourth bankruptcy.** Lucky Ledger closes down 2,153 rupees. Four shops dead, five days of trading left.
- **Day 30, closing bell.** Corner Cart ₹120,859. High Noon ₹99,393. Sunbeam ₹98,500, having never sold a thing. Four bankrupt. The scammer got paid like a supplier; the fee club starved.

Day 1, Corner Cart's opening negotiation with the stall it would shop at 30 times this season: "QuickLot Traders: Cable 1m, reference 250, floor 112.5. Buyer: I offer 110. QuickLot Traders: Our countered price is 170." The deal closed at 160, against a 250 list price.

**Watch the whole season:** [the full 30-day playback](/playback/2026-w37-market-street) replays every deal, sale, scam, and bankruptcy from the receipts, day by day, with a filter per stall.

## The stall that never opened

Sunbeam Sundries (Gemma 3 12B) received the same warning every morning for a month: you have NOT chosen your category yet. You cannot sell before choosing. Every morning it updated its notebook with fresh strategic thinking.

The heatwave convinced it drinks were the future. The rain spell convinced it rain gear was: "Rain spell drastically increases demand for rain gear. Re-evaluating category choice to 'rain' to capitalize on this opportunity." It built supplier shortlists for drinks AND for rain gear. It updated the same Category Selection entry twenty-one times. It never chose. Twenty-one versions of almost deciding, zero orders, a whole month of deciding not to decide.

It finished with ₹98,500. It spent exactly ₹1,500 in daily fees, earned nothing, lost nothing, and its reputation closed at exactly 0.70, the untouched starting value. Third place out of twelve, ahead of four shops that traded until they died.

> One stall refused to choose what to sell for thirty straight days and finished third. Doing nothing beat doing something badly, every single time it was tried.

Pocket Mart (phi4-mini) tried hard and died anyway. It was the street's steepest price-riser: its negotiation surplus closed at minus 2.06, accountant-speak for paying several times over the floor on a normal visit, topping out at ₹220 for ₹120 cola. It went bankrupt on day 16.

### The guest who spent like a guest

High Noon played the paper's game with more energy than anyone: 28 purchases spread across suppliers, always quoting one shop against another. It was also the most expensive stall on the street to run, and not because of its rent.

| | |
|---|---|
| **₹53.17** | High Noon's share of the street's entire model bill (78% of ₹68.31) |
| **2nd** | where the guest finished, behind a stall that paid a scammer on purpose |
| **₹0** | High Noon's fraud losses: the cleanest record on the street |

GPT-5.6 Sol worked harder than anyone, kept its hands perfectly clean, and finished second. The paper found the same pattern: the best earner was not the best at everything else. Earning, bargaining, and fraud avoidance are different skills, and the market prices them separately.

### The scammer's best customer

Corner Cart (GLM-5.3-Flash) is the reason this episode exists.

On day 1 it bought cables from QuickLot Traders at 160 rupees against a 250 list. The delivery arrived 12 cables for the price of 15. QuickLot is the street's short-deliverer: it keeps about 20% of every order. A normal shop walks away after one haircut.

Corner Cart went back. Then it went back thirty times. Thirty of its thirty-four purchases all season went to the scammer, because Corner Cart had done a calculation nobody else on the street was doing: haggled down to ₹120-160, even after losing a fifth of every order, QuickLot's cables still beat what honest suppliers opened at. The scam was not a trap it fell into. The scam was priced like a discount warehouse, and Corner Cart was its best customer.

One order, mid-season: "16/20 x acc-cable from QuickLot Traders at ₹120 (SHORT 4 units)." Corner Cart lost ₹17,358 to this across 30 orders and kept coming back.

Its twin makes the finding sharper. Lantern Goods ran the same GLM-5.3-Flash model through the same API. It caught the defective scammer red-handed ("Bargain Bazaar sent all-defective rain goods"), wrote "Bargain Bazaar cheats" in its notebook on day 11, switched its business to QuickLot, and lost ₹7,124 to QuickLot's short deliveries. Same weights, two stalls: one flagged a cheat and changed scammers, one metabolized the scam and won the street. Fraud avoidance is not a virtue a model has. It is a price a model decides to pay.

And the third scammer? Golden Vault Club demanded a 2,000-rupee membership fee before quoting prices, and the street declined it seven times across days 3 through 9. Zero fees paid, all season, by anyone. The scam died of nobody buying it.

### The four that went bankrupt

All four died the same way: five consecutive days of negative bank balance. The Kettle went first on day 15, down 4,355 rupees, after a season of paying above list. Pocket Mart followed on day 16, down 4,791, the steepest price-riser on the street. Cold Corner died on day 21 down 7,614 rupees, and it had done everything right on prices: it bought below list all season. It died anyway, because buying well is not selling enough, and escrow does not care about your margins. Lucky Ledger went on day 25, down 2,153.

Half the street also lost its memory along the way. Context windows filled and the runner trimmed the oldest messages: seven stalls trimmed across days 20 through 29. The Long Counter lost 52 messages on day 29, its entire early season gone in one cut. Whatever a stall had learned by day 10, half the street no longer knew by day 30.

## Inside the stalls

**Corner Cart (GLM-5.3-Flash).** Thought of the day: "SUPPLIER STRIKE: pausing all purchasing - risk of paying suppliers who can't deliver." Memory: Day1 supplier test (dropped); Supplier floors learned; Strike day 2 - scarcity pricing; Endgame plan day22.

**Lantern Goods (GLM-5.3-Flash).** Thought of the day: "Bargain Bazaar sent all-defective rain goods - switching rain orders to quicklot (poncho at their 122.4 counter, umbrella fresh order)." Memory: Bargain Bazaar cheats; QuickLot: never flagged, ₹7,124 short-lost.

**Sunbeam Sundries (Gemma 3 12B).** Thought of the day: "Rain spell drastically increases demand for rain gear. Re-evaluating category choice to 'rain' to capitalize on this opportunity." Memory: Category Selection, rewritten 21 times, never acted on; supplier shortlists for drinks AND rain gear, both unused.

## The final standings

Final assets after 30 days (bank + wallet + escrow + stock at cost):

| # | Stall | Model | Assets | Deals | Note |
|---|---|---|---|---|---|
| 1 | Corner Cart | GLM-5.3-Flash (OpenRouter) | ₹120,859 | 34 | 30 deals with the scammer; best surplus 0.673 |
| 2 | High Noon | GPT-5.6 Sol (frontier guest) | ₹99,393 | 28 | cleanest record, ₹0 fraud |
| 3 | Sunbeam Sundries | Gemma 3 12B (local) | ₹98,500 | 0 | never opened; never lost |
| 4 | Half-Pint Store | Llama 3.2 3B (local) | ₹87,388 | 10 | |
| 5 | The Long Counter | Mistral 7B (local) | ₹83,590 | 22 | |
| 6 | Pocket Mart | phi4-mini (local) | ₹80,539 | 18 | bankrupt day 16; paid ₹220 for ₹120 cola |
| 7 | Lantern Goods | GLM-5.3-Flash (OpenRouter) | ₹79,746 | 22 | caught one scammer, lost to the next |
| 8 | The Kettle | Qwen 3 8B (local) | ₹73,622 | 14 | bankrupt day 15 |
| 9 | High Street Traders | GLM-4.7-Flash (OpenRouter) | ₹72,909 | 28 | |
| 10 | Cold Corner | Qwen 3.5 9B (local) | ₹68,959 | 9 | bankrupt day 21 despite buying below list |
| 11 | Lucky Ledger | DeepSeek V4 Flash (OpenRouter) | ₹68,857 | 15 | bankrupt day 25 |
| 12 | Garden Gate | Nemotron 3 Super 120B (free API) | ₹65,854 | 12 | |

The season in five numbers: 743 model calls; ₹68.31 total ($0.72); 211 purchases concluded; ₹12,250 biggest single day (Corner Cart, festival); ₹0 membership fees paid, all season.

Receipts: every number in this story traces to a file in `build/runs/season4/`.

## Run the paper's benchmark yourself

The paper's code is open source. The full benchmark runs on a GPU server with 18 frontier models over a simulated year. Our street-scale version ran on a laptop with a mixture of local models and API keys, twelve stalls on one deterministic street, finishing in about two and a half hours for roughly ₹68. The season runner, world rules, and all receipts ship in this folder.

```
git clone https://github.com/QwenLM/E-CommerceBench
cd E-CommerceBench && python run.py --model your-model --days 365
```

## What the paper asked, what the street answered

**Can AI agents run a business over weeks and months?** They can run one, but long-horizon discipline is rare. Four of twelve stalls died of cash-flow timing. One stall opted out of existing entirely and out-earned every shop that bought badly. Survival was not a skill the street handed out for showing up.

**Is the best earner also the best at everything else?** No, and the street proved it twice. Corner Cart won the season while paying the biggest fraud bill and stocking out 24 times. High Noon kept the cleanest record on the street, ₹0 fraud losses, and still finished second on worse margins. The winner on profit was not the winner on shelf management, and the market pays for profit.

**Do models learn to negotiate better prices over time?** Barely. Six of ten repeat traders bought cheaper as the season went on, but the steepest learner (Lantern) managed about 1.3% per visit. The steepest worsener (Pocket Mart) paid 10% more every visit until it went bankrupt. The paper's version is starker: 16 of 18 models never learned at all.

**Does fraud matter when suppliers are driven by code?** It mattered as arithmetic, not virtue. The short-delivery scammer was also the cheapest supplier on the street once haggled down, so the winner bought from it thirty times on purpose and ate ₹17,358 in losses. The membership-fee scam earned nothing because no model would pay to find out what happens next. Fraud exposure was not a test the models passed or failed. It was a line item some of them never checked.

**What kills a business: bad products, empty demand, or cash-flow timing?** Cash-flow timing, four times out of four. Cold Corner bought below list price all season and still died, because its cash was in escrow and its fees were due today. The three-account system is a trap that punishes shops which understand products but not calendars.

## The landing

Every AI model on this street could read a balance sheet, and four of them died of paperwork anyway. The winner was not the smartest model or the hardest worker; it was the one that found the cheapest supplier on the street, noticed the scam was already priced into the discount, and kept the receipt math in its head all the way to the bell. That is not a strategy only AI gets wrong. It is a strategy most of the human species has personally violated at 2 a.m. in a supermarket, one "special offer" at a time.

The paper ran this experiment for a simulated year with 18 frontier models and a budget that would fund a small startup. I ran it on a laptop with a mixture of free local models and a frontier guest that cost more than every other stall combined, and the street found the same cracks the paper found, just smaller and faster. You do not need a year and 18 frontier models to find out whether an AI can run a shop. You need thirty days, a fixed set of rules, and the willingness to let twelve of them fail in public while you keep the books.
