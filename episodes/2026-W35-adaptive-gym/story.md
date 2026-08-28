---
slug: 2026-W35-adaptive-gym
house_pitch: "I built a gym that drills four AI students on sneaky string-sorting rules and lets them carry their own notes into the exam. Answer-sheets made them ace the homework and learn almost nothing. Their own written rules helped a little, for the ones who wrote good rules. Nobody beat the girl who just walked in cold."
world_sketch: "A deterministic tutor (the Gym) runs a sorting office: four shelves, four secret rules, verdicts after every card. Three local students and one expensive consultant practice in three ways: no practice, drilling an answer sheet, or fresh targeted cards plus their own written rulebook. Then everyone sits two exams: brand-new strings, and the exact homework sheet."
cast:
  - name: Juniper
    modelId: local:qwen3:8b
    epithet: perfect taste, fainting spells; wrote a textbook-perfect rulebook and still lost to her cold self
  - name: Bram
    modelId: local:gemma3:12b
    epithet: good soldier; wrong precisely; quiet best gainer from written rules
  - name: Pip
    modelId: local:phi4-mini
    epithet: smallest intern; mangled two of his four rules, then performed exactly those rules
  - name: Flit
    modelId: or:google/gemini-3.7-flash
    epithet: visiting consultant; worst cold score of the day (31%), most beautiful prose, only student whose cliff-exam score rose
  - name: The Gym
    modelId: deterministic code
    epithet: never lies, never tires, cannot write rules for you
---

## What actually happened (timeline w/ event refs)

1. (Aug 27 night) First smoke walked into a machine that slept for 19 hours; process spun at 100% CPU against a dead Ollama.
2. (Aug 28 11:10) Wake-up smoke: Juniper FAIL empty - qwen3 now THINKS by default and a 16-token budget dies inside reasoning. Flit FAIL empty for the opposite reason: OpenRouter says reasoning is MANDATORY on gemini-3.7-flash. Same symptom, opposite diseases. (journal)
3. (Aug 28 11:40) think:false for locals, 768-token reasoning budget for Flit. Smoke 4/4.
4. (g1, 432 events) FIRST GRID, NO-NOTES DESIGN: all three arms byte-identical exam rows per student. Stateless models cannot feel practice without a channel. Practice as theater. (events-g1.jsonl)
5. (g2, 592 events) ANSWER-NOTEBOOK GRID: fixed-drill students scored 100% on the homework sheet (verbatim recall) while novel transfer split: Juniper 69→50 (DERANGED by her own perfect cheat sheet), Bram +19, Pip +6, Flit +19 from a 31% floor. Adaptive-tutor arm (8 fresh targeted examples in notes) matched no-practice on everything. P1 graded WRONG. (tally-g2)
6. (g3, 320 calls) RULE-NOTEBOOK GRID: students WROTE each shelf's rule in words after targeted practice. Juniper's rulebook was flawless prose. Pip mangled 2 of 4. Gains: Bram 50→63, Flit 31→50 (and the only cliff-exam rise, 60→70), Juniper 56 (still below her cold 69), Pip flat at 50 - exactly the quality of his rulebook. (events-g3.jsonl)
7. Money: g3 actual ₹10.15 vs ₹1.20 estimate (mandatory reasoning burns ~500 output tokens/call; estimator budgeted 24). Escalation E1, fix-now accepted. (results-gym-g3-FATAL.json ledger)

## The moments (verbatim, ranked)

1. Juniper's rulebook, perfect: "The string must contain an even number of vowels." / "All characters in the string must be unique..." - a textbook chapter, written by an 8B model in seconds... who then scored BELOW her no-notes self.
2. Pip's mangled rulebook: "No consecutive characters should appear more than once" (that is not the uniqueness rule) and "strings with an even number of vowels... only vowels" - and he performed exactly those rules. 50%.
3. The four 100%s: every drill student answered all 10 homework cards right while their fresh-material scores sat at 50-69%. Aced the test, learned the nothing.
4. Flit cold: 31% on toys a 2.5GB intern handled at 44%. The consultant's first act of the day was failing a child's sorting game, beautifully.
5. g1's ghost rows: three arms, identical numbers, a whole grid of expensive theater.

## The numbers in household units

- "Fixed-arm sting 100% vs novel 50-69%" -> they memorized the homework sheet perfectly and learned almost nothing that worked anywhere else.
- "Juniper novel 69→50 with the answer notebook" -> handing her the answers made her WORSE at new questions; she stopped trusting her first instinct.
- "Flit cold 31%" (below the 50% coin flip) -> the most expensive student was the only one who did worse than guessing.
- "Strategy gains: Bram 50→63, Flit 31→50" -> writing the rule in your own words helped the two students who needed it most.
- "Sting after rules: still ~40% for locals" -> even a correct rule in words does not survive deliberately unfair exam questions.

## What I predicted vs what I got

- P1 adaptive tutor beats fixed on held-out: WRONG (it matched no-practice; the paper's mechanism needs its full component-writing loop, not re-targeted item streams).
- P2 fixed practice flat-or-worse on fresh items: SURPRISED/mixed (Juniper -19 as predicted; but the notebook doubled as worked examples and LIFTED Bram/Flit/Pip a bit).
- P3 both arms improve more on trained items than novel, gap larger for fixed: CONFIRMED x4, hugely (gaps +31..+50 pts).

## The landing

The tutor the paper promises is real, but at my scale its soul is one line: the notebook that works carries RULES, not ANSWERS. A cheat sheet is a photograph of yesterday; eight random examples are noise; a rule in your own words is the only thing that generalized at all - and even then, only for the students who wrote good ones, and only on fair questions. The scariest row for humans: the perfect answer-key made the best cold student measurably worse.
