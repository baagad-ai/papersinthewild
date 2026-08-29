"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * TryIt - copyable prompt block with one-click copy. Mono text on
 * paper-deep, a COPY button, and a brief moss COPIED confirmation.
 *
 * Usage in MDX:
 *   <TryIt label="The replication prompt">
 *     Run the experiment exactly as described. Report every failure
 *     verbatim. Do not summarize.
 *   </TryIt>
 *
 * Copy path: navigator.clipboard with a textarea + execCommand fallback.
 * No-JS: the prompt renders complete (the button simply does nothing).
 */
export function TryIt({
  label,
  className,
  children,
}: {
  label?: string;
  className?: string;
  children: ReactNode;
}) {
  const preRef = useRef<HTMLPreElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const legacyCopy = (text: string) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  };

  const onCopy = async () => {
    const text = (preRef.current?.innerText ?? "").trim();
    if (!text) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else if (!legacyCopy(text)) {
        return;
      }
    } catch {
      if (!legacyCopy(text)) return;
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <figure className={cn("my-8", className)}>
      <div className="flex items-center justify-between gap-3 pb-2">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-mute">
          {label ?? "Try it"}
        </span>
        <button
          type="button"
          onClick={onCopy}
          aria-live="polite"
          className={cn(
            "border px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-wider transition-colors duration-[var(--motion-fast)]",
            copied
              ? "border-moss bg-moss text-paper"
              : "border-rule bg-paper text-ink hover:border-oxblood hover:text-oxblood"
          )}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="border-l-[3px] border-rule bg-paper-deep px-5 py-4">
        <pre
          ref={preRef}
          className="whitespace-pre-wrap [overflow-wrap:anywhere] font-mono text-[0.95rem] leading-[1.6] text-ink"
        >
          {children}
        </pre>
      </div>
    </figure>
  );
}
