"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PlotModule = typeof import("@observablehq/plot");

type PlotDatum = Record<string, number | string | Date | null | undefined>;

/**
 * PlotChart - Observable Plot wrapper for inline story charts.
 *
 * Two ways to specify the chart:
 *   1. Simple typed encoding (MDX-friendly, serializable props):
 *        <PlotChart
 *          data={[{ round: 1, believers: 1 }, { round: 2, believers: 2 }]}
 *          mark="line" x="round" y="believers" color="oxblood"
 *          caption="Infected agents per round"
 *        />
 *   2. A render function receiving the Plot module (TSX use, full control):
 *        <PlotChart render={(Plot) => Plot.plot({ marks: [...] })} />
 *
 * Plot is dynamically imported inside useEffect, so the library never lands
 * in the initial bundle and nothing runs during SSR. Static export / no-JS:
 * renders the optional `fallback` node (pass a static SVG or a note).
 * Colors pass through palette CSS variables so the chart consumes tokens.
 */
export function PlotChart({
  data,
  mark = "line",
  x,
  y,
  color = "oxblood",
  series,
  xOrder,
  height = 260,
  caption,
  fallback,
  render,
  className,
}: {
  data?: PlotDatum[];
  mark?: "line" | "area" | "bar" | "dot";
  x?: string;
  y?: string;
  color?: "oxblood" | "oxblood-deep" | "moss" | "ink" | "rule" | "highlight";
  /** field name to group by; draws one mark per group with the palette cycle */
  series?: string;
  /** explicit domain for an ordinal x-axis (stops alphabetical re-sorting) */
  xOrder?: (string | number)[];
  height?: number;
  caption?: string;
  fallback?: ReactNode;
  render?: (Plot: PlotModule) => Element;
  className?: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);

  // Serializable snapshot: only these re-trigger the (lazy) Plot render.
  const specKey = JSON.stringify({ data, mark, x, y, color, series, xOrder, height });
  const liveRef = useRef({ data, mark, x, y, color, series, xOrder, height, render });
  useEffect(() => {
    liveRef.current = { data, mark, x, y, color, series, xOrder, height, render };
  });

  useEffect(() => {
    let cancelled = false;
    import("@observablehq/plot").then((Plot) => {
      const box = boxRef.current;
      if (cancelled || !box) return;
      const spec = liveRef.current;
      try {
        let svg: Element | null = null;
        if (spec.render) {
          svg = spec.render(Plot);
        } else if (spec.data && spec.x && spec.y) {
          const palette = ["oxblood", "moss", "ink", "highlight"];
          const groups: { key: string; rows: PlotDatum[]; stroke: string }[] =
            spec.series
              ? [
                  ...new Set(
                    spec.data.map((d) => String(d[spec.series!] ?? ""))
                  ),
                ].map((key, i) => ({
                  key,
                  rows: spec.data!.filter(
                    (d) => String(d[spec.series!]) === key
                  ),
                  stroke: `var(--${palette[i % palette.length]})`,
                }))
              : [
                  {
                    key: "",
                    rows: spec.data,
                    stroke: `var(--${spec.color})`,
                  },
                ];
          const encodings = { x: spec.x, y: spec.y };
          const marks: ReturnType<PlotModule["dot"]>[] = [];
          for (const g of groups) {
            if (spec.mark === "line")
              marks.push(
                Plot.line(g.rows, {
                  ...encodings,
                  stroke: g.stroke,
                  strokeWidth: 2,
                  curve: "monotone-x",
                })
              );
            if (spec.mark === "area")
              marks.push(
                Plot.area(g.rows, {
                  ...encodings,
                  fill: g.stroke,
                  fillOpacity: 0.25,
                  stroke: g.stroke,
                  strokeWidth: 2,
                  curve: "monotone-x",
                })
              );
            if (spec.mark === "bar")
              marks.push(
                Plot.barY(g.rows, {
                  ...encodings,
                  fill: g.stroke,
                  insetLeft: 12,
                  insetRight: 12,
                })
              );
            if (spec.mark === "dot" || spec.series)
              marks.push(
                Plot.dot(g.rows, { ...encodings, fill: g.stroke, r: 3.5 })
              );
          }
          marks.push(Plot.ruleY([0], { stroke: "var(--rule)" }));
          svg = Plot.plot({
            marks,
            height: spec.height,
            marginTop: 12,
            marginRight: 12,
            marginBottom: 30,
            marginLeft: 42,
            style: {
              background: "transparent",
              color: "var(--ink-mute)",
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
            },
            x: spec.xOrder
              ? { label: null, domain: spec.xOrder }
              : { label: null },
            y: { label: null, grid: false },
          });
        }
        if (!svg) return;
        svg.setAttribute("width", "100%");
        box.replaceChildren(svg);
        if (spec.series && spec.data) {
          const palette = ["oxblood", "moss", "ink", "highlight"];
          const keys = [
            ...new Set(spec.data.map((d) => String(d[spec.series!] ?? ""))),
          ];
          const legend = document.createElement("div");
          legend.className =
            "mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-wider";
          keys.forEach((key, i) => {
            const item = document.createElement("span");
            item.className = "inline-flex items-center gap-1.5";
            const swatch = document.createElement("span");
            swatch.style.cssText = `display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--${palette[i % palette.length]})`;
            item.appendChild(swatch);
            item.appendChild(document.createTextNode(key));
            legend.appendChild(item);
          });
          box.appendChild(legend);
        }
      } catch {
        // Bad spec: keep whatever fallback is already in the box.
        return;
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [specKey]);

  return (
    <figure className={cn("my-8", className)}>
      <div ref={boxRef} className="border border-rule bg-paper-deep/40 p-4">
        {fallback ?? null}
      </div>
      {caption && (
        <figcaption className="mt-2 font-mono text-meta uppercase tracking-wider text-ink-mute">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
