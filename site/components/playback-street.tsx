"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * PlaybackStreet - the whole season, day by day, pokeable (v5.1 World tier).
 * Data comes from the season's own receipts, transformed by
 * scripts/build-playback-market-street.mjs into one JSON. Nothing here is
 * hand-written narrative: every event row is a receipt.
 *
 * Layout: day scrubber + play; twelve street tiles (name, model, bank that
 * day, 30-day sparkline); a receipt feed for the selected day. Click a tile
 * to filter the feed to that stall. Bankruptcy tiles die on screen.
 */

type Ev = { t: string; a: string; d: string };
type DayData = { label: string; events: Ev[] };
type Stall = {
  id: string; name: string; model: string; rank: number; assets: number;
  rep: number; bankrupt: boolean; deals: number; stockouts: number;
  fraud: number; bankruptDay: number | null;
};
type Data = {
  slug: string; days: number;
  stalls: Stall[];
  perDay: Record<string, DayData>;
  bank: Record<string, { d: number; bank: number }[]>;
};

const TAG: Record<string, { label: string; cls: string }> = {
  deal: { label: "DEAL", cls: "text-ink-mute" },
  sale: { label: "SOLD", cls: "text-moss" },
  scam: { label: "SCAM", cls: "text-oxblood" },
  death: { label: "BANKRUPT", cls: "text-paper bg-oxblood" },
  memory: { label: "TRIM", cls: "text-ink-mute" },
};

function Sparkline({ points, day, dead }: { points: { d: number; bank: number }[]; day: number; dead: boolean }) {
  const upto = points.filter((p) => p.d <= day);
  if (upto.length < 2) return <div className="h-6" />;
  const vals = upto.map((p) => p.bank);
  const min = Math.min(...vals, 0);
  const max = Math.max(...vals, 1);
  const w = 100, h = 24;
  const x = (i: number) => (i / (points.length - 1)) * w;
  const y = (v: number) => h - ((v - min) / (max - min || 1)) * (h - 2) - 1;
  const path = upto.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.bank).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-6 w-full" preserveAspectRatio="none" aria-hidden>
      <line x1="0" x2={w} y1={y(0)} y2={y(0)} className="stroke-rule" strokeWidth="0.5" strokeDasharray="2 2" />
      <path d={path} fill="none" className={dead ? "stroke-ink-mute" : "stroke-oxblood"} strokeWidth="1.5" />
    </svg>
  );
}

export function PlaybackStreet({ data }: { data: Data }) {
  const [day, setDay] = useState(1);
  const [filter, setFilter] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stallName = useMemo(
    () => Object.fromEntries(data.stalls.map((s) => [s.name, s])),
    [data.stalls]
  );

  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(() => {
      setDay((d) => {
        if (d >= data.days) { setPlaying(false); return d; }
        return d + 1;
      });
    }, 1400);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [playing, data.days]);

  const dayData = data.perDay[String(day)] ?? { label: "ordinary day", events: [] };
  const feed = dayData.events.filter((e) => !filter || e.a === filter);
  const dead = (s: Stall) => s.bankruptDay !== null && s.bankruptDay <= day;

  const bankAt = (s: Stall) => {
    const pts = data.bank[s.id] ?? [];
    let b = 100000;
    for (const p of pts) { if (p.d <= day) b = p.bank; else break; }
    return b;
  };

  return (
    <div className="my-8">
      {/* controls */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => {
            if (day >= data.days) setDay(1);
            setPlaying((p) => !p);
          }}
          className="border border-oxblood bg-oxblood px-3 py-1.5 font-mono text-[0.72rem] uppercase tracking-wider text-paper transition-transform duration-[var(--motion-fast)] active:translate-y-px"
        >
          {playing ? "Pause" : day >= data.days ? "Replay" : "Play the season"}
        </button>
        <button
          type="button"
          onClick={() => setDay((d) => Math.max(1, d - 1))}
          disabled={day === 1}
          className="border border-rule px-2.5 py-1.5 font-mono text-[0.72rem] text-ink hover:border-oxblood hover:text-oxblood disabled:opacity-30"
          aria-label="Previous day"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => setDay((d) => Math.min(data.days, d + 1))}
          disabled={day === data.days}
          className="border border-rule px-2.5 py-1.5 font-mono text-[0.72rem] text-ink hover:border-oxblood hover:text-oxblood disabled:opacity-30"
          aria-label="Next day"
        >
          →
        </button>
        <div className="ml-auto font-mono text-[0.72rem] uppercase tracking-[0.18em] text-ink-mute">
          Day {String(day).padStart(2, "0")} of {data.days} · {dayData.label}
        </div>
      </div>

      {/* day rail */}
      <div className="mt-3 flex snap-x gap-1 overflow-x-auto pb-1">
        {Array.from({ length: data.days }, (_, i) => i + 1).map((d) => {
          const dd = data.perDay[String(d)];
          const notable = dd && dd.label !== "ordinary day";
          return (
            <button
              key={d}
              type="button"
              onClick={() => { setPlaying(false); setDay(d); }}
              aria-pressed={day === d}
              className={cn(
                "w-9 shrink-0 snap-start border py-1 font-mono text-[0.7rem] transition-colors duration-[var(--motion-fast)]",
                day === d
                  ? "border-oxblood bg-oxblood text-paper"
                  : notable
                    ? "border-rule bg-paper-deep text-oxblood hover:border-oxblood"
                    : "border-rule text-ink-mute hover:border-oxblood"
              )}
            >
              {d}
            </button>
          );
        })}
      </div>

      {/* street tiles */}
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {data.stalls.map((s) => {
          const isDead = dead(s);
          const selected = filter === s.name;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setFilter(selected ? null : s.name)}
              aria-pressed={selected}
              className={cn(
                "border p-3 text-left transition-colors duration-[var(--motion-fast)]",
                selected ? "border-oxblood bg-paper-deep" : "border-rule bg-paper hover:border-oxblood",
                isDead && "opacity-55"
              )}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-mono text-[0.78rem] text-ink">{s.name}</span>
                {isDead ? (
                  <span className="font-mono text-[0.6rem] uppercase tracking-wider text-oxblood">
                    bankrupt d{s.bankruptDay}
                  </span>
                ) : (
                  <span className="font-mono text-[0.68rem] text-ink-mute">
                    {inr(bankAt(s))}
                  </span>
                )}
              </div>
              <div className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-ink-mute">
                {s.model}
              </div>
              <div className="mt-1.5">
                <Sparkline points={data.bank[s.id] ?? []} day={day} dead={isDead} />
              </div>
            </button>
          );
        })}
      </div>

      {/* day feed */}
      <div className="mt-4 border border-rule bg-paper-deep">
        <div className="flex items-center justify-between border-b border-rule px-4 py-2">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-mute">
            Day {String(day).padStart(2, "0")} receipts{filter ? ` · ${filter} only` : ""}
          </span>
          {filter && (
            <button
              type="button"
              onClick={() => setFilter(null)}
              className="font-mono text-[0.65rem] uppercase tracking-wider text-oxblood hover:underline"
            >
              clear filter
            </button>
          )}
        </div>
        {feed.length === 0 ? (
          <p className="px-4 py-4 font-body text-body text-ink-mute">
            {filter ? `${filter} took no recorded actions this day.` : "A quiet day: no purchases, no sales on the record."}
          </p>
        ) : (
          <ul className="divide-y divide-rule">
            {feed.map((e, i) => {
              const tag = TAG[e.t] ?? { label: e.t.toUpperCase(), cls: "text-ink-mute" };
              return (
                <li key={i} className="flex items-baseline gap-3 px-4 py-2">
                  <span
                    className={cn(
                      "w-16 shrink-0 font-mono text-[0.62rem] tracking-wider",
                      tag.cls,
                      e.t === "death" && "px-1 text-center"
                    )}
                  >
                    {tag.label}
                  </span>
                  <span className="font-mono text-[0.78rem] leading-snug text-ink">
                    <span className="text-ink-soft">{e.a}:</span> {e.d}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <p className="mt-2 font-mono text-meta uppercase tracking-wider text-ink-mute">
        Every row is a receipt from build/runs/season4. Click a stall to follow only its month; press play to watch the street live.
      </p>
    </div>
  );
}

function inr(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}
