"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Instagram, Youtube, Twitter, Globe, Music2 } from "lucide-react";

/** ---------------- Types ---------------- */
type Flags = {
  bgDrift: boolean;
  noiseOverlay: boolean;
  underlineSweep: boolean;
  textGlitchHover: boolean;
  pulseOnClick: boolean;
  typingTitle: boolean;
  clockFooter: boolean;
  hoverAltNames: boolean;
  hoverEmojis: boolean;
  consolePoetry: boolean;
  shuffleDeck: boolean; // optional mild structural shuffle
  accordionHover: boolean; // optional emphasis on hovered card
};
type FlagKey = keyof Flags;

/**
 * links.kultjur.lk — clean, minimal link hub with subtle "coding-artist" effects.
 * Everything is non-annoying by default; fancy bits behind a Dev panel (?dev=1).
 */
export default function LinksPage() {
  const search = useSearchParams();
  const devMode =
    search?.get("dev") === "1" || process.env.NODE_ENV !== "production";

  /** ---------------- Data ---------------- */
  const baseLinks = useMemo(
    () => [
      {
        name: "Instagram",
        url: "https://www.instagram.com/kultjur.lk",
        icon: <Instagram className="w-5 h-5" />,
        altHoverName: "Stalk Me",
        emojiSet: ["🦖", "💿", "🌀", "✨", "📸"],
      },
      {
        name: "TikTok",
        url: "https://www.tiktok.com/@kultjur",
        icon: <Music2 className="w-5 h-5" />,
        altHoverName: "Time Sink",
        emojiSet: ["🪩", "🎛️", "⚡", "🧪", "🎵"],
      },
      {
        name: "X (Twitter)",
        url: "https://x.com/kultjur",
        icon: <Twitter className="w-5 h-5" />,
        altHoverName: "Ex-Bird App",
        emojiSet: ["🐍", "🛰️", "📡", "💬", "🧷"],
      },
      {
        name: "YouTube",
        url: "https://www.youtube.com/@kultjurrr",
        icon: <Youtube className="w-5 h-5" />,
        altHoverName: "Longform Noise",
        emojiSet: ["📼", "📺", "🔊", "🚀", "🧊"],
      },
      {
        name: "Website",
        url: "https://kultjur.lk",
        icon: <Globe className="w-5 h-5" />,
        altHoverName: "HQ",
        emojiSet: ["🌐", "🗺️", "🏁", "🧠", "💎"],
      },
    ],
    []
  );

  /** ---------------- Feature flags ---------------- */
  const [flags, setFlags] = useState<Flags>({
    bgDrift: true,
    noiseOverlay: true,
    underlineSweep: true,
    textGlitchHover: true,
    pulseOnClick: true,
    typingTitle: true,
    clockFooter: true,
    hoverAltNames: true,
    hoverEmojis: true,
    consolePoetry: true,
    shuffleDeck: false, // off by default
    accordionHover: false, // off by default
  });

  const toggle = (k: FlagKey) => setFlags((f) => ({ ...f, [k]: !f[k] }));

  /** ---------------- Optional deck shuffle ---------------- */
  const [indices, setIndices] = useState(baseLinks.map((_, i) => i));
  useEffect(() => {
    if (!flags.shuffleDeck) return;
    const id = setInterval(() => {
      setIndices((arr) => {
        const a = [...arr];
        const i = Math.floor(Math.random() * a.length);
        const j = Math.floor(Math.random() * a.length);
        [a[i], a[j]] = [a[j], a[i]];
        return a;
      });
    }, 8000);
    return () => clearInterval(id);
  }, [flags.shuffleDeck]);

  const links = flags.shuffleDeck
    ? indices.map((i) => baseLinks[i])
    : baseLinks;

  /** ---------------- Typing title ---------------- */
  const title = "KULTJUR®";
  const [typeStep, setTypeStep] = useState(
    flags.typingTitle ? 0 : title.length
  );
  useEffect(() => {
    if (!flags.typingTitle) return;
    setTypeStep(0);
    let mounted = true;
    let i = 0;
    const tick = () => {
      if (!mounted) return;
      setTypeStep((prev) => Math.min(prev + 1, title.length));
      i++;
      if (i <= title.length) setTimeout(tick, 90 + Math.random() * 90);
      else setTimeout(() => setTypeStep(0), 8000);
    };
    const t = setTimeout(tick, 400);
    return () => {
      mounted = false;
      clearTimeout(t);
    };
  }, [flags.typingTitle]);

  /** ---------------- Clock ---------------- */
  const [now, setNow] = useState<Date | null>(
    flags.clockFooter ? new Date() : null
  );
  useEffect(() => {
    if (!flags.clockFooter) return;
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [flags.clockFooter]);

  /** ---------------- Console poetry ---------------- */
  const poems = [
    "pixels remember what fingers forget",
    "glitches are just honest frames",
    "syntax is a rhythm, not a rule",
    "we debug to hear the code breathe",
    "design is latency for the eye",
  ];
  const logPoem = () => {
    if (!flags.consolePoetry) return;
    const line = poems[Math.floor(Math.random() * poems.length)];
    // eslint-disable-next-line no-console
    console.log(
      `%c${line}`,
      "font-family: ui-monospace, SFMono-Regular, Menlo, monospace; color:#9ae6b4"
    );
  };

  /** ---------------- Hover state ---------------- */
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-black text-white selection:bg-white/20">
      {/* Animated background */}
      {flags.bgDrift && (
        <div className="pointer-events-none absolute inset-0 -z-10 animate-bg-drift opacity-[0.18]" />
      )}

      {/* Noise overlay */}
      {flags.noiseOverlay && (
        <div className="pointer-events-none absolute inset-0 -z-10 noise-overlay opacity-[0.08]" />
      )}

      <main className="mx-auto flex min-h-dvh max-w-screen-sm flex-col items-center justify-center gap-8 px-4">
        {/* Title */}
        <h1 className="text-balance text-4xl font-bold tracking-tight text-white/95">
          {flags.typingTitle ? title.slice(0, typeStep) : title}
          <span className="ml-1 inline-block w-4 animate-caret-blink">
            {flags.typingTitle && typeStep < title.length ? "_" : ""}
          </span>
        </h1>

        {/* Links */}
        <div
          className={`w-full ${
            flags.accordionHover ? "group/card" : ""
          } flex flex-col gap-4`}
        >
          {links.map((link, idx) => {
            const showAlt = flags.hoverAltNames && hoverIdx === idx;
            const emoji =
              flags.hoverEmojis && hoverIdx === idx
                ? link.emojiSet[
                    Math.floor(Math.random() * link.emojiSet.length)
                  ]
                : null;

            return (
              <Card
                key={link.name + idx}
                className={`bg-zinc-900/70 border border-zinc-800/70 backdrop-blur-sm transition-all ${
                  flags.accordionHover && hoverIdx !== null
                    ? hoverIdx === idx
                      ? "scale-[1.02]"
                      : "scale-[0.98] opacity-90"
                    : ""
                }`}
                onMouseEnter={() => setHoverIdx(idx)}
                onMouseLeave={() => setHoverIdx(null)}
              >
                <CardContent className="p-0">
                  <Link
                    href={link.url}
                    target="_blank"
                    onClick={logPoem}
                    className={`group flex items-center gap-3 p-4 transition-[transform,background] duration-200 hover:bg-zinc-800/70 ${
                      flags.pulseOnClick ? "active:scale-[0.985]" : ""
                    }`}
                  >
                    {link.icon}
                    <div className="flex min-w-0 flex-1 items-center justify-between">
                      <div className="min-w-0">
                        <div
                          className={`truncate text-[15px]/tight font-medium ${
                            flags.textGlitchHover ? "glitch-on-hover" : ""
                          } ${flags.underlineSweep ? "underline-sweep" : ""}`}
                        >
                          {showAlt ? link.altHoverName : link.name}
                        </div>
                        {showAlt && (
                          <div className="text-xs text-zinc-400">
                            {link.name}
                          </div>
                        )}
                      </div>
                      <div className="shrink-0 pl-2 text-lg">{emoji}</div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-2 flex w-full items-center justify-between text-xs text-zinc-500">
          <span>© {new Date().getFullYear()} KULTJUR</span>
          {flags.clockFooter && now && (
            <span className="font-mono tabular-nums">
              {now.toLocaleTimeString()}
            </span>
          )}
        </div>

        {/* Dev toggles */}
        {devMode && <DevPanel flags={flags} toggle={toggle} />}
      </main>

      {/* Styles */}
      <style jsx global>{`
        /* Animated gradient backdrop */
        .animate-bg-drift {
          background: radial-gradient(
              60% 60% at 20% 20%,
              rgba(0, 255, 170, 0.35),
              transparent 60%
            ),
            radial-gradient(
              50% 50% at 80% 30%,
              rgba(0, 200, 255, 0.28),
              transparent 60%
            ),
            radial-gradient(
              70% 70% at 40% 80%,
              rgba(255, 0, 170, 0.2),
              transparent 60%
            );
          background-size: 140% 140%, 120% 120%, 160% 160%;
          animation: driftA 22s linear infinite alternate;
          filter: blur(40px);
        }
        @keyframes driftA {
          0% {
            background-position: 0% 0%, 100% 20%, 0% 100%;
          }
          100% {
            background-position: 100% 60%, 0% 80%, 100% 0%;
          }
        }

        /* Subtle noise (pure CSS approximation) */
        .noise-overlay {
          background-image: repeating-linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.02) 0px,
              rgba(255, 255, 255, 0.02) 1px,
              transparent 1px,
              transparent 2px
            ),
            repeating-linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.02) 0px,
              rgba(255, 255, 255, 0.02) 1px,
              transparent 1px,
              transparent 2px
            );
          mix-blend-mode: soft-light;
        }

        /* Typing caret */
        @keyframes caretBlink {
          0%,
          49% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0;
          }
        }
        .animate-caret-blink {
          animation: caretBlink 1s steps(1) infinite;
        }

        /* Tiny glitch-on-hover: subtle shadow nudge */
        .glitch-on-hover:hover {
          text-shadow: -0.5px 0 rgba(255, 255, 255, 0.35),
            0.5px 0 rgba(0, 255, 200, 0.25);
          transform: translateZ(0);
        }

        /* Underline sweep using background */
        .underline-sweep {
          background-image: linear-gradient(currentColor, currentColor);
          background-size: 0% 1px;
          background-repeat: no-repeat;
          background-position: 0 100%;
          transition: background-size 200ms ease;
        }
        a:hover .underline-sweep {
          background-size: 100% 1px;
        }
      `}</style>
    </div>
  );
}

/** ---------------- Dev Panel ---------------- */
function DevPanel({
  flags,
  toggle,
}: {
  flags: Flags;
  toggle: (k: FlagKey) => void;
}) {
  const items: Array<{ key: FlagKey; label: string }> = [
    { key: "bgDrift", label: "Animated gradient background" },
    { key: "noiseOverlay", label: "Subtle noise overlay" },
    { key: "underlineSweep", label: "Underline sweep (hover)" },
    { key: "textGlitchHover", label: "Tiny text glitch (hover)" },
    { key: "pulseOnClick", label: "Pulse on click" },
    { key: "typingTitle", label: "Typing title" },
    { key: "clockFooter", label: "Live clock in footer" },
    { key: "hoverAltNames", label: "Alt names on hover (funny)" },
    { key: "hoverEmojis", label: "Hover emoji pepper" },
    { key: "consolePoetry", label: "Console poetry on click" },
    { key: "shuffleDeck", label: "Occasional deck shuffle (structure)" },
    { key: "accordionHover", label: "Accordion hover emphasis" },
  ];

  return (
    <Card className="w-full border-zinc-800 bg-zinc-950/70">
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-medium text-zinc-300">Dev toggles</div>
          <div className="text-xs text-zinc-500">(add ?dev=1 to URL)</div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map(({ key, label }) => (
            <div
              key={key}
              className="flex items-center justify-between gap-3 rounded-lg bg-zinc-900/60 px-3 py-2"
            >
              <Label htmlFor={`sw-${key}`} className="text-xs text-zinc-300">
                {label}
              </Label>
              <Switch
                id={`sw-${key}`}
                checked={flags[key]}
                onCheckedChange={() => toggle(key)}
              />
            </div>
          ))}
        </div>
        <div className="mt-3 text-[11px] text-zinc-500">
          These effects are intentionally subtle; keep them tasteful in prod. 💅
        </div>
      </CardContent>
    </Card>
  );
}
