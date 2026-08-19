import { cn } from "@/lib/utils";

/**
 * Sparkline — tiny inline trend line, used inside a sentence.
 *
 * Usage in MDX:
 *   caught it, peaked at four, forgot it <Sparkline data={[2,2,4,4,4,2]} />
 *
 * Server component, inline-block SVG sized to sit on the text baseline.
 * Never standalone: it is a sentence modifier, not a figure.
 */

const STROKE = {
  oxblood: "var(--oxblood)",
  moss: "var(--moss)",
  rule: "var(--ink-mute)",
} as const;

export function Sparkline({
  data,
  color = "oxblood",
  width = 72,
  height = 22,
  className,
}: {
  data: number[];
  color?: keyof typeof STROKE;
  width?: number;
  height?: number;
  className?: string;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pad = 3;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1 || 1)) * (width - pad * 2);
    const y = pad + (1 - (v - min) / span) * (height - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      role="img"
      aria-label={`trend: ${data.join(" to ")}`}
      className={cn("mx-1 inline-block align-[-3px]", className)}
    >
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={STROKE[color]}
        strokeWidth={1.75}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle
        cx={pts[pts.length - 1].split(",")[0]}
        cy={pts[pts.length - 1].split(",")[1]}
        r={2}
        fill={STROKE[color]}
      />
    </svg>
  );
}
