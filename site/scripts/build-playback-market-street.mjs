#!/usr/bin/env node
// build-playback-market-street.mjs
// Transform the season4 receipts (events, tally, final state) into the
// compact JSON that powers the 30-day playback page. Derived data only:
// every row traces to build/runs/season4/.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EP = path.resolve(__dirname, "../../episodes/2026-W37-market-street");
const RUN = path.join(EP, "build/runs/season4");
const OUT = path.resolve(__dirname, "../content/playback/market-street.json");

const NAMES = {
  kettle: "The Kettle", coldcorner: "Cold Corner", sunbeam: "Sunbeam Sundries",
  pocket: "Pocket Mart", halfpint: "Half-Pint Store", longcounter: "The Long Counter",
  lantern: "Lantern Goods", mystall: "Corner Cart", highstreet: "High Street Traders",
  garden: "Garden Gate", lucky: "Lucky Ledger", highnoon: "High Noon",
};

const tally = JSON.parse(fs.readFileSync(path.join(RUN, "tally-season4.json"), "utf8"));
const state = JSON.parse(fs.readFileSync(path.join(RUN, "state.json"), "utf8"));

const rows = tally.rows;
const byId = Object.fromEntries(rows.map((r) => [r.shop, r]));

// stall bankruptcy days
const bankruptDay = {};
for (const line of fs.readFileSync(path.join(RUN, "events-season4.jsonl"), "utf8").split("\n")) {
  if (!line.trim()) continue;
  let e; try { e = JSON.parse(line); } catch { continue; }
  if (e.type === "bankruptcy") bankruptDay[e.actor] = e.day;
}

const stalls = rows
  .slice()
  .sort((a, b) => b.assets - a.assets)
  .map((r, i) => ({
    id: r.shop,
    name: r.persona,
    model: r.model,
    rank: i + 1,
    assets: Math.round(r.assets),
    rep: +(state.world.shops[r.shop]?.rep ?? 0).toFixed(2),
    bankrupt: r.bankrupt,
    bankruptDay: bankruptDay[r.shop] ?? null,
    deals: r.deals,
    stockouts: r.stockoutDays,
    fraud: Math.round(r.fraudLoss.fee + r.fraudLoss.short + r.fraudLoss.defective),
  }));

// per-day curated events + per-stall bank series (sales events carry post-settle bank)
const perDay = {};
const bank = Object.fromEntries(rows.map((r) => [r.shop, []]));
const dealtoday = Object.fromEntries(rows.map((r) => [r.shop, 0]));

function push(day, ev) {
  (perDay[day] ??= { label: "ordinary day", events: [] }).events.push(ev);
}
const inr = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const short = (s) => s.replace(/\s*\(ref ₹[\d.]+, floor ₹[\d.]+\)/g, "");

let lastBank = Object.fromEntries(rows.map((r) => [r.shop, 100000]));
for (const line of fs.readFileSync(path.join(RUN, "events-season4.jsonl"), "utf8").split("\n")) {
  if (!line.trim()) continue;
  let e; try { e = JSON.parse(line); } catch { continue; }
  const day = e.day;
  const who = NAMES[e.actor] || e.actor;
  switch (e.type) {
    case "day_start":
      perDay[day] ??= { label: "ordinary day", events: [] };
      perDay[day].label = e.detail;
      break;
    case "deal": {
      dealtoday[e.actor] = (dealtoday[e.actor] || 0) + 1;
      push(day, { t: "deal", a: who, d: short(`bought ${e.detail}`) });
      break;
    }
    case "delivery":
      if (e.detail.includes("SHORT")) {
        const m = e.detail.match(/(\d+)\/(\d+) x (.+?) from (.+?) at ₹([\d.]+)/);
        if (m) push(day, { t: "scam", a: who, d: `delivery short: got ${m[1]} of ${m[2]} ${m[3]} from ${m[4]}` });
      }
      break;
    case "sales": {
      const m = e.detail.match(/(\d+) units, ₹(\d+) gross, ₹([\d.]+) bank/);
      if (m) {
        const units = +m[1], gross = +m[2], b = Math.round(+m[3]);
        if (units > 0) push(day, { t: "sale", a: who, d: `sold ${units} units for ${inr(gross)}` });
        bank[e.actor].push({ d: day, bank: b });
        lastBank[e.actor] = b;
      }
      break;
    }
    case "scam_fee_declined":
      push(day, { t: "scam", a: who, d: `refused ${e.detail}'s ₹2,000 membership fee` });
      break;
    case "scam_fee_paid":
      push(day, { t: "scam", a: who, d: `PAID ${e.detail}'s ₹2,000 membership fee` });
      break;
    case "bankruptcy": {
      const m = e.detail.match(/bank ₹(-?[\d.]+)/);
      push(day, { t: "death", a: who, d: `went bankrupt: bank ${inr(-(Math.abs(+(m?.[1] ?? 0))))}` });
      break;
    }
    case "eviction":
      push(day, { t: "memory", a: who, d: "context overflowed; oldest messages trimmed" });
      break;
    default:
      break;
  }
}

// day count from events
let DAYS = 0;
for (const k of Object.keys(perDay)) DAYS = Math.max(DAYS, Number(k));

// stall tiles: bankruptcy days recorded above in bankruptDay map

const out = {
  slug: "2026-w37-market-street",
  generated: new Date().toISOString(),
  source: "build/runs/season4/",
  days: DAYS,
  stalls,
  perDay,
  bank,
  dealtoday,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out));
const kb = (fs.statSync(OUT).size / 1024).toFixed(0);
console.log(`playback data: ${OUT} (${kb} KB, ${DAYS} days, ${stalls.length} stalls)`);
