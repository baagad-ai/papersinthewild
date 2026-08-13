import { cn } from "@/lib/utils";

/**
 * Translation — the four-step translation ladder, visualised.
 *
 * The PITW style guide requires technical terms to be "climbed":
 *   1. Name the term (one sentence)
 *   2. Translate to plain English (one sentence)
 *   3. Anchor with an analogy (one paragraph)
 *   4. Demonstrate with real data (one paragraph)
 *
 * For non-technical readers, the ladder has to be VISIBLE. They need
 * to see "this is the jargon, this is what it actually means".
 *
 * Usage in MDX:
 *   <Translation
 *     term="Level 3+ redundant verification"
 *     plain="The AI re-verified work it had already verified."
 *     analogy="Like asking your anxious friend if they locked the door. They'll check it. Check it again. Write themselves a note confirming they checked it. The door was locked the first time."
 *     data="Across 6 max-certainty trials, the AI wrote an average of 10 extra probe tests per run. Every probe passed. None caught a bug."
 *   />
 *
 * Design: 4-row vertical stack. Each row: small mono uppercase label
 * on the left, content on the right. Hairline dividers between rows.
 * Paper-deep background, sits as a distinct visual block.
 */
type Row = {
  label: string;
  text: string;
  accent?: boolean;
};

export function Translation({
  term,
  plain,
  analogy,
  data,
  className,
}: {
  term: string;
  plain: string;
  analogy: string;
  data: string;
  className?: string;
}) {
  const rows: Row[] = [
    { label: "The jargon", text: term },
    { label: "In plain English", text: plain },
    { label: "Like", text: analogy },
    { label: "The data", text: data, accent: true },
  ];

  return (
    <figure className={cn("my-10 bg-paper-deep px-6 py-6 sm:px-8", className)}>
      {rows.map((row, i) => (
        <div
          key={row.label}
          className={cn(
            "grid grid-cols-1 gap-2 sm:grid-cols-[8rem_1fr] sm:gap-6",
            i > 0 && "mt-5 border-t border-rule pt-5",
            i === 0 && "-mt-1"
          )}
        >
          <div
            className={cn(
              "font-mono text-[0.7rem] uppercase tracking-[0.18em]",
              row.accent ? "text-oxblood" : "text-ink-mute"
            )}
          >
            {row.label}
          </div>
          <div
            className={cn(
              "text-body leading-relaxed",
              i === 2 && "font-display italic text-ink",
              row.accent && "font-medium text-ink"
            )}
          >
            {row.text}
          </div>
        </div>
      ))}
    </figure>
  );
}
