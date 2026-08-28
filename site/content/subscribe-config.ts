/**
 * PITW subscribe configuration.
 *
 * ACTIVATION STEPS (to go from mailto to a real newsletter):
 *   1. Create a free account at https://buttondown.com
 *      (free up to 100 subscribers).
 *   2. In the Buttondown dashboard, open Settings → Embeds and copy
 *      the form action URL. Paste it as `buttondownEndpoint` below.
 *   3. Flip `provider` to "buttondown".
 *   4. Optional: enable RSS-to-email (https://docs.buttondown.com/rss-to-email)
 *      pointed at SITE_ORIGIN_URL + "/feed.xml" (i.e.
 *      https://baagad-ai.github.io/papersinthewild/feed.xml) so the Friday
 *      send drafts itself whenever a new episode ships.
 *
 * TWO free providers supported out of the box. To switch, change the
 * `provider` field below. The <Subscribe /> component reads from here.
 *
 * ──────────────────────────────────────────────────────────────
 * provider: "mailto"   - zero setup, works today
 * ──────────────────────────────────────────────────────────────
 *   The Subscribe button opens the reader's email client with a
 *   prefilled subscribe request to the address below. You collect
 *   subscribe requests manually and add senders to your newsletter
 *   list. Crude but free, no third-party account needed.
 *
 *   To use: set `mailtoEmail` to whatever address you want to receive
 *   subscribe requests at. A dedicated inbox is best.
 *
 * ──────────────────────────────────────────────────────────────
 * provider: "buttondown"  - recommended upgrade
 * ──────────────────────────────────────────────────────────────
 *   Buttondown is newsletter-first, indie-friendly, and offers the
 *   first 1,000 subscribers free (no feature limits). The form below
 *   POSTs to your Buttondown endpoint, so subscribers go directly
 *   into your list with no manual step.
 *
 *   To use:
 *     1. Sign up at https://buttondown.com
 *     2. Create a newsletter (e.g., "papersinthewild")
 *     3. In Buttondown, open Settings → Embeddable forms
 *     4. Copy the form action URL. It looks like:
 *        https://buttondown.com/api/emails/embed-subscribe/{your-newsletter-id}
 *     5. Paste it into `buttondownEndpoint` below
 *     6. Change `provider` to "buttondown"
 *
 *   Other providers that also work with this pattern:
 *     - MailerLite (https://mailerlite.com, 1K contacts free)
 *     - ConvertKit (https://convertkit.com, 10K contacts free, creator tier)
 *     - beehiiv (https://beehiiv.com, 2.5K subscribers free)
 *
 *   All four expose a form POST endpoint that works on static sites
 *   like GitHub Pages (no server-side code needed).
 *
 * ──────────────────────────────────────────────────────────────
 * GitHub Watch (always shown as secondary CTA, no config needed)
 * ──────────────────────────────────────────────────────────────
 *   Readers can also "watch" the GitHub repo to get notifications
 *   when new episodes ship as releases. The link points to the repo
 *   where they click Watch → Custom → Releases.
 */

export type SubscribeConfig = {
  provider: "mailto" | "buttondown";
  mailtoEmail: string;
  buttondownEndpoint?: string;
  githubRepo: string;
  githubUrl: string;
};

export const subscribeConfig: SubscribeConfig = {
  // ── Change this to "buttondown" once you've signed up and pasted the endpoint ──
  provider: "mailto",

  // ── mailto mode ──
  mailtoEmail: "baagad@users.noreply.github.com",

  // ── buttondown mode (uncomment + paste your endpoint after signing up) ──
  // buttondownEndpoint: "https://buttondown.com/api/emails/embed-subscribe/REPLACE_ME",

  // ── Always-on secondary CTA ──
  githubRepo: "baagad-ai/papersinthewild",
  githubUrl: "https://github.com/baagad-ai/papersinthewild",
};
