import { ReactNode } from "react";
import "./globals.css"; // Assuming you have global styles
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "කල්චර් | kultjur",
  description:
    "Exploring culture, technology, economics, politics, and the arts through thoughtful articles and insights",
  keywords: ["kultjur", "technology", "economics", "politics", "arts", "blog"],
  viewport: { width: "device-width", initialScale: 1 },
  openGraph: {
    title: "කල්චර් | kultjur",
    description:
      "Exploring culture, technology, economics, politics, and the arts",
    url: "https://kultjur.lk",
    siteName: "කල්චර්",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <body>{children}</body>
      <Analytics />
    </html>
  );
}
