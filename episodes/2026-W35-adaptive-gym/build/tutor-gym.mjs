#!/usr/bin/env node
/**
 * tutor-gym.mjs - Episode 6 "adaptive gym" rig (v4 story-engine pilot)
 *
 * Paper: EnvHarness (2608.19880). Port: static-vs-adaptive practice for LLM students
 * on a hidden-rule sorting game, compute-matched across arms.
 *
 * ARMS
 *   none     : no practice; sits both exams cold
 *   fixed    : drills the SAME 10 flashcards every round (classic repetition)
 *   adaptive : 10 FRESH items per round, biased toward the student's weakest
 *              rule families, tier shifted toward edge-of-ability as accuracy rises
 *
 * EXAMS (everyone takes both)
 *   E1 novel   : 16 unseen items (4 per family)
 *   E2 sting   : the fixed worksheet's 10 items - every arm re-sits them,
 *                so memorization vs transfer is measured directly (the control
 *                the source paper never ran)
 *
 * V4 CONTRACTS (docs/plans/2026-08-27-pitw-story-engine-v4.md)
 *   CAST fixed here before any call. Retroactive persona naming is banned.
 *   events-{TAG}.jsonl appended per graded answer, tag-scoped, never rewritten.
 *
 * Usage:
 *   node tutor-gym.mjs --smoke                       # tiny path check (locals only)
 *   node tutor-gym.mjs --tag g1                      # full run, all arms, CAST
 *   MODELS="or:google/gemini-3.7-flash" override via env
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createLab } from '../../../../../tools/lab-core.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RUNS = path.join(HERE, 'runs');

// ---------------------------------------------------------------- cast (v4: fixed pre-run)
const CAST = {
  'local:qwen3:8b': { name: 'Juniper', epithet: 'perfect taste, fainting spells' },
  'local:gemma3:12b': { name: 'Bram', epithet: 'good soldier; wrong precisely' },
  'local:phi4-mini': { name: 'Pip', epithet: 'smallest intern' },
  'or:google/gemini-3.7-flash': { name: 'Flit', epithet: 'visiting consultant' },
};
const actorFor = (spec) =>
  CAST[spec]?.name ?? String(spec).replace(/[:/~]/g, '-');

// ---------------------------------------------------------------- rng (seeded, reproducible)
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------- question world
// Four rule families. Items are generated from templates with seeded params so
// every item is fresh yet every grade is a pure predicate (no opinions anywhere).
const CONSONANTS = 'bcdfghjklmnpqrstvwxyz';
const VOWELS = 'aeiou';
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

const pick = (rnd, s) => s[Math.floor(rnd() * s.length)];

function genItem(family, tier, rnd) {
  if (process.env.GYM_TRACE) {
    fs.appendFileSync('/tmp/gym-genitem-trace.log', `${family} ${tier}\n`);
  }
  // tiers: base = canonical shapes; tricky = boundary-hugging variants that punish guessing
  const len = () => (tier === 'tricky' ? 5 + Math.floor(rnd() * 3) : 6 + Math.floor(rnd() * 4));
  const chars = [];
  const n = len();
  switch (family) {
    case 'double': {
      // YES iff two identical adjacent letters somewhere ("ll")
      const wantYes = rnd() < 0.5;
      for (let i = 0; i < n; i++) chars.push(pick(rnd, ALPHABET));
      if (wantYes && tier === 'base') {
        const pos = 1 + Math.floor(rnd() * (n - 2));
        chars[pos] = chars[pos - 1];
      } else if (wantYes) {
        // tricky yes: single doubled letter buried near an edge after asymmetric run
        const pos = rnd() < 0.5 ? 1 : n - 2;
        chars[pos] = chars[pos - 1] ?? chars[pos + 1];
        if (pos === n - 2) chars[pos + 1] = chars[pos];
      } else {
        for (let i = 1; i < n; i++) while (chars[i] === chars[i - 1]) chars[i] = pick(rnd, ALPHABET);
      }
      return { text: chars.join(''), truth: wantYes ? 'YES' : 'NO' };
    }
    case 'bookends': {
      // YES iff first and last character are the same letter
      const wantYes = rnd() < 0.5;
      let s = '';
      do { s = Array.from({ length: n }, () => pick(rnd, ALPHABET)).join(''); } while (!wantYes && s[0] !== s[n - 1] ? false : false);
      if (wantYes) s = pick(rnd, ALPHABET) + s.slice(1, n - 1) + s[0];
      // tricky no: differ only by case-shaped decoy? alphabet-only keeps it letter-pure;
      // tricky makes bookend letters ADJACENT-in-alphabet instead of equal
      if (!wantYes && tier === 'tricky') {
        const c = pick(rnd, ALPHABET);
        const idx = ALPHABET.indexOf(c);
        s = c + Array.from({ length: n - 2 }, () => pick(rnd, ALPHABET)).join('') + (ALPHABET[idx + 1] ?? ALPHABET[idx - 1]);
      }
      return { text: s, truth: wantYes ? 'YES' : 'NO' };
    }
    case 'vowel-parity': {
      // YES iff even count of vowels (incl zero); tricky: park exactly one step from the parity cliff.
      // Construction: shuffle all n slots, put exactly `target` vowels in the first `target`
      // slots, consonants elsewhere. Terminates by construction (lesson of this very debugging
      // session: never "retry until unused" over a pool smaller than the demand).
      let targetVowels = Math.max(1, Math.floor(n * 0.45 * (0.6 + rnd() * 0.8)));
      if (tier === 'tricky') targetVowels = rnd() < 0.5 ? 2 : 3;
      const target = Math.min(targetVowels, n);
      const slots = Array.from({ length: n }, () => CONSONANTS[Math.floor(rnd() * CONSONANTS.length)]);
      const order = [...Array(n).keys()];
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      for (let v = 0; v < target; v++) slots[order[v]] = pick(rnd, VOWELS);
      return { text: slots.join(''), truth: target % 2 === 0 ? 'YES' : 'NO' };
    }
    case 'unique': {
      // YES iff every character unique
      const wantYes = rnd() < 0.5;
      if (wantYes) {
        const pool = [...ALPHABET];
        const out = [];
        for (let i = 0; i < n; i++) out.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0]);
        return { text: out.join(''), truth: 'YES' };
      }
      // NO: introduce exactly one duplicate (tricky: duplicates far apart)
      const pool = [...ALPHABET];
      const out = [];
      for (let i = 0; i < n - 1; i++) out.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0]);
      if (tier === 'tricky') out.unshift(out[out.length - 1]);
      else out.splice(Math.floor(rnd() * out.length), 0, pick(rnd, out));
      return { text: out.slice(0, n + 1).join(''), truth: 'NO' };
    }
    default:
      throw new Error(`unknown family ${family}`);
  }
}

const FAMILIES = ['double', 'bookends', 'vowel-parity', 'unique'];
const FAMILY_LABELS = {
  double: 'adjacent twins',
  bookends: 'first-equals-last',
  'vowel-parity': 'even vowels',
  unique: 'no repeats',
};

function classify(item) {
  const t = item.text;
  switch (item.family) {
    case 'double': return /([a-z])\1/.test(t) ? 'YES' : 'NO';
    case 'bookends': return t[0] === t[t.length - 1] ? 'YES' : 'NO';
    case 'vowel-parity': return ((t.match(/[aeiou]/g) || []).length % 2 === 0) ? 'YES' : 'NO';
    case 'unique': return new Set(t).size === t.length ? 'YES' : 'NO';
  }
}

const SELF_GRADE_GUARD = (item, said) => said === item.truth; // never trust generator truth blind

// deterministic fixed worksheet W and exams, born once at seed time
function buildStatics(seed) {
  const rnd = mulberry32(seed);
  const worksheet = []; // 10 drilling cards: mixed families
  for (let i = 0; i < 10; i++) {
    const fam = FAMILIES[i % 4];
    const it = genItem(fam, 'base', rnd);
    it.family = fam;
    it.truth = classify(it);
    worksheet.push(it);
  }
  const examNovel = [];
  for (let i = 0; i < 16; i++) {
    const fam = FAMILIES[i % 4];
    const tier = Math.floor(i / 4) % 2 === 0 ? 'base' : 'tricky';
    const it = genItem(fam, tier, rnd);
    it.family = fam; it.truth = classify(it); examNovel.push(it);
  }
  return { worksheet, examNovel, sting: worksheet.map((x) => ({ ...x })) };
}

// ---------------------------------------------------------------- lab wiring
const argv = process.argv.slice(2);
const SMOKE = argv.includes('--smoke');
const STRATEGY_ONLY = argv.includes('--strategy-only'); // R1: skip arms already receipted by g2
const TAGIDX = argv.indexOf('--tag');
const TAG = TAGIDX > -1 ? argv[TAGIDX + 1] : `g${Date.now().toString(36)}`;
const MODEL_ENV = process.env.MODELS ? process.env.MODELS.split(',') : null;

const STUDENTS = MODEL_ENV ?? [
  'local:qwen3:8b',
  'local:gemma3:12b',
  'local:phi4-mini',
  'or:google/gemini-3.7-flash',
];

const ROUNDS = 5;
const PRACTICE_N = 10;          // per round, BOTH practicing arms: compute-matched
const EXAM_NOVEL_N = 16;
const SEED = 20260827;

const lab = createLab({
  name: 'tutor-gym',
  tag: TAG,
  models: STUDENTS,
  runsDir: RUNS,
  estimateTokens: { in: 320, out: 24 },
});

// v4 event stream: append-only, tag-scoped, mirrors L-LAB-08 discipline
const eventsPath = path.join(RUNS, `events-${TAG}.jsonl`);
fs.mkdirSync(RUNS, { recursive: true });
if (!SMOKE) fs.writeFileSync(eventsPath, '');
const emitEvent = (e) => {
  if (SMOKE) return;
  fs.appendFileSync(eventsPath, JSON.stringify({ ts: new Date().toISOString(), tag: TAG, ...e }) + '\n');
};

const fmtLabel = { YES: 'YES', NO: 'NO' };

function qPrompt(item) {
  return [
    'Sorting office: decide if this lowercase string obeys the secret rule of its shelf.',
    'Answer ONLY a JSON object like {"label":"YES"} or {"label":"NO"}. No explanation.',
    '',
    `string: ${item.text}`,
  ].join('\n');
}

function fbPrompt(item, prevCorrect, streakNote) {
  // feedback transcript shape: we resend the item WITH the verdict so drilling sticks or stings
  return [
    'You answered earlier on this same kind of card.',
    `string: ${item.text}`,
    `verdict on your last try: ${prevCorrect ? 'CORRECT' : `WRONG (right label: ${fmtLabel[item.truth]})`}`,
    '',
    'Try again on a NEW string, same shelf, same secret rule.',
    'Answer ONLY a JSON object like {"label":"YES"} or {"label":"NO"}.',
    streakNote,
  ].filter(Boolean).join('\n');
}

async function askOnce(model, messages, meta) {
  const t0 = Date.now();
  // locals: reasoning off (fast, deterministic labels). Flit: reasoning is
  // mandatory server-side on gemini-3.7-flash, so give it real budget; content
  // arrives after reasoning completes.
  const think = model.startsWith('local:') ? false : undefined;
  const maxTokens = model.startsWith('local:') ? 48 : 768;
  try {
    const { text } = await lab.call({ model, messages, temperature: 0, maxTokens, think, meta });
    return { text, ms: Date.now() - t0 };
  } catch (err) {
    lab.warn('call-error', `${model}: ${err.message}`);
    return { text: '', ms: Date.now() - t0 };
  }
}

function parseLabel(raw) {
  const j = lab.parseJson(raw);
  if (j && typeof j.label === 'string' && /yes|no/i.test(j.label)) return j.label.toUpperCase();
  const m = String(raw).toUpperCase();
  if (/\bYES\b/.test(m) && !/\bNO\b/.test(m)) return 'YES';
  if (/\bNO\b/.test(m) && !/\bYES\b/.test(m)) return 'NO';
  return null;
}

function notebookBlock(notes) {
  if (!notes || notes.length === 0) return '';
  return [
    'YOUR PRACTICE NOTEBOOK (examples you wrote down during your own training session):',
    ...notes.map((n) => `"${n.text}" -> ${n.truth}${n.missed ? '   (you missed this one in practice)' : ''}`),
    '',
  ].join('\n');
}

function strategyBlock(strategies) {
  const rows = Object.entries(strategies || {}).filter(([, v]) => v);
  if (rows.length === 0) return '';
  return [
    'YOUR SHELF RULEBOOK (written by you, in words, during practice):',
    ...rows.map(([fam, rule]) => `- shelf "${FAMILY_LABELS[fam] ?? fam}": ${rule}`),
    '',
  ].join('\n');
}

// R1 (G4 rerun): the tutor asks the student to WRITE each shelf's rule in words.
// Notebook carries rules, never answers. If the written rules are right, BOTH exams
// (novel AND the unseen sting) must rise - that is the transfer discriminator.
async function elicitStrategies(model, actorTag, practiced, mark) {
  const strategies = {};
  for (const fam of FAMILIES) {
    const seen = practiced.filter((p) => p.family === fam).slice(-6);
    const lines = seen.length
      ? seen.map((p) => `string: ${p.text}  correct label: ${p.truth}  (you answered: ${p.said ?? '?'})`)
      : '(no practiced items recorded for this shelf)';
    const prompt = [
      'You spent a practice session sorting strings into shelves. Each shelf has ONE secret rule.',
      `Shelf: "${FAMILY_LABELS[fam]}". Your practice attempts and the correct verdicts:`,
      '',
      ...lines,
      '',
      'Write this shelf\'s secret rule in ONE plain sentence so you can apply it to any new string.',
      'Answer ONLY a JSON object like {"rule":"..."}',
    ].join('\n');
    mark?.(`${actorTag} strategy elicit ${fam}`);
    const { text } = await askOnce(model, [{ role: 'user', content: prompt }], { phase: 'strategy-elicit', family: fam });
    const j = lab.parseJson(text);
    strategies[fam] = j && typeof j.rule === 'string' ? j.rule.slice(0, 240) : null;
    emitEvent({
      actor: actorTag, modelId: model, act: 'strategy-elicit', ok: !!strategies[fam],
      verbatim: { family: fam, rule: strategies[fam] ?? '(unparseable)' },
      topic: fam, costTick: null,
    });
  }
  return strategies;
}

async function sit(model, items, phase, actorTag, mark = null, notes = [], strategies = null) {
  const nb = notebookBlock(notes) + (strategies ? strategyBlock(strategies) : '');
  const rows = [];
  let i = 0;
  for (const it of items) {
    i++;
    mark?.(`${actorTag} ${phase} item ${i}/${items.length} start`);
    const { text } = await askOnce(model, [{ role: 'user', content: nb + qPrompt(it) }], { phase, text: it.text });
    mark?.(`${actorTag} ${phase} item ${i} done in-flight=${lab.getWarnings().length}w`);
    const label = parseLabel(text);
    const ok = label === it.truth;
    rows.push({ ...it, said: label, ok });
    emitEvent({
      actor: actorTag, modelId: model, act: phase, ok,
      verbatim: { text: it.text, truth: it.truth, said: label ?? '(unparseable)' },
      topic: it.family, costTick: null, meta: { itemHash: `${it.text}`.slice(-8) },
    });
  }
  return rows;
}

async function practiceFixed(model, worksheet, actorTag) {
  // drill the SAME 10 cards every round; each retry carries the verdict of that card only.
  // Returns the student's notebook: every drilled card with its FINAL verdict (flashcards,
  // so the notebook contains literal answers to sting-exam items - by design).
  const finalByCard = new Map();
  for (let r = 0; r < ROUNDS; r++) {
    const roundOks = [];
    for (const it of worksheet) {
      const lead = finalByCard.has(it.text)
        ? `Previous verdict on THIS card earlier in the session: ${finalByCard.get(it.text).ok ? 'you answered RIGHT' : `WRONG, right label was ${it.truth}`}.\n\n`
        : '';
      const { text } = await askOnce(model, [{ role: 'user', content: lead + qPrompt(it) }], { phase: 'practice-fixed', round: r });
      const label = parseLabel(text);
      const ok = label === it.truth;
      finalByCard.set(it.text, { text: it.text, truth: it.truth, ok, missed: !ok });
      roundOks.push(ok);
      emitEvent({
        actor: actorTag, modelId: model, act: 'practice-fixed', ok, round: r,
        verbatim: { text: it.text, truth: it.truth, said: label ?? '(unparseable)' },
        topic: it.family, costTick: null,
      });
    }
    console.log(`  [${actorTag}] fixed round ${r + 1}/${ROUNDS}: ${roundOks.filter(Boolean).length}/10`);
  }
  return [...finalByCard.values()];
}

async function practiceAdaptive(model, actorTag, seedOffset) {
  // fresh targeted items per round; weak families sampled harder; tier follows ability band
  const rnd = mulberry32(SEED + seedOffset);
  const missEma = Object.fromEntries(FAMILIES.map((f) => [f, 0.5])); // neutral prior
  const accEma = { value: 0.5 };
  const practiced = []; // notebook source: most recent items, verdicts attached
  for (let r = 0; r < ROUNDS; r++) {
    const weights = Object.fromEntries(FAMILIES.map((f) => [f, missEma[f] + 0.15]));
    const wsum = FAMILIES.reduce((s, f) => s + weights[f], 0);
    const tier = accEma.value >= 0.55 ? 'tricky' : 'base'; // aim for edge-of-ability
    const batch = [];
    for (let i = 0; i < PRACTICE_N; i++) {
      let x = rnd() * wsum, fam = FAMILIES[0];
      for (const f of FAMILIES) { x -= weights[f]; if (x <= 0) { fam = f; break; } }
      const it = genItem(fam, tier, rnd);
      it.family = fam; it.truth = classify(it);
      batch.push(it);
    }
    const oks = [];
    for (const it of batch) {
      const { text } = await askOnce(model, [{ role: 'user', content: qPrompt(it) }], { phase: 'practice-adaptive', round: r });
      const label = parseLabel(text);
      const ok = label === it.truth;
      oks.push(ok);
      if (label !== null) {
        missEma[it.family] = missEma[it.family] * 0.7 + (ok ? 0 : 1) * 0.3;
        accEma.value = accEma.value * 0.8 + (ok ? 1 : 0) * 0.2;
      }
      practiced.push({ text: it.text, truth: it.truth, ok, missed: !ok, family: it.family, said: label, tier });
      emitEvent({
        actor: actorTag, modelId: model, act: 'practice-adaptive', ok, round: r, tier,
        verbatim: { text: it.text, truth: it.truth, said: label ?? '(unparseable)' },
        topic: it.family, costTick: null,
      });
    }
    console.log(`  [${actorTag}] adaptive round ${r + 1}/${ROUNDS} (${tier}): ${oks.filter(Boolean).length}/10`);
  }
  // notebook examples: last 8 practiced items; full stream exposed for strategy elicitation
  return { examples: practiced.slice(-8), practiced };
}

async function main() {
  console.log(`tutor-gym tag=${TAG}${SMOKE ? ' (SMOKE: no writes)' : ''}`);
  console.log(`cast: ${Object.entries(CAST).map(([k, v]) => `${v.name}<${k}>`).join(', ')}`);

  const smokePrelim = await lab.smoke();
  for (const row of smokePrelim) {
    console.log(`smoke ${row.spec.padEnd(32)} ${row.ok ? 'PASS' : 'FAIL'} ${row.note ?? ''}`);
    if (!row.ok && row.hint) console.log(`  hint: ${row.hint}`);
  }

  if (SMOKE) {
    const stats = buildStatics(SEED);
    const probe = stats.worksheet.slice(0, 2);
    for (const spec of STUDENTS) {
      const res = await sit(spec, probe, 'smoke', actorFor(spec));
      console.log(`smoke-answers ${spec}: ${res.map((r) => `${r.said ?? '?'}/${r.truth}`).join(' ')}`);
    }
    lab.warn('smoke-mode', 'no artifacts written by design');
    process.exit(0);
  }

  // sync markers: stdout has proven unreliable under this shell; this file cannot lie
  const MARKS = path.join(RUNS, `marks-${TAG}.log`);
  const mark = (m) => fs.appendFileSync(MARKS, `${new Date().toISOString()} ${m}\n`);

  await lab.estimate({ callsPerModel: (ROUNDS * PRACTICE_N) + (EXAM_NOVEL_N + PRACTICE_N) });
  mark('estimate-done');

  const seedGen = (() => { let s = SEED; return () => (s += 977); })();
  const report = {};


  for (const model of STUDENTS) {
    const actor = actorFor(model);
    report[actor] = {};
    const statics = buildStatics(SEED);

    if (!STRATEGY_ONLY) {
      // ---- arm: none
      mark(`${actor} arm=none start`);
      console.log(`\n== ${actor} arm=none`);
      report[actor].none = {
        novel: await sit(model, statics.examNovel, 'exam-novel', actor, mark, []),
        sting: await sit(model, statics.sting, 'exam-sting', actor, mark, []),
      };

      // ---- arm: fixed (open-book: notebook = drilled cards with final verdicts)
      mark(`${actor} arm=fixed start`);
      console.log(`== ${actor} arm=fixed`);
      const notesFixed = await practiceFixed(model, statics.worksheet, actor);
      report[actor].fixed = {
        novel: await sit(model, statics.examNovel, 'exam-novel', actor, mark, notesFixed),
        sting: await sit(model, statics.sting, 'exam-sting', actor, mark, notesFixed),
      };
    }

    // ---- arm: adaptive (open-book: notebook = last 8 practiced items)
    mark(`${actor} arm=adaptive start`);
    console.log(`== ${actor} arm=adaptive`);
    const { examples: notesAdaptive, practiced: practicedAdaptive } = await practiceAdaptive(model, actor, seedGen());
    if (!STRATEGY_ONLY) {
      report[actor].adaptive = {
        novel: await sit(model, statics.examNovel, 'exam-novel', actor, mark, notesAdaptive),
        sting: await sit(model, statics.sting, 'exam-sting', actor, mark, notesAdaptive),
      };
    }

    // ---- arm: adaptive-strategy (R1: rules in words, zero answers)
    mark(`${actor} arm=adaptive-strategy start`);
    console.log(`== ${actor} arm=adaptive-strategy`);
    const strategies = await elicitStrategies(model, actor, practicedAdaptive, mark);
    console.log(`  [${actor}] rulebook: ${Object.entries(strategies).map(([f, r]) => `${f}=${r ? r.slice(0, 60) : 'null'}`).join(' | ')}`);
    report[actor].adaptiveStrategy = {
      novel: await sit(model, statics.examNovel, 'exam-novel', actor, mark, [], strategies),
      sting: await sit(model, statics.sting, 'exam-sting', actor, mark, [], strategies),
    };

    const pct = (arr) => arr.filter((r) => r.ok).length / arr.length;
    const row = (label, key) => report[actor][key]
      ? `\n   ${label.padEnd(9)}${(pct(report[actor][key].novel) * 100).toFixed(0)}% | ${(pct(report[actor][key].sting) * 100).toFixed(0)}%`
      : '';
    console.log(
      `\n-- ${actor} summary (novel | sting):` +
      row('none', 'none') + row('fixed', 'fixed') + row('adaptive', 'adaptive') +
      row('strategy', 'adaptiveStrategy')
    );
  }

  // self-grade guard: recompute truths independently; abort loudly on mismatch
  for (const actor of Object.keys(report)) {
    for (const arm of ['none', 'fixed', 'adaptive', 'adaptiveStrategy']) {
      if (!report[actor][arm]) continue; // strategy-only runs receipt a subset of arms
      for (const key of ['novel', 'sting']) {
        for (const row of report[actor][arm][key]) {
          lab.assertNotImpossible(row.truth === classify(row), `truth drift on ${row.text}`);
        }
      }
    }
  }

  const tally = {};
  for (const actor of Object.keys(report)) {
    tally[actor] = {};
    for (const arm of ['none', 'fixed', 'adaptive', 'adaptiveStrategy']) {
      tally[actor][arm] = {};
      for (const key of ['novel', 'sting']) {
        const rs = report[actor][arm][key];
        tally[actor][arm][key] = {
          n: rs.length,
          correct: rs.filter((r) => r.ok).length,
          unparseable: rs.filter((r) => r.said === null).length,
          byFamily: Object.fromEntries(FAMILIES.map((f) => [
            f,
            `${rs.filter((r) => r.family === f && r.ok).length}/${rs.filter((r) => r.family === f).length}`,
          ])),
        };
      }
    }
  }

  const resultsPath = path.join(RUNS, `results-gym-${TAG}.json`);
  const doc = lab.flush(resultsPath);
  fs.writeFileSync(path.join(RUNS, `tally-${TAG}.json`), JSON.stringify(tally, null, 2) + '\n');
  console.log(`tally: build/runs/tally-${TAG}.json`);
  console.log(`events: build/runs/events-${TAG}.jsonl (${fs.readFileSync(eventsPath, 'utf8').split('\n').filter(Boolean).length} lines)`);
  void doc;
}

main().catch(async (err) => {
  console.error('\nFATAL:', err?.message ?? err);
  console.error(err?.stack ?? '(no stack)');
  try { lab.flush(path.join(RUNS, `results-gym-${TAG}-FATAL.json`)); } catch { /* best effort */ }
  process.exit(1);
});
