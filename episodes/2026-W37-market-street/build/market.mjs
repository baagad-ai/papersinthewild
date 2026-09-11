#!/usr/bin/env node
// market.mjs - Market Street orchestrator for episode 2026-W37.
// Drives the deterministic world (world.mjs) with the 12-shop cast through
// tools/lab-core.mjs. Contract: ../experiment-spec.md; world bible: ../scenario.md.
//
// Usage:
//   node build/market.mjs --calibrate             economy-only check, no model calls
//   node build/market.mjs --smoke                 lab-core smoke over the cast
//   node build/market.mjs --days=2 --tag=trial    short real run (all 12 shops)
//   node build/market.mjs --tag=season1           full 30-day season
//   node build/market.mjs --tag=season1 --resume  continue after a session handoff
//
// The session stall (My Stall) pauses the runner: it writes a request file and
// exits 42. The live session agent writes the response file and resumes.
// State: build/runs/<tag>/state.json. Receipts: results/events/world/transcripts.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createLab } from '../../../../../tools/lab-core.mjs';
import * as W from './world.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const EPISODE = path.resolve(HERE, '..');
const ROOT = path.resolve(HERE, '../../../../..');
const RUNS = path.join(HERE, 'runs');

// ---------------------------------------------------------------- cast
export const CAST = [
  { id: 'kettle', persona: 'The Kettle', spec: 'local:qwen3:8b', badge: 'Qwen 3 8B (local)' },
  { id: 'coldcorner', persona: 'Cold Corner', spec: 'local:qwen3.5:9b', badge: 'Qwen 3.5 9B (local)' },
  { id: 'sunbeam', persona: 'Sunbeam Sundries', spec: 'local:gemma3:12b', badge: 'Gemma 3 12B (local)' },
  { id: 'pocket', persona: 'Pocket Mart', spec: 'local:phi4-mini:latest', badge: 'phi4-mini (local)' },
  { id: 'halfpint', persona: 'Half-Pint Store', spec: 'local:llama3.2:3b', badge: 'Llama 3.2 3B (local)' },
  { id: 'longcounter', persona: 'The Long Counter', spec: 'local:mistral:7b', badge: 'Mistral 7B (local)' },
  { id: 'lantern', persona: 'Lantern Goods', spec: 'or:z-ai/glm-5.3-flash', promptStyle: 'compact', alts: ['or:z-ai/glm-4.7-flash'], maxPlanTokens: 3000, badge: 'GLM-5.3-Flash (OpenRouter)' },
  { id: 'highstreet', persona: 'High Street Traders', spec: 'or:z-ai/glm-4.7-flash', alts: ['or:z-ai/glm-5.3-flash'], maxPlanTokens: 2000, badge: 'GLM-4.7-Flash (OpenRouter)' },
  { id: 'garden', persona: 'Garden Gate', spec: 'or:nvidia/nemotron-3-super-120b-a12b:free', alts: ['or:google/gemma-4-31b-it'], maxPlanTokens: 3000, badge: 'Nemotron 3 Super 120B (free endpoint; paid Gemma 4 fallback)' },
  { id: 'lucky', persona: 'Lucky Ledger', spec: 'or:deepseek/deepseek-v4-flash', alts: ['or:~deepseek/deepseek-v4-flash-latest'], maxPlanTokens: 2000, badge: 'DeepSeek V4 Flash (OpenRouter)' },
  { id: 'mystall', persona: 'Corner Cart', spec: 'or:z-ai/glm-5.3-flash', promptStyle: 'compact', alts: ['or:z-ai/glm-4.7-flash'], maxPlanTokens: 3000, badge: 'GLM-5.3-Flash (OpenRouter)' },
  { id: 'highnoon', persona: 'High Noon', spec: 'or:openai/gpt-5.6-sol', maxPlanTokens: 1800, maxReplyTokens: 400, maxCallsPerDay: 4, badge: 'GPT-5.6 Sol (frontier guest)' },
];

// Contamination guard (season3 post-mortem): a stall played through the
// session harness could read this rig's own source (supplier floors, scam
// list, calendar) from the authoring context. That is answer-key access and
// it is how the house agent won season3. The harness stays in the code for
// archaeology only; a season refuses to start with it unless explicitly
// unlocked for a rig that cannot see the world's source.
const CRIER_SPEC = 'local:gemma3:12b';

// ---------------------------------------------------------------- args
const args = process.argv.slice(2);
const flag = (name, d = null) => {
  const hit = args.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
  if (!hit) return d;
  const i = hit.indexOf('=');
  return i === -1 ? true : hit.slice(i + 1);
};
const DAYS = Number(flag('days', 30));
const TAG = String(flag('tag', 'season1'));
const RESUME = Boolean(flag('resume'));

// Contamination guard (season3 post-mortem): a stall played through the
// session harness could read this rig's own source (supplier floors, scam
// list, calendar) from the authoring context. That is answer-key access and
// it is how the house agent won season3. The harness stays in the code for
// archaeology only; a season refuses to start with it unless explicitly
// unlocked for a rig that cannot see the world's source.
if (!flag('allow-session-handoff', false) && CAST.some((s) => String(s.spec).startsWith('session:'))) {
  console.error('REFUSING TO RUN: a stall uses the session: handoff harness. The playing agent can read this rig source, which contaminates the season (see season3). Pass --allow-session-handoff only if the harness agent provably cannot see the rig source.');
  process.exit(1);
}
const CALIBRATE = Boolean(flag('calibrate'));
const MOCK = Boolean(flag('mock'));
const SMOKE = Boolean(flag('smoke'));
const SIM = MOCK || CALIBRATE; // no model calls: mock policies drive the world
const NO_CRIER = Boolean(flag('no-crier')) || SIM;
const SEED = 20260910;
const RUN_DIR = path.join(RUNS, TAG);
const STATE_FILE = path.join(RUN_DIR, 'state.json');
const HANDOFF_DIR = path.join(RUN_DIR, 'handoff');

function log(...a) { console.log(...a); }
let saveSeq = 0;
function saveJson(file, obj) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp-${process.pid}-${saveSeq++}`;
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 2) + '\n');
  fs.renameSync(tmp, file);
}
function readJson(file, d = null) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return d; }
}

// ---------------------------------------------------------------- prompts
function catSkus(cat) { return W.SKUS_BY_CAT[cat] || []; }

function compactPrompt(shop) {
  const refs = Object.keys(W.SKUS_BY_CAT).map(
    (c) => `${c}: ` + W.SKUS_BY_CAT[c].map((s) => `${s.id}=${s.ref}`).join(' ')
  ).join('\n');
  const sups = W.SUPPLIERS.map((s) => `${s.id}(${s.cats.join(',')})`).join(' ');
  return `You are ${shop.persona}, an AI running one stall on Market Street for ${DAYS} days. Your model: ${shop.badge}. Goal: most money at close.
Money: bank pays all; sales sit in escrow 3 days then wallet; withdraw moves wallet to bank; 5 negative days closes you. Costs: 50/day + 2 per unit stored. Reputation multiplies demand; unshipped orders cancel after 2 days. Some suppliers cheat.
Reference prices (sku=price):
${refs}
Suppliers: ${sups}
Actions (JSON objects in order, cost minutes): check_books 10, check_stock 10, check_street 10, read_memory 5, set_prices {"sku-id":price} 20, order {"supplier":"id","sku":"id","qty":N,"offerPerUnit":X,"maxPerUnit":Y} 30, ship {"freight":"standard|express"} 20, withdraw {"amount":N} 10, memory {"op":"add","title":"..","content":".."} 0, open_second {"category":".."} 60.
Day 1 must include "category": drinks | rain | snacks | acc.
Reply with ONE JSON object only, no prose: {"category":"..","actions":[...],"note":".."}`;
}

function systemPrompt(shop, style = 'big') {
  if (style === 'compact') return compactPrompt(shop);
  const supplierLines = W.SUPPLIERS.map(
    (s) => `- ${s.id}: ${s.name} (${s.cats.join(', ')})`
  ).join('\n');
  const catalogLines = Object.keys(W.CATEGORIES).map((c) => {
    const rows = W.SKUS_BY_CAT[c].map((s) => `${s.id}=${s.ref}`).join(' ');
    return `${c}: ${rows}`;
  }).join('\n');
  return `You are ${shop.persona}, an AI running one stall on Market Street. Your model: ${shop.badge}. You buy stock from suppliers, set your prices, ship orders, and manage money. The season lasts ${DAYS} days. Goal: finish with the most money.

RULES
- Bank pays everything instantly. Sales go to escrow for 3 days, then to your wallet; only a withdraw action moves wallet money to the bank. Five straight days with negative bank balance closes you.
- Daily costs: 50 rupees operating + 2 per unit in stock. Second stall: 8000 setup + 150 per day.
- Reputation 0.15 to 1.0 multiplies your demand. Unshipped orders cancel after 2 days.
- Some suppliers are dishonest (hidden fees, short deliveries, defective goods). Opening quotes never reveal it.
- You get 600 action minutes per day; actions over budget are cut off. Prices you can set: 30% to 250% of reference. Reference prices are public; supplier cost floors are hidden.
CATALOG (sku=reference price)
${catalogLines}
SUPPLIERS (id: name, categories)
${supplierLines}
ACTIONS (JSON objects, in order, each costs minutes)
{"type":"check_books"} 10 extra cash detail
{"type":"check_stock"} 10 extra stock detail
{"type":"check_street"} 10 competitors' prices
{"type":"read_memory"} 5 your notebook
{"type":"set_prices","prices":{"sku-id":price}} 20
{"type":"order","supplier":"id","sku":"sku-id","qty":N,"offerPerUnit":X,"maxPerUnit":Y} 30 negotiation
{"type":"ship","freight":"standard"|"express"} 20
{"type":"withdraw","amount":N} 10
{"type":"memory","op":"add"|"update"|"delete","index":N,"title":"...","content":"..."} 0
{"type":"open_second","category":"drinks|rain|snacks|acc"} 60
Categories: drinks, rain, snacks, acc.
Reply with ONE JSON object only, no other text:
{"actions":[...],"note":"one line about your plan"}`;
}

function digestFor(shop, opts = {}) {
  const s = shop;
  const lines = [];
  const todaysEvents = opts.events || [];
  lines.push(`DAY ${opts.day} of ${DAYS}.${todaysEvents.length ? ' Event: ' + todaysEvents.map((e) => e.label).join(', ') + '.' : ''}`);
  if (!s.cats.length) {
    lines.push('You have NOT chosen your category yet. Add "category" to your plan: drinks | rain | snacks | acc. You cannot sell before choosing.');
  }
  lines.push(`Cash: bank ₹${s.bank.toFixed(2)} | wallet ₹${s.wallet.toFixed(2)} | escrow ₹${s.escrowTotal().toFixed(2)}`);
  lines.push(`Reputation: ${s.rep.toFixed(2)}`);
  const stock = Object.entries(s.stock).filter(([, q]) => q > 0)
    .map(([k, q]) => `${k} ${q}${s.defectiveStock[k] ? '(defective ' + s.defectiveStock[k] + ')' : ''}`).join(', ');
  lines.push(`Stock: ${stock || 'empty'}`);
  if (s.cats.length && !Object.values(s.stock).some((q) => q > 0)) {
    lines.push('Stock note: you have no sellable stock; nothing sells until you order and receive goods.');
  }
  if (s.cats.length) {
    const priceLine = Object.entries(s.prices).filter(([k]) => s.cats.includes(W.SKU_BY_ID[k]?.cat))
      .map(([k, p]) => `${k}=${p}`).join(', ');
    lines.push(`Your prices: ${priceLine || 'not set'}`);
  }
  const pending = s.pendingOrders.filter((o) => !o.shipped && !o.cancelled);
  if (pending.length) lines.push(`Pending shipments: ${pending.reduce((a, o) => a + o.qty, 0)} units (oldest day ${Math.min(...pending.map((o) => o.placedDay))})`);
  if (s.lastDay) {
    const l = s.lastDay;
    lines.push(`Yesterday: sold ${l.sold} units for ₹${l.revenue.toFixed(0)}; returns ${l.returns}; shipped ${l.shippedUnits} units; fees ₹${l.fees.toFixed(0)}; minutes ${l.minutes}/600.`);
  }
  if (s.messages && s.messages.length) lines.push(`Supplier messages: ${s.messages.join(' | ')}`);
  if (opts.extraBooks) lines.push(`Books detail: next escrow maturity day ${opts.extraBooks.nextMaturity ?? '-'} for ₹${opts.extraBooks.amount ?? 0}.`);
  if (opts.extraStreet) lines.push(`Street: ${opts.extraStreet}`);
  if (opts.notebook) lines.push(`Notebook: ${opts.notebook}`);
  if (s.evictions > 0) lines.push(`Context: ${s.evictions} earlier day(s) trimmed from your history.`);
  lines.push('Reply with your day plan JSON only.');
  return lines.join('\n');
}

function replyPrompt(shop, facts) {
  const fee = facts.feeDemand
    ? ` The supplier demands a ₹${facts.feeDemand} membership fee before quoting. To pay it and continue, include "payFee":true.`
    : '';
  const decisionHint = facts.feeDemand
    ? `If you pay the fee, the quote will be ₹${facts.openP}/unit; your options are {"payFee":true,"decision":"accept"} or {"payFee":true,"decision":"counter","counter":X} or abort.`
    : `Options: {"decision":"accept"} pays ₹${facts.counterP}/unit; {"decision":"counter","counter":X} offers X per unit (supplier may walk); {"decision":"abort"} ends it.`;
  return `You are ${shop.persona}. Mid-negotiation with ${facts.supplierName} for ${facts.skuName}. Reference price ₹${facts.ref}. You offered ₹${facts.offer}, your maximum was ₹${facts.maxPrice}. The supplier countered at ₹${facts.counterP}.${fee} ${decisionHint} Reply with ONE JSON object only.`;
}

// ---------------------------------------------------------------- state
function newShop(def, day0) {
  return {
    id: def.id, persona: def.persona, spec: def.spec, specAlt: def.alt || null,
    specAlts: def.alts || (def.alt ? [def.alt] : []),
    badge: def.badge, session: !!def.session,
    altCalls: 0, promptStyle: def.promptStyle || 'big', callsToday: 0,
    maxCallsPerDay: def.maxCallsPerDay || (def.session || (def.spec || '').startsWith('local:') ? 8 : 6),
    maxPlanTokens: def.maxPlanTokens || null, maxReplyTokens: def.maxReplyTokens || null,
    cats: [], secondOpen: false,
    bank: 100000, wallet: 0, escrow: [],
    stock: {}, defectiveStock: {}, stockCost: {}, prices: {},
    rep: 0.7, memory: [], messages: [], pendingOrders: [],
    minutesSpent: 0, calls: 0, evictions: 0, closed: false, bankrupt: false, negDays: 0,
    checks: {}, lastDay: null, dealPrices: {},
    fraudLoss: { fee: 0, short: 0, defective: 0 }, scamSessions: 0,
    lostUnits: 0, stockoutDays: 0, cancelledUnits: 0, returnedUnits: 0, shippedUnits: 0,
    minBank: 100000, feesPaid: 0, salesRevenue: 0, orderSpend: 0,
    escrowTotal() { return this.escrow.reduce((a, e) => a + e.amount, 0); },
  };
}

function newState() {
  const world = W.createWorld({ seed: SEED, maxDays: DAYS });
  for (const def of CAST) world.shops[def.id] = newShop(def, 0);
  return {
    tag: TAG, seed: SEED, maxDays: DAYS, day: 0, startedAt: new Date().toISOString(),
    world, arrivals: [], pending: null, sessionCalls: 0,
    contexts: Object.fromEntries(CAST.map((c) => [c.id, []])),
    evictions: 0, dayStarted: false, doneShops: [],
  };
}

function rebuildShopFuncs(world) {
  for (const s of Object.values(world.shops)) {
    if (typeof s.escrowTotal !== 'function') {
      s.escrowTotal = function () { return this.escrow.reduce((a, e) => a + e.amount, 0); };
    }
    if (typeof s.callsToday !== 'number') s.callsToday = 0;
    if (typeof s.maxCallsPerDay !== 'number') s.maxCallsPerDay = (s.session || String(s.spec || '').startsWith('local:')) ? 8 : 6;
    if (!Array.isArray(s.specAlts)) s.specAlts = s.specAlt ? [s.specAlt] : [];
  }
}

// ---------------------------------------------------------------- lab
let lab = null;
function getLab() {
  if (lab) return lab;
  const specs = CAST.filter((c) => !c.session).map((c) => c.spec);
  lab = createLab({
    name: 'market-street', tag: TAG, models: specs,
    runsDir: RUN_DIR,
    estimateTokens: { in: 2200, out: 400 },
    maxWallMs: 5 * 60 * 60 * 1000,
  });
  return lab;
}

const MODEL_NAME = (spec) => spec.replace(/^[a-z]+:/, '');

// ---------------------------------------------------------------- model calls
async function tryAlt(shop, L, messages, temperature, maxTokens, meta) {
  const alts = (shop.specAlts && shop.specAlts.length ? shop.specAlts : (shop.specAlt ? [shop.specAlt] : []));
  for (const alt of alts) {
    try {
      const r = await L.call({ model: alt, messages, temperature, maxTokens, meta: { ...meta, alt } });
      shop.altCalls++;
      shop.callsToday++;
      L.warn('alt-used', `${shop.id} fell back to ${alt}`);
      return r;
    } catch (err) {
      L.warn('alt-failed', `${shop.id} ${alt}: ${err.message.slice(0, 80)}`);
    }
  }
  return null;
}

function silentJson(text) {
  try { return JSON.parse(text); } catch { /* fall through */ }
  const m = String(text).match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch { /* give up */ } }
  return null;
}

async function callPlan(shop, state, digest, opts = {}) {
  const L = getLab();
  const style = shop.promptStyle || 'big';
  const budget = shop.maxPlanTokens || (shop.spec.startsWith('local:') ? 700 : 2000);
  const ctx = state.contexts[shop.id] || [];
  const messages = [{ role: 'system', content: systemPrompt(shop, style) }, ...ctx, { role: 'user', content: digest }];
  const meta = { shop: shop.id, day: state.day, kind: opts.kind || 'plan' };
  const thinkOpt = shop.spec.startsWith('local:') ? { think: false } : {};
  let resp;
  try {
    resp = await L.call({ model: shop.spec, messages, temperature: 0.6, maxTokens: budget, meta, ...thinkOpt });
  } catch (err) {
    resp = await tryAlt(shop, L, messages, 0.6, budget, meta);
    if (!resp) {
      L.warn(err.quota ? 'quota-exhausted' : 'plan-call-failed', `${shop.id}: ${err.message}`);
      return { plan: null, raw: '', messages, error: err.message };
    }
  }
  if (resp) shop.callsToday++;
  const raw = resp.text || '';
  let plan = L.parseJson(raw);
  if ((!plan || !Array.isArray(plan.actions)) && resp.reasoning) {
    const rescued = silentJson(resp.reasoning);
    if (rescued && Array.isArray(rescued.actions)) {
      L.warn('answered-in-reasoning', `${shop.id} day ${state.day}`);
      plan = rescued;
    }
  }
  if (!plan || !Array.isArray(plan.actions)) {
    // one repair attempt, pointed
    const repairMsg = digest + '\nYour previous reply was not valid JSON. Reply with ONE JSON object: {"actions":[...],"note":"..."}';
    try {
      const retry = await L.call({
        model: shop.spec,
        messages: [{ role: 'system', content: systemPrompt(shop, style) }, { role: 'user', content: repairMsg }],
        temperature: 0.2, maxTokens: budget, meta: { ...meta, repair: true }, ...thinkOpt,
      });
      shop.callsToday++;
      plan = L.parseJson(retry.text || '');
      if (plan && Array.isArray(plan.actions)) {
        writeTranscript(shop, state.day, 'plan-repair', [{ role: 'user', content: repairMsg }], retry.text, meta);
        return { plan, raw: retry.text || '', error: null };
      }
    } catch (err) { L.warn('plan-repair-failed', `${shop.id}: ${err.message}`); }
    L.warn('malformed-plan', `${shop.id} day ${state.day}: ${raw.slice(0, 120)}`);
    return { plan: null, raw, error: 'malformed' };
  }
  return { plan, raw, error: null };
}

async function callReply(shop, state, facts) {
  const L = getLab();
  const prompt = replyPrompt(shop, facts);
  const budget = shop.maxReplyTokens || (shop.spec.startsWith('local:') ? 300 : 600);
  const messages = [
    { role: 'system', content: `You are ${shop.persona}, mid-negotiation. Reply with ONE JSON object only.` },
    { role: 'user', content: prompt },
  ];
  try {
    let resp;
    try {
      resp = await L.call({ model: shop.spec, messages, temperature: 0.3, maxTokens: budget, meta: { shop: shop.id, day: state.day, kind: 'reply' }, ...(shop.spec.startsWith('local:') ? { think: false } : {}) });
    } catch (err) {
      resp = await tryAlt(shop, L, messages, 0.3, budget, { shop: shop.id, day: state.day, kind: 'reply' });
      if (!resp) {
        L.warn('reply-call-failed', `${shop.id}: ${err.message}`);
        return { decision: 'abort', reason: 'call failed' };
      }
    }
    shop.callsToday++;
    let dec = L.parseJson(resp.text || '');
    if ((!dec || !dec.decision) && resp.reasoning) {
      const rescued = silentJson(resp.reasoning);
      if (rescued && rescued.decision) dec = rescued;
    }
    if (!dec || !dec.decision) {
      L.warn('malformed-reply', `${shop.id}: ${(resp.text || '').slice(0, 100)}`);
      return { decision: 'abort', reason: 'malformed reply' };
    }
    writeTranscript(shop, state.day, 'reply-' + facts.supplierId, messages, resp.text, {});
    return dec;
  } catch (err) {
    L.warn('reply-call-failed', `${shop.id}: ${err.message}`);
    return { decision: 'abort', reason: 'call failed' };
  }
}

function templateRender(facts) {
  const lines = [];
  if (facts.feeDemand) lines.push(`${facts.supplierName}: Want wholesale prices? Join the club first, ₹${facts.feeDemand}.`);
  else lines.push(`${facts.supplierName}: ${facts.skuName}, opening at ₹${facts.openP} per unit.`);
  lines.push(`Buyer: I can do ₹${facts.offer}.`);
  if (facts.dealPrice) lines.push(`${facts.supplierName}: Done, ₹${facts.dealPrice} per unit.`);
  else lines.push(`${facts.supplierName}: I cannot go that low, we are done here.`);
  return lines.join(' ');
}

async function renderCrier(state, facts) {
  if (NO_CRIER) return facts.phase.startsWith('deal') ? `[deal at ₹${facts.dealPrice}]` : `[${facts.phase}]`;
  const L = getLab();
  const summary = JSON.stringify({
    supplier: facts.supplierName, sku: facts.skuName, reference: facts.ref,
    floor: facts.floorP, opened: facts.openP, countered: facts.counterP,
    buyerOffer: facts.offer, buyerMax: facts.maxPrice, outcome: facts.phase,
    dealPrice: facts.dealPrice ?? null, fee: facts.feeDemand ?? null,
  });
  const messages = [
    { role: 'system', content: 'You are the Market Crier, the voice of suppliers on Market Street. Render a short dialogue (2 to 4 lines: supplier, buyer, supplier) from the facts. Use the exact numbers given, do not invent prices, no commentary. Plain text.' },
    { role: 'user', content: summary },
  ];
  try {
    const resp = await L.call({ model: CRIER_SPEC, messages, temperature: 0.8, maxTokens: 650, meta: { shop: 'crier', day: state.day, kind: 'render' } });
    let text = (resp.text || '').trim();
    if (!text && resp.reasoning) {
      // GLM flash sometimes answers inside the reasoning trace; keep only
      // dialogue-shaped lines so analysis notes do not leak into the chronicle.
      const tail = resp.reasoning.split('\n').map((l) => l.trim())
        .filter((l) => l.length > 15 && l.length < 220)
        .filter((l) => !/\b(I should|we should|we need|maybe I|perhaps|actually|let me|I think)\b/i.test(l))
        .filter((l) => /[:"]/.test(l));
      if (tail.length) text = tail.slice(-3).join(' ');
    }
    if (!text) throw new Error('empty render');
    // Validator: every number in the render must appear in the facts (rounded).
    const factNums = new Set();
    for (const v of [facts.ref, facts.floorP, facts.openP, facts.counterP, facts.offer, facts.maxPrice, facts.dealPrice]) {
      if (v == null) continue;
      factNums.add(Math.round(Number(v)));
      factNums.add(Math.round(Number(v) * 10) / 10);
    }
    const found = text.match(/\d+(?:\.\d+)?/g) || [];
    // only price-like numbers (> 20) must trace back to kernel facts; small
    // narrative numbers ("2 units", "3 days") are allowed.
    const foreign = found.filter((n) => Number(n) > 20).filter((n) => {
      const r = Math.round(Number(n));
      return !factNums.has(r) && !factNums.has(Math.round(Number(n) * 10) / 10);
    });
    if (foreign.length > 1) { // allow a stray day number
      L.warn('render-mismatch', `${foreign.join(',')} not in facts`);
      return templateRender(facts);
    }
    writeTranscriptRaw(state, 'crier', `day-${String(state.day).padStart(2, '0')}-${facts.shopId || 'shop'}-${facts.supplierId}`, messages, text, {});
    return text;
  } catch (err) {
    L.warn('render-failed', err.message);
    return templateRender(facts);
  }
}

function writeTranscript(shop, day, kind, messages, response, meta) {
  if (!shop) return;
  const file = path.join(RUN_DIR, 'shops', shop.id, `day-${String(day).padStart(2, '0')}-${kind}.md`);
  const L = getLab();
  L.writeTranscript(file, { label: `${shop.persona} day ${day} ${kind}`, model: shop.spec, messages, response, meta });
}
function writeTranscriptRaw(state, actor, kind, messages, response, meta) {
  const file = path.join(RUN_DIR, 'shops', actor, `${kind}.md`);
  const L = getLab();
  L.writeTranscript(file, { label: `${actor} ${kind}`, model: CRIER_SPEC, messages, response, meta });
}

// ---------------------------------------------------------------- session handoff
function handoffRequest(state, kind, payload) {
  fs.mkdirSync(HANDOFF_DIR, { recursive: true });
  const reqFile = path.join(HANDOFF_DIR, `${kind}-day${String(state.day).padStart(2, '0')}-request.json`);
  const resFile = path.join(HANDOFF_DIR, `${kind}-day${String(state.day).padStart(2, '0')}-response.json`);
  saveJson(reqFile, payload);
  state.pending = { kind, reqFile, resFile };
  saveJson(STATE_FILE, serializable(state));
  const L = getLab();
  L.flush(path.join(RUN_DIR, `results-${TAG}.json`), { merge: true });
  L.flushChronicle({ dir: RUN_DIR });
  log(`HANDOFF: ${kind} needed for ${payload.persona || 'My Stall'} on day ${state.day}.`);
  log(`  request:  ${path.relative(ROOT, reqFile)}`);
  log(`  response: ${path.relative(ROOT, resFile)}`);
  process.exit(42);
}

function serializable(state) {
  return {
    tag: state.tag, seed: state.seed, maxDays: state.maxDays, day: state.day,
    startedAt: state.startedAt, world: state.world, arrivals: state.arrivals,
    pending: state.pending, sessionCalls: state.sessionCalls,
    contexts: state.contexts, evictions: state.evictions,
    dayStarted: state.dayStarted, doneShops: state.doneShops,
  };
}

async function getReply(state, shop, facts, action) {
  if (SIM) return { decision: 'accept' };
  if (shop.session) {
    // My Stall pre-registers its negotiation fallback in the day plan; the
    // runner applies it when the counter lands, so no mid-day pause is needed.
    const fb = action && action.fallback ? action.fallback : { decision: 'abort' };
    return fb;
  }
  return callReply(shop, state, facts);
}

// ---------------------------------------------------------------- actions
// Accept several model quirks: {"type":...} is canonical; {"action":...} is
// GLM style; a bare {"check_street":true} or {"set_prices":{...}} is tolerated.
function normalizeAction(a) {
  if (!a || typeof a !== 'object') return null;
  let kind = a.type || a.action || a.op; // type / action / op all seen in the wild
  if (!kind) {
    const known = Object.keys(a).filter((k) => W.MINUTES[k] !== undefined);
    if (known.length === 1) {
      kind = known[0];
      const v = a[kind];
      const rest = v && typeof v === 'object' ? v : {};
      return { type: kind, ...rest };
    }
    return null;
  }
  return { ...a, type: kind };
}

async function processPlan(state, shop, plan) {
  const L = getLab();
  const day = state.day;
  let minutes = 0;
  const actions = Array.isArray(plan.actions) ? plan.actions : [];
  let truncated = false;
  const info = { extraBooks: null, extraStreet: null, notebook: null };
  shop.checks = {};

  // Category choice happens before any action (day 1 for most shops; a shop
  // that failed to choose can pick on a later day).
  if (plan.category && !shop.cats.length && W.CATEGORIES[plan.category]) {
    shop.cats.push(plan.category);
    L.event({ day, actor: shop.id, model: shop.badge, type: 'category', detail: `chose ${plan.category}` });
  }

  for (const raw of actions) {
    const a = normalizeAction(raw);
    if (!a) { L.warn('bad-action', `${shop.id}: ${JSON.stringify(raw).slice(0, 90)}`); continue; }
    const cost = W.MINUTES[a.type] ?? 0;
    if (minutes + cost > W.MAX_MINUTES) { truncated = true; break; }
    minutes += cost;
    if (a.type === 'check_books') { shop.checks.books = true; }
    else if (a.type === 'check_stock') { shop.checks.stock = true; }
    else if (a.type === 'check_street') { shop.checks.street = true; }
    else if (a.type === 'read_memory') { shop.checks.memory = true; }
    else if (a.type === 'set_prices') {
      for (const [skuId, price] of Object.entries(a.prices || {})) {
        const sku = W.SKU_BY_ID[skuId];
        if (!sku || !shop.cats.includes(sku.cat)) continue;
        const p = Number(price);
        if (!Number.isFinite(p) || p <= 0) continue;
        const clamped = Math.max(sku.ref * 0.3, Math.min(sku.ref * 2.5, p));
        shop.prices[skuId] = +clamped.toFixed(2);
        L.event({ day, actor: shop.id, model: shop.badge, type: 'price', detail: `${skuId} = ₹${shop.prices[skuId]}${clamped !== p ? ' (clamped)' : ''}` });
      }
    } else if (a.type === 'order') {
      await processOrder(state, shop, a, info);
    } else if (a.type === 'ship') {
      const freight = a.freight === 'express' ? 'express' : 'standard';
      const before = shop.pendingOrders.filter((o) => !o.shipped && !o.cancelled && o.placedDay < day);
      const cost = W.shipOrders(state.world, shop, freight);
      shop.shippedUnits += before.reduce((x, o) => x + o.qty, 0);
      shop._shippedToday = (shop._shippedToday || 0) + before.reduce((x, o) => x + o.qty, 0);
      shop.bank -= cost;
      if (before.length) shop.rep = Math.min(1, shop.rep + 0.01);
      L.event({ day, actor: shop.id, model: shop.badge, type: 'ship', detail: `${before.length} orders, ${freight}, freight ₹${cost.toFixed(0)}` });
    } else if (a.type === 'withdraw') {
      const amt = Math.max(0, Math.min(shop.wallet, Number(a.amount) || 0));
      shop.wallet -= amt; shop.bank += amt;
      if (amt > 0) L.event({ day, actor: shop.id, model: shop.badge, type: 'withdraw', detail: `₹${amt.toFixed(0)} wallet to bank` });
    } else if (a.type === 'memory') {
      const op = a.op || 'add';
      if (op === 'add' && shop.memory.length < 20) shop.memory.push({ title: String(a.title || '').slice(0, 60), content: String(a.content || '').slice(0, 240), day });
      else if (op === 'update' && Number.isInteger(a.index) && shop.memory[a.index]) { shop.memory[a.index].content = String(a.content || '').slice(0, 240); shop.memory[a.index].day = day; }
      else if (op === 'delete' && Number.isInteger(a.index)) shop.memory.splice(a.index, 1);
      else L.warn('memory-op-failed', `${shop.id} ${op} len=${shop.memory.length}`);
      L.event({ day, actor: shop.id, model: shop.badge, type: 'memory', detail: `${op}: ${String(a.title || '').slice(0, 60)}` });
    } else if (a.type === 'open_second') {
      const cat = a.category;
      if (W.CATEGORIES[cat] && !shop.cats.includes(cat)) {
        if (!shop.cats.length) {
          // a stall must exist before a second one; treat as the first category
          shop.cats.push(cat);
          L.event({ day, actor: shop.id, model: shop.badge, type: 'category', detail: `chose ${cat} (open_second read as first stall)` });
        } else if (!shop.secondOpen && shop.bank >= W.SECOND_STALL_SETUP) {
          shop.bank -= W.SECOND_STALL_SETUP; shop.cats.push(cat); shop.secondOpen = true;
          L.event({ day, actor: shop.id, model: shop.badge, type: 'second_stall', detail: `opened in ${cat} for ₹${W.SECOND_STALL_SETUP}` });
        }
      }
    }
  }
  shop.minutesSpent += minutes;
  if (truncated) L.warn('minutes-truncated', `${shop.id} day ${day}`);
  shop.lastMinutes = minutes;
  shop.planNote = String(plan.note || '').slice(0, 200);
  return { minutes, truncated };
}

async function processOrder(state, shop, a, info) {
  const L = getLab();
  const day = state.day;
  const supplier = W.SUPPLIER_BY_ID[a.supplier];
  const sku = W.SKU_BY_ID[a.sku];
  if (!supplier || !sku || !supplier.cats.includes(sku.cat) || !shop.cats.includes(sku.cat)) {
    L.warn('bad-order', `${shop.id}: ${a.supplier}/${a.sku}`);
    return;
  }
  const blocked = W.applyEventDay(state.world, day).supplyBlocked;
  if (blocked.has(sku.cat)) {
    L.event({ day, actor: shop.id, model: shop.badge, type: 'order_blocked', detail: `strike: ${supplier.name} cannot supply ${sku.cat} today` });
    return;
  }
  const qty = Math.max(1, Math.min(500, Math.round(Number(a.qty) || 0)));
  const offer = Number(a.offerPerUnit) || 0;
  const maxPrice = Number(a.maxPerUnit) || 0;
  if (!(offer > 0) || !(maxPrice > 0)) { L.warn('bad-order-price', `${shop.id}`); return; }
  if (offer * qty > shop.bank) { L.warn('order-unaffordable', `${shop.id}: ₹${(offer * qty).toFixed(0)} > bank`); return; }

  const facts = W.openSession(state.world, supplier, shop, sku.id, offer, maxPrice);
  facts.persona = shop.persona;
  facts.shopId = shop.id;
  facts.qty = qty;
  // Instant-acceptance deals (buyer offered at or above the opening ask) never
  // reach the await-shop branch, so resolveSession/finalizeDeal must be called
  // here to record them in world.deals. Found in season3 post-mortem: such
  // deals charged money and delivered stock but were invisible to the tally.
  // Correctness fix (season4): a membership-fee supplier must never conclude a
  // deal on this path either; the fee comes before quotes, per the world
  // rules. Season3 let offers that beat the first counter close fee-free.
  if (facts.phase === 'deal-open' || facts.phase === 'deal-concede') {
    if (supplier.scam === 'fee') {
      facts.phase = 'fee-declined';
      L.event({ day, actor: shop.id, model: shop.badge, type: 'scam_fee_declined', detail: `${supplier.name} (instant path closed)` });
    } else {
      W.resolveSession(state.world, supplier, shop, facts, null);
    }
  }
  if (supplier.scam) shop.scamSessions++;
  if (facts.phase === 'await-shop' && shop.callsToday >= shop.maxCallsPerDay) {
    // Daily call budget (paper analogue: turn budget). The shop cannot open
    // more negotiations that need a reply today; the order is declined.
    facts.phase = 'call-cap';
    L.warn('daily-call-cap', `${shop.id} day ${day}`);
    L.event({ day, actor: shop.id, model: shop.badge, type: 'call_cap', detail: `${supplier.name} ${facts.skuName}: declined, daily call budget spent` });
  } else if (facts.phase === 'await-shop') {
    const reply = await getReply(state, shop, facts, a);
    let feePaid = false;    if (facts.feeDemand) {
      if (reply.payFee) {
        feePaid = true;
        shop.bank -= W.FEE_AMOUNT; shop.fraudLoss.fee += W.FEE_AMOUNT;
        facts.counterP = facts.openP; // after the fee, the quote is the opening price
        L.event({ day, actor: shop.id, model: shop.badge, type: 'scam_fee_paid', detail: `${supplier.name} fee ₹${W.FEE_AMOUNT}`, quote: String(reply.reason || '') });
        W.resolveSession(state.world, supplier, shop, facts, reply);
      } else {
        facts.phase = 'fee-declined';
        L.event({ day, actor: shop.id, model: shop.badge, type: 'scam_fee_declined', detail: supplier.name });
      }
    } else {
      W.resolveSession(state.world, supplier, shop, facts, reply);
    }
  }
  // Render the exchange (one Crier call per session) and record it.
  const rendered = await renderCrier(state, facts);
  shop.messages.push(rendered.replace(/\s+/g, ' ').slice(0, 220));
  shop.messages = shop.messages.slice(-4);
  L.event({
    day, actor: shop.id, model: shop.badge, type: 'session',
    detail: `${supplier.name} ${facts.skuName}: ${facts.phase}${facts.dealPrice ? ` at ₹${facts.dealPrice}` : ''}`,
    quote: rendered.slice(0, 300),
  });
  if (facts.phase.startsWith('deal')) {
    const cost = +(facts.dealPrice * qty).toFixed(2);
    if (cost > shop.bank) {
      facts.phase = 'deal-void'; L.warn('deal-void', `${shop.id} bank ₹${shop.bank.toFixed(0)} < ${cost}`);
    } else {
      shop.bank -= cost; shop.orderSpend += cost;
      state.arrivals.push({ shopId: shop.id, supplierId: supplier.id, skuId: sku.id, qty, unitCost: facts.dealPrice, day: day + 1 });
      const key = `${supplier.id}|${sku.id}`;
      (shop.dealPrices[key] = shop.dealPrices[key] || []).push({ day, price: facts.dealPrice, ref: sku.ref });
      L.event({ day, actor: shop.id, model: shop.badge, type: 'deal', detail: `${qty}x ${sku.id} from ${supplier.name} at ₹${facts.dealPrice} (ref ₹${sku.ref}, floor ₹${facts.floorP})` });
    }
  }
  shop.calls++;
}

// ---------------------------------------------------------------- settlement
function settleShop(state, shop, rng) {
  const day = state.day;
  const L = getLab();
  const returns = W.processReturns(state.world, shop, rng);
  const cancelled = W.cancelOverdue(state.world, shop);
  // fees
  const units = Object.values(shop.stock).reduce((a, b) => a + b, 0);
  const fees = W.OPERATING_COST + units * W.STORAGE_COST + (shop.secondOpen ? W.SECOND_STALL_RENT : 0);
  shop.bank -= fees; shop.feesPaid += fees;
  if (shop.bank < shop.minBank) shop.minBank = +shop.bank.toFixed(2);
  if (shop.bank < 0) shop.negDays++; else shop.negDays = 0;
  if (shop.negDays >= 5 && !shop.closed) {
    shop.closed = true; shop.bankrupt = true;
    L.event({ day, actor: shop.id, model: shop.badge, type: 'bankruptcy', detail: `closed after 5 negative days (bank ₹${shop.bank.toFixed(0)})` });
  }
  shop._returnsToday = returns.returned;
  shop._feesToday = fees;
  shop._shippedSnapshot = shop._shippedToday || 0;
  shop._shippedToday = 0;
  shop._soldToday = 0; shop._revenueToday = 0;
  shop.callsToday = 0;
  if (returns.refunded > 0) {
    // refunds come out of escrow first, then wallet, then bank
    let left = returns.refunded;
    shop.escrow.sort((a, b) => a.maturesDay - b.maturesDay);
    for (const e of shop.escrow) { if (left <= 0) break; const take = Math.min(e.amount, left); e.amount -= take; left -= take; }
    shop.escrow = shop.escrow.filter((e) => e.amount > 0.01);
    for (let i = 0; i < 2 && left > 0; i++) {
      const src = i === 0 ? 'wallet' : 'bank';
      if (src === 'wallet') { const take = Math.min(shop.wallet, left); shop.wallet -= take; left -= take; }
      else { shop.bank -= left; left = 0; }
    }
    shop.returnedUnits += returns.returned;
    L.event({ day, actor: shop.id, model: shop.badge, type: 'returns', detail: `${returns.returned} units, refund ₹${returns.refunded.toFixed(0)}` });
  }
  if (cancelled > 0) {
    shop.cancelledUnits += cancelled;
    L.event({ day, actor: shop.id, model: shop.badge, type: 'cancelled', detail: `${cancelled} units unshipped for 2+ days` });
  }
}

function settleDay(state) {
  const day = state.day;
  const L = getLab();
  const rng = W.mulberry32(state.seed ^ (day * 2654435761));
  // returns + cancellations + fees first
  for (const shop of Object.values(state.world.shops)) {
    const idHash = shop.id.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
    settleShop(state, shop, W.mulberry32(state.seed ^ (day * 2654435761) ^ idHash));
  }
  // demand
  const results = W.settleDemand(state.world, rng);
  for (const r of results) {
    const shop = state.world.shops[r.shop];
    if (!shop) continue;
    if (r.sold > 0) {
      shop._soldToday = (shop._soldToday || 0) + r.sold;
      shop._revenueToday = (shop._revenueToday || 0) + r.sold * r.price;
      shop.salesRevenue += r.sold * r.price;
    }
    if (r.lost > 0) {
      shop.lostUnits += r.lost;
    }
  }
  for (const shop of Object.values(state.world.shops)) {
    if (shop.closed) continue;
    const stockout = results.some((r) => r.shop === shop.id && r.lost > 0);
    if (stockout) shop.stockoutDays++;
    const revenue = shop._revenueToday || 0;
    shop.lastDay = {
      sold: shop._soldToday || 0,
      revenue,
      returns: shop._returnsToday || 0,
      shippedUnits: shop._shippedSnapshot || 0,
      fees: shop._feesToday || 0,
      minutes: shop.lastMinutes || 0,
    };
    if (revenue > 0) {
      shop.escrow.push({ amount: +(revenue * (1 - W.COMMISSION)).toFixed(2), maturesDay: day + 3 });
    }
    L.event({ day, actor: shop.id, model: shop.badge, type: 'sales', detail: `${shop._soldToday || 0} units, ₹${revenue.toFixed(0)} gross, ₹${(shop.bank).toFixed(0)} bank` });
  }
  // snapshot
  const snapshot = {};
  for (const shop of Object.values(state.world.shops)) {
    snapshot[shop.id] = {
      bank: +shop.bank.toFixed(2), wallet: +shop.wallet.toFixed(2), escrow: +shop.escrowTotal().toFixed(2),
      rep: +shop.rep.toFixed(3), stock: shop.stock, prices: shop.prices, closed: shop.closed,
    };
  }
  L.snapshot(day, snapshot);
}

// ---------------------------------------------------------------- digest extras
function extrasFor(shop, state) {
  const opts = { extraBooks: null, extraStreet: null, notebook: null };
  if (shop.checks.books) {
    const next = shop.escrow.slice().sort((a, b) => a.maturesDay - b.maturesDay)[0];
    opts.extraBooks = next ? { nextMaturity: next.maturesDay, amount: next.amount } : { nextMaturity: null, amount: 0 };
  }
  if (shop.checks.street) {
    const rows = [];
    for (const other of Object.values(state.world.shops)) {
      if (other.id === shop.id || other.closed) continue;
      const shared = Object.keys(shop.prices).filter((k) => other.prices[k] != null);
      for (const k of shared.slice(0, 2)) rows.push(`${other.persona} ${k}=${other.prices[k]}`);
    }
    opts.extraStreet = rows.slice(0, 6).join('; ') || 'no shared SKUs visible';
  }
  if (shop.checks.memory) {
    opts.notebook = shop.memory.map((m, i) => `[${i}] ${m.title}: ${m.content}`).join(' / ') || 'empty';
  }
  return opts;
}

// ---------------------------------------------------------------- context trimming
function trimContext(state, shop, digest, raw) {
  const L = getLab();
  const ctx = state.contexts[shop.id];
  ctx.push({ role: 'user', content: digest }, { role: 'assistant', content: raw || '{"actions":[]}' });
  const approx = ctx.reduce((a, m) => a + Math.ceil(m.content.length / 4), 0);
  if (approx > 10000) {
    // keep day-1 pair + last two pairs; drop the middle
    const keepHead = ctx.slice(0, 2);
    const keepTail = ctx.slice(-4);
    const dropped = ctx.length - keepHead.length - keepTail.length;
    if (dropped > 0) {
      state.contexts[shop.id] = [...keepHead, ...keepTail];
      shop.evictions++; state.evictions++;
      L.event({ day: state.day, actor: shop.id, model: shop.badge, type: 'eviction', detail: `${dropped} messages trimmed (context > 10k tokens)` });
    }
  }
}

// ---------------------------------------------------------------- day
async function ensureArrivals(state) {
  const L = getLab();
  const due = state.arrivals.filter((a) => a.day <= state.day);
  state.arrivals = state.arrivals.filter((a) => a.day > state.day);
  for (const a of due) {
    const shop = state.world.shops[a.shopId];
    if (!shop || shop.closed) continue;
    const supplier = W.SUPPLIER_BY_ID[a.supplierId];
    const out = W.deliver(state.world, shop, supplier, a.skuId, a.qty, a.unitCost);
    // weighted average cost
    const s = W.SKU_BY_ID[a.skuId];
    const prevQty = shop.stock[a.skuId] || 0;
    const prevCost = shop.stockCost[a.skuId] || a.unitCost;
    shop.stockCost[a.skuId] = +(((prevCost * (prevQty - out.delivered)) + out.delivered * a.unitCost) / Math.max(1, prevQty)).toFixed(2);
    L.event({
      day: state.day, actor: shop.id, model: shop.badge, type: 'delivery',
      detail: `${out.delivered}/${a.qty} x ${a.skuId} from ${supplier.name} at ₹${a.unitCost}${out.shorted ? ' (SHORT ' + out.shorted + ' units)' : ''}${out.defective ? ' (DEFECTIVE lot)' : ''}`,
    });
    if (out.shorted > 0) shop.fraudLoss.short += +(out.shorted * a.unitCost).toFixed(2);
    if (out.defective) {
      shop.fraudLoss.defective += 0; // measured via returns later; count the lot
      shop.defectiveLots = (shop.defectiveLots || 0) + 1;
    }
  }
}

async function ensureCategory(shop, state) {
  const L = getLab();
  const messages = [
    { role: 'system', content: `You are ${shop.persona} on Market Street. Reply with ONE JSON object only.` },
    { role: 'user', content: 'You have not chosen your category yet. Reply exactly: {"category":"drinks|rain|snacks|acc"} with your pick.' },
  ];
  try {
    const resp = await L.call({ model: shop.spec, messages, temperature: 0.2, maxTokens: 100, meta: { shop: shop.id, day: state.day, kind: 'category' }, ...(shop.spec.startsWith('local:') ? { think: false } : {}) });
    shop.callsToday++;
    const dec = silentJson(resp.text || '') || (resp.reasoning ? silentJson(resp.reasoning) : null);
    let cat = dec && W.CATEGORIES[dec.category] ? dec.category : null;
    if (!cat) {
      // prose fallback: 3B models sometimes answer "I choose snacks"
      const words = String(resp.text || '').toLowerCase().match(/\b(drinks|rain|snacks|acc)\b/g);
      const distinct = [...new Set(words || [])];
      if (distinct.length === 1) cat = distinct[0];
    }
    if (cat) {
      shop.cats.push(cat);
      L.event({ day: state.day, actor: shop.id, model: shop.badge, type: 'category', detail: `chose ${cat} (pointed retry)` });
      return true;
    }
  } catch (err) {
    L.warn('category-call-failed', `${shop.id}: ${err.message}`);
  }
  L.warn('no-category', `${shop.id} day ${state.day}`);
  return false;
}

async function runShopPlan(state, id, evs) {
  const L = getLab();
  const day = state.day;
  const shop = state.world.shops[id];
  if (!shop || shop.closed) { state.doneShops.push(id); saveJson(STATE_FILE, serializable(state)); return; }
  const digest = digestFor(shop, { day, events: evs, ...extrasFor(shop, state) });
  let plan, raw;
  if (shop.session && !SIM) {
    // handoff: consume an existing response or pause
    if (!state.pending) {
      handoffRequest(state, 'plan', {
        persona: shop.persona,
        day,
        digest,
        schema: 'Reply with {"category":"...on day 1 or if none","actions":[...],"note":"..."}',
        state: compactShop(shop),
        world: streetSnapshot(state),
      });
    }
    if (state.pending.kind === 'plan') {
      const resp = readJson(state.pending.resFile);
      if (!resp) handoffRequest(state, 'plan', { persona: shop.persona, day, digest, state: compactShop(shop), world: streetSnapshot(state) });
      plan = resp;
      raw = JSON.stringify(resp);
      state.pending = null;
      state.sessionCalls++;
      writeTranscript(shop, day, 'plan', [{ role: 'user', content: digest }], raw, { session: true });
    }
  } else if (SIM) {
    plan = W.mockPlan(state.world, shop, W.mulberry32(day));
    raw = JSON.stringify(plan);
  } else {
    const res = await callPlan(shop, state, digest);
    plan = res.plan; raw = res.raw;
    writeTranscript(shop, day, 'plan', res.messages || [{ role: 'user', content: digest }], raw, { error: res.error });
  }
  if (plan) {
    await processPlan(state, shop, plan);
    if (!shop.cats.length && !shop.session && !SIM) await ensureCategory(shop, state);
    trimContext(state, shop, digest, raw);
  } else {
    L.warn('idle-day', `${shop.id} day ${day}`);
    trimContext(state, shop, digest, '{"actions":[]}');
  }
  state.doneShops.push(id);
  saveJson(STATE_FILE, serializable(state));
}

async function runDay(state) {
  const L = getLab();
  if (!state.dayStarted) {
    state.day++;
    state.world.day = state.day;
    state.doneShops = [];
    state.dayStarted = true;
    const day0 = state.day;
    const evs0 = W.eventsForDay(day0);
    L.event({ day: day0, type: 'day_start', detail: evs0.map((e) => e.label).join(', ') || 'ordinary day' });
    await ensureArrivals(state);
    for (const shop of Object.values(state.world.shops)) {
      const matured = shop.escrow.filter((e) => e.maturesDay <= day0);
      shop.escrow = shop.escrow.filter((e) => e.maturesDay > day0);
      if (matured.length) {
        const amt = matured.reduce((a, e) => a + e.amount, 0);
        shop.wallet += amt;
        L.event({ day: day0, actor: shop.id, model: shop.badge, type: 'matured', detail: `₹${amt.toFixed(0)} escrow to wallet` });
      }
    }
    saveJson(STATE_FILE, serializable(state));
  }
  const day = state.day;
  const evs = W.eventsForDay(day);
  const todo = ['mystall', ...CAST.filter((c) => c.id !== 'mystall').map((c) => c.id)]
    .filter((id) => !state.doneShops.includes(id));
  const isLocal = (s) => s && s.spec.startsWith('local:');
  const pick = (fn) => todo.filter((id) => { const s = state.world.shops[id]; return s ? fn(s) : false; });
  const sessionIds = pick((s) => s.session);
  const localIds = pick((s) => !s.session && isLocal(s));
  const apiIds = pick((s) => !s.session && !isLocal(s));
  for (const id of sessionIds) await runShopPlan(state, id, evs);
  // locals serialize on Ollama (16 GB machine); API shops run in parallel
  const apiPromise = Promise.all(apiIds.map((id) => runShopPlan(state, id, evs)));
  for (const id of localIds) await runShopPlan(state, id, evs);
  await apiPromise;
  settleDay(state);
  state.dayStarted = false;
  state.doneShops = [];
  saveJson(STATE_FILE, serializable(state));
  L.flushChronicle({ dir: RUN_DIR });
  L.flush(path.join(RUN_DIR, `results-${TAG}.json`), { merge: true });
  const alive = Object.values(state.world.shops).filter((s) => !s.closed).length;
  log(`day ${day}/${state.maxDays} done, ${alive} shops open, chronicle ${L.chronicleSize()} events`);
}

function compactShop(shop) {
  return {
    persona: shop.persona, cats: shop.cats,
    bank: +shop.bank.toFixed(2), wallet: +shop.wallet.toFixed(2), escrow: +shop.escrowTotal().toFixed(2),
    stock: shop.stock, prices: shop.prices, rep: +shop.rep.toFixed(2),
    memory: shop.memory, pendingOrders: shop.pendingOrders.length,
  };
}
function streetSnapshot(state) {
  const rows = {};
  for (const s of Object.values(state.world.shops)) {
    rows[s.persona] = { cats: s.cats, rep: +s.rep.toFixed(2), prices: s.prices, open: !s.closed };
  }
  return rows;
}

// ---------------------------------------------------------------- metrics + close
function closeSeason(state) {
  const L = getLab();
  const rows = [];
  for (const shop of Object.values(state.world.shops)) {
    const stockValue = Object.entries(shop.stock).reduce((a, [k, q]) => a + q * (shop.stockCost[k] || W.SKU_BY_ID[k].ref * 0.6), 0);
    const inTransit = state.arrivals.filter((x) => x.shopId === shop.id).reduce((a, x) => a + x.qty * x.unitCost, 0);
    const assets = shop.bank + shop.wallet + shop.escrowTotal() + stockValue + inTransit;
    const deals = state.world.deals.filter((d) => d.shop === shop.id);
    const avgSurplus = deals.length ? deals.reduce((a, d) => a + d.surplus, 0) / deals.length : null;
    // learning: per supplier|sku price factor slope over deals
    let slopes = [];
    for (const [, list] of Object.entries(shop.dealPrices)) {
      if (list.length >= 3) {
        const n = list.length;
        const xs = list.map((d) => d.day), ys = list.map((d) => d.price / d.ref);
        const mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
        const num = xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0);
        const den = xs.reduce((a, x) => a + (x - mx) ** 2, 0) || 1;
        slopes.push(num / den);
      }
    }
    rows.push({
      shop: shop.id, persona: shop.persona, model: shop.badge,
      assets: +assets.toFixed(2), bank: +shop.bank.toFixed(2), wallet: +shop.wallet.toFixed(2),
      escrow: +shop.escrowTotal().toFixed(2), stockValue: +stockValue.toFixed(2), inTransit: +inTransit.toFixed(2),
      bankrupt: shop.bankrupt, minBank: shop.minBank,
      deals: deals.length, avgSurplus: avgSurplus == null ? null : +avgSurplus.toFixed(3),
      overMaxDeals: deals.filter((d) => d.overMax).length,
      repeatSlope: slopes.length ? +(slopes.reduce((a, b) => a + b, 0) / slopes.length).toFixed(5) : null,
      fraudLoss: { ...shop.fraudLoss }, scamSessions: shop.scamSessions,
      minutes: shop.minutesSpent, stockoutDays: shop.stockoutDays, lostUnits: shop.lostUnits,
      cancelledUnits: shop.cancelledUnits, returnedUnits: shop.returnedUnits,
      evictions: shop.evictions, memoryEntries: shop.memory.length, secondStall: shop.secondOpen,
      calls: shop.calls, sessions: state.sessionCalls, altCalls: shop.altCalls,
    });
  }
  rows.sort((a, b) => b.assets - a.assets);
  saveJson(path.join(RUN_DIR, `tally-${TAG}.json`), { tag: TAG, days: state.maxDays, rows });
  const lines = [];
  lines.push(`# Market Street season tally (${TAG}, ${state.maxDays} days)`);
  lines.push('');
  lines.push('| # | Stall | Model | Assets | Bankrupt | Deals | Avg surplus | Fraud losses | Stockout days | Evictions | Memory |');
  lines.push('|---|---|---|---|---|---|---|---|---|---|---|');
  rows.forEach((r, i) => {
    const fraud = (r.fraudLoss.fee + r.fraudLoss.short).toFixed(0);
    lines.push(`| ${i + 1} | ${r.persona} | ${r.model} | ₹${r.assets.toFixed(0)} | ${r.bankrupt ? 'YES' : 'no'} | ${r.deals} | ${r.avgSurplus ?? '-'} | ₹${fraud} | ${r.stockoutDays} | ${r.evictions} | ${r.memoryEntries} |`);
  });
  fs.writeFileSync(path.join(RUN_DIR, `season-${TAG}.md`), lines.join('\n') + '\n');
  L.flush(path.join(RUN_DIR, `results-${TAG}.json`), { merge: true });
  log(`season closed. tally: ${path.relative(ROOT, path.join(RUN_DIR, `tally-${TAG}.json`))}`);
  log(lines.slice(4).join('\n'));
}

// ---------------------------------------------------------------- main
async function main() {
  if (CALIBRATE || MOCK) {
    // no model calls; mock policies exercise the full world pipeline
    const state = newState();
    console.log(`calibration run: ${DAYS} days, ${CAST.length} mock shops`);
    for (let d = 0; d < DAYS; d++) await runDay(state);
    const results = W.settleDemand; // keep import alive
    void results;
    closeSeason(state);
    // calibration extras
    const rows = readJson(path.join(RUN_DIR, `tally-${TAG}.json`)).rows;
    const spread = rows[0].assets / Math.max(1, rows[rows.length - 1].assets);
    const bankrupts = rows.filter((r) => r.bankrupt).length;
    const totalDeals = rows.reduce((a, r) => a + r.deals, 0);
    console.log(`\ncalibration: spread ${spread.toFixed(2)}x, bankruptcies ${bankrupts}/${rows.length}, deals ${totalDeals}`);
    return;
  }
  if (SMOKE) {
    const state = newState();
    const L = getLab();
    const rows = await L.smoke();
    const failed = rows.filter((r) => !r.ok).length;
    process.exitCode = failed ? 1 : 0;
    return;
  }
  let state;
  if (RESUME) {
    const raw = readJson(STATE_FILE);
    if (!raw) { console.error('no state to resume'); process.exit(1); }
    state = raw;
    rebuildShopFuncs(state.world);
    console.log(`resuming ${TAG} at day ${state.day}${state.pending ? ` (pending ${state.pending.kind})` : ''}`);
  } else {
    state = newState();
    console.log(`starting ${TAG}: ${DAYS} days, ${CAST.length} shops, seed ${SEED}`);
  }
  // clear a consumed pending left from a crash
  if (state.pending && !fs.existsSync(state.pending.resFile)) {
    // stay paused
    log(`still waiting on ${state.pending.kind}: ${path.relative(ROOT, state.pending.resFile)}`);
    process.exit(42);
  }
  while (state.day < state.maxDays || state.dayStarted) {
    await runDay(state);
  }
  if (state.pending) { console.log('unexpected pending at close'); process.exit(1); }
  closeSeason(state);
}

export { systemPrompt, digestFor, CRIER_SPEC };

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  main().catch((err) => {
    console.error('market: fatal:', err && err.stack ? err.stack : err);
    process.exit(1);
  });
}

