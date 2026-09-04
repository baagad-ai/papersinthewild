#!/usr/bin/env node
// preview.mjs - serve the static export under the production base path.
//
// Incident 2026-09-04: `serve out` at root strips the /papersinthewild prefix
// that next.config basePath bakes into every asset URL, so CSS and fonts 404
// and the preview renders raw unstyled HTML while "build green" says nothing.
// This server mounts out/ at the base path exactly like GitHub Pages does, then
// self-checks that the episode page's CSS actually resolves. Exit code 1 on a
// failed check, so a broken preview can never look like a working one.
//
// Usage: npm run preview   (or: node scripts/preview.mjs)

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, '..', 'out');
const BASE = '/papersinthewild';
const PORT = Number(process.env.PREVIEW_PORT || 3111);
const EPISODE = process.env.PREVIEW_EPISODE || '2026-w36-engine-as-referee';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.mjs': 'text/javascript', '.json': 'application/json', '.xml': 'application/xml',
  '.txt': 'text/plain', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.map': 'application/json',
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  if (urlPath !== BASE && !urlPath.startsWith(BASE + '/')) {
    res.writeHead(302, { Location: BASE + '/' });
    res.end();
    return;
  }
  let rel = urlPath.slice(BASE.length);
  if (rel.endsWith('/')) rel += 'index.html';
  let file = path.join(OUT, rel);
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    if (fs.existsSync(file + '.html')) file += '.html';
    else {
      res.writeHead(404, { 'content-type': 'text/plain' });
      res.end('not found: ' + urlPath);
      return;
    }
  }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, async () => {
  const home = `http://localhost:${PORT}${BASE}/`;
  const episode = `http://localhost:${PORT}${BASE}/episodes/${EPISODE}`;
  console.log(`preview:  ${home}`);
  console.log(`episode:  ${episode}`);
  try {
    if (!fs.existsSync(OUT)) throw new Error('out/ missing; run npm run build first');
    const html = await fetch(episode).then((r) => { if (!r.ok) throw new Error(`episode page ${r.status}`); return r.text(); });
    const cssHrefs = [...html.matchAll(/href="([^"]*\/_next\/static\/css\/[^"]+\.css)"/g)].map((m) => m[1]);
    if (cssHrefs.length === 0) throw new Error('episode html references no css (unstyled page ahead)');
    for (const href of cssHrefs) {
      const res = await fetch(new URL(href, `http://localhost:${PORT}`));
      if (!res.ok) throw new Error(`css ${href} -> ${res.status}`);
      console.log(`self-check: ${href} ${res.status} OK`);
    }
    console.log('self-check: styled preview verified');
  } catch (e) {
    console.error(`self-check FAILED: ${e.message}`);
    process.exitCode = 1;
    server.close();
  }
});
