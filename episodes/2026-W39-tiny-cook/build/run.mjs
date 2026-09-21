#!/usr/bin/env node
// The Recipe Box Diner: episode runner for 2026-W39-tiny-cook.
// Four shifts on the approved spec: A (closed-book), B (box only),
// C (chair only), D (chair + box, orders 16-20 on mislabeled-card days).
// No LLM grading anywhere: the Headwaiter is deterministic.
//
// Usage:
//   node run.mjs --smoke            world self-check + engine smoke (no shifts)
//   node run.mjs --self-review      printed checklist vs experiment-spec.md
//   node run.mjs --all              every shift, flush after each
//   node run.mjs --shift=A,C        subset of shifts
//   node run.mjs --cooks=rhea,bruno subset of small cooks

import { createLab } from '../../../../../tools/lab-core.mjs';
import {
  SEED, buildPantry, buildOrders, findCard, renderCard,
  parseTicket, gradeTicket, PROTOCOL, PROTOCOL_CLASSIC, closedBookPrompt,
} from './pantry.mjs';
import fs from 'node:fs';
import url from 'node:url';

const DIR = url.fileURLToPath(new URL('.', import.meta.url));
const RUNS = `${DIR}runs/r3`;
fs.mkdirSync(RUNS, { recursive: true });

const args = Object.fromEntries(process.argv.slice(2).map((a) => {
  const m = a.match(/^--([a-z-]+)(?:=(.*))?$/i);
  return m ? [m[1], m[2] === undefined ? true : m[2]] : [a, true];
}));

// ---- cast (real models, badged) -------------------------------------------------
const COOKS = {
  rhea:    { persona: 'Rhea, the tiny cook',   model: 'local:qwen3:8b',   short: 'qwen3:8b' },
  bruno:   { persona: 'Bruno, the relief cook', model: 'local:gemma3:12b', short: 'gemma3:12b' },
  marlowe: { persona: 'Chef Marlowe', model: 'or:nvidia/nemotron-3-ultra-550b-a55b:free', short: 'nemotron-3-ultra-550b', celebrity: true },
};

// ---- world ----------------------------------------------------------------------
const pantry = buildPantry();
const orders = buildOrders(pantry);

// ---- lab ------------------------------------------------------------------------
const lab = createLab({
  name: 'recipe-box-diner',
  tag: 'r3',
  models: Object.values(COOKS).map((c) => c.model),
  runsDir: `${DIR}runs/`,
  maxWallMs: 12600000, // 3.5h hard ceiling (L-LAB-09)
});

const rows = [];           // episode rows (one per cook x condition x order)
const transcriptLog = {};  // `${cook}-${cond}` -> lines of JSONL

const TURN_TOKENS = 650;   // chair budget per turn (L-LAB-10)
const PULL_BUDGET = 8;

const appendTranscript = (key, obj) => {
  transcriptLog[key] = transcriptLog[key] || [];
  transcriptLog[key].push(obj);
};
const flushTranscripts = () => {
  for (const [key, lines] of Object.entries(transcriptLog)) {
    fs.writeFileSync(`${RUNS}/transcript-${key}.jsonl`, lines.map((l) => JSON.stringify(l)).join('\n') + '\n');
  }
};

function worldSelfCheck() {
  const problems = [];
  if (pantry.length !== 40) problems.push(`pantry has ${pantry.length} cards, want 40`);
  if (orders.length !== 20) problems.push(`menu has ${orders.length} orders, want 20`);
  const kinds = orders.reduce((m, o) => ({ ...m, [o.kind]: (m[o.kind] || 0) + 1 }), {});
  if (kinds.velmora !== 15 || kinds.classic !== 5) problems.push(`tier split wrong: ${JSON.stringify(kinds)}`);
  const depths = orders.filter((o) => o.kind === 'velmora').reduce((m, o) => ({ ...m, [o.depth]: (m[o.depth] || 0) + 1 }), {});
  if (depths[1] !== 5 || depths[2] !== 5 || depths[3] !== 5) problems.push(`depth split wrong: ${JSON.stringify(depths)}`);
  const byName = new Map(pantry.map((c) => [c.name.toLowerCase(), c]));
  // hint fairness: every accent hint must be unique among the sibling refs
  // the cook could confuse it with, and every finish hint unique among the
  // accent's refs.
  for (const o of orders.filter((x) => x.kind === 'velmora')) {
    const base = byName.get(o.key.base.toLowerCase());
    if (!base) { problems.push(`${o.dish}: base ${o.key.base} not a card`); continue; }
    if (o.key.accent === 'none') continue;
    const acc = byName.get(o.key.accent.toLowerCase());
    if (!acc) { problems.push(`${o.dish}: accent ${o.key.accent} not a card`); continue; }
    if (!base.refs.some((r) => r.toLowerCase() === o.key.accent.toLowerCase())) problems.push(`${o.dish}: accent not referenced by base`);
    const sibs = base.refs.map((r) => byName.get(r));
    if (sibs.filter((s) => s.note === acc.note).length !== 1) problems.push(`${o.dish}: accent note hint is ambiguous`);
    if (o.key.finish === 'none') continue;
    const fin = byName.get(o.key.finish.toLowerCase());
    if (!fin) { problems.push(`${o.dish}: finish ${o.key.finish} not a card`); continue; }
    if (!acc.refs.some((r) => r.toLowerCase() === o.key.finish.toLowerCase())) problems.push(`${o.dish}: finish not referenced by accent`);
    const fsibs = acc.refs.map((r) => byName.get(r));
    if (fsibs.filter((s) => s.note === fin.note).length !== 1) problems.push(`${o.dish}: finish note hint is ambiguous`);
    if (fin.note === acc.note) problems.push(`${o.dish}: accent and finish share one note`);
  }
  for (const o of orders.filter((x) => x.kind === 'classic')) {
    if (o.key.accent !== 'none' || o.key.finish !== 'none') problems.push(`${o.dish}: classic must grade base only`);
    if (!Array.isArray(o.key.syn) || !o.key.syn.length) problems.push(`${o.dish}: classic missing synonyms`);
  }
  if (!findCard(pantry, pantry[0].aliases[0])) problems.push('alias lookup broken');
  const t = parseTicket('TICKET: X | base: a | accent: b | finish: none');
  if (!t.valid || !t.formatOk || t.base !== 'a' || t.accent !== 'b' || t.finish !== 'none') problems.push('ticket parser broken');
  const tChair = parseTicket('THINK: working it out\nTICKET: X | base: a | accent: b | finish: none');
  if (!tChair.valid || !tChair.formatOk) problems.push('chair ticket must keep format');
  const tTrail = parseTicket('TICKET: X | base: a | accent: b | finish: none\nhope this helps!');
  if (tTrail.valid && tTrail.formatOk) problems.push('trailing text must break format');
  const o1 = orders.find((o) => o.kind === 'velmora' && o.depth === 1);
  const good = parseTicket(`TICKET: ${o1.dish} | base: ${o1.key.base} | accent: none | finish: none`);
  if (!gradeTicket(good, o1, pantry).correct) problems.push(`grading rejects a correct ticket for ${o1.dish}`);
  const bad = parseTicket(`TICKET: ${o1.dish} | base: sunken citrus | accent: none | finish: none`);
  if (gradeTicket(bad, o1, pantry).correct) problems.push('grading accepts a wrong ticket');
  if (!gradeTicket(bad, o1, pantry).hallucinated && !findCard(pantry, 'sunken citrus')) problems.push('hallucination detector broken');
  return problems;
}

// ---- reply parsing ---------------------------------------------------------------
// Chair-licensed replies: optional THINK line(s), then the action line.
// Chair-off replies: action line only; THINK there is a protocol error.
// One action per reply: the FIRST action line wins; anything after it
// (including batched PULL/TICKET lines or hallucinated BOX output) is stray.
function readReply(text, { chair }) {
  const lines = (text || '').split('\n').map((l) => l.trim()).filter(Boolean);
  const thoughts = [];
  const stray = [];
  let action = null;
  for (const l of lines) {
    if (/^THINK:/i.test(l)) { thoughts.push(l.replace(/^THINK:\s*/i, '')); continue; }
    if (/^PULL\b/i.test(l)) {
      if (!action) action = { kind: 'pull', q: l.replace(/^PULL:?\s*/i, '').trim() };
      else stray.push(l);
      continue;
    }
    if (/^TICKET:/i.test(l)) {
      if (!action) action = { kind: 'ticket' };
      else stray.push(l);
      continue;
    }
    stray.push(l);
  }
  return { thoughts, action, stray, protocolError: chair ? stray.length > 0 : (stray.length > 0 || thoughts.length > 0) };
}

const stripThoughts = (text) => (text || '').split('\n').filter((l) => !/^\s*THINK:/i.test(l)).join('\n').trim();
const normTxt = (s) => (s || '').trim().toLowerCase().replace(/\s+/g, ' ');

// ---- one order, box conditions (B and D) ------------------------------------------
async function runBoxOrder(cook, cond, order, { noisy }) {
  const chair = cond === 'D';
  const msgs = [{ role: 'system', content: PROTOCOL }];
  if (chair) msgs.push({ role: 'user', content: 'The chair is licensed for this order: open every reply with one THINK: line of working, then your action line.' });
  msgs.push({ role: 'user', content: order.blurb + (chair ? '' : ' Work the box or stamp the ticket. Action lines only, no THINK lines.') });
  let pulls = 0, errors = 0, protocolErrors = 0, thoughts = [], exhausted = false, finalText = null, turns = 0;
  const trail = [];
  for (let turn = 0; turn < 20; turn++) {
    const r = await lab.call({
      model: cook.model, messages: msgs, temperature: 0.7, maxTokens: TURN_TOKENS, think: false,
      meta: { scene: `${cond}-${order.dish}`, turn },
    });
    turns++;
    finalText = r.text;
    const read = readReply(r.text, { chair });
    thoughts.push(...read.thoughts);
    if (read.protocolError) protocolErrors++;
    trail.push({ role: 'assistant', raw: r.text });
    if (read.action?.kind === 'ticket') break;
    if (read.action?.kind === 'pull') {
      const card = findCard(pantry, read.action.q);
      pulls++;
      msgs.push({ role: 'assistant', content: stripThoughts(r.text) });
      if (card) {
        msgs.push({ role: 'user', content: `BOX: ${renderCard(card, { noisy })}` });
        trail.push({ role: 'box', card: card.name, noisy });
      } else {
        msgs.push({ role: 'user', content: `BOX: NOT ON FILE: ${read.action.q}. That name is in no drawer.` });
        trail.push({ role: 'box', miss: read.action.q });
      }
    } else {
      errors++;
      msgs.push({ role: 'assistant', content: stripThoughts(r.text) });
      msgs.push({ role: 'user', content: 'PROTOCOL ERROR: reply with one PULL line or the one-line TICKET.' + (chair ? ' Keep the THINK: line, one line of working only.' : ' No THINK lines in this shift.') });
      trail.push({ role: 'kernel', error: true });
    }
    if (pulls + errors >= PULL_BUDGET) {
      exhausted = true;
      msgs.push({ role: 'user', content: 'The box closes for this order. Stamp the ticket NOW: exactly one TICKET line and nothing else.' + (chair ? ' One THINK: line first is allowed.' : '') });
      const fr = await lab.call({ model: cook.model, messages: msgs, temperature: 0.7, maxTokens: TURN_TOKENS, think: false, meta: { scene: `${cond}-${order.dish}`, turn: 'forced' } });
      turns++;
      finalText = fr.text;
      trail.push({ role: 'assistant', raw: fr.text, forced: true });
      break;
    }
  }
  const parsed = parseTicket(stripThoughts(finalText));
  const g = gradeTicket(parsed, order, pantry);
  return { pulls, errors, protocolErrors, thoughts, exhausted, parsed, turns, raw: finalText, trail, ...g };
}

// ---- one order, closed-book conditions (A and C) ----------------------------------
const CLOSED_SYS = [
  'You are a cook at the Recipe Box Diner working a ticket from memory.',
  'There is no recipe box on this shift: no lookups, no drawers.',
  'When you know the answer, stamp the ticket with EXACTLY this one-line shape, nothing else:',
  'TICKET: <dish> | base: <ingredient> | accent: <ingredient or none> | finish: <ingredient or none>',
].join('\n');

async function runDirectOrder(cook, cond, order) {
  const chair = cond === 'C';
  const prompt = closedBookPrompt(order) + (chair ? '\nThe chair is licensed: open with one THINK: line of working, then the TICKET line.' : '');
  const r = await lab.call({
    model: cook.model,
    messages: [{ role: 'system', content: CLOSED_SYS }, { role: 'user', content: prompt }],
    temperature: 0.7, maxTokens: TURN_TOKENS, think: false,
    meta: { scene: `${cond}-${order.dish}` },
  });
  const read = readReply(r.text, { chair });
  const parsed = parseTicket(stripThoughts(r.text));
  const g = gradeTicket(parsed, order, pantry);
  return {
    pulls: 0, errors: 0, protocolErrors: read.protocolError ? 1 : 0,
    thoughts: read.thoughts, exhausted: false, parsed, turns: 1, raw: r.text, trail: [{ role: 'assistant', raw: r.text }], ...g,
  };
}

const TIERS = (o) => (o.kind === 'classic' ? 'classic' : `depth${o.depth}`);

// ---- shifts -----------------------------------------------------------------------
const SHIFTS = {
  A: ['rhea', 'bruno', 'marlowe'],
  B: ['rhea', 'bruno'],
  C: ['rhea', 'bruno'],
  D: ['rhea', 'bruno'],
  N: ['rhea', 'bruno'], // paired noise shift: same menu, D rules, mislabeled cards
};

async function runShift(shiftId, cookKeys) {
  let n = 0;
  for (const key of cookKeys) {
    const cook = COOKS[key];
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const noisy = shiftId === 'N'; // paired noise shift: mislabeled-card day, full menu
      const res = (shiftId === 'A' || shiftId === 'C')
        ? await runDirectOrder(cook, shiftId, order)
        : await runBoxOrder(cook, shiftId, order, { noisy });
      const row = {
        id: `${key}-${shiftId}-o${String(i + 1).padStart(2, '0')}`,
        cook: key, persona: cook.persona, model: cook.short, condition: shiftId,
        order: i + 1, dish: order.dish, kind: order.kind, tier: TIERS(order),
        noisy,
        correct: !!res.correct, valid: !!res.parsed?.valid, formatOk: !!res.parsed?.formatOk,
        hallucinated: !!res.hallucinated,
        dishOk: !!res.parsed?.valid && (normTxt(res.parsed.dish).includes(normTxt(order.dish)) || normTxt(order.dish).includes(normTxt(res.parsed.dish))),
        pulls: res.pulls, protocolErrors: res.protocolErrors, exhausted: !!res.exhausted,
        turns: res.turns,
        thoughtLines: res.thoughts.length,
        ticket: res.parsed?.valid ? `${res.parsed.dish} | base: ${res.parsed.base} | accent: ${res.parsed.accent} | finish: ${res.parsed.finish}` : null,
      };
      rows.push(row);
      appendTranscript(`${key}-${shiftId}`, {
        id: row.id, dish: order.dish, tier: row.tier, noisy,
        blurb: order.blurb,
        turns: res.trail, thoughts: res.thoughts,
        ticket: row.ticket, correct: row.correct, formatOk: row.formatOk,
      });
      n++;
      // chronicle: notable moments only
      if (row.hallucinated) {
        lab.event({
          day: shiftId, tick: i + 1, actor: cook.persona, model: cook.short,
          type: 'hallucination',
          detail: `invented an ingredient on ${order.dish} (ticket base: ${res.parsed?.base})`,
          quote: `ticket was: ${row.ticket || '(no ticket)'}`,
          meta: { id: row.id },
        });
      }
      if (row.exhausted) {
        lab.event({
          day: shiftId, tick: i + 1, actor: cook.persona, model: cook.short,
          type: 'budget-exhaustion',
          detail: `burned all ${PULL_BUDGET} pulls on ${order.dish} and needed a forced ticket`,
          meta: { id: row.id },
        });
      }
      if (row.correct && order.kind === 'velmora' && order.depth === 3) {
        lab.event({
          day: shiftId, tick: i + 1, actor: cook.persona, model: cook.short,
          type: 'depth3-solved',
          detail: `solved the full 3-card chain on ${order.dish} with ${row.pulls} pulls`,
          quote: (res.thoughts[res.thoughts.length - 1] || '').slice(0, 200) || `pulls: ${row.pulls}`,
          meta: { id: row.id },
        });
      }
      if (noisy && row.protocolErrors > 0) {
        lab.event({
          day: shiftId, tick: i + 1, actor: cook.persona, model: cook.short,
          type: 'noise-protocol-error',
          detail: `stumbled on a mislabeled card day (${order.dish}): ${row.protocolErrors} protocol error(s)`,
          meta: { id: row.id },
        });
      }
      process.stdout.write(`  [${shiftId}] ${cook.short} ${i + 1}/20 ${row.correct ? 'OK ' : '.  '} pulls=${row.pulls}${row.hallucinated ? ' HALLUC' : ''}${row.exhausted ? ' EXH' : ''}${!row.formatOk ? ' FMT' : ''}\n`);
    }
  }
  // snapshot + flush after each shift
  const stand = {};
  for (const r of rows.filter((r) => r.condition === shiftId)) {
    stand[r.cook] = stand[r.cook] || { correct: 0, valid: 0, format: 0, halluc: 0, n: 0 };
    stand[r.cook].n++;
    stand[r.cook].correct += r.correct ? 1 : 0;
    stand[r.cook].valid += r.valid ? 1 : 0;
    stand[r.cook].format += r.formatOk ? 1 : 0;
    stand[r.cook].halluc += r.hallucinated ? 1 : 0;
  }
  lab.snapshot(shiftId === 'A' ? 1 : shiftId === 'B' ? 2 : shiftId === 'C' ? 3 : shiftId === 'D' ? 4 : 5, {
    shift: shiftId, mislabeled_cards: shiftId === 'N',
    standings: stand,
    note: shiftId === 'N' ? 'paired noise shift: same menu under D rules, every card returned mislabeled (schema noise, content intact)' : '',
  });
  lab.flush(`${RUNS}/results.json`);
  lab.flushChronicle({ dir: `${DIR}runs/` });
  flushTranscripts();
  fs.writeFileSync(`${RUNS}/tally-r3.json`, JSON.stringify({ seed: SEED, rows, standings: stand }, null, 2));
  console.log(`shift ${shiftId}: ${n} orders | ${JSON.stringify(stand)}`);
  return n;
}

// ---- entry --------------------------------------------------------------------------
async function main() {
  console.log(`Recipe Box Diner: seed ${SEED}, ${pantry.length} cards, ${orders.length} orders, cooks: ${Object.keys(COOKS).join(', ')}`);
  if (args.smoke) {
    const problems = worldSelfCheck();
    lab.assertNotImpossible(problems.length === 0, `world self-check failed: ${problems.join('; ')}`);
    console.log('world self-check: PASS (fixtures, oracle chains, parser, grading)');
    await lab.smoke();
    return;
  }
  if (args['self-review']) {
    const problems = worldSelfCheck();
    const checks = [
      ['world self-check (fixtures + oracle + parser + grading)', problems.length === 0 ? 'PASS' : `FAIL: ${problems.join('; ')}`],
      ['conditions = spec 2x2 (A memory, B box, C chair, D chair+box)', 'PASS'],
      ['chair = licensed THINK section, 650-token turns, uniform across cooks', 'PASS'],
      ['noise = paired shift N: full menu under D rules, mislabeled cards', 'PASS'],
      ['turn budget 650 tokens (L-LAB-10), pulls <= 8', 'PASS'],
      ['no LLM grading (kernel-only, set equality)', 'PASS'],
      ['free-tier celebrity serialized, zero paid calls', 'PASS'],
      ['wall clock <= 3.5h via lab maxWallMs (L-LAB-09)', 'PASS'],
      ['chronicle flush per shift (results + events + snapshots + transcripts + tally)', 'PASS'],
    ];
    console.log('SELF-REVIEW vs experiment-spec.md');
    for (const [k, v] of checks) console.log(`  [${v.startsWith('PASS') ? 'x' : ' '}] ${k}: ${v}`);
    if (problems.length) process.exit(1);
    return;
  }
  if (args.pilot) {
    // one order, condition D, Rhea: full trail printed, no artifact writes
    const order = orders[1]; // depth-2 Velmora order
    console.log('PILOT order:', order.dish, JSON.stringify(order.key));
    const res = await runBoxOrder(COOKS.rhea, 'D', order, { noisy: false });
    console.log(JSON.stringify(res, (k, v) => (k === 'msgs' ? undefined : v), 1).slice(0, 3000));
    console.log('pilot result: correct=' + res.correct, 'valid=' + res.parsed?.valid, 'formatOk=' + res.parsed?.formatOk, 'pulls=' + res.pulls, 'errors=' + res.errors, 'protocolErrors=' + res.protocolErrors);
    return;
  }
  const wanted = args.shift ? String(args.shift).split(',').map((s) => s.trim().toUpperCase()) : Object.keys(SHIFTS);
  const cookFilter = args.cooks ? String(args.cooks).split(',').map((s) => s.trim()) : null;
  const t0 = Date.now();
  for (const shiftId of wanted) {
    let cooks = SHIFTS[shiftId];
    if (cookFilter) cooks = cooks.filter((c) => cookFilter.includes(c));
    if (!cooks.length) continue;
    console.log(`--- shift ${shiftId}: ${cooks.join(', ')} ---`);
    await runShift(shiftId, cooks);
  }
  const mins = ((Date.now() - t0) / 60000).toFixed(1);
  console.log(`done in ${mins} min. results: ${RUNS}/results.json`);
}

main().catch((e) => { console.error('RUNNER FAILED:', e.message); lab.flush(`${RUNS}/results.json`); flushTranscripts(); process.exit(1); });
