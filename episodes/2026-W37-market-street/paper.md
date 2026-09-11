# Paper - E-Commerce Bench

**Title:** E-Commerce Bench: Evaluating LLM Agents on Long-Horizon Autonomous Business Operation
**Authors:** Wei Fan, Xinjie Shen, Xudong Guo, Jianhong Tu, Yang Su, Yinger Zhang, Lianghao Deng, Fengyu Wang, Baohua Dong, Yangqiu Song, Dayiheng Liu (Qwen Team, Alibaba Group; HKUST)
**arXiv:** 2608.30730
**PDF:** https://arxiv.org/pdf/2608.30730
**Published:** 2026-08-31

Paper link: https://arxiv.org/abs/2608.30730

## Party pitch (C1 residue)

Eighteen frontier models each ran online stores for a simulated year, bargaining
with suppliers through a deterministic kernel and dodging fraudsters. The model
that made the most money (GPT-5.6 Sol, about 14x its stake) ranked 16th of 18 at
avoiding scams, and the best negotiator finished mid-pack on profit. We shrank
the year to one 30-day season, put twelve models on one small street with real
money limits, and invited the paper's richest model to run a stall.

## Why this paper

- **The story:** the richest shop on the street is not the most honest one, and
  a model that talks a great game can still forget to withdraw its own cash.
- **We can test it:** the paper's market is deterministic on both sides by
  design, so we rebuild a compressed version (12 stalls, 10 suppliers, 3 scams,
  6 events, 30 days) and score profit, fraud losses, solvency, execution and
  price learning mechanically from the ledger.
- **Why now:** it topped the dair-ai editorial week (Aug 31 to Sep 6) and the
  HF daily window never carried it; it arrived through the merged radar, and it
  is the first paper this season whose apparatus IS a world.
