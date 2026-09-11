// handoff-read.mjs: compact view of a season handoff request for the session
// agent. Usage: node build/handoff-read.mjs [tag] [day]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const tag = process.argv[2] || 'season1';
const day = process.argv[3] || String(new Date().getDate());

const reqFile = path.join(HERE, 'runs', tag, 'handoff', `plan-day${String(day).padStart(2, '0')}-request.json`);
const req = JSON.parse(fs.readFileSync(reqFile, 'utf8'));

console.log('=== DIGEST ===');
console.log(req.digest);
console.log('=== MY STATE ===');
console.log(JSON.stringify(req.state));
console.log('=== STREET (persona: categories, rep) ===');
for (const [persona, w] of Object.entries(req.world)) {
  console.log(`${persona}: ${w.cats.join('+') || '-'} rep ${w.rep}${w.open ? '' : ' CLOSED'}`);
}
