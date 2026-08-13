import { cn } from "@/lib/utils";

/**
 * Num — inline number in body text.
 * Renders in IBM Plex Mono with oxblood tint.
 * Use for any specific number: 9.62×, 452s, 18%, etc.
 */
export function Num({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("font-mono text-[0.95em] text-oxblood", className)}>
      {children}
    </span>
  );
}
