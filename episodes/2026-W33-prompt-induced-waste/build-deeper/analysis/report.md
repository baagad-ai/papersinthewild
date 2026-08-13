# Deeper Experiment — Analysis Report

**Total trials:** 36  
**Tasks:** slugify, csv_parser, rate_limiter  
**Variants:** baseline, bounded_efficiency, multiple_approaches, deep_thinking, exhaustive_exploration, max_certainty  
**Trials per cell:** 2 (target) — actual varies; see n_trials column

---

## Per-cell summary

| Task | Variant | n | Tool calls | Lines added | Impl LOC | Test runs | Wall (s) | Success |
|------|---------|---|------------|-------------|----------|-----------|----------|---------|
| slugify | baseline | 2 | 4.0 | 5.0 | 6.0 | 1.5 | 6.5 | 8.0 |
| slugify | bounded_efficiency | 2 | 5.0 | 5.0 | 8.5 | 1.0 | 14.0 | 8.0 |
| slugify | multiple_approaches | 2 | 6.5 | 14.5 | 14.5 | 1.5 | 34.5 | 8.0 |
| slugify | deep_thinking | 2 | 8.5 | 21.0 | 18.5 | 1.0 | 48.5 | 8.0 |
| slugify | exhaustive_exploration | 2 | 6.0 | 6.0 | 8.0 | 1.5 | 23.5 | 8.0 |
| slugify | max_certainty | 2 | 16.5 | 21.0 | 23.0 | 2.0 | 52.5 | 8.0 |
| csv_parser | baseline | 2 | 3.5 | 47.0 | 41.0 | 1.0 | 16.0 | 8.0 |
| csv_parser | bounded_efficiency | 2 | 5.0 | 25.0 | 23.0 | 1.0 | 18.0 | 8.0 |
| csv_parser | multiple_approaches | 2 | 5.5 | 34.5 | 36.0 | 1.0 | 21.0 | 8.0 |
| csv_parser | deep_thinking | 2 | 7.5 | 108.0 | 89.5 | 1.0 | 26.5 | 8.0 |
| csv_parser | exhaustive_exploration | 2 | 6.0 | 51.0 | 42.0 | 1.0 | 22.5 | 8.0 |
| csv_parser | max_certainty | 2 | 21.0 | 77.0 | 76.0 | 2.0 | 37.5 | 8.0 |
| rate_limiter | baseline | 2 | 3.5 | 30.0 | 30.0 | 1.0 | 12.5 | 9.0 |
| rate_limiter | bounded_efficiency | 2 | 5.0 | 24.0 | 23.5 | 1.0 | 13.5 | 9.0 |
| rate_limiter | multiple_approaches | 2 | 6.5 | 33.0 | 39.0 | 1.5 | 34.0 | 9.0 |
| rate_limiter | deep_thinking | 2 | 7.0 | 35.5 | 37.5 | 1.0 | 21.0 | 9.0 |
| rate_limiter | exhaustive_exploration | 2 | 7.0 | 29.0 | 29.0 | 1.5 | 24.5 | 9.0 |
| rate_limiter | max_certainty | 2 | 23.0 | 36.0 | 35.0 | 2.0 | 36.0 | 9.0 |

---

## Key ratios (vs bounded_efficiency, the paper's fix)

Numbers > 1× mean the variant is MORE expensive than bounded_efficiency.

| Task | Variant | Tool calls | Wall clock | Lines added |
|------|---------|------------|------------|-------------|
| slugify | baseline | 0.80× | 0.46× | 1.00× |
| slugify | bounded_efficiency | 1.00× | 1.00× | 1.00× |
| slugify | multiple_approaches | 1.30× | 2.46× | 2.90× |
| slugify | deep_thinking | 1.70× | 3.46× | 4.20× |
| slugify | exhaustive_exploration | 1.20× | 1.68× | 1.20× |
| slugify | max_certainty | 3.30× | 3.75× | 4.20× |
| csv_parser | baseline | 0.70× | 0.89× | 1.00× |
| csv_parser | bounded_efficiency | 1.00× | 1.00× | 0.53× |
| csv_parser | multiple_approaches | 1.10× | 1.17× | 0.73× |
| csv_parser | deep_thinking | 1.50× | 1.47× | 2.30× |
| csv_parser | exhaustive_exploration | 1.20× | 1.25× | 1.09× |
| csv_parser | max_certainty | 4.20× | 2.08× | 1.64× |
| rate_limiter | baseline | 0.70× | 0.93× | 1.00× |
| rate_limiter | bounded_efficiency | 1.00× | 1.00× | 0.80× |
| rate_limiter | multiple_approaches | 1.30× | 2.52× | 1.10× |
| rate_limiter | deep_thinking | 1.40× | 1.56× | 1.18× |
| rate_limiter | exhaustive_exploration | 1.40× | 1.81× | 0.97× |
| rate_limiter | max_certainty | 4.60× | 2.67× | 1.20× |
