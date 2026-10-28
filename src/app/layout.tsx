import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./premium.css";
import "./atlas.css";

const cinzel = localFont({
  src: "../../public/fonts/Cinzel-latin.woff2",
  variable: "--font-cinzel",
  weight: "400 900",
  display: "swap",
});

const inter = localFont({
  src: "../../public/fonts/Inter-latin.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const display = localFont({
  src: "../../public/fonts/CormorantGaramond.ttf",
  variable: "--font-display",
  weight: "300 700",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GRAMMARIA — Conquer Knowledge. Rule Grammar.",
  description: "Gamified English Grammar Conquest Platform. Attack territories, solve grammar challenges, and conquer the world of Grammaria.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${inter.variable} ${display.variable} dark h-full antialiased`}
    >
      <head><link rel="preload" href="/effects/cloud-veil.png" as="image" /></head>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans select-none overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
