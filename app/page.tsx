"use client";

import { Globe } from "@/components/magicui/globe";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DynamicBreadcrumb } from "@/components/ui/dynamic-breadcrumb";

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
      <div className="w-full max-w-lg mt-4 pl-4 pt-4 pb-4 flex items-center">
        <DynamicBreadcrumb />

        <div className="ml-auto flex justify-end">
          <Button variant="link" size="default" asChild className="font-normal">
            <Link href="/article">Enter</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
