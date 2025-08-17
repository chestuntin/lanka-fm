"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, Youtube, Twitter, Globe, Music2 } from "lucide-react";

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

  // --- Minimal WebAudio hover blip (with unlock) ---
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const ensureAudio = () => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      const Ctx =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!Ctx) return null;
      const ctx = new Ctx();
      const g = ctx.createGain();
      g.gain.value = 0.08; // master volume (subtle but audible)
      g.connect(ctx.destination);
      audioCtxRef.current = ctx;
      gainRef.current = g;
    }
    if (audioCtxRef.current?.state === "suspended")
      audioCtxRef.current.resume();
    return audioCtxRef.current;
  };

  // unlock on first interaction (required by Safari/Chrome)
  useEffect(() => {
    const unlock = () => {
      ensureAudio();
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  function playHoverBlip(idx: number) {
    const ctx = ensureAudio();
    const g = gainRef.current;
    if (!ctx || !g) return;

    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    const filt = ctx.createBiquadFilter();

    // gentle, rounded blip
    osc.type = "sine"; // smoother than square
    osc.frequency.value = 420 + idx * 18; // slight pitch step per item
    filt.type = "lowpass";
    filt.frequency.value = 2000;

    const t = ctx.currentTime;
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(1.0, t + 0.012);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);

    osc.connect(filt).connect(env).connect(g);
    osc.start(t);
    osc.stop(t + 0.14);
  }

  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-black text-white">
      <main className="mx-auto flex min-h-dvh max-w-screen-sm flex-col items-center justify-center gap-8 px-4">
        {/* Title */}
        <h1 className="text-4xl font-bold tracking-tight text-white/95">
          KULTJUR®
        </h1>

        {/* Links */}
        <div className="w-full flex flex-col gap-4">
          {links.map((link, idx) => (
            <Card
              key={link.name}
              className="relative overflow-hidden border border-zinc-800/80 bg-zinc-900/80 backdrop-blur-sm rounded-2xl"
            >
              {/* Apple-ish rainbow stroke + glow (appears on hover/focus) */}
              <span
                aria-hidden
                className="
                  pointer-events-none absolute inset-0 -z-10 rounded-[1.25rem]
                  opacity-0 transition-opacity duration-200
                  group-hover:opacity-100 group-focus-within:opacity-100
                "
                style={{
                  // conic rainbow ring + soft outer glow
                  background:
                    "conic-gradient(from 180deg at 50% 50%, #ff6b6b, #ffd166, #06d6a0, #4cc9f0, #b388ff, #ff6b6b)",
                  mask: "linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0) border-box",
                  WebkitMask:
                    "linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0) border-box",
                  border: "1px solid transparent",
                  // create a thin rainbow stroke outside the card edges
                  padding: "1px",
                  filter: "blur(10px) saturate(1.1)",
                }}
              />
              <CardContent className="relative p-0">
                {/* inner stroke to separate card from glow */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5" />

                <Link
                  href={link.url}
                  target="_blank"
                  className="
                    group flex items-center gap-3 p-4 rounded-2xl
                    transition-colors outline-none
                    hover:bg-zinc-800/70 focus-visible:bg-zinc-800/70
                  "
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
