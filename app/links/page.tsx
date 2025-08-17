// app/links/page.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Music2, Twitter, Youtube, Globe } from "lucide-react";

export default function Page() {
  // ---- Links ----
  const links = useMemo(
    () => [
      {
        name: "Instagram",
        url: "https://www.instagram.com/kultjur.lk",
        icon: <Instagram className="h-5 w-5" />,
      },
      {
        name: "TikTok",
        url: "https://www.tiktok.com/@kultjur",
        icon: <Music2 className="h-5 w-5" />,
      },
      {
        name: "X (Twitter)",
        url: "https://x.com/kultjur",
        icon: <Twitter className="h-5 w-5" />,
      },
      {
        name: "YouTube",
        url: "https://www.youtube.com/@kultjurrr",
        icon: <Youtube className="h-5 w-5" />,
      },
      {
        name: "Website",
        url: "https://kultjur.lk",
        icon: <Globe className="h-5 w-5" />,
      },
    ],
    []
  );

  // ---- Clock ----
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // ---- Hover sound from /public/hover.mp3 ----
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    // /public/hover.mp3 -> accessible at /hover.mp3
    const a = new Audio("/hover.mp3");
    a.preload = "auto";
    a.volume = 0.18; // subtle
    audioRef.current = a;
  }, []);

  const playHover = () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      // restart sound quickly for repeated hovers
      a.currentTime = 0;
      // some browsers block until first user gesture — hover counts after a click/scroll/keypress
      a.play().catch(() => {});
    } catch {}
  };

  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-black text-white">
      <main className="mx-auto flex min-h-dvh max-w-screen-sm flex-col items-center justify-center gap-8 px-4">
        {/* Title */}
        <h1 className="text-4xl font-bold tracking-tight text-white/95">
          KULTJUR®
        </h1>

        {/* Links — responsive, proportionate width */}
        <div className="w-full flex flex-col items-center gap-4">
          {links.map((link) => (
            <div
              key={link.name}
              className="relative w-full sm:w-[92%] md:w-[80%] lg:w-[65%] rounded-2xl"
            >
              {/* Rainbow stroke + glow */}
              <span
                aria-hidden
                className="absolute inset-[-2px] z-0 rounded-[1.125rem] opacity-0 transition-opacity duration-200 hover:opacity-60 focus-within:opacity-60 pointer-events-none"
                style={{
                  background:
                    "conic-gradient(from 180deg at 50% 50%, #ff7a7a, #ffd166, #06d6a0, #4cc9f0, #b388ff, #ff7a7a)",
                  filter: "blur(16px) saturate(1.05)",
                  mixBlendMode: "screen",
                }}
              />

              <Card className="relative z-10 overflow-visible rounded-2xl border border-zinc-800/80 bg-zinc-900/80 backdrop-blur-sm">
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5" />
                <CardContent className="p-0">
                  <Link
                    href={link.url}
                    target="_blank"
                    className="group flex items-center gap-3 rounded-2xl p-4 outline-none transition-colors hover:bg-zinc-800/70 focus-visible:bg-zinc-800/70"
                    onMouseEnter={playHover}
                  >
                    {link.icon}
                    <span className="font-medium">{link.name}</span>
                  </Link>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Footer — same responsive width as tiles */}
        <div className="w-full flex justify-center">
          <div className="w-full sm:w-[92%] md:w-[80%] lg:w-[65%] flex items-center justify-between text-xs text-zinc-500 mt-2">
            <span>© 2025 KULTJUR</span>
            <span className="font-mono tabular-nums">
              {now.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
