#!/usr/bin/env node
/**
 * generate-og.mjs — generate Open Graph PNG images for PITW episodes.
 *
 * Reads episode metadata from site/content/episodes.ts, generates an SVG per
 * episode using the branded template, rasterizes to PNG via sharp.
 *
 * Usage:
 *   node scripts/generate-og.mjs                    # generate for ALL episodes
 *   node scripts/generate-og.mjs --slug=2026-w33-prompt-induced-waste  # one episode
 *   node scripts/generate-og.mjs --default          # regenerate the generic og-default only
 *
 * Output:
 *   public/og-default.png         (branded default, used when no episode OG applies)
 *   public/og/{slug}.png          (per-episode, 1200×630)
 *
 * Requires: sharp (already in site/package.json devDependencies).
 *
 * Brand lock-in (per BRAND.md + DESIGN-SYSTEM.md):
 *   - palette: paper #F5EFE0, ink #1A1612, ink-soft #3C342B, ink-mute #6B5F4F,
 *     rule #C9BFA7, oxblood #7C2D2D
 *   - fonts: Fraunces (display, falls back to Georgia), Source Serif 4 (body),
 *     IBM Plex Mono (mono, falls back to Courier New)
 *   - em-dash ban: titles + subtitles must not contain em-dashes
 */

import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = resolve(__dirname, "..");
const PUBLIC_DIR = join(SITE_ROOT, "public");
const OG_DIR = join(PUBLIC_DIR, "og");

// Parse args
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? "true"];
  }),
);

mkdirSync(OG_DIR, { recursive: true });

// ─────────────────────────────────────────────────────────────
// Read episodes.ts (regex parse, since it's a TS module not JSON)
// ─────────────────────────────────────────────────────────────
function readEpisodes() {
  const ts = readFileSync(join(SITE_ROOT, "content", "episodes.ts"), "utf8");
  // Match each episode block: { slug: "...", ... }
  const blocks = [...ts.matchAll(/slug:\s*"([^"]+)"[\s\S]*?(?=\}|$)/g)];
  return blocks.map((m) => {
    const block = m[0];
    const get = (key) => {
      const r = new RegExp(`${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`);
      const match = block.match(r);
      return match ? match[1].replace(/\\(.)/g, "$1") : "";
    };
    const getList = (key) => {
      const r = new RegExp(`${key}:\\s*\\[([^\\]]+)\\]`);
      const match = block.match(r);
      if (!match) return [];
      return match[1]
        .split(",")
        .map((s) => s.trim().replace(/"/g, ""))
        .filter(Boolean);
    };
    return {
      slug: get("slug"),
      episode: parseInt((block.match(/episode:\s*(\d+)/) || [])[1] ?? "0", 10),
      title: get("title"),
      subtitle: get("subtitle"),
      hook: get("hook"),
      date: get("date"),
      paper: get("paper"),
      paperUrl: get("paperUrl"),
      tags: getList("tags"),
      readingTime: get("readingTime"),
      teaser: get("teaser"),
    };
  });
}

// ─────────────────────────────────────────────────────────────
// Escape text for SVG (handle ampersands, <, >)
// ─────────────────────────────────────────────────────────────
const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Wrap long titles onto multiple lines (max ~14 chars per line at 64px Fraunces)
function wrapTitle(title, maxCharsPerLine = 18, maxLines = 3) {
  const words = title.split(/\s+/);
  const lines = [];
  let current = "";
  for (const w of words) {
    if ((current + " " + w).trim().length <= maxCharsPerLine) {
      current = (current + " " + w).trim();
    } else {
      if (current) lines.push(current);
      current = w;
      if (lines.length >= maxLines - 1) break;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  // If we ran out of room, append "…" to last line
  return lines;
}

// ─────────────────────────────────────────────────────────────
// SVG template for an episode OG
// ─────────────────────────────────────────────────────────────
function episodeSvg(ep) {
  const titleLines = wrapTitle(ep.title, 22, 3);
  const titleTspans = titleLines
    .map(
      (line, i) =>
        `<tspan x="64" dy="${i === 0 ? 0 : 78}">${esc(line)}</tspan>`,
    )
    .join("");

  // Episode meta strip
  const epMeta = `EP. ${String(ep.episode).padStart(2, "0")} · ${ep.date}`;

  // Subtitle (wrapped if needed)
  const subtitleLines = wrapTitle(ep.subtitle, 70, 2);
  const subtitleTspans = subtitleLines
    .map(
      (line, i) =>
        `<tspan x="64" dy="${i === 0 ? 0 : 34}">${esc(line)}</tspan>`,
    )
    .join("");

  // Paper attribution (single line, truncated if needed)
  const paper = ep.paper.length > 70 ? ep.paper.slice(0, 67) + "…" : ep.paper;

  return `<svg viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(ep.title)}">
  <rect width="1200" height="630" fill="#F5EFE0" />

  <!-- Top-left: compact wordmark + seal -->
  <g transform="translate(64, 56)">
    <text x="0" y="20" font-family="'IBM Plex Mono', 'Courier New', monospace" font-size="16" font-weight="500" fill="#1A1612" letter-spacing="0.5">papers in the wild</text>
    <rect x="180" y="6" width="14" height="14" fill="#7C2D2D" />
  </g>

  <!-- Top-right: EPISODE meta -->
  <text x="1136" y="76" text-anchor="end" font-family="'IBM Plex Mono', 'Courier New', monospace" font-size="13" fill="#6B5F4F" letter-spacing="2">${esc(epMeta.toUpperCase())}</text>

  <!-- Ink rule below header -->
  <rect x="64" y="100" width="6" height="6" fill="#7C2D2D" />
  <line x1="76" y1="103" x2="1136" y2="103" stroke="#C9BFA7" stroke-width="1" />

  <!-- Center: episode title (Fraunces italic, multi-line) -->
  <text x="64" y="240" font-family="'Fraunces', Georgia, serif" font-size="72" font-weight="500" font-style="italic" fill="#1A1612">${titleTspans}</text>

  <!-- Subtitle (Source Serif, 2 lines max) -->
  <text x="64" y="${240 + titleLines.length * 78 + 60}" font-family="'Source Serif 4', Georgia, serif" font-size="26" fill="#3C342B">${subtitleTspans}</text>

  <!-- Paper attribution -->
  <text x="64" y="555" font-family="'IBM Plex Mono', 'Courier New', monospace" font-size="14" fill="#6B5F4F" letter-spacing="1">PAPER · ${esc(paper)}</text>
  <text x="1136" y="555" text-anchor="end" font-family="'IBM Plex Mono', 'Courier New', monospace" font-size="14" fill="#6B5F4F" letter-spacing="2">papersinthewild.io</text>

  <!-- Large oxblood seal in bottom-right corner (subtle) -->
  <g transform="translate(980, 410)" opacity="0.15">
    <circle cx="100" cy="100" r="80" fill="none" stroke="#7C2D2D" stroke-width="3" />
    <text x="100" y="115" text-anchor="middle" font-family="'IBM Plex Mono', monospace" font-size="36" font-weight="500" letter-spacing="4" fill="#7C2D2D">PITW</text>
  </g>
</svg>`;
}

// ─────────────────────────────────────────────────────────────
// Default OG (generic, no episode data)
// ─────────────────────────────────────────────────────────────
function defaultSvg() {
  const svg = readFileSync(join(PUBLIC_DIR, "og-default.svg"));
  return svg;
}

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────
async function main() {
  if (args.default) {
    console.log("→ Generating og-default.png");
    await sharp(defaultSvg(), { density: 200 })
      .resize(1200, 630)
      .png()
      .toFile(join(PUBLIC_DIR, "og-default.png"));
    console.log("✓ public/og-default.png");
    return;
  }

  const episodes = readEpisodes();
  const filtered = args.slug
    ? episodes.filter((e) => e.slug === args.slug)
    : episodes;

  if (filtered.length === 0) {
    console.error(`No episodes found${args.slug ? ` for slug: ${args.slug}` : ""}.`);
    console.error("Available slugs:", episodes.map((e) => e.slug).join(", "));
    process.exit(1);
  }

  for (const ep of filtered) {
    console.log(`→ Generating og/${ep.slug}.png`);
    const svg = Buffer.from(episodeSvg(ep));
    const outPath = join(OG_DIR, `${ep.slug}.png`);
    await sharp(svg, { density: 200 })
      .resize(1200, 630)
      .png()
      .toFile(outPath);
    console.log(`✓ ${outPath}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
