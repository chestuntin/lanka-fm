"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  PlayCircle,
  Star,
  Clock,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ---
// Portfolio Page (drop into app/portfolio/page.tsx)
// TailwindCSS + framer-motion + lucide-react required
// ---

type Slide = { type: "image" | "video"; src: string; poster?: string };

type Project = {
  title: string;
  blurb: string;
  tags: string[];
  thumb: string;
  status: string;
  slides: Slide[];
};

const projects: Project[] = [
  {
    title: "KULTJUR® Brand Identity System",
    blurb:
      "Logo suite (Sinhala/Latin), grid, typography scale, color system, and social templates.",
    tags: ["Branding", "Typography", "Logo", "Guidelines"],
    thumb: "/portfolio/kultjur-logo-7.png",
    status: "Case Study",
    slides: [
      { type: "image", src: "/portfolio/brand-identity/kultjur-logo-7.png" },
      // Add more identity slides here later (color system, grids, mockups, etc.)
    ],
  },
  {
    title: "IG Carousel Pack — 30 Templates",
    blurb:
      "Punchy, sarcastic, high‑retention slides built for 4:5. Designed for scroll‑stop power.",
    tags: ["Social", "Layout", "Photoshop"],
    thumb: "/portfolio/carousel-pack/slide-2.png",
    status: "Case Study",
    slides: [
      {
        type: "video",
        src: "/portfolio/carousel-pack/slide-1.mp4",
        poster: "/portfolio/carousel-pack/slide-2.png",
      },
      { type: "image", src: "/portfolio/carousel-pack/slide-2.png" },
      { type: "image", src: "/portfolio/carousel-pack/slide-3.png" },
      { type: "image", src: "/portfolio/carousel-pack/slide-4.png" },
      { type: "image", src: "/portfolio/carousel-pack/slide-5.png" },
      { type: "image", src: "/portfolio/carousel-pack/slide-6.png" },
    ],
  },
  {
    title: "Poster Series — LankaCore Minimal",
    blurb:
      "Monochrome type‑driven posters exploring Sinhala/English harmony, grid & rhythm.",
    tags: ["Poster", "Grid", "Type", "Print"],
    thumb:
      "https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?q=80&w=1600&auto=format&fit=crop",
    status: "WIP",
    slides: [
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?q=80&w=1600&auto=format&fit=crop",
      },
    ],
  },
];

const skills = [
  { name: "Adobe Illustrator", level: 90 },
  { name: "Adobe Photoshop", level: 88 },
  { name: "Typography & Grids", level: 90 },
  { name: "Color Systems", level: 85 },
  { name: "After Effects (Motion)", level: 78 },
  { name: "Premiere Pro (Edits)", level: 80 },
];

const experiences = [
  {
    role: "Graphic Designer",
    org: "KULTJUR® / Freelance",
    period: "2023 — Present",
    where: "Hamburg → Colombo (Remote)",
    points: [
      "Shipped brand identities (logo suites, fonts, palettes, guidelines)",
      "Designed high‑retention IG/TikTok carousels & packs (Sinhala/English)",
      "Built simple landing pages to showcase work & collect leads",
    ],
  },
  {
    role: "Video Editor (Side)",
    org: "Various Creators/SMBs",
    period: "2022 — Present",
    where: "Remote",
    points: [
      "Short‑form edits focusing on hooks, pacing, retention",
      "Motion graphics for titles, captions, kinetic type",
    ],
  },
];

export default function PortfolioPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSlides, setActiveSlides] = useState<Slide[]>([]);
  const [index, setIndex] = useState(0);

  const openLightbox = (slides: Slide[], start = 0) => {
    setActiveSlides(slides);
    setIndex(start);
    setIsOpen(true);
  };

  const closeLightbox = () => setIsOpen(false);

  const go = (dir: 1 | -1) => {
    setIndex((i) => {
      if (activeSlides.length === 0) return 0;
      return (i + dir + activeSlides.length) % activeSlides.length;
    });
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none bg-[radial-gradient(60%_60%_at_50%_0%,rgba(99,102,241,0.15),transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl font-semibold tracking-tight"
          >
            I’m Chenuka — a{" "}
            <span className="text-indigo-400">graphic designer</span> crafting
            bold, clean brand systems and socials.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-6 max-w-2xl text-lg text-neutral-300"
          >
            Brand identity, typography, layout systems, and scroll‑stopping
            social carousels for Gen‑Z/Sri Lankan audiences (සිංහල/English).
            Motion when it matters.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <button
              onClick={() =>
                document
                  .getElementById("projects")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="rounded-2xl bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400 transition"
            >
              View Projects
            </button>
            <a
              href="mailto:jchenuka@gmail.com"
              className="rounded-2xl border border-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-900 transition"
            >
              Contact
            </a>
            <div className="ml-auto flex gap-2 text-neutral-300">
              <IconLink href="mailto:jchenuka@gmail.com" label="Email">
                <Mail className="h-5 w-5" />
              </IconLink>
              <IconLink href="https://github.com/your" label="GitHub">
                <Github className="h-5 w-5" />
              </IconLink>
              <IconLink
                href="https://www.linkedin.com/in/your"
                label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </IconLink>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <Header
          title="Selected Work"
          subtitle="Case studies, not just links."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {projects.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/70"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={p.thumb}
                  alt="thumbnail"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-neutral-950/80 px-2 py-1 text-[10px] font-medium text-neutral-200 ring-1 ring-neutral-700">
                  <Star className="h-3 w-3" /> {p.status}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-1 text-sm text-neutral-300">{p.blurb}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-neutral-800 px-2 py-1 text-[10px] text-neutral-300 ring-1 ring-neutral-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => openLightbox(p.slides, 0)}
                    className="inline-flex items-center gap-1 rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-200 hover:bg-neutral-900 transition"
                  >
                    <PlayCircle className="h-4 w-4" /> Demo
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <Header title="Core Skills" subtitle="Design + motion." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {skills.map((s) => (
            <div
              key={s.name}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{s.name}</span>
                <span className="text-neutral-400">{s.level}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-800">
                <div
                  className="h-full bg-indigo-500"
                  style={{ width: `${s.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <Header title="Experience" subtitle="What I’ve been building." />
        <div className="mt-8 space-y-4">
          {experiences.map((e) => (
            <div
              key={e.role}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5"
            >
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-base font-semibold">
                  {e.role} · {e.org}
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-neutral-800 px-2 py-1 text-[10px] text-neutral-300 ring-1 ring-neutral-700">
                  <Clock className="h-3 w-3" />
                  {e.period}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-neutral-800 px-2 py-1 text-[10px] text-neutral-300 ring-1 ring-neutral-700">
                  <MapPin className="h-3 w-3" />
                  {e.where}
                </span>
              </div>
              <ul className="mt-3 list-disc pl-5 text-sm text-neutral-300">
                {e.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <Header
          title="Services"
          subtitle="Pick what you need, skip what you don't."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              name: "Brand Starter",
              desc: "Logo (primary/alt), typography & color system, mini style guide (8–10pp).",
              includes: ["Logo suite", "Type scale", "Palette", "Mini guide"],
            },
            {
              name: "Social Content Kit",
              desc: "30 carousel templates (4:5), cover systems, caption styles, export presets.",
              includes: ["30 templates", "Cover system", "Asset pack"],
            },
            {
              name: "Motion Add‑On",
              desc: "Kinetic type openers, lower‑thirds, caption styles for shorts/reels.",
              includes: ["3 openers", "Lower‑thirds", "Caption style"],
            },
          ].map((s) => (
            <div
              key={s.name}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5"
            >
              <h3 className="text-lg font-semibold">{s.name}</h3>
              <p className="mt-1 text-sm text-neutral-300">{s.desc}</p>
              <ul className="mt-3 list-disc pl-5 text-sm text-neutral-300">
                {s.includes.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">
                Hire me for graphic design.
              </h3>
              <p className="mt-1 text-neutral-300">
                Brand identities, social packs, and kinetic‑type add‑ons.
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="mailto:jchenuka@gmail.com"
                className="inline-flex items-center gap-2 rounded-2xl bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400 transition"
              >
                <Mail className="h-4 w-4" /> Email me
              </a>
              <a
                href="https://cal.com/your/intro"
                className="inline-flex items-center gap-2 rounded-2xl border border-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-900 transition"
              >
                <ArrowUpRight className="h-4 w-4" /> Book a call
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900/70 py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-sm text-neutral-400">
          © {new Date().getFullYear()} KULTJUR® — Built with Next.js & Tailwind.
        </div>
      </footer>

      {/* Lightbox Modal */}
      <Lightbox
        isOpen={isOpen}
        slides={activeSlides}
        index={index}
        onClose={closeLightbox}
        onPrev={() => go(-1)}
        onNext={() => go(1)}
      />
    </main>
  );
}

function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-neutral-400">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-700 hover:bg-neutral-900 transition"
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}

// --- Lightbox Modal ---
function Lightbox({
  isOpen,
  slides,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  isOpen: boolean;
  slides: Slide[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const esc = (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") onPrev();
    if (e.key === "ArrowRight") onNext();
  };
  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [isOpen]);

  const [startX, setStartX] = useState<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => setStartX(e.clientX);
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    if (dx > 60) onPrev();
    if (dx < -60) onNext();
    setStartX(null);
  };

  if (!isOpen) return null;
  const slide = slides[index];

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative max-h-[90vh] w-[min(92vw,900px)]"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            <button
              aria-label="Close"
              onClick={onClose}
              className="absolute -right-2 -top-2 rounded-full bg-white/10 p-2 ring-1 ring-white/20 hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
            {/* Media */}
            {slide?.type === "video" ? (
              <video
                src={slide.src}
                poster={slide.poster}
                className="max-h-[90vh] w-full rounded-xl object-contain"
                autoPlay
                muted
                controls
                playsInline
              />
            ) : (
              <img
                src={slide?.src}
                className="max-h-[90vh] w-full rounded-xl object-contain"
                alt="slide"
              />
            )}
            {/* Controls */}
            {slides.length > 1 && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-between">
                <button
                  onClick={onPrev}
                  className="pointer-events-auto ml-2 rounded-full bg-white/10 p-2 ring-1 ring-white/20 hover:bg-white/20"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={onNext}
                  className="pointer-events-auto mr-2 rounded-full bg-white/10 p-2 ring-1 ring-white/20 hover:bg-white/20"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            )}
            {/* Dots */}
            {slides.length > 1 && (
              <div className="mt-3 flex justify-center gap-1">
                {slides.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-4 rounded-full ${
                      i === index ? "bg-white" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
