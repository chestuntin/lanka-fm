import type { Metadata } from "next";
import { VT323 } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

// Initialize the VT323 font for Next.js optimization
const vt323 = VT323({
  subsets: ["latin"],
  weight: "400",
});

// Create comprehensive metadata for Lanka.FM, incorporating your previous structure
export const metadata: Metadata = {
  title: "Lanka.FM",
  description: "A retro-digital internet radio station.",
  keywords: [
    "lanka.fm",
    "internet radio",
    "retro digital",
    "live stream",
    "mixcloud",
    "sri lanka",
  ],
  viewport: { width: "device-width", initialScale: 1 },
  openGraph: {
    title: "Lanka.FM",
    description:
      "A retro-digital internet radio station with a boot-up countdown.",
    url: "https://lanka.fm",
    siteName: "Lanka.FM",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply the font class directly to the body */}
      <body className={vt323.className}>
        <main>{children}</main>
        {/* Include Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
