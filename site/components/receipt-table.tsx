import { cn } from "@/lib/utils";

/**
 * ReceiptTable — the signature Papers in the Wild component.
 *
 * Usage in MDX:
 *   <ReceiptTable
 *     caption="Source: in-session Claude Code runs, 2026-08-12"
 *     headers={["Metric", "Arm A", "Arm B", "Delta"]}
 *     rows={[
 *       ["Wall-clock (sec)", "452", "47", "9.62×"],
 *       ["Lines churned", "75", "4", "18.75×"],
 *     ]}
 *   />
 *
 * The right-most column is always rendered in oxblood bold (the delta).
 */
type Row = Array<string | number>;

export function ReceiptTable({
  headers,
  rows,
  caption,
  className,
}: {
  headers: string[];
  rows: Row[];
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={cn("my-8", className)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-mono">
          <thead>
            <tr className="border-y border-rule">
              {headers.map((h, i) => (
                <th
                  key={i}
                  className="py-2 px-3 text-left uppercase text-ink-mute text-[0.75rem] tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={i % 2 ? "bg-paper-deep" : "bg-paper"}
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={cn(
                      "py-3 px-3 text-ink",
                      j === row.length - 1 &&
                        "font-bold text-oxblood"
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <figcaption className="mt-3 font-body italic text-meta text-ink-mute">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
