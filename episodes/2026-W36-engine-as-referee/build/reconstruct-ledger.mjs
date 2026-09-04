#!/usr/bin/env node
// reconstruct-ledger.mjs - rebuild results-v3.json + events-v3.jsonl from the
// system of record after the multi-process flush overwrite (build-log row 15).
//
// Sources of truth, in order:
//   studio-state-v3.json   every candidate: seed, engine output, ascii, patches, verdicts, consult scores
//   owner-verdicts-v3.json the owner verdict ledger
//   runs/v3/<model>/transcripts/  one file per LLM call (mtime = honest call clock)
//   tally-v3.json          the graded observables
//
// Every rebuilt row carries rebuilt: true and atSource. Nothing is invented:
// no row exists without a state candidate behind it, and the script FAILS if
// any call lacks its transcript file (the grep-back law).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RUNS = path.join(HERE, 'runs');
const V3 = path.join(RUNS, 'v3');
const st = JSON.parse(fs.readFileSync(path.join(RUNS, 'studio-state-v3.json'), 'utf8'));
const verdicts = JSON.parse(fs.readFileSync(path.join(RUNS, 'owner-verdicts-v3.json'), 'utf8'));
const tally = JSON.parse(fs.readFileSync(path.join(RUNS, 'tally-v3.json'), 'utf8'));

const GEMMA = 'local:gemma3:12b';
const QWEN = 'local:qwen3:8b';
const mtime = (p) => (fs.existsSync(p) ? fs.statSync(p).mtime.toISOString() : null);
const tPath = (model, label) => path.join(V3, model, 'transcripts', `${label}.md`);

function failLine(f) {
  if (!f) return null;
  const cell = f.cell ? ` at (${f.cell[0]},${f.cell[1]})` : '';
  const obj = f.objectId ? ` [${f.objectId}]` : '';
  return `${f.gate}${cell}${obj}: ${f.reason}`;
}

// ---------------------------------------------------------------- calls
const calls = [];
const missingTranscripts = [];
for (const c of st.candidates) {
  const label = `${c.id}-design`;
  const tp = tPath('local-gemma3-12b', label);
  if (!fs.existsSync(tp)) missingTranscripts.push(label);
  calls.push({
    engine: 'local', model: GEMMA, kind: 'design', label,
    ok: true, ms: null, promptTokens: null, completionTokens: null,
    usd: 0, inr: 0, at: mtime(tp), atSource: 'transcript-mtime', rebuilt: true,
    candidate: c.id,
  });
  if (c.consultFeedback) {
    const fl = `consult-${c.id}-fb`;
    const fp = tPath('local-qwen3-8b', fl);
    if (!fs.existsSync(fp)) missingTranscripts.push(fl);
    calls.push({
      engine: 'local', model: QWEN, kind: 'consult', label: fl,
      ok: true, ms: null, promptTokens: null, completionTokens: null,
      usd: 0, inr: 0, at: mtime(fp), atSource: 'transcript-mtime', rebuilt: true,
      candidate: c.id,
    });
  }
  if (c.consultScore !== null) {
    const sl = `consult-${c.id}-score`;
    const sp = tPath('local-qwen3-8b', sl);
    if (!fs.existsSync(sp)) missingTranscripts.push(sl);
    calls.push({
      engine: 'local', model: QWEN, kind: 'consult', label: sl,
      ok: true, ms: null, promptTokens: null, completionTokens: null,
      usd: 0, inr: 0, at: mtime(sp), atSource: 'transcript-mtime', rebuilt: true,
      candidate: c.id,
    });
  }
}
if (missingTranscripts.length) {
  console.error('MISSING TRANSCRIPTS (grep-back law violated, aborting):');
  for (const m of missingTranscripts) console.error('  ' + m);
  process.exit(1);
}
calls.sort((a, b) => String(a.at).localeCompare(String(b.at)));

const count = (model, kind) => calls.filter((c) => c.model === model && (!kind || c.kind === kind)).length;
const results = {
  meta: {
    name: 'studio', tag: 'v3',
    rebuilt: true,
    rebuiltAt: new Date().toISOString(),
    rebuildNote: 'Original per-process flushes overwrote the shared tag file (26 studio.mjs processes, one tag; lab flush was overwrite-mode). Rebuilt from studio-state-v3.json + owner-verdicts-v3.json + tally-v3.json; every call verified against its transcript file. Timestamps are transcript mtimes.',
    models: [
      { model: GEMMA, calls: count(GEMMA), tokens: null, usd: 0, inr: 0, unpricedCalls: 0 },
      { model: QWEN, calls: count(QWEN), tokens: null, usd: 0, inr: 0, unpricedCalls: 0 },
    ],
    startedAt: calls[0]?.at ?? null,
    finishedAt: calls[calls.length - 1]?.at ?? null,
    inrPerUsd: 94.97,
    chronicleEvents: 0, worldSnapshots: 6,
  },
  models: [
    { model: GEMMA, calls: count(GEMMA), tokens: null, promptTokens: null, completionTokens: null, usd: 0, inr: 0, unpricedCalls: 0 },
    { model: QWEN, calls: count(QWEN), tokens: null, promptTokens: null, completionTokens: null, usd: 0, inr: 0, unpricedCalls: 0 },
  ],
  warnings: [],
  calls,
};

// ---------------------------------------------------------------- events
// Keep the 3 surviving live events (dedupe on candidate id in detail), rebuild the rest.
const eventsPath = path.join(RUNS, 'events-v3.jsonl');
let live = [];
if (fs.existsSync(eventsPath)) {
  live = fs.readFileSync(eventsPath, 'utf8').split('\n').filter(Boolean)
    .map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
}
const liveIds = new Set(live.map((e) => String(e.detail || '').split(':')[0]));

const events = [];
for (const c of st.candidates) {
  if (liveIds.has(c.id)) continue; // live chronicle already covers this candidate
  const at = mtime(tPath('local-gemma3-12b', `${c.id}-design`));
  events.push({
    at, atSource: 'transcript-mtime', rebuilt: true,
    day: c.brief, tick: c.attempt,
    actor: `Rhea (${c.arm} desk)`, model: GEMMA,
    type: c.engine.pass ? (c.revisionOf ? 'revision' : 'submission') : 'engine-reject',
    detail: `${c.id}: ${c.engine.pass ? (c.revisionOf ? 'revision passed gates' : `passed gates, bot walked ${c.engine.bot?.steps ?? '?'} steps`) : failLine(c.engine.failure)}`,
    quote: c.pitch,
  });
  if (c.consultFeedback) {
    events.push({
      at: mtime(tPath('local-qwen3-8b', `consult-${c.id}-fb`)), atSource: 'transcript-mtime', rebuilt: true,
      day: c.brief, tick: c.attempt,
      actor: 'Vibe consultant', model: QWEN, type: 'consult-note',
      detail: `${c.id}-fb: ${c.consultFeedback.slice(0, 160)}`,
      quote: c.consultFeedback,
    });
  }
  const v = verdicts[c.id];
  if (v) {
    const vat = mtime(tPath('local-gemma3-12b', `${c.id}-rev-design`))
      ?? mtime(tPath('local-qwen3-8b', `consult-${c.id}-score`))
      ?? at;
    events.push({
      at: vat, atSource: 'applied-in-revise/finalize; transcript-mtime proxy', rebuilt: true,
      day: c.brief, tick: c.attempt,
      actor: 'Studio head', model: 'human', type: 'owner-verdict',
      detail: `${c.id}: ${v.accept ? 'ACCEPTED' : 'rejected'} - ${v.reason}`,
      quote: v.reason,
    });
  }
  if (c.consultScore !== null) {
    events.push({
      at: mtime(tPath('local-qwen3-8b', `consult-${c.id}-score`)), atSource: 'transcript-mtime', rebuilt: true,
      day: c.brief, tick: c.attempt,
      actor: 'Vibe consultant', model: QWEN, type: 'consult-score',
      detail: `${c.id}: SCORE ${c.consultScore}/10`,
      quote: c.consultLine || null,
    });
  }
}
const tallyAt = mtime(path.join(RUNS, 'tally-v3.json'));
events.push({
  at: tallyAt, atSource: 'file-mtime', rebuilt: true,
  day: 6, tick: 6, actor: 'The engine', model: 'deterministic', type: 'run-closed',
  detail: `run closed: ${st.candidates.length} submissions, ${calls.length} model calls, INR 0; owner accepted ${Object.values(verdicts).filter((v) => v.accept).length} of ${Object.keys(verdicts).length} verdicts; consultant scored 8+ on ${tally.receipts.length} engine-failed levels`,
  quote: 'the engine never argues; it just is right',
});

const all = live.concat(events).sort((a, b) => String(a.at ?? '').localeCompare(String(b.at ?? '')));
all.forEach((e, i) => { e.seq = i + 1; });

fs.writeFileSync(path.join(RUNS, 'results-v3.json'), JSON.stringify(results, null, 2) + '\n');
fs.writeFileSync(eventsPath, all.map((e) => JSON.stringify(e)).join('\n') + '\n');

console.log(`results-v3.json: ${calls.length} calls (design ${count(GEMMA)}, consult ${count(QWEN)}), INR 0, rebuilt`);
console.log(`events-v3.jsonl: ${all.length} events (${live.length} live + ${events.length} rebuilt)`);
console.log(`transcript coverage: ${calls.length}/${calls.length} verified`);
