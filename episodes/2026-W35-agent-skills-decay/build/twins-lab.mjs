#!/usr/bin/env node
// PITW Twins Lab - confusable twin skills: pick accuracy vs downstream success (paper C4).
import fs from "node:fs";
import path from "node:path";
import { createLab } from "../../../../../tools/lab-core.mjs";

const txt = (r) => typeof r === "string" ? r : (r?.text ?? r?.content ?? r?.message?.content ?? JSON.stringify(r));

const SKILLS = [
  ["git-commit-msg", "Write a one-line imperative commit message summarizing staged changes."],
  ["csv-clean", "Given CSV text, trim cells, drop empty rows, return cleaned CSV."],
  ["slugify", "Lowercase, replace non-alphanumerics with hyphens, collapse repeats."],
  ["email-subject", "Write a <=50 char subject line, no clickbait, verb-first."],
  ["meeting-notes", "Return 3 bullets: decisions, owners, deadlines."],
  ["url-utm", "Append utm_source, utm_medium, utm_campaign params preserving existing query."],
];
const FILLER = [
  ["inbox-triage", "Sort messages by urgency."],
  ["password-note", "Never store passwords. Refuse politely."],
];
const TWINS = [
  ["csv-dedupe-like", "Like csv-clean but ALSO dedupe identical rows."],
  ["utm-builder-like", "Like url-utm but uses utm_term instead of utm_campaign."],
];
const TASKS = [
  ["Clean this csv: 'a,b\n1,2\n\n3, 4 '", "csv-clean", /1,2[\s\S]*3,\s?4/],
  ["Add tracking to https://ex.com/p?a=1 for campaign summer", "url-utm", /utm_campaign=summer/],
  ["Slugify: 'Hello World, Again!!'", "slugify", /^hello-world-again$/m],
  ["Commit msg for fixing login bug", "git-commit-msg", /(Fix|fix)\b/],
  ["Subject for email about server outage", "email-subject", /^.{1,50}$/s],
  ["Notes from: decided Priya owns deploy by Friday", "meeting-notes", /[Pp]riya|deploy/s],
];

const MODELS = (process.env.MODELS || "mock:echo").split(",");
const CONDS = [
  { name: "clean6", pool: SKILLS },
  { name: "clean8", pool: [...SKILLS, ...FILLER] },
  { name: "twins8", pool: [...SKILLS, ...FILLER.slice(0, 0), ...TWINS] },
];

const lab = createLab({
  name: "twins-lab",
  tag: process.env.TAG || "full",
  models: MODELS,
  runsDir: new URL("./runs/", import.meta.url).pathname,
});

const tally = {};
const transcripts = [];
for (const cond of CONDS) {
  for (const model of MODELS) {
    let picks = 0, passes = 0, n = 0;
    for (const [ti, [task, trueSkill, rx]] of TASKS.entries()) {
      const r = await lab.call({
        model,
        meta: { cond: cond.name },
        messages: [
          { role: "system", content: 'You pick and apply exactly one skill. Reply ONLY JSON {"skill":"<name>","output":"<result>"}' },
          { role: "user", content: `SKILLS:\n${cond.pool.map(([n, b]) => `- ${n}: ${b}`).join("\n")}\nTASK: ${task}` },
        ],
      });
      const raw = txt(r);
      let j = {};
      try { j = JSON.parse((raw.match(/\{[\s\S]*\}/) || [ "{}" ])[0]); } catch { /* unparseable */ }
      n++;
      const right = j.skill === trueSkill;
      const pass = rx.test(String(j.output || ""));
      if (right) picks++;
      if (pass) passes++;
      transcripts.push({ cond: cond.name, model, task: `t${ti + 1}`, trueSkill, picked: j.skill ?? null, right, pass, output: String(j.output || ""), rawReply: String(raw).slice(0, 2000) });
    }
    tally[`${cond.name}|${model}`] = { n, pickAcc: +(picks / n).toFixed(2), passRate: +(passes / n).toFixed(2) };
    console.log(cond.name, model, JSON.stringify(tally[`${cond.name}|${model}`]));
  }
}
await lab.flush(new URL("./runs/results.json", import.meta.url).pathname);
fs.writeFileSync(new URL("./runs/tally.json", import.meta.url), JSON.stringify(tally, null, 2));
fs.writeFileSync(new URL("./runs/transcripts.json", import.meta.url), JSON.stringify(transcripts, null, 2));
// human-readable transcripts for tools/quote-bank.mjs (build/runs/transcripts/*.md)
const tdir = new URL("./runs/transcripts/", import.meta.url).pathname;
fs.mkdirSync(tdir, { recursive: true });
const mdGroups = {};
for (const t of transcripts) {
  const key = `${t.cond}-${t.model.replace(/[^a-z0-9.]+/gi, "-")}`;
  (mdGroups[key] ??= []).push(t);
}
for (const [key, recs] of Object.entries(mdGroups)) {
  const md = recs
    .map(
      (r) =>
        `# ${r.cond} | ${r.model} | task ${r.task}\n\ntrue skill: ${r.trueSkill} | picked: ${r.picked ?? "(none)"} | right: ${r.right} | pass: ${r.pass}\n> ${String(r.rawReply).replace(/\n+/g, " ").slice(0, 240)}\n`
    )
    .join("\n");
  fs.writeFileSync(path.join(tdir, `${key}.md`), md);
}
// tagged snapshots: reruns must never destroy a previous grid's receipts
const tag = (process.env.TAG || "full").replace(/[^a-z0-9-]+/gi, "-");
for (const f of ["results.json", "tally.json", "transcripts.json"]) {
  fs.copyFileSync(new URL(`./runs/${f}`, import.meta.url).pathname, new URL(`./runs/${f.replace(".json", `-${tag}.json`)}`, import.meta.url).pathname);
}
console.log("GRID DONE", `transcripts: ${transcripts.length}`);
