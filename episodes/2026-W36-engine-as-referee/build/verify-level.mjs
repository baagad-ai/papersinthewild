// verify-level.mjs - the engine of the game studio (episode 2026-W36-engine-as-referee).
// Deterministic referee for 12x12 grid levels. No LLM, no network, no opinions.
// Maps the paper's engine-check ladder (arXiv 2608.25518) one-to-one:
//   loading          -> PARSE   (valid JSON, 12 rows, legal charset, exactly one S and one G)
//   collision/geom   -> BOUNDS  (every row exactly 12 chars; nothing outside the world)
//                    -> BORDER  (outer ring fully walled; the world does not leak)
//   physics          -> SUPPORT (no prop embedded in solids; every prop touches floor)
//   navmesh          -> REACH   (BFS from S to G through walkable tiles)
//   bounded playtest -> BOT     (seeded random walk, 200-step budget, never crosses solids)
//
// Level format (the scene program):
//   { "name": "cozy cafe", "grid": ["############", "#....T.....#", ...] }
//   12 strings x 12 chars. '#' wall, '.' floor, 'S' spawn, 'G' goal,
//   any other uppercase letter = a named prop (solid). Props get stable ids
//   (T1, T2, C1 ...) in scan order, per the paper's stable-object-identifier rule.

export const SIZE = 12;
export const BOT_BUDGET = 200;
const WALKABLE = new Set(['.', 'S', 'G']);
const PROP_LETTERS = /^[A-Z]$/;

// ---------------------------------------------------------------- parsing

export function parseLevel(text) {
  let doc;
  try {
    doc = JSON.parse(text);
  } catch (err) {
    return { ok: false, error: { gate: 'PARSE', cell: null, objectId: null, reason: `not valid JSON (${String(err.message).split(' at ')[0]})` } };
  }
  if (typeof doc !== 'object' || doc === null || Array.isArray(doc)) {
    return { ok: false, error: { gate: 'PARSE', cell: null, objectId: null, reason: 'level must be a JSON object with name and grid' } };
  }
  if (typeof doc.name !== 'string' || !doc.name.trim()) {
    return { ok: false, error: { gate: 'PARSE', cell: null, objectId: null, reason: 'missing "name": every level needs a name' } };
  }
  if (!Array.isArray(doc.grid)) {
    return { ok: false, error: { gate: 'PARSE', cell: null, objectId: null, reason: 'missing "grid": expected an array of 12 strings' } };
  }
  const grid = doc.grid.map((r) => String(r));
  const spawn = [];
  const goal = [];
  for (let r = 0; r < grid.length; r++) {
    const row = grid[r];
    for (let c = 0; c < row.length; c++) {
      const ch = row[c];
      if (ch === 'S') spawn.push([r, c]);
      else if (ch === 'G') goal.push([r, c]);
      else if (ch !== '#' && ch !== '.' && !PROP_LETTERS.test(ch)) {
        return { ok: false, error: { gate: 'PARSE', cell: [r, c], objectId: null, reason: `illegal tile "${ch}" (legal: # . S G and prop letters)` } };
      }
    }
  }
  if (spawn.length !== 1) {
    return { ok: false, error: { gate: 'PARSE', cell: null, objectId: 'S', reason: `expected exactly one S (spawn), found ${spawn.length}` } };
  }
  if (goal.length !== 1) {
    return { ok: false, error: { gate: 'PARSE', cell: null, objectId: 'G', reason: `expected exactly one G (goal), found ${goal.length}` } };
  }
  // stable prop ids in scan order
  const counts = new Map();
  const props = [];
  const idAt = Array.from({ length: grid.length }, () => Array(grid[0]?.length ?? 0).fill(null));
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < (grid[r] || '').length; c++) {
      const ch = grid[r][c];
      if (ch !== 'S' && ch !== 'G' && PROP_LETTERS.test(ch)) {
        const n = (counts.get(ch) ?? 0) + 1;
        counts.set(ch, n);
        const id = `${ch}${n}`;
        idAt[r][c] = id;
        props.push({ id, ch, r, c });
      }
    }
  }
  return { ok: true, level: { name: doc.name.trim(), grid, spawn: spawn[0], goal: goal[0], props, idAt } };
}

// ---------------------------------------------------------------- gates

const cellStr = ([r, c]) => `(${r},${c})`;

function checkBounds(level) {
  if (level.grid.length !== SIZE) {
    return { gate: 'BOUNDS', cell: null, objectId: null, reason: `grid has ${level.grid.length} rows, the world is exactly ${SIZE}` };
  }
  for (let r = 0; r < level.grid.length; r++) {
    if (level.grid[r].length !== SIZE) {
      return { gate: 'BOUNDS', cell: [r, 0], objectId: null, reason: `row ${r} is ${level.grid[r].length} chars, every row is exactly ${SIZE} (nothing may stick out of the world)` };
    }
  }
  return null;
}

function checkBorder(level) {
  const last = SIZE - 1;
  for (let i = 0; i < SIZE; i++) {
    for (const [r, c] of [[0, i], [last, i], [i, 0], [i, last]]) {
      if (level.grid[r][c] !== '#') {
        return { gate: 'BORDER', cell: [r, c], objectId: level.idAt[r][c], reason: 'the outer wall has a hole; the world leaks into the void' };
      }
    }
  }
  return null;
}

function checkSupport(level) {
  for (const p of level.props) {
    let floorTouch = 0;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const r = p.r + dr;
      const c = p.c + dc;
      if (r >= 0 && r < level.grid.length && c >= 0 && c < (level.grid[r] || '').length && WALKABLE.has(level.grid[r][c])) floorTouch++;
    }
    if (floorTouch === 0) {
      return { gate: 'SUPPORT', cell: [p.r, p.c], objectId: p.id, reason: 'rests inside solid tiles; no floor touches it' };
    }
  }
  return null;
}

function bfs(level) {
  const { spawn, goal } = level;
  const dist = Array.from({ length: SIZE }, () => Array(SIZE).fill(-1));
  dist[spawn[0]][spawn[1]] = 0;
  const q = [spawn];
  while (q.length) {
    const [r, c] = q.shift();
    if (r === goal[0] && c === goal[1]) return dist[r][c];
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) continue;
      if (dist[nr][nc] !== -1) continue;
      if (!WALKABLE.has(level.grid[nr][nc])) continue;
      dist[nr][nc] = dist[r][c] + 1;
      q.push([nr, nc]);
    }
  }
  return -1;
}

function checkReach(level) {
  const d = bfs(level);
  if (d === -1) {
    return { gate: 'REACH', cell: level.goal, objectId: 'G', reason: 'no path exists from S to G; the goal is unreachable' };
  }
  return null;
}

// seeded PRNG so the bot is reproducible (same level + seed = same walk)
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function botWalk(level, seed = 1) {
  // Pixel the playtester, v3: carries a notebook. He prefers tiles he has
  // visited least (a real playtester remembers where they have been),
  // tie-breaks toward the goal, and wanders purely 20% of the time.
  // Seeded, so the same level + seed always produces the same playthrough.
  const rand = mulberry32(seed);
  const shortest = bfs(level);
  let [r, c] = level.spawn;
  const atGoal = () => r === level.goal[0] && c === level.goal[1];
  const visits = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  visits[r][c] = 1;
  let steps = 0;
  let bumps = 0;
  let prev = null;
  while (!atGoal() && steps < BOT_BUDGET) {
    const options = [];
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) continue;
      if (!WALKABLE.has(level.grid[nr][nc])) continue;
      options.push([nr, nc]);
    }
    if (options.length === 0) break; // sealed in (REACH would have failed first)
    let pick = null;
    if (rand() >= 0.2) {
      let bestKey = null;
      for (const opt of options) {
        const d = Math.abs(opt[0] - level.goal[0]) + Math.abs(opt[1] - level.goal[1]);
        const key = [visits[opt[0]][opt[1]], d];
        if (bestKey === null || key[0] < bestKey[0] || (key[0] === bestKey[0] && key[1] < bestKey[1])) {
          bestKey = key;
          pick = opt;
        }
      }
    }
    if (!pick) pick = options[Math.floor(rand() * options.length)];
    if (options.length > 1 && prev && pick[0] === prev[0] && pick[1] === prev[1]) {
      pick = options[Math.floor(rand() * options.length)]; // one chance to not undo
    }
    prev = [r, c];
    [r, c] = pick;
    visits[r][c]++;
    steps++;
  }
  return { reached: atGoal(), steps, bumps, shortest };
}

// ---------------------------------------------------------------- top level

export function verifyLevel(level, { seed = 1 } = {}) {
  const failure =
    checkBounds(level) ||
    checkBorder(level) ||
    checkSupport(level) ||
    checkReach(level);
  if (failure) {
    return { pass: false, failure, bot: null };
  }
  const bot = botWalk(level, seed);
  if (!bot.reached) {
    return {
      pass: false,
      failure: {
        gate: 'BOT',
        cell: level.goal,
        objectId: 'G',
        reason: `the playtest bot wandered for ${BOT_BUDGET} steps and never reached the goal (shortest path is ${bot.shortest})`,
      },
      bot,
    };
  }
  return { pass: true, failure: null, bot };
}

// full engine report for a raw designer output (text in, verdict out).
// importer behavior (2026-08-30 spec amendment): row noise is normalized
// BEFORE gate checks, exactly like a real engine clamps out-of-bounds
// transforms on import. Every patch is receipted; world-content failures
// (no spawn, no goal, sealed rooms, embedded props) are never repaired.
export function importLevel(rawText) {
  // pull candidate rows out of whatever the designer emitted
  let rows = [];
  const m = String(rawText ?? '').match(/\{[\s\S]*\}/);
  if (m) {
    try {
      const j = JSON.parse(m[0]);
      if (j && Array.isArray(j.grid)) rows = j.grid.map((r) => String(r));
    } catch {
      /* fall through to row scan */
    }
  }
  if (rows.length < 8) {
    rows = [...String(rawText ?? '').matchAll(/"([#A-Z.]{6,20})"/g)].map((x) => x[1]);
  }
  if (rows.length < 8) {
    return { ok: false, error: { gate: 'PARSE', cell: null, objectId: null, reason: 'no grid found: fewer than 8 rows of wall/floor tiles' }, patches: [] };
  }
  const patches = [];
  if (rows.length > 12) {
    patches.push({ row: -1, op: 'trim-rows', from: rows.length, to: 12 });
    rows = rows.slice(0, 12);
  }
  const grid = rows.map((row, r) => {
    if (row.length > 12) {
      patches.push({ row: r, op: 'trim', from: row.length, to: 12 });
      return row.slice(0, 12);
    }
    if (row.length < 12) {
      patches.push({ row: r, op: 'pad', from: row.length, to: 12 });
      return row + '#'.repeat(12 - row.length);
    }
    return row;
  });
  const nameM = String(rawText ?? '').match(/"name"\s*:\s*"([^"]+)"/);
  const parsed = parseLevel(JSON.stringify({ name: nameM?.[1] || 'unnamed level', grid }));
  if (!parsed.ok) return { ok: false, error: parsed.error, patches };
  return { ok: true, level: parsed.level, patches };
}

export function engineReport(rawText, { seed = 1 } = {}) {
  const imp = importLevel(rawText);
  if (!imp.ok) {
    return { pass: false, level: null, failure: imp.error, bot: null, ascii: null, patches: imp.patches };
  }
  const verdict = verifyLevel(imp.level, { seed });
  return {
    pass: verdict.pass,
    level: imp.level,
    failure: verdict.failure,
    bot: verdict.bot,
    ascii: renderASCII(imp.level),
    patches: imp.patches,
  };
}

// ---------------------------------------------------------------- render

export function renderASCII(level) {
  const lines = [];
  lines.push(`  ${Array.from({ length: SIZE }, (_, i) => String(i % 10)).join(' ')}`);
  level.grid.forEach((row, r) => {
    lines.push(`${String(r % 10).padStart(1)} ${row}`);
  });
  const propList = level.props.map((p) => `${p.id}=${p.ch}`).join(' ');
  lines.push(`props: ${propList || '(none)'}`);
  return lines.join('\n');
}
