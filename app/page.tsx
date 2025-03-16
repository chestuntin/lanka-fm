"use client";

import { Globe } from "@/components/magicui/globe";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-black text-white">
      <div className="relative flex flex-col size-full max-w-lg items-center justify-center overflow-hidden px-40 pb-40 pt-8 md:pb-60">
        <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-white to-slate-900/10 bg-clip-text text-center text-9xl font-semibold leading-none text-transparent">
          කල්චර්
        </span>
        <Globe className="top-28" />
        <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,255,255,0))]" />
      </div>

      {/* Navigation bar */}
      <div className="w-full max-w-lg mt-4 p-4 flex items-center">
        <div className="flex items-center space-x-2 text-sm">
          <a
            href="/"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Home
          </a>
          <span className="text-gray-500">/</span>
          <span className="text-white">Main</span>
        </div>

        <div className="ml-auto">
          <Button variant="link" size="default" asChild>
            <Link href="/article">Enter</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
