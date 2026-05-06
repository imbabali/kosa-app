import type { Metadata, Viewport } from "next";
import { Geist, Fraunces } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "KOSA — Kibuli SS Old Students Association",
    template: "%s · KOSA",
  },
  description:
    "The home of Kibuli Secondary School alumni. Directory, events, and digital identity for the Class of 2005 cohort. Established 1945.",
  metadataBase: new URL("https://kosa-alumni.vercel.app"),
  openGraph: {
    title: "KOSA — Kibuli SS Old Students Association",
    description:
      "Proud Past. Stronger Together. Brighter Future.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1F4E2D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
