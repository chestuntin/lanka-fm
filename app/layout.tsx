import { ReactNode } from "react";
import "./globals.css"; // Assuming you have global styles

export const metadata = {
  title: "My App",
  description: "A Next.js app with MDX and dark mode",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth dark">
      <body>{children}</body>
    </html>
  );
}
