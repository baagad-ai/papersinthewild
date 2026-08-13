import { cn } from "@/lib/utils";

/**
 * BigStat — punchy display number for moments that deserve to break
 * out of body text. Think: "4×", "36 trials", "9.62× invoice".
 *
 * Usage in MDX:
 *   <BigStat value="4×" label="more work, same correct answer" />
 *   <BigStat value="0" label="bugs caught by the extra work" />
 *
 * Design: Fraunces display, oxblood, single-line value + small caption.
 * Restrained. No animation. The number does the work.
 *
 * Placement: between paragraphs, never two in a row. One BigStat per
 * key finding. If you find yourself adding a third, the post has too
 * many "key" findings.
 */
export function BigStat({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "my-12 flex flex-col items-start gap-2",
        className
      )}
    >
      <div
        className="font-display text-[4.5rem] leading-[0.95] text-oxblood sm:text-[5.5rem]"
        aria-hidden
      >
        {value}
      </div>
      <figcaption className="max-w-[28rem] font-body text-meta uppercase tracking-wider text-ink-mute">
        {label}
      </figcaption>
    </figure>
  );
}
