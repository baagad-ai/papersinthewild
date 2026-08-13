import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        "paper-deep": "var(--paper-deep)",
        ink: {
          DEFAULT: "var(--ink)",
          soft: "var(--ink-soft)",
          mute: "var(--ink-mute)",
        },
        rule: "var(--rule)",
        oxblood: {
          DEFAULT: "var(--oxblood)",
          deep: "var(--oxblood-deep)",
        },
        moss: "var(--moss)",
        highlight: "var(--highlight)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      maxWidth: {
        article: "var(--article-width)",
        page: "var(--page-width)",
      },
      fontSize: {
        display: ["var(--text-display)", { lineHeight: "1.05" }],
        h1: ["var(--text-h1)", { lineHeight: "1.1" }],
        h2: ["var(--text-h2)", { lineHeight: "1.2" }],
        h3: ["var(--text-h3)", { lineHeight: "1.3" }],
        body: ["var(--text-body)", { lineHeight: "1.65" }],
        meta: ["var(--text-meta)", { lineHeight: "1.4" }],
        mono: ["var(--text-mono)", { lineHeight: "1.5" }],
      },
      transitionTimingFunction: { ink: "var(--ease-ink)" },
      transitionDuration: {
        fast: "var(--duration-fast)",
        base: "var(--duration-base)",
        slow: "var(--duration-slow)",
      },
    },
  },
  plugins: [],
};

export default config;
