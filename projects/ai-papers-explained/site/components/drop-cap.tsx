import { cn } from "@/lib/utils";

/**
 * DropCap — wraps the first paragraph of an episode.
 * Fraunces 500, oxblood, 4 lines tall, float-left.
 */
export function DropCap({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-body text-ink-soft mb-6 drop-cap",
        className
      )}
    >
      {children}
    </p>
  );
}
