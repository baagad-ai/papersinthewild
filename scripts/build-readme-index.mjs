#!/usr/bin/env node
// build-readme-index.mjs - regenerates the README's episode index (and the
// "Latest episode" pointer) from the synced site registry, so the repo front
// page updates on every publish without anyone hand-editing markdown.
// Called by publish.sh after the sync, before the commit.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPTS = path.dirname(fileURLToPath(import.meta.url));
const PUB = path.dirname(SCRIPTS);
const README = path.join(PUB, 'README.md');
const reg = fs.readFileSync(path.join(PUB, 'site', 'content', 'episodes.ts'), 'utf8');

const chunks = reg.split(/\n  \{\n/).slice(1);
const eps = chunks
  .map((c) => ({
    episode: Number(c.match(/episode:\s*(\d+)/)?.[1] ?? 0),
    slug: c.match(/slug:\s*"([^"]+)"/)?.[1],
    title: c.match(/title:\s*\n?\s*"([^"]+)"/)?.[1],
    hook: c.match(/hook:\s*\n?\s*"([^"]+)"/)?.[1],
    paper: c.match(/paper:\s*\n?\s*"([^"]+)"/)?.[1],
    paperUrl: c.match(/paperUrl:\s*"([^"]+)"/)?.[1],
  }))
  .filter((e) => e.slug && e.title && e.hook)
  .sort((a, b) => b.episode - a.episode);

if (eps.length === 0) throw new Error('no episodes parsed from registry; refusing to write an empty index');

const live = (s) => `https://baagad-ai.github.io/papersinthewild/episodes/${s}`;
const esc = (s) => String(s).replace(/\|/g, '\\|').replace(/\[/g, '\\[');

const table =
  '| # | Episode | The one line | Paper |\n' +
  '|---|---------|--------------|-------|\n' +
  eps
    .map(
      (e) =>
        `| ${String(e.episode).padStart(2, '0')} | [${esc(e.title)}](${live(e.slug)}) | ${esc(e.hook)} | [${esc(e.paper)}](${e.paperUrl}) |`
    )
    .join('\n');

const latest = eps[0];
const latestLine = `**Latest episode:** [${esc(latest.title)}](${live(latest.slug)})`;

const readme = fs.readFileSync(README, 'utf8');
const splice = (src, startMark, endMark, body) => {
  const a = src.indexOf(startMark);
  const b = src.indexOf(endMark);
  if (a === -1 || b === -1 || b < a) throw new Error(`README markers missing: ${startMark}`);
  return src.slice(0, a + startMark.length) + '\n' + body + '\n' + src.slice(b);
};

let out = splice(readme, '<!-- LATEST:START -->', '<!-- LATEST:END -->', latestLine);
out = splice(out, '<!-- EPISODE-INDEX:START -->', '<!-- EPISODE-INDEX:END -->', table);

fs.writeFileSync(README, out);
console.log(`readme index: ${eps.length} episodes, latest ${latest.slug}`);
