import { cn } from "@/lib/utils";
import { subscribeConfig } from "@/content/subscribe-config";

/**
 * <Subscribe /> - the PITW subscribe call to action.
 *
 * Two variants:
 *   - variant="form"  - inline email form (footer, about page)
 *   - variant="link"  - minimal "Subscribe" link/button (header)
 *
 * Provider switching is one line: change `subscribeConfig.provider`
 * in site/content/subscribe-config.ts from "mailto" to "buttondown".
 *
 * See subscribe-config.ts for setup docs.
 */
export function Subscribe({
  variant = "form",
  className,
}: {
  variant?: "form" | "link";
  className?: string;
}) {
  const { provider, mailtoEmail, buttondownEndpoint, githubUrl } =
    subscribeConfig;

  // Validate buttondown config if selected
  if (provider === "buttondown" && !buttondownEndpoint) {
    if (typeof console !== "undefined") {
      console.warn(
        "Subscribe: provider is 'buttondown' but buttondownEndpoint is not set in subscribe-config.ts. Falling back to mailto.",
      );
    }
  }

  const actionUrl =
    provider === "buttondown" && buttondownEndpoint
      ? buttondownEndpoint
      : `mailto:${mailtoEmail}?subject=Subscribe%20to%20Papers%20in%20the%20Wild&body=Add%20me%20to%20the%20Papers%20in%20the%20Wild%20newsletter.%20I%20want%20every%20Friday%20episode.`;

  const usesButtondown =
    provider === "buttondown" && Boolean(buttondownEndpoint);

  // ─────────────────────────────────────────────────────────────
  // LINK variant - minimal "Follow" link for header
  // ─────────────────────────────────────────────────────────────
  if (variant === "link") {
    return (
      <a
        href={actionUrl}
        className={cn(
          "font-mono text-meta uppercase tracking-wider text-ink-mute",
          "hover:text-oxblood transition-colors duration-base",
          className,
        )}
      >
        Follow
      </a>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // FORM variant - inline email form for footer / about page
  // ─────────────────────────────────────────────────────────────
  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-oxblood">
        Get the next episode in your inbox
      </div>
      <p className="mb-4 max-w-md font-body text-body text-ink-soft">
        One episode, every Friday. Real experiments on real AI papers. No
        spam, no hype, no AI-sparkle emoji.
      </p>
      <form
        action={actionUrl}
        method={usesButtondown ? "post" : "get"}
        target={usesButtondown ? "_blank" : undefined}
        rel={usesButtondown ? "noopener noreferrer" : undefined}
        className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-start"
      >
        {usesButtondown && (
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            required
            aria-label="Email address"
            className={cn(
              "flex-1 border border-rule bg-paper px-4 py-2.5",
              "font-body text-body text-ink placeholder:text-ink-mute",
              "focus:border-oxblood focus:outline-none focus:ring-1 focus:ring-oxblood",
              "transition-colors duration-base",
            )}
          />
        )}
        <button
          type="submit"
          className={cn(
            "bg-oxblood px-5 py-2.5 font-mono text-meta uppercase tracking-wider text-paper",
            "hover:bg-oxblood-deep transition-colors duration-base",
            "active:translate-y-px",
            "shrink-0",
          )}
        >
          {usesButtondown ? "Subscribe" : "Subscribe via email"}
        </button>
      </form>
      <p className="mt-3 font-body text-meta text-ink-mute">
        Or{" "}
        <a
          href={`${githubUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-rule underline-offset-4 hover:text-oxblood"
        >
          watch the repo on GitHub
        </a>{" "}
        to get a notification when each episode ships.
      </p>
    </div>
  );
}
