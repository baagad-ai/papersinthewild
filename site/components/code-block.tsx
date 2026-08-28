import { cn } from "@/lib/utils";

/**
 * CodeBlock - wrapper for code with optional file-path header.
 * Pairs with rehype-pretty-code in next.config.mjs.
 */
export function CodeBlock({
  children,
  filename,
  className,
}: {
  children: React.ReactNode;
  filename?: string;
  className?: string;
}) {
  return (
    <figure className={cn("my-8 border border-rule bg-paper-deep", className)}>
      {filename && (
        <div className="border-b border-rule px-4 py-2 font-mono text-[0.75rem] uppercase tracking-wider text-ink-mute">
          {filename}
        </div>
      )}
      <div className="overflow-x-auto p-4">
        <pre className="font-mono text-[0.875rem] leading-[1.6] text-ink">
          {children}
        </pre>
      </div>
    </figure>
  );
}
