"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * RelationshipMap - who trusts whom in the world (v5.1 World tier; use only
 * when the paper is social). Agents sit on a circle; links are drawn as
 * lines: trust = ink solid, love = oxblood solid, distrust = dashed ink.
 * Clicking a node highlights its links and dims the rest. Hand-rolled SVG,
 * no graph library; SpreadRing's ring math, repurposed for edges.
 *
 * Usage in MDX:
 *   <RelationshipMap
 *     caption="Day 6: two kitchens, one conspiracy"
 *     nodes={[
 *       { name: "Mira", model: "phi4-mini" },
 *       { name: "Rao", model: "qwen3:8b" },
 *       { name: "Okoye", model: "gemma3:12b" },
 *     ]}
 *     links={[
 *       { from: "Mira", to: "Okoye", kind: "trust" },
 *       { from: "Mira", to: "Rao", kind: "distrust" },
 *     ]}
 *   />
 *
 * No-JS: the complete graph is in the SVG (labels, links, legend); clicking
 * only changes emphasis. Decorative circles carry aria-hidden; the node
 * labels are real SVG text.
 */
const LINK_STYLES: Record<string, { stroke: string; dash?: string; label: string }> = {
  trust: { stroke: "var(--ink, #1A1612)", label: "trust" },
  love: { stroke: "var(--oxblood, #7C2D2D)", label: "alliance" },
  distrust: { stroke: "var(--ink-mute, #6B5F4F)", dash: "5 4", label: "distrust" },
};

const SIZE = 340;
const CENTER = SIZE / 2;
const RADIUS = 118;

export function RelationshipMap({
  nodes,
  links,
  caption,
  className,
}: {
  nodes: { name: string; model?: string }[];
  links: { from: string; to: string; kind?: "trust" | "love" | "distrust" }[];
  caption?: string;
  className?: string;
}) {
  const [active, setActive] = useState<string | null>(null);

  const pos = new Map(
    nodes.map((n, i) => {
      const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
      return [n.name, { x: CENTER + RADIUS * Math.cos(angle), y: CENTER + RADIUS * Math.sin(angle) }];
    })
  );

  const linkActive = (l: { from: string; to: string }) =>
    active === null || l.from === active || l.to === active;

  const kindsPresent = [...new Set(links.map((l) => l.kind ?? "trust"))];

  return (
    <figure className={cn("my-8", className)}>
      <div className="flex justify-center border-y border-rule py-6">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="w-full max-w-[22rem]"
          role="img"
          aria-label={`Relationship map: ${nodes.map((n) => n.name).join(", ")}`}
        >
          {links.map((l, i) => {
            const a = pos.get(l.from);
            const b = pos.get(l.to);
            if (!a || !b) return null;
            const style = LINK_STYLES[l.kind ?? "trust"];
            const on = linkActive(l);
            return (
              <line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={style.stroke}
                strokeWidth={on ? 2 : 1}
                strokeDasharray={style.dash}
                opacity={on ? 1 : 0.18}
                className="transition-all duration-[var(--motion-fast)]"
              />
            );
          })}
          {nodes.map((n) => {
            const p = pos.get(n.name);
            if (!p) return null;
            const on = active === null || active === n.name;
            return (
              <g
                key={n.name}
                onClick={() => setActive(active === n.name ? null : n.name)}
                className="cursor-pointer"
                opacity={on ? 1 : 0.35}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={active === n.name ? 9 : 7}
                  fill={active === n.name ? "var(--oxblood, #7C2D2D)" : "var(--paper, #F5EFE0)"}
                  stroke="var(--ink, #1A1612)"
                  strokeWidth="1.5"
                  className="transition-all duration-[var(--motion-fast)]"
                />
                <text
                  x={p.x}
                  y={p.y - 15}
                  textAnchor="middle"
                  className="fill-[var(--ink,#1A1612)] font-mono"
                  fontSize="12"
                >
                  {n.name}
                </text>
                {n.model && (
                  <text
                    x={p.x}
                    y={p.y + 22}
                    textAnchor="middle"
                    className="fill-[var(--oxblood,#7C2D2D)] font-mono"
                    fontSize="8.5"
                    letterSpacing="0.5"
                  >
                    {n.model}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
        {kindsPresent.map((k) => {
          const style = LINK_STYLES[k] ?? LINK_STYLES.trust;
          return (
            <span key={k} className="flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-wider text-ink-mute">
              <svg width="22" height="6" aria-hidden>
                <line x1="0" y1="3" x2="22" y2="3" stroke={style.stroke} strokeWidth="2" strokeDasharray={style.dash} />
              </svg>
              {style.label}
            </span>
          );
        })}
        <span className="font-mono text-[0.7rem] uppercase tracking-wider text-ink-mute">
          click a node to isolate its links
        </span>
      </div>
      {caption && (
        <figcaption className="mt-2 font-mono text-meta uppercase tracking-wider text-ink-mute">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
