"use client";

import React, { useEffect } from "react";
import { motion, useAnimation, AnimationControls } from "framer-motion";

// Replace this with your real Mixcloud stream URL
const MIXCLOUD_URL = "https://www.mixcloud.com/your-profile/your-show/";

export default function AnimatedHome(): JSX.Element {
  const controls: AnimationControls = useAnimation();

  useEffect(() => {
    // entrance animation loop for neon badge
    controls.start({
      scale: [1, 1.02, 1],
      opacity: [0.95, 1, 0.95],
      transition: { duration: 3, repeat: Infinity },
    });
  }, [controls]);

  return (
    <main className="min-h-screen bg-black text-white antialiased overflow-x-hidden">
      {/* Animated starfield + scanlines */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-[#03030b] to-[#05050a]" />

        {/* particle layer (CSS animated) */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="w-full h-full opacity-30 bg-[length:120px_120px] animate-[bgPan_35s_linear_infinite]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'><circle cx='10' cy='10' r='1.2' fill='%23e6fff7' fill-opacity='0.06'/><circle cx='60' cy='60' r='1.8' fill='%2300ffd5' fill-opacity='0.03'/></svg>\")",
            }}
          />
        </div>

        {/* scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_94%,rgba(255,255,255,0.02)_95%)] bg-[length:100%_2px] opacity-30 pointer-events-none -z-10" />
      </div>

      <header className="max-w-6xl mx-auto px-6 pt-8 sm:pt-14 relative z-10">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 2, 0] }}
              transition={{ repeat: Infinity, duration: 6 }}
              className="w-12 h-12 rounded-sm flex items-center justify-center bg-gradient-to-br from-[#00ffd5] to-[#0077ff] text-black font-extrabold tracking-tight"
            >
              L
            </motion.div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                LANKA.FM
              </h1>
              <p className="text-xs text-gray-400 -mt-0.5">
                Retro-digital radio · Beta
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a href="#shows" className="text-sm text-gray-300 hover:text-white">
              Shows
            </a>
            <a href="#about" className="text-sm text-gray-300 hover:text-white">
              About
            </a>
            <a
              href="#contact"
              className="text-sm text-gray-300 hover:text-white"
            >
              Contact
            </a>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-12 relative z-10">
        <div className="rounded-3xl border border-[rgba(255,255,255,0.04)] p-8 backdrop-blur-sm bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-[rgba(255,255,255,0.01)] overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-1">
              <motion.h2
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.06 }}
                className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight"
              >
                LANKA.FM
              </motion.h2>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.12 }}
                className="mt-4 text-gray-300 max-w-xl"
              >
                From the islands to the cloud — curated radio with a
                retro-digital heartbeat. Live shows, deep cuts, and sound for
                late nights.
              </motion.p>

              <div className="mt-8 flex items-center gap-4">
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  href={MIXCLOUD_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-md text-sm font-semibold bg-gradient-to-r from-[#00ffd5] to-[#00aaff] text-black shadow-xl"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Listen Live
                </motion.a>

                <motion.button
                  whileHover={{ x: 4 }}
                  className="text-xs px-3 py-2 rounded-md border border-[rgba(255,255,255,0.06)] text-gray-300"
                  onClick={() =>
                    window.scrollTo({ top: 720, behavior: "smooth" })
                  }
                >
                  See Shows
                </motion.button>
              </div>

              {/* animated neon badge */}
              <motion.div
                animate={controls}
                className="inline-flex items-center gap-3 rounded-full px-4 py-2 mt-6 bg-[rgba(0,255,213,0.04)] border border-[rgba(0,255,213,0.06)]"
              >
                <div className="w-2 h-2 rounded-full bg-[#00ffd5] shadow-[0_0_8px_rgba(0,255,213,0.6)]" />
                <div className="text-xs font-mono">LIVE</div>
                <div className="ml-2 text-xs text-gray-300">
                  Now Playing: Unknown
                </div>
              </motion.div>
            </div>

            {/* Right column: waveform + schedule */}
            <aside className="w-full max-w-md flex-shrink-0">
              <div className="rounded-xl p-4 border border-[rgba(255,255,255,0.04)] bg-gradient-to-b from-[rgba(255,255,255,0.01)] to-transparent mb-6">
                <Waveform />
                <div className="mt-4 text-sm text-gray-300">
                  <div className="font-semibold">Next</div>
                  <div className="mt-2 font-mono text-xs text-green-300">
                    Fri 20:00
                  </div>
                  <div className="font-medium">Trap Tape Thursdays</div>
                </div>
              </div>

              <div className="rounded-xl p-4 border border-[rgba(255,255,255,0.04)] bg-gradient-to-b from-[rgba(255,255,255,0.01)] to-transparent">
                <div className="font-semibold">Quick Links</div>
                <div className="mt-3 flex flex-col gap-2 text-sm text-gray-300">
                  <a href={MIXCLOUD_URL} target="_blank" rel="noreferrer">
                    Mixcloud
                  </a>
                  <a href="#about">About</a>
                  <a href="#contact">Submit a Mix</a>
                </div>
              </div>
            </aside>
          </div>

          {/* subtle VHS glitch overlay */}
          <div className="pointer-events-none absolute inset-0 mix-blend-screen opacity-5">
            <div className="w-full h-full bg-[linear-gradient(90deg,rgba(255,0,100,0.02),transparent,rgba(0,200,255,0.02))] animate-[vhsShift_6s_linear_infinite]" />
          </div>
        </div>
      </section>

      {/* Shows grid with card entrance animations */}
      <section
        id="shows"
        className="max-w-6xl mx-auto px-6 pb-20 relative z-10"
      >
        <h3 className="text-2xl font-bold mb-6">Shows & Playlists</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Trap Tape Thursdays",
              desc: "One-hour curated beats",
              href: MIXCLOUD_URL,
            },
            {
              title: "Low Frequency Lounge",
              desc: "Ambient & deep cuts",
              href: MIXCLOUD_URL,
            },
            {
              title: "Retro Rewinds",
              desc: "Old school classics & sample crates",
              href: MIXCLOUD_URL,
            },
            {
              title: "Late Night Rinse",
              desc: "Slow + reverb sets",
              href: MIXCLOUD_URL,
            },
            {
              title: "Archive Dives",
              desc: "Sample crate excavations",
              href: MIXCLOUD_URL,
            },
            {
              title: "Guest Sets",
              desc: "Local DJs & friends",
              href: MIXCLOUD_URL,
            },
          ].map((s, i) => (
            <motion.a
              key={s.title}
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="block rounded-xl p-6 border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.01)] hover:scale-[1.01] transition"
            >
              <div className="flex items-center justify-between">
                <div className="font-bold">{s.title}</div>
                <div className="text-xs font-mono text-green-300">Live</div>
              </div>
              <div className="text-sm text-gray-400 mt-2">{s.desc}</div>
            </motion.a>
          ))}
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="max-w-4xl mx-auto px-6 pb-20 relative z-10"
      >
        <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] p-8 bg-[rgba(255,255,255,0.01)]">
          <h3 className="text-xl font-bold">About Lanka.FM</h3>
          <p className="mt-3 text-gray-300">
            Lanka.FM is a retro-digital radio project — curating music,
            conversation and culture for the island-minded. A place where the
            past meets the future and the studio sounds like home.
          </p>

          <div className="mt-6 flex items-center gap-4">
            <a
              href={MIXCLOUD_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="text-sm px-4 py-2 rounded-md border border-[rgba(255,255,255,0.06)]"
            >
              Open Mixcloud
            </a>
            <a
              href="#contact"
              className="text-sm px-4 py-2 rounded-md border border-[rgba(255,255,255,0.06)]"
            >
              Submit a Mix
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="border-t border-[rgba(255,255,255,0.03)] mt-6 bg-gradient-to-t from-black/60 to-transparent relative z-10"
      >
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} Lanka.FM — Built by Che
          </div>
          <div className="flex items-center gap-4">
            <a
              href={MIXCLOUD_URL}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-gray-300"
            >
              Mixcloud
            </a>
            <a href="#" className="text-sm text-gray-300">
              Instagram
            </a>
            <a href="#" className="text-sm text-gray-300">
              Threads
            </a>
          </div>
        </div>
      </footer>

      {/* Tailwind-friendly extra CSS (keyframes) */}
      <style jsx>{`
        @keyframes bgPan {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: -240px 0;
          }
        }
        @keyframes vhsShift {
          0% {
            transform: translateX(0px);
          }
          50% {
            transform: translateX(-6px);
          }
          100% {
            transform: translateX(0px);
          }
        }
      `}</style>
    </main>
  );
}

function Waveform(): JSX.Element {
  // simple animated SVG waveform using framer-motion
  const pathVariants: Record<string, any> = {
    float: {
      d: [
        "M0 40 C20 20 40 60 60 40 C80 20 100 60 120 40 L120 60 L0 60 Z",
        "M0 40 C20 60 40 20 60 40 C80 60 100 20 120 40 L120 60 L0 60 Z",
        "M0 40 C20 30 40 50 60 40 C80 30 100 50 120 40 L120 60 L0 60 Z",
      ],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <svg
      viewBox="0 0 120 60"
      className="w-full h-28"
      role="img"
      aria-label="Waveform"
    >
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0%" stopColor="#00ffd5" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#00aaff" stopOpacity="0.45" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="none" />
      <motion.path
        d="M0 40 C20 20 40 60 60 40 C80 20 100 60 120 40 L120 60 L0 60 Z"
        variants={pathVariants}
        animate="float"
        fill="url(#g1)"
      />
    </svg>
  );
}
