#!/usr/bin/env node
// The Recipe Box Diner: world fixtures (seeded, deterministic).
// Pantry = 40 invented Velmora cards. Orders = 20 (5 Town Classics + 15
// Velmora dishes at chain depth 1/2/3). Oracle = correct card chains.
// No em-dashes anywhere. Seed fixed so anyone can regenerate the world.

export const SEED = 390921;

// mulberry32: tiny seeded PRNG, deterministic across runs.
function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const NOUNS = [
  'glimmerroot', 'hollowfen salt', 'emberlace', 'moonwilt', 'brackthorn',
  'velvet ash', 'sourlight', 'cinderquill', 'duskmarrow', 'fenwater',
  'tallowbloom', 'greymint', 'stormcress', 'nightcap oil', 'palebroker flour',
  'wildspire pepper', 'ashfoil', 'copperfern', 'bogamber', 'thistledew',
  'murkcherry', 'lanternseed', 'greyloam butter', 'wraithcurrant', 'sedgefire',
  'coldmilk sap', 'harrowgrain', 'dimsyrup', 'oldstone salt', 'feverbark',
  'ravenleaf', 'quietloaf crumb', 'shadowcaraway', 'brightknot garlic',
  'mistmallow', 'ironhoney', 'foggard', 'wispcelery', 'gravebread crumb',
  'sunken citrus',
];
const SHELVES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const ALIAS_PARTS = [
  'witch', 'fen', 'grey', 'ember', 'moon', 'crow', 'salt', 'bog', 'mist', 'iron',
  'whisper', 'hollow', 'brack', 'night', 'storm', 'dusk', 'pale', 'wild',
];
const ALIAS_TAILS = ['leaf', 'kiss', 'tooth', 'hair', 'milk', 'wine', 'dust', 'seed', 'tear', 'wort'];
const NOTES = [
  'picked at night or it turns bitter',
  'never boil, only steep',
  'the bulb keeps for one winter',
  'grind fresh or the dish goes mute',
  'sold in twisted bundles at the Velmora docks',
  'swears of citrus if overused',
  'must be folded, never stirred',
  'spoilage smells like rain on hot stone',
  'safe raw, dangerous twice-cooked',
  'cheap in season, ruinous out of it',
];

// Build 40 pantry cards with aliases, shelves, and reference links.
export function buildPantry() {
  const rand = rng(SEED);
  const usedAliases = new Set();
  const cards = NOUNS.map((name, i) => {
    const nAlias = 1 + Math.floor(rand() * 2); // 1-2 aliases
    const aliases = [];
    while (aliases.length < nAlias) {
      const a = `${ALIAS_PARTS[Math.floor(rand() * ALIAS_PARTS.length)]} ${ALIAS_TAILS[Math.floor(rand() * ALIAS_TAILS.length)]}`;
      if (!usedAliases.has(a)) { usedAliases.add(a); aliases.push(a); }
    }
    return {
      name,
      aliases,
      shelf: SHELVES[i % SHELVES.length],
      refs: [],
      note: NOTES[Math.floor(rand() * NOTES.length)],
    };
  });
  // Cross-references: each card 0-3 refs to later-ish cards (acyclic-ish by index).
  for (let i = 0; i < cards.length; i++) {
    const nRefs = Math.floor(rand() * 3); // 0-2 refs base rate
    const set = new Set();
    while (set.size < nRefs) set.add(Math.floor(rand() * cards.length));
    set.delete(i);
    cards[i].refs = [...set].map((j) => cards[j].name);
  }
  return cards;
}

// Velmora dishes: the blurb states the dish's shape in words, names the
// base (canonical or alias), and describes the accent and finish VERBATIM
// by the matching card's keeper's note. Picking the right cards is the
// cook's job; nothing about the oracle is unknowable.
// Hints are constrained: the note that identifies a chain card must differ
// from the notes on every sibling card the cook could confuse it with.
export function buildOrders(pantry) {
  const rand = rng(SEED + 1);
  const byName = new Map(pantry.map((c) => [c.name, c]));
  const dishes = [
    ['Emberlace Tart', 1], ['Hollowfen Stew', 2], ['Moonwilt Gratin', 3],
    ['Brackthorn Relish', 1], ['Duskmarrow Broth', 2], ['Sourlight Custard', 3],
    ['Cinderquill Roast', 1], ['Fenwater Punch', 2], ['Tallowbloom Pudding', 3],
    ['Greymint Granita', 1], ['Stormcress Souffle', 2], ['Nightcap Tonic', 3],
    ['Bogamber Terrine', 2], ['Thistledew Ice', 3], ['Murkcherry Compote', 1],
  ];
  const orders = [];
  for (const [dish, depth] of dishes) {
    let base = null, accent = null, finish = null, blurbShape = '';
    if (depth === 1) {
      base = pantry[Math.floor(rand() * pantry.length)];
      blurbShape = 'A single-note dish: one base ingredient, no accent, no finish.';
    } else if (depth === 2) {
      // base + accent: accent's note must differ from every sibling ref's note
      const bases = pantry.filter((c) => c.refs.length >= 2);
      for (let tries = 0; tries < 60 && !accent; tries++) {
        base = bases[Math.floor(rand() * bases.length)];
        const sibs = base.refs.map((r) => byName.get(r));
        const pool = sibs.filter((s) => sibs.every((o) => o === s || o.note !== s.note));
        accent = pool[Math.floor(rand() * pool.length)];
      }
      if (!accent) { base = pantry.find((c) => c.refs.length >= 2); accent = byName.get(base.refs[0]); }
      blurbShape = 'A two-note dish: a base and one accent, no finish.';
    } else {
      // base + accent + finish: finish hint unique among accent's refs
      const bases = pantry.filter((c) => c.refs.length >= 2);
      for (let tries = 0; tries < 60 && !finish; tries++) {
        base = bases[Math.floor(rand() * bases.length)];
        const sibs = base.refs.map((r) => byName.get(r));
        const pool = sibs.filter((s) => sibs.every((o) => o === s || o.note !== s.note));
        accent = pool[Math.floor(rand() * pool.length)];
        if (!accent || accent.refs.length < 1) continue;
        const fsibs = accent.refs.map((r) => byName.get(r));
        const fpool = fsibs.filter((s) => fsibs.every((o) => o === s || o.note !== s.note));
        finish = fpool[Math.floor(rand() * fpool.length)];
      }
      if (!finish) { base = pantry[0]; accent = byName.get(base.refs[0]); finish = byName.get(accent.refs[0]); }
      blurbShape = 'A three-note dish: a base, an accent, and a finish.';
    }
    const useAlias = orders.length % 2 === 1; // alternate alias/canonical in blurb
    const calledAs = useAlias ? base.aliases[0] : base.name;
    let hint = '';
    if (depth === 2) hint = ` The menu describes the accent: "${accent.note}".`;
    if (depth === 3) hint = ` The menu describes the accent: "${accent.note}". It describes the finish: "${finish.note}".`;
    orders.push({
      kind: 'velmora',
      dish,
      depth,
      blurb: `Order: ${dish}, from the ${base.shelf} shelf. ${blurbShape} The cook on duty swears the base is called "${calledAs}".${hint} Pull the cards and stamp the ticket: name the base, then its accent${depth === 3 ? ', then the finish' : ''}, exactly as the pantry cards chain them (or "none" where the dish has none).`,
      key: { base: base.name, accent: accent ? accent.name : 'none', finish: finish ? finish.name : 'none' },
    });
  }
  // Town Classics: one signature ingredient each, graded base only.
  // Accent and finish must be "none"; the blurb says so in plain words.
  const classics = [
    { dish: 'Pancakes, short stack', base: 'flour', syn: ['flour', 'all-purpose flour', 'wheat flour'] },
    { dish: 'Margherita Pizza', base: 'mozzarella', syn: ['mozzarella', 'fresh mozzarella', 'mozzarella cheese'] },
    { dish: 'Mashed Potatoes', base: 'potatoes', syn: ['potatoes', 'potato', 'russet potatoes'] },
    { dish: 'Hot Chocolate', base: 'chocolate', syn: ['chocolate', 'cocoa', 'cocoa powder', 'dark chocolate'] },
    { dish: 'Greek Salad', base: 'feta', syn: ['feta', 'feta cheese'] },
  ];
  for (const c of classics) {
    orders.push({
      kind: 'classic',
      dish: c.dish,
      depth: 1,
      blurb: `Order: ${c.dish}. A Town Classic everyone knows, and the ticket wants ONE thing: the dish's single signature ingredient as the base. Put "none" for the accent and the finish; this ticket has no other notes.`,
      key: { base: c.base, accent: 'none', finish: 'none', syn: c.syn },
    });
  }
  return orders;
}

const norm = (s) => (s || '').trim().toLowerCase().replace(/\s+/g, ' ');

export function findCard(pantry, q) {
  const target = norm(q);
  return pantry.find((c) => norm(c.name) === target || c.aliases.some((a) => norm(a) === target));
}

// Scrambled-field, punctuation-noise rendering (content intact) for noise rounds.
const NOISE_MARKS = ['~', ' *', ' !', ' ??'];
export function renderCard(card, { noisy = false } = {}) {
  const fields = [
    `name: ${card.name}`,
    `aliases: ${card.aliases.join(', ') || 'none'}`,
    `shelf: ${card.shelf}`,
    `references: ${card.refs.join(', ') || 'none'}`,
    `note: ${card.note}`,
  ];
  if (!noisy) return `CARD | ${fields.join(' | ')}`;
  const shuffled = fields.slice();
  for (let i = shuffled.length - 1 > 0 ? shuffled.length - 1 : 0; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const mark = NOISE_MARKS[Math.floor(Math.random() * NOISE_MARKS.length)];
  return `CARD | ${shuffled.join(' |')}${mark}`;
}

// Ticket law: exactly one line, exact shape.
const TICKET_RE = /^TICKET:\s*(.+?)\s*\|\s*base:\s*(.+?)\s*\|\s*accent:\s*(.+?)\s*\|\s*finish:\s*(.+?)\s*$/;

export function parseTicket(text) {
  const lines = (text || '').split('\n').map((l) => l.trim()).filter(Boolean);
  const idx = lines.findIndex((l) => /^TICKET:/i.test(l));
  const line = idx >= 0 ? lines[idx] : '';
  const m = line.match(TICKET_RE);
  if (!m) return { valid: false, formatOk: false };
  // The ticket law: the TICKET line is one well-formed line and it ENDS the
  // reply (a licensed THINK line before it is fine; anything after is not).
  const formatOk = idx === lines.length - 1;
  return {
    valid: true,
    formatOk,
    dish: m[1].trim(),
    base: m[2].trim(),
    accent: m[3].trim(),
    finish: m[4].trim(),
  };
}

const sameIngredient = (a, pantry, key) => {
  const card = findCard(pantry, a);
  if (card) return norm(card.name) === norm(key);
  return norm(a) === norm(key);
};

export function gradeTicket(parsed, order, pantry) {
  if (!parsed.valid) return { correct: false, hallucinated: false };
  const dishOk = norm(parsed.dish).includes(norm(order.dish)) || norm(order.dish).includes(norm(parsed.dish));
  const k = order.key;
  const baseOk = order.kind === 'classic' ? classicSynMatch(parsed.base, k) : sameIngredient(parsed.base, pantry, k.base);
  const accentOk = k.accent === 'none' ? norm(parsed.accent) === 'none' : sameIngredient(parsed.accent, pantry, k.accent);
  const finishOk = k.finish === 'none' ? norm(parsed.finish) === 'none' : sameIngredient(parsed.finish, pantry, k.finish);
  // hallucination: named a pantry-sounding ingredient that is on no card (velmora only)
  let hallucinated = false;
  if (order.kind === 'velmora') {
    for (const f of [parsed.base, parsed.accent, parsed.finish]) {
      if (!f || norm(f) === 'none') continue;
      if (!findCard(pantry, f)) { hallucinated = true; break; }
    }
  }
  return { correct: !!(dishOk && baseOk && accentOk && finishOk), hallucinated };
}

// classics: exact or synonym match against the signature ingredient
const classicSynMatch = (a, key) => {
  const n = norm(a);
  const names = [key.base, ...(key.syn || [])].map(norm);
  return names.some((kk) => kk === n || kk.includes(n) || n.includes(kk));
};

// The Headwaiter speaks to the cook between pulls.
export const PROTOCOL = [
  'You are a cook at the Recipe Box Diner.',
  'To look at a pantry card, reply with one line: PULL <ingredient name or alias>',
  'The box replies with a CARD record. Cards chain: a card\'s "references" field names other cards.',
  'When you know the dish, stamp the ticket with EXACTLY one line and nothing else:',
  'TICKET: <dish> | base: <card name> | accent: <card name or none> | finish: <card name or none>',
  'Rules: use the card\'s canonical name (not an alias) on the ticket. Max 8 pulls per order.',
  'Never write anything except a PULL line or the TICKET line.',
].join('\n');

export const PROTOCOL_CLASSIC = [
  'You are a cook at the Recipe Box Diner, working a Town Classic order.',
  'Everyone knows these dishes; the pantry box does not stock everyday ingredients.',
  'The ticket wants the dish and its ONE signature ingredient as the base; put "none" for accent and finish.',
  'Stamp the ticket with EXACTLY one line and nothing else:',
  'TICKET: <dish> | base: <signature ingredient> | accent: none | finish: none',
  'Never write anything except the TICKET line.',
].join('\n');

export function closedBookPrompt(order) {
  return [
    order.blurb,
    'Answer with EXACTLY one line and nothing else:',
    'TICKET: <dish> | base: <ingredient> | accent: <ingredient or none> | finish: <ingredient or none>',
    order.kind === 'velmora'
      ? 'This dish comes from Velmora, a cuisine you have never heard of. If you do not actually know the chain, still stamp the ticket: guessing is visible and graded.'
      : 'This is a Town Classic: the ticket wants the dish and its single signature ingredient as the base, then "none" for the accent and the finish.',
  ].filter(Boolean).join('\n');
}
