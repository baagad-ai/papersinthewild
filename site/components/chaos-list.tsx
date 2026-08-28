import { cn } from "@/lib/utils";

/**
 * ChaosList - quote cards scattered like notes taped to a wall.
 * Mobile: static stacked column. Desktop (>=1024px): cards offset,
 * rotated, and staggered via pure CSS nth-of-type rules in
 * globals.css (.chaos-list / .chaos-item). No client JS, static
 * render, reduced-motion safe (transforms are fixed offsets, not
 * animations).
 *
 * Usage in MDX:
 *   <ChaosList
 *     items={[
 *       { quote: "I will carry it forward as instructed.", who: "Birch, run 2" },
 *       { quote: "I won't be participating.", who: "Birch, run 5" },
 *     ]}
 *   />
 */
export function ChaosList({
  items,
  className,
}: {
  items: Array<{ quote: string; who: string }>;
  className?: string;
}) {
  return (
    <ul className={cn("chaos-list", className)}>
      {items.map((item) => (
        <li key={item.who} className="chaos-item">
          <p className="chaos-quote">&ldquo;{item.quote}&rdquo;</p>
          <p className="chaos-who">{item.who}</p>
        </li>
      ))}
    </ul>
  );
}
