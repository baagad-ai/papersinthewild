import { cn } from "@/lib/utils";

/**
 * Scene - boxed analogy / story scene for non-technical readers.
 *
 * When you're writing for a general audience, the analogy has to
 * arrive BEFORE the data, not after. Scene is the visual cue that
 * says: "slow down, this is the picture you should hold in your head".
 *
 * Usage in MDX:
 *   <Scene title="The anxious friend at the door">
 *     Telling an AI to "be absolutely certain" is like telling your
 *     most anxious friend that you "just want to make sure" the door
 *     is locked...
 *   </Scene>
 *
 * Design: indented block, paper-deep background, oxblood left bar.
 * Fraunces italic for the title; Source Serif body inside.
 * Distinct from PullQuote (which is for one-line paper quotes).
 */
export function Scene({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "my-10 bg-paper-deep px-6 py-6 sm:px-8 sm:py-7",
        "border-l-[3px] border-oxblood",
        className
      )}
    >
      {title && (
        <div className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-oxblood">
          {title}
        </div>
      )}
      <div className="text-body leading-relaxed text-ink-soft">
        {children}
      </div>
    </aside>
  );
}
