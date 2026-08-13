import { cn } from "@/lib/utils";

/**
 * AgentLine — quote the AI as a character.
 *
 * When the AI is anthropomorphised in the story (it "got anxious",
 * it "decided to write nine extra tests"), its literal output reads
 * as dialogue. PullQuote is for paper quotes; AgentLine is for the
 * AI speaking in the scene.
 *
 * Usage in MDX:
 *   <AgentLine>
 *     I'll write nine probe tests covering edge cases the original
 *     suite didn't exercise, then re-run the full suite to confirm.
 *   </AgentLine>
 *
 * Design: subtle inline-block, paper-deep bg, Plex Mono body (because
 * it is real agent output), small "AI" tag in oxblood. Restrained,
 * no speech-bubble gimmick.
 */
export function AgentLine({
  children,
  className,
  task,
}: {
  children: React.ReactNode;
  className?: string;
  task?: string;
}) {
  return (
    <figure className={cn("my-6", className)}>
      <div className="mb-2 flex items-center gap-2">
        <span className="bg-oxblood px-1.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-paper">
          AI
        </span>
        {task && (
          <span className="font-body italic text-meta text-ink-mute">
            {task}
          </span>
        )}
      </div>
      <div className="bg-paper-deep px-5 py-4 font-mono text-[0.92rem] leading-[1.6] text-ink">
        <pre className="whitespace-pre-wrap break-words font-[inherit]">
          {children}
        </pre>
      </div>
    </figure>
  );
}
