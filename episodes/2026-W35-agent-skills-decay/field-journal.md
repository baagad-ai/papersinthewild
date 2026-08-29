# Field journal: 2026-W35-agent-skills-decay (v5 rewrite)

Entries appended during work. What happened + the in-the-moment reaction. Reactions stay raw.

---

## 2026-08-29 ~01:15 IST: receipt audit (pre-run)

Read the rig code properly for the first time. The old rewrite never did. Found it in one read: the twin descriptions shipped with "(twin trap)" IN the prompt text. The fakes were wearing nametags. Three system versions of process and nobody opened the file.

Reaction: cold splash. This is exactly the L-LAB-09 class of thing: probe the rig before trusting it. The old "one lookalike fooled them" headline was never true. gemma picking a LABELED fake is a different (funnier, worse-for-gemma) story.

Old grid preserved as results-labeledtrap.json / tally-labeledtrap.json / transcripts-labeledtrap/. Owner approved clean rerun <=INR 3.

## 2026-08-29 ~01:18 IST: estimate + smoke

Estimate: Rs 3.45 ($0.04) for 24 flash calls; locals Rs 0. Rate 95.76. Smoke PASS on all four engines (locals ~5-6s, flash 3s).

Reaction: the money machinery quietly working as designed. Estimate printed INR-first, no drama.

## 2026-08-29 ~01:20 IST: clean grid launched

TAG=clean, caffeinate-wrapped, 72 calls (48 local + 24 flash). Labeled-trap data stays on disk for the record.

Reaction: the rewrite now gets receipts nobody can dispute. If gemma picks the unlabeled fake this time, the drawer story is real. If nobody picks it, that is ALSO a finding (paper C4 said identification breaks; maybe one-line skills are too easy to tell apart). Either way we finally run the honest experiment.

## 2026-08-29 ~02:05 IST: clean grid complete

72 calls, Rs 1.19 actual vs Rs 3.45 estimate. 2 warnings, no fatal. Tally (pickAcc/passRate): clean6 qwen .83/.67 gemma 1/.83 phi4 1/.83 flash .83/.83 | clean8 qwen .83/.83 gemma 1/.83 phi4 1/.67 flash 1/1 | twins8 qwen 1/1 gemma .83/.83 phi4 .67/.67 flash .83/.83.

The reads that mattered, transcript by transcript:

1. gemma picked the counterfeit utm-builder-like and executed it perfectly: utm_source=summer&utm_medium=campaign&utm_term=summer. Parameter salad, tidy JSON, zero hesitation. THE moment. The good soldier followed the wrong orders.
2. phi4-mini collapsed in the twin drawer: 1.0 -> 1.0 -> .67 across conditions. Stopped picking skills entirely, invented its OWN envelope {"csv-clean": "a-b\n1-2\n3-4"} (hyphen-ated the CSV, destroyed the commas), then did the UTM task PERFECTLY in the wrong envelope and got graded fail. The intern quit the toolbox and started freelancing.
3. qwen3:8b went 6/6 in the twin drawer after silent-refusing in the CLEAN drawer (t2 empty, t3 trailing-hyphen slug "hello-world-again-"). The flaky one aced the dishonest drawer. n=6 noise, but delicious.
4. flash's paperwork bounced: wrote a URL in t2, reply broke the JSON envelope, machine recorded a miss. The transcript slice shows it was composing the right thing. Even the consultant's invoices get lost sometimes.
5. The grader is an unreliable narrator: one regex per task. qwen's scrambled UTM (source=summer, medium=campaign) PASSED on /utm_campaign=summer/. phi4's PERFECT url (newsletter/email/summer) FAILED because the envelope was wrong. The machine passed the mangled answer and failed the immaculate one.

Prediction grades, as pre-registered Aug 25: P1 (cliff shape for qwen): WRONG for qwen (it improved), direction showed up in phi4 instead. P2 (wrong picks still pass): WRONG at this n, gemma's wrong pick failed. P3 (procedure > fact stability): not directly measurable in this rig, grade: untested. Honest caveats: n=6 per cell, one regex grader, one-line skills, our drawer had 8 entries vs the paper's 100-entry cliff.

Reaction: this is the episode. The old version's headline ("one lookalike made everyone dumber") was fake-precise. The true story is better: four models, four different failure personalities, and a grader that failed the one perfect answer. And the whole clean grid cost Rs 1.19, about half a cutting chai.

