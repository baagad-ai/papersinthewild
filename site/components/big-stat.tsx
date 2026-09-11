import { cn } from "@/lib/utils";

type Stat = {
  value: string;
  label: string;
  note?: string;
};

function StatCell({ stat }: { stat: Stat }) {
  return (
    <div className="flex flex-col gap-1.5 px-5 py-4 first:pl-0">
      <div className="font-display text-[2.4rem] leading-[1.05] text-oxblood sm:text-[2.9rem]">
        {stat.value}
      </div>
      <div className="font-body text-[0.85rem] leading-snug text-ink-soft">
        {stat.label}
      </div>
      {stat.note && (
        <div className="font-mono text-[0.65rem] uppercase tracking-wider text-ink-mute">
          {stat.note}
        </div>
      )}
    </div>
  );
}

/**
 * BigStat - key numbers as a quiet editorial stat band, not shouting
 * display type. Two forms:
 *
 * 1. Single (legacy, episodes 1-6):
 *      <BigStat value="4×" label="more work, same correct answer" />
 *    renders as one number + label row inside a ruled band.
 *
 * 2. Strip (preferred for 2-4 related stats):
 *      <BigStat items={[
 *        { value: "₹53.17", label: "the guest's share of the model bill", note: "78% of ₹68.31" },
 *        { value: "rank 2", label: "where the guest finished" },
 *      ]} />
 *    renders as a divided band: number / sentence-case label / mono note.
 *
 * Design: one ruled band (border-y), numbers in display serif oxblood at a
 * size that reads as data, labels in sentence case body text. No uppercase
 * shouting, no 5rem numerals. The band groups; the numbers speak.
 */
export function BigStat({
  value,
  label,
  items,
  className,
}: {
  value?: string;
  label?: string;
  items?: Stat[];
  className?: string;
}) {
  const stats: Stat[] =
    items && items.length
      ? items
      : value !== undefined && label !== undefined
        ? [{ value, label }]
        : [];

  if (!stats.length) return null;

  return (
    <figure
      className={cn(
        "my-10 border-y border-rule py-2",
        className
      )}
    >
      <div
        className={cn(
          "grid",
          stats.length === 2 && "grid-cols-1 sm:grid-cols-2 sm:divide-x sm:divide-rule",
          stats.length >= 3 && "grid-cols-1 sm:grid-cols-3 sm:divide-x sm:divide-rule",
          stats.length === 1 && "grid-cols-1"
        )}
      >
        {stats.map((s, i) => (
          <StatCell key={i} stat={s} />
        ))}
      </div>
    </figure>
  );
}
