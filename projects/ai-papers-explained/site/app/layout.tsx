import type { Metadata } from "next";
import { Fraunces, Source_Serif_4, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

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
  title: "Papers in the Wild — weekly experiments on real AI papers",
  description:
    "I read a paper. I tried it. Here are the receipts. Weekly experiments on AI research papers — curious explorer, not guru.",
  metadataBase: new URL("https://papersinthewild.io"),
  openGraph: {
    title: "Papers in the Wild",
    description: "I read a paper. I tried it. Here are the receipts.",
    type: "website",
    locale: "en_US",
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
      </body>
    </html>
  );
}
