import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * MarginNote - a whisper in the margin.
 * Desktop (>=1024px): floats right beside the running text,
 * 200px column, rule left border, mono meta. Mobile: full-width
 * blockquote-style aside so nothing overlaps.
 *
 * Usage in MDX:
 *   <MarginNote>Sample size was 8 agents per run.</MarginNote>
 */
export function MarginNote({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "my-6 border-l-2 border-rule pl-3",
        "font-mono text-meta text-ink-mute",
        "lg:float-right lg:clear-right lg:ml-6 lg:mt-0 lg:w-[200px]",
        className,
      )}
    >
      {children}
    </aside>
  );
}
