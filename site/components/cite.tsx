import { cn } from "@/lib/utils";

/**
 * Cite - citation link. Ink → oxblood on hover, rule underline.
 * Never use blue. Never underline by default.
 */
export function Cite({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const isExternal = href.startsWith("http");
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={cn(
        "text-ink underline decoration-rule decoration-1 underline-offset-4",
        "hover:text-oxblood hover:decoration-oxblood transition-colors duration-base",
        className
      )}
    >
      {children}
    </a>
  );
}
