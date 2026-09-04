#!/usr/bin/env node
// studio.mjs - the game studio run orchestrator (episode 2026-W36-engine-as-referee).
// Subcommands (all append-safe, state is TAG-scoped and rewritten atomically):
//   selftest                     engine sanity: known-good + known-broken levels
//   propose --arm A --brief N    stage A: submit + up to 2 repairs on arm feedback
//   present --brief N            blind owner view (shuffled, arm-hidden) + writes shuffle map
//   revise --brief N             stage C: one owner-feedback repair per rejected candidate
//   present-rev --brief N        blind owner view of the revisions
//   finalize --brief N           record revision verdicts + consultant scores for finals
//   tally                        observables table from state + verdicts
//
// Arms: full (engine diagnostics + owner verdicts + accepted exemplar traces)
//       engine (engine diagnostics only)
//       fuzzy (design consultant on the pitch only; never the grid, never the engine)
// Designer + consultant: local:qwen3:8b (think:false, 350 output tokens). INR 0.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createLab } from '../../../../../tools/lab-core.mjs';
import { engineReport } from './verify-level.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RUNS = path.join(HERE, 'runs');
const TAG = process.env.STUDIO_TAG || 'v3';
const STATE_PATH = path.join(RUNS, `studio-state-${TAG}.json`);
const MODEL = 'local:gemma3:12b'; // designer (2026-08-30 amendment: qwen3:8b could not hold the grid format in 9 smoke probes; see build-log)
const CONSULT_MODEL = 'local:qwen3:8b';

const BRIEFS = [
  { n: 1, id: 'cafe', text: 'A cozy cafe. At least two tables (T) and a counter (C). A customer enters at S and should reach the counter nook G.' },
  { n: 2, id: 'library', text: 'A small library. Bookshelves (B) along at least one wall, plus a reading table (T). A reader enters at S and reaches the reading nook G.' },
  { n: 3, id: 'dungeon', text: 'A dungeon entry hall. Stone pillars (P) and crates (X) for cover. The adventurer enters at S and reaches the treasure door G.' },
  { n: 4, id: 'flowershop', text: 'A flower shop. Flower buckets (F) and a counter (C). A customer enters at S and reaches the bouquet counter G.' },
  { n: 5, id: 'nightmarket', text: 'A night market stall row. Food stalls (M) and crates (X). A visitor enters at S and reaches the food stall G.' },
  { n: 6, id: 'mazegarden', text: 'A tiny hedge maze garden. The hedges must form at least two dead ends. A visitor enters at S and reaches the fountain G.' },
];

const SYSTEM = [
  'You are Rhea, a level designer at a tiny game studio.',
  'A level is a grid of exactly 12 rows, each row exactly 12 characters long.',
  'Tile meanings: # = wall, . = floor, S = spawn (exactly one), G = goal (exactly one), any other capital letter = a prop.',
  'Rules: the outer border must be all walls. Exactly one S and one G. Every prop must have floor/S/G next to it. A walkable path from S to G must exist.',
  'Output format - nothing else, exactly this shape:',
  '{"name":"<level name>","grid":[',
  '"############",',
  '"#S....T....#",',
  '... 12 rows total, each 12 chars ...',
  '"]}',
  'PITCH: <one sentence selling this level>',
  'Example of a valid level (do not copy it, design your own):',
  '{"name":"demo","grid":["############","#S...#.....#","#....#..T..#","#.......#..#","#..#....#..#","#..#.......#","#..#####...#","#..........#","#...C......#","#.....######","#........G.#","############"]}',
  'PITCH: A compact showroom with a long back wall.',
].join('\n');

const SEED_BASE = 20260830;
function seedFor(arm, brief, attempt) {
  let h = SEED_BASE;
  const s = `${arm}-${brief}-${attempt}`;
  for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0;
  return h >>> 0;
}

function loadState() {
  if (fs.existsSync(STATE_PATH)) return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8'));
  return {
    tag: TAG,
    createdAt: new Date().toISOString(),
    briefs: BRIEFS,
    candidates: [],
    shuffle: {},
    revShuffle: {},
  };
}

function saveState(st) {
  fs.mkdirSync(RUNS, { recursive: true });
  const tmp = `${STATE_PATH}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, JSON.stringify(st, null, 2) + '\n');
  fs.renameSync(tmp, STATE_PATH);
  console.log(`state: ${STATE_PATH}`);
}

function lab() {
  return createLab({
    name: 'studio',
    tag: TAG,
    models: [MODEL, CONSULT_MODEL],
    runsDir: RUNS + path.sep,
    estimateTokens: { in: 900, out: 400 },
    maxWallMs: 45 * 60 * 1000, // L-LAB-09
  });
}

function pitchOf(text) {
  const m = text.match(/PITCH:\s*(.+)/i) || text.match(/"pitch"\s*:\s*"([^"]+)"/i);
  const p = m?.[1];
  return p ? String(p).trim().slice(0, 200) : null;
}

// Importer: normalizes container noise (nested arrays, pitch-as-key, code
// fences) the way a real engine importer would. It NEVER repairs world
// content: wrong row counts, ragged rows, missing S/G stay hard gate fails.
function extract(raw) {
  const text = String(raw ?? '');
  const m = text.match(/\{[\s\S]*\}/);
  if (m) {
    try {
      const j = JSON.parse(m[0]);
      if (j && Array.isArray(j.grid)) return { json: j, pitch: pitchOf(text) };
    } catch {
      /* fall through to row scan */
    }
  }
  const rows = [...text.matchAll(/"([#A-Z.]{9,16})"/g)].map((x) => x[1]);
  if (rows.length >= 8) {
    const name = (text.match(/"name"\s*:\s*"([^"]+)"/) || [])[1] || 'unnamed level';
    return { json: { name, grid: rows.slice(0, 16) }, pitch: pitchOf(text) };
  }
  return { json: null, pitch: pitchOf(text) };
}

async function designerCall(lab, userPrompt, label) {
  const r = await lab.call({
    model: MODEL,
    messages: [
      { role: 'system', content: SYSTEM },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    maxTokens: 400, // L-LAB-10 budget (gemma3:12b grid output measured ~150-250 tokens)
    think: false,
    meta: { kind: 'design', label },
  });
  lab.writeTranscript(lab.transcriptPath(MODEL, `${label}.md`), {
    label,
    model: MODEL,
    messages: [
      { role: 'system', content: SYSTEM },
      { role: 'user', content: userPrompt },
    ],
    response: r.text,
    meta: { label },
  });
  return r;
}

async function consultantCall(lab, userPrompt, label) {
  const r = await lab.call({
    model: CONSULT_MODEL,
    messages: [{ role: 'user', content: userPrompt }],
    temperature: 0.7,
    maxTokens: 160,
    think: false,
    meta: { kind: 'consult', label },
  });
  lab.writeTranscript(lab.transcriptPath(CONSULT_MODEL, `consult-${label}.md`), {
    label: `consult ${label}`,
    model: MODEL,
    messages: [{ role: 'user', content: userPrompt }],
    response: r.text,
    meta: { label },
  });
  return r;
}

function runEngine(raw, seed) {
  const rep = engineReport(raw, { seed });
  return {
    pass: rep.pass,
    failure: rep.failure,
    bot: rep.bot,
    ascii: rep.ascii,
    name: rep.level?.name ?? null,
    patches: rep.patches ?? [],
  };
}

function failLine(f) {
  if (!f) return null;
  const cell = f.cell ? ` at (${f.cell[0]},${f.cell[1]})` : '';
  const obj = f.objectId ? ` [${f.objectId}]` : '';
  return `${f.gate}${cell}${obj}: ${f.reason}`;
}

// ---------------------------------------------------------------- selftest

async function selftest() {
  const good = {
    name: 'ok level',
    grid: [
      '############',
      '#S.........#',
      '#..........#',
      '#..T....C..#',
      '#..........#',
      '#....##....#',
      '#....#G....#',
      '#..........#',
      '#.########.#',
      '#..........#',
      '#..........#',
      '############',
    ],
  };
  const r1 = engineReport(JSON.stringify(good), { seed: 7 });
  const ok1 = r1.pass && r1.bot?.reached;
  console.log(`selftest good level: ${ok1 ? 'PASS' : 'FAIL'} bot=${JSON.stringify(r1.bot)}`);
  if (!ok1) console.log('ascii was:', r1.ascii, 'failure:', failLine(r1.failure));

  const leaky = JSON.parse(JSON.stringify(good));
  leaky.grid[0] = '#####.######'; // hole in the outer wall
  const r2 = engineReport(JSON.stringify(leaky), { seed: 7 });
  const ok2 = !r2.pass && r2.failure?.gate === 'BORDER';
  console.log(`selftest leaky border: ${ok2 ? 'PASS' : 'FAIL'} -> ${failLine(r2.failure)}`);

  const embedded = {
    name: 'embedded prop',
    grid: [
      '############',
      '#S.........#',
      '#..........#',
      '#..T.#..C..#',
      '#####X#....#',
      '#....##....#',
      '#....#G....#',
      '#..........#',
      '#.########.#',
      '#..........#',
      '#..........#',
      '############',
    ],
  };
  const r3 = engineReport(JSON.stringify(embedded), { seed: 7 });
  const ok3 = !r3.pass && r3.failure?.gate === 'SUPPORT';
  console.log(`selftest embedded prop: ${ok3 ? 'PASS' : 'FAIL'} -> ${failLine(r3.failure)}`);

  const noPath = {
    name: 'sealed goal',
    grid: [
      '############',
      '#S.......###',
      '#........#G#',
      '#........###',
      '#..........#',
      '############',
      '#..........#',
      '#..........#',
      '############',
      '############',
      '############',
      '############',
    ],
  };
  const r4 = engineReport(JSON.stringify(noPath), { seed: 7 });
  const ok4 = !r4.pass && r4.failure?.gate === 'REACH';
  console.log(`selftest sealed goal: ${ok4 ? 'PASS' : 'FAIL'} -> ${failLine(r4.failure)}`);

  const allOk = ok1 && ok2 && ok3 && ok4;
  console.log(allOk ? 'SELFTEST: ALL PASS' : 'SELFTEST: FAILURES ABOVE');
  if (!allOk) process.exitCode = 1;
}

// ---------------------------------------------------------------- propose

async function propose(arm, briefN) {
  const brief = BRIEFS[briefN - 1];
  if (!brief) throw new Error(`no brief ${briefN}`);
  if (!['full', 'engine', 'fuzzy'].includes(arm)) throw new Error(`bad arm ${arm}`);
  const st = loadState();
  const labI = lab();
  await labI.estimate({ callsPerModel: 3 });

  for (let attempt = 1; attempt <= 3; attempt++) {
    const id = `${arm}-b${brief.n}-a${attempt}`;
    if (st.candidates.some((c) => c.id === id)) {
      console.log(`skip ${id} (exists)`);
      continue;
    }
    const seed = seedFor(arm, brief.n, attempt);
    let userPrompt;
    if (attempt === 1) {
      userPrompt = `Brief: ${brief.text}\nDesign the level now.`;
    } else {
      const prev = st.candidates.find((c) => c.id === `${arm}-b${brief.n}-a${attempt - 1}`);
      const fl = failLine(prev?.engine?.failure);
      if (arm === 'fuzzy') {
        const consult = prev?.consultFeedback || '(no consultant note available)';
        userPrompt = `Brief: ${brief.text}\nYour previous level concept got this consultant note:\n"${consult}"\nDesign a new, better level now.`;
      } else if (arm === 'full') {
        const cards = st.candidates
          .filter((c) => c.arm === 'full' && c.brief === brief.n && c.attempt < attempt)
          .map((c) => `- attempt ${c.attempt}: ${c.engine?.pass ? 'engine OK' : failLine(c.engine?.failure)}${c.ownerVerdict ? `; studio head: ${c.ownerVerdict.accept ? 'ACCEPTED' : 'rejected'} (${c.ownerVerdict.reason || 'no reason given'})` : ''}`)
          .join('\n');
        userPrompt = `Brief: ${brief.text}\nYour previous submission failed the engine check:\n${fl}\nYour trace cards so far:\n${cards}\nFix the level. Keep what works, repair what the engine named.`;
      } else {
        userPrompt = `Brief: ${brief.text}\nYour previous submission failed the engine check:\n${fl}\nFix the level. Keep what works, repair what the engine named.`;
      }
    }
    const r = await designerCall(labI, userPrompt, `${id}-design`);
    const { json, pitch } = extract(r.text);
    const raw = json ? JSON.stringify(json) : r.text;
    const engine = runEngine(raw, seed);
    const cand = {
      id,
      arm,
      brief: brief.n,
      attempt,
      seed,
      name: engine.name || (json && typeof json.name === 'string' ? json.name : null),
      pitch,
      rawOk: Boolean(json),
      engine: { pass: engine.pass, failure: engine.failure, bot: engine.bot },
      ascii: engine.ascii,
      importPatches: engine.patches,
      status: engine.pass ? 'review' : (attempt < 3 ? 'repairing' : 'void'),
      ownerVerdict: null,
      revisionOf: null,
      consultFeedback: null,
      consultScore: null,
    };
    st.candidates.push(cand);
    labI.event({
      day: brief.n,
      tick: attempt,
      actor: `Rhea (${arm} desk)`,
      model: MODEL,
      type: engine.pass ? 'submission' : 'engine-reject',
      detail: `${id}: ${engine.pass ? `passed gates, bot walked ${engine.bot?.steps} steps` : failLine(engine.failure)}`,
      quote: pitch,
    });
    labI.snapshot(brief.n, { brief: brief.id, arm, attempt, ascii: engine.ascii, pass: engine.pass });
    saveState(st);
    console.log(`${id}: ${engine.pass ? 'GATES PASS' : 'FAIL -> ' + failLine(engine.failure)}`);

    // fuzzy desk: consultant feedback feeds the next repair, engine is never shown
    if (!engine.pass && arm === 'fuzzy' && attempt < 3) {
      const cr = await consultantCall(
        labI,
        `You are a design consultant at a game studio. The brief: ${brief.text}\nThe designer pitches this level concept: "${pitch || '(no pitch given)'}". Give two sharp sentences of feedback: does the concept fit the brief and sound fun? Be specific. Do not ask questions.`,
        `${id}-fb`
      );
      cand.consultFeedback = String(cr.text || '').trim().slice(0, 400);
      saveState(st);
    }
    if (engine.pass) break; // stage A closes on gate pass
  }

  labI.flush(path.join(RUNS, `results-${TAG}.json`), { merge: true }); // L-LAB-08: one run, many processes
  labI.flushChronicle({ dir: RUNS });
  console.log(`propose ${arm} b${brief.n} done`);
}

// ---------------------------------------------------------------- present

function shuffleMap(st, briefN, ids, kind) {
  const idx = Array.from({ length: ids.length }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = (seedFor('shuffle', briefN, SEED_BASE + i + kind.length) % (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const map = {};
  idx.forEach((candIdx, pos) => {
    map[ids[candIdx]] = `${kind}-${pos + 1}`;
  });
  return map;
}

async function present(briefN, kind = 'rev') {
  const st = loadState();
  const brief = BRIEFS[briefN - 1];
  const pending = st.candidates.filter((c) => c.brief === briefN && c.status === 'review' && (kind === 'rev' ? c.revisionOf === null : typeof c.revisionOf === 'string') && c.ownerVerdict === null);
  if (pending.length === 0) {
    console.log('nothing pending review');
    return;
  }
  const key = kind === 'rev' ? briefN : 100 + briefN;
  const map = shuffleMap(st, key, pending.map((c) => c.id), kind === 'rev' ? 'CAND' : 'REV');
  st.shuffle[key] = map;
  saveState(st);
  console.log(`BRIEF ${briefN} (${brief.id}): ${brief.text}`);
  console.log(`Reply as: CAND-1 accept | CAND-2 reject: <one-line reason> ...\n`);
  for (const cand of pending) {
    console.log(`=== ${map[cand.id]} ===`);
    console.log(cand.ascii || '(no render)');
    console.log('');
  }
}

async function presentRev(briefN) {
  return present(briefN, 'rev2');
}

// ---------------------------------------------------------------- revise

function applyVerdicts(st) {
  const vPath = path.join(RUNS, `owner-verdicts-${TAG}.json`);
  if (!fs.existsSync(vPath)) return 0;
  const verdicts = JSON.parse(fs.readFileSync(vPath, 'utf8'));
  let applied = 0;
  for (const [id, v] of Object.entries(verdicts)) {
    const cand = st.candidates.find((c) => c.id === id);
    if (cand && cand.ownerVerdict === null) {
      cand.ownerVerdict = { accept: Boolean(v.accept), reason: String(v.reason || '').slice(0, 200) };
      cand.status = v.accept ? 'accepted' : 'rejected';
      applied++;
    }
  }
  if (applied) saveState(st);
  return applied;
}

async function revise(briefN) {
  const st = loadState();
  const brief = BRIEFS[briefN - 1];
  const labI = lab();
  applyVerdicts(st);
  const rejected = st.candidates.filter((c) => c.brief === briefN && c.revisionOf === null && c.status === 'rejected' && !st.candidates.some((r) => r.revisionOf === c.id));
  if (rejected.length === 0) {
    console.log('no rejected candidates to revise');
    return;
  }
  const exemplar = st.candidates.find((c) => c.brief === briefN && c.ownerVerdict?.accept === true && c.revisionOf === null);
  for (const cand of rejected) {
    const id = `${cand.arm}-b${briefN}-rev`;
    const attempt = 4;
    const seed = seedFor(cand.arm, briefN, attempt);
    let userPrompt;
    if (cand.arm === 'fuzzy') {
      userPrompt = `Brief: ${brief.text}\nThe studio head rejected your level. The consultant says rework the concept bolder. Design a new, better level now.`;
    } else if (cand.arm === 'full') {
      const cards = st.candidates
        .filter((c) => c.arm === cand.arm && c.brief === briefN)
        .map((c) => `- attempt ${c.attempt}: studio head ${c.ownerVerdict?.accept ? 'ACCEPTED' : 'rejected'} (${c.ownerVerdict?.reason || 'no reason given'})`)
        .join('\n');
      const ex = exemplar && exemplar.id !== cand.id ? `\nThe studio head accepted this level for the same brief:\n${exemplar.ascii}` : '';
      userPrompt = `Brief: ${brief.text}\nThe studio head REJECTED your level with this reason: "${cand.ownerVerdict?.reason || 'no reason given'}"\nYour trace cards:\n${cards}${ex}\nDesign a new level that fixes the complaint.`;
    } else {
      userPrompt = `Brief: ${brief.text}\nThe studio head rejected your level (engine checks had all passed). Design a different layout for the same brief.`;
    }
    const r = await designerCall(labI, userPrompt, `${id}-design`);
    const { json, pitch } = extract(r.text);
    const raw = json ? JSON.stringify(json) : r.text;
    const engine = runEngine(raw, seed);
    const rev = {
      id,
      arm: cand.arm,
      brief: briefN,
      attempt,
      seed,
      name: engine.name || null,
      pitch,
      rawOk: Boolean(json),
      engine: { pass: engine.pass, failure: engine.failure, bot: engine.bot },
      ascii: engine.ascii,
      importPatches: engine.patches,
      status: engine.pass ? 'review' : 'void',
      ownerVerdict: null,
      revisionOf: cand.id,
      consultFeedback: null,
      consultScore: null,
    };
    st.candidates.push(rev);
    labI.event({
      day: briefN,
      tick: 4,
      actor: `Rhea (${cand.arm} desk)`,
      model: MODEL,
      type: engine.pass ? 'revision' : 'engine-reject',
      detail: `${id}: ${engine.pass ? 'revision passed gates' : failLine(engine.failure)}`,
      quote: pitch,
    });
    saveState(st);
    console.log(`${id}: ${engine.pass ? 'GATES PASS (needs review)' : 'FAIL -> ' + failLine(engine.failure)}`);
  }
  labI.flush(path.join(RUNS, `results-${TAG}.json`), { merge: true }); // L-LAB-08: one run, many processes
  console.log(`revise b${briefN} done`);
}

// ---------------------------------------------------------------- finalize

async function finalize(briefN) {
  const st = loadState();
  const labI = lab();
  const brief = BRIEFS[briefN - 1];

  // 1. apply any verdicts not yet recorded (candidates + revisions)
  applyVerdicts(st);

  // 2. consultant scores the FINAL candidate of each arm for this brief
  //    (pitch only, never the grid; disagreement receipts live here)
  for (const arm of ['full', 'engine', 'fuzzy']) {
    const chain = st.candidates.filter((c) => c.arm === arm && c.brief === briefN);
    const last = chain[chain.length - 1];
    if (!last || last.consultScore !== null) continue;
    const cr = await consultantCall(
      labI,
      `Rate this game level concept for the brief. Brief: ${brief.text}\nDesigner's pitch: "${last.pitch || '(no pitch)'}".\nAnswer with EXACTLY one line and nothing else, in this format:\nSCORE: <number 0 to 10> | <one short line of reasoning>`,
      `${last.id}-score`
    );
    const m = String(cr.text || '').match(/SCORE:?\s*\**\s*(\d{1,2})/i);
    last.consultScore = m ? Number(m[1]) : null;
    last.consultLine = String(cr.text || '').trim().slice(0, 200);
    saveState(st);
    console.log(`consult ${last.id}: ${last.consultScore ?? '?'}/10`);
  }
  labI.flush(path.join(RUNS, `results-${TAG}.json`), { merge: true }); // L-LAB-08: one run, many processes
  console.log(`finalize b${briefN} done`);
}

// ---------------------------------------------------------------- tally

async function tally() {
  const st = loadState();
  const arms = ['full', 'engine', 'fuzzy'];
  const rows = [];
  for (const arm of arms) {
    const finals = st.candidates.filter((c) => c.arm === arm && c.revisionOf === null);
    const reached = finals.filter((c) => {
      const last = st.candidates.filter((x) => x.arm === arm && x.brief === c.brief).pop();
      return last && last.ownerVerdict !== null;
    });
    const accepted = finals.filter((c) => {
      const chain = [c, ...st.candidates.filter((x) => x.revisionOf === c.id)];
      return chain.some((x) => x.ownerVerdict?.accept === true);
    });
    const gateFirst = finals.filter((c) => c.attempt === 1 && c.engine?.pass).length;
    const voids = finals.filter((c) => !c.engine?.pass).length;
    const reviews = st.candidates.filter((c) => c.arm === arm && c.ownerVerdict !== null && c.revisionOf === null);
    const revReviews = st.candidates.filter((c) => c.arm === arm && c.ownerVerdict !== null && c.revisionOf !== null);
    rows.push({
      arm,
      briefsReachingReview: reached.length,
      briefsAccepted: accepted.length,
      acceptanceRate: reached.length ? +(accepted.length / reached.length).toFixed(2) : null,
      firstAttemptGatePass: gateFirst,
      voidedBriefs: voids,
      ownerReviews: reviews.length + revReviews.length,
      importPatches: finals.reduce((s, c) => s + (c.importPatches?.length ?? 0), 0),
      consultScores: finals.map((c) => {
        const last = st.candidates.filter((x) => x.arm === arm && x.brief === c.brief).pop();
        return last?.consultScore ?? null;
      }),
    });
  }
  console.log('=== STUDIO TALLY (owner acceptance is primary) ===');
  for (const r of rows) {
    console.log(`${r.arm.padEnd(7)} review:${r.briefsReachingReview}/6  accepted:${r.briefsAccepted}/6  rate:${r.acceptanceRate ?? '-'}  a1-gate-pass:${r.firstAttemptGatePass}/6  voids:${r.voidedBriefs}  import-patches:${r.importPatches}  owner-reviews:${r.ownerReviews}`);
  }
  // disagreement receipts: consultant loved a level the engine voided
  const receipts = st.candidates.filter((c) => c.consultScore !== null && c.consultScore >= 8 && !c.engine?.pass);
  console.log(`\ndisagreement receipts (consultant 8+ on engine-failed levels): ${receipts.length}`);
  for (const r of receipts) console.log(`  ${r.id}: consult ${r.consultScore}/10 while engine said ${failLine(r.engine?.failure)}`);
  fs.mkdirSync(RUNS, { recursive: true });
  fs.writeFileSync(path.join(RUNS, `tally-${TAG}.json`), JSON.stringify({ rows, receipts: receipts.map((r) => r.id) }, null, 2) + '\n');
  console.log(`tally: ${path.join(RUNS, `tally-${TAG}.json`)}`);
}

// ---------------------------------------------------------------- cli

const [, , cmd, ...rest] = process.argv;
const arg = (name) => {
  const i = rest.indexOf(`--${name}`);
  return i >= 0 ? rest[i + 1] : null;
};
try {
  if (cmd === 'selftest') await selftest();
  else if (cmd === 'propose') await propose(arg('arm'), Number(arg('brief')));
  else if (cmd === 'present') await present(Number(arg('brief')), 'rev');
  else if (cmd === 'present-rev') await presentRev(Number(arg('brief')));
  else if (cmd === 'revise') await revise(Number(arg('brief')));
  else if (cmd === 'finalize') await finalize(Number(arg('brief')));
  else if (cmd === 'tally') await tally();
  else {
    console.log('usage: studio.mjs selftest | propose --arm A --brief N | present --brief N | revise --brief N | present-rev --brief N | finalize --brief N | tally');
    process.exitCode = cmd ? 1 : 0;
  }
} catch (err) {
  console.error(`studio: ${err.message}`);
  process.exitCode = 1;
}
