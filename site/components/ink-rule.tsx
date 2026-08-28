import { cn } from "@/lib/utils";

/**
 * InkRule - the signature brand divider.
 * A 1px ink-rule line with a small oxblood square at the start (the "seal").
 * Used between major sections in every episode.
 */
export function InkRule({ className }: { className?: string }) {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn("flex items-center gap-2 py-6", className)}
    >
      <span className="h-px bg-rule flex-1" />
      <span className="h-1.5 w-1.5 bg-oxblood" aria-hidden />
    </div>
  );
}
