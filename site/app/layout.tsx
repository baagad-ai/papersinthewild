import type { Metadata } from "next";
import { Fraunces, Source_Serif_4, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE_URL, absUrl } from "@/app/lib/site";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Papers in the Wild: weekly experiments on real AI papers",
  description:
    "I read a paper. I tried it. Here are the receipts. Weekly experiments on AI research papers. Curious explorer, not guru.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    types: {
      "application/rss+xml": absUrl("/feed.xml"),
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Papers in the Wild",
    description: "I read a paper. I tried it. Here are the receipts.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: absUrl("/og-default.png"),
        width: 1200,
        height: 630,
        alt: "Papers in the Wild: weekly experiments on real AI papers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Papers in the Wild",
    description: "Weekly experiments on real AI papers. Curious explorer, not guru.",
    images: [absUrl("/og-default.png")],
  },
  authors: [{ name: "Baagad" }],
  keywords: ["ai", "papers", "research", "experiments", "build_to_think"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${sourceSerif.variable} ${plexMono.variable}`}
    >
      <body className="font-body bg-paper text-ink-soft antialiased">
        <SiteHeader />
        <main className="relative z-10">{children}</main>
        <SiteFooter />
        {process.env.NEXT_PUBLIC_CF_BEACON && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.js"
            data-cf-beacon={JSON.stringify({
              token: process.env.NEXT_PUBLIC_CF_BEACON,
            })}
          />
        )}
      </body>
    </html>
  );
}
