"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Youtube, Twitter, Globe, Music2 } from "lucide-react";

// Plain, minimal links page (no dev toggles, no gimmicks)
// - Subtle glow behind each tile on hover/focus
// - Soft hover sound for a light game-menu feel
// - Footer shows local time + © 2025 KULTJUR

export default function Page() {
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

  // --- Local clock ---
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // --- Minimal WebAudio hover blip ---
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  function ensureAudio() {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      const Ctx =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!Ctx) return null;
      const ctx = new Ctx();
      const g = ctx.createGain();
      g.gain.value = 0.05; // master volume (very soft)
      g.connect(ctx.destination);
      audioCtxRef.current = ctx;
      gainRef.current = g;
    }
    if (audioCtxRef.current?.state === "suspended")
      audioCtxRef.current.resume();
    return audioCtxRef.current;
  }
  function playHoverBlip(idx: number) {
    const ctx = ensureAudio();
    const g = gainRef.current;
    if (!ctx || !g) return;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    const filt = ctx.createBiquadFilter();
    // small pitch step per index for variety
    osc.type = "square";
    osc.frequency.value = 220 * (1 + idx * 0.06);
    filt.type = "lowpass";
    filt.frequency.value = 1800;
    const t = ctx.currentTime;
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(1.0, t + 0.01);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    osc.connect(filt).connect(env).connect(g);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-black text-white">
      <main className="mx-auto flex min-h-dvh max-w-screen-sm flex-col items-center justify-center gap-8 px-4">
        {/* Title */}
        <h1 className="text-4xl font-bold tracking-tight text-white/95">
          KULTJUR®
        </h1>

        {/* Links stack */}
        <div className="w-full flex flex-col gap-4">
          {links.map((link, idx) => (
            <Card
              key={link.name}
              className="relative overflow-hidden border border-zinc-800 bg-zinc-900/80 backdrop-blur-sm"
            >
              {/* Glow layer */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 scale-105 rounded-xl bg-[radial-gradient(40%_60%_at_50%_50%,rgba(0,255,200,0.18),transparent_70%)] blur-xl opacity-0 transition duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
              />
              <CardContent className="p-0">
                <Link
                  href={link.url}
                  target="_blank"
                  className="group flex items-center gap-3 p-4 transition-colors hover:bg-zinc-800/70 focus-visible:bg-zinc-800/70 outline-none"
                  onMouseEnter={() => playHoverBlip(idx)}
                >
                  {link.icon}
                  <span className="font-medium">{link.name}</span>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-2 flex w-full items-center justify-between text-xs text-zinc-500">
          <span>© 2025 KULTJUR</span>
          <span className="font-mono tabular-nums">
            {now.toLocaleTimeString()}
          </span>
        </div>
      </main>
    </div>
  );
}
