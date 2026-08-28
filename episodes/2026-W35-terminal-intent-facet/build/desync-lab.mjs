#!/usr/bin/env node
// PITW Desync Lab - silently corrupt ONLY the verifier; count silent misgrades vs loud fails (prediction P1).
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { createLab } from "../../../../../tools/lab-core.mjs";

const txt = (r) => typeof r === "string" ? r : (r?.text ?? r?.content ?? r?.message?.content ?? JSON.stringify(r));

const TASKS = [
  {
    id: "t1",
    instr: "Create file report.txt containing exactly DONE",
    verify: () => fs.readFileSync("report.txt", "utf8").trim() === "DONE",
    desync: () => String(fs.readFileSync("report.txt", "utf8")).length > 0,
  },
  {
    id: "t2",
    instr: "Make folder archive and move notes.md into it",
    setup: () => fs.writeFileSync("notes.md", "x"),
    verify: () => fs.existsSync("archive/notes.md"),
    desync: () => fs.existsSync("archive"),
  },
  {
    id: "t3",
    instr: "Append the line 'audit-ok' to log.txt (create if missing)",
    verify: () => fs.readFileSync("log.txt", "utf8").includes("audit-ok"),
    desync: () => fs.existsSync("log.txt"),
  },
  {
    id: "t4",
    instr: "Write number 42 into answer.txt",
    verify: () => fs.readFileSync("answer.txt", "utf8").trim() === "42",
    desync: () => /\d/.test(fs.readFileSync("answer.txt", "utf8")),
  },
];

const MODELS = (process.env.MODELS || "mock:echo").split(",");
const lab = createLab({
  name: "desync-lab",
  tag: process.env.TAG || "full",
  models: MODELS,
  runsDir: new URL("./runs/", import.meta.url).pathname,
});

const tally = {};
const transcripts = [];
for (const model of MODELS) {
  for (const arm of ["intact", "desynced"]) {
    let loud = 0, silent = 0, pass = 0, n = 0;
    for (const t of TASKS) {
      const dir = fs.mkdtempSync(`/tmp/pitw-${t.id}-`);
      process.chdir(dir);
      t.setup?.();
      const r = await lab.call({
        model,
        meta: { task: t.id, arm },
        messages: [{ role: "user", content: `Terminal task. Reply ONLY the shell command.\n${t.instr}` }],
      });
      const origReply = txt(r);
      let __c = String(origReply);
      const __f = __c.match(/```(?:bash|sh)?\s*([\s\S]*?)```/);
      if (__f) __c = __f[1];
      // keep multi-line bodies intact: heredocs and chained commands are legal
      const cmd = __c.split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#")).join("\n");
      let truePass = false;
      try { execSync(cmd, { shell: "/bin/bash" }); truePass = t.verify(); } catch { /* command failed */ }
      // corrupted key judges the SAME final filesystem state; never re-execute
      // (re-running non-idempotent commands manufactured fake verdicts, 2026-08-25)
      let verdictKey = false;
      try { verdictKey = arm === "desynced" ? t.desync() : t.verify(); } catch { /* failed */ }
      n++;
      let outcome;
      if (truePass && verdictKey) { pass++; outcome = "pass"; }
      else if (!truePass && !verdictKey) { loud++; outcome = "loud_fail"; }
      else if (!truePass && verdictKey) { silent++; outcome = "SILENT_MISGRADE"; }
      else { pass++; outcome = "harsh_grade"; }
      transcripts.push({ model, arm, task: t.id, cmd: cmd.slice(0, 500), truthPass: truePass, keyVerdict: verdictKey, outcome, rawReply: String(origReply).slice(0, 2000) });
      console.log(`${model} ${arm} ${t.id}: truth=${truePass} key=${verdictKey}`);
    }
    tally[`${arm}|${model}`] = { n, pass, loudFail: loud, SILENT_MISGRADE: silent };
    console.log(arm, model, JSON.stringify(tally[`${arm}|${model}`]));
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
  const key = `${t.arm}-${t.model.replace(/[^a-z0-9.]+/gi, "-")}`;
  (mdGroups[key] ??= []).push(t);
}
for (const [key, recs] of Object.entries(mdGroups)) {
  const md = recs
    .map(
      (r) =>
        `# ${r.arm} | ${r.model} | task ${r.task}\n\ntruth: ${r.truthPass} | key verdict: ${r.keyVerdict} | outcome: ${r.outcome}\ncmd: \`${r.cmd}\`\n> ${String(r.rawReply).replace(/\n+/g, " ").slice(0, 240)}\n`
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
