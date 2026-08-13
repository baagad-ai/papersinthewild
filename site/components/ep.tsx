import { cn } from "@/lib/utils";

/**
 * Ep — episode number reference. Renders "EP. 01" in Plex Mono.
 */
export function Ep({
  n,
  className,
}: {
  n: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-mono text-[0.85em] uppercase tracking-wider text-oxblood",
        className
      )}
    >
      EP. {String(n).padStart(2, "0")}
    </span>
  );
}
