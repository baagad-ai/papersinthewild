import { cn } from "@/lib/utils";

/**
 * PullQuote — emphasis block with oxblood left border.
 * Fraunces italic, larger than body.
 */
export function PullQuote({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <blockquote
      className={cn(
        "my-12 border-l-[3px] border-oxblood pl-6 font-display italic text-h3 text-ink",
        className
      )}
    >
      {children}
    </blockquote>
  );
}
