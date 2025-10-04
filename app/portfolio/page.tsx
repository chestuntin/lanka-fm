import React from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  Globe,
  PlayCircle,
  Star,
  Folder,
  Clock,
  MapPin,
} from "lucide-react";

// ---
// Portfolio Page Prototype (drop into app/portfolio/page.tsx or pages/portfolio.tsx)
// TailwindCSS required. Optional: framer-motion & lucide-react.
// Replace placeholder data below with real content.
// ---

const projects = [
  {
    title: "KULTJUR® Brand Identity System",
    blurb:
      "Logo suite (Sinhala/Latin), grid, typography scale, color system, and social templates.",
    tags: ["Branding", "Typography", "Logo", "Guidelines"],
    links: { live: "https://kultjur.lk", repo: undefined },
    thumb:
      "https://images.unsplash.com/photo-1512950050685-b1d4ae63d6b0?q=80&w=1600&auto=format&fit=crop",
    status: "Case Study",
  },
  {
    title: "IG Carousel Pack — 30 Templates",
    blurb:
      "Punchy, sarcastic, high‑retention slides built for 4:5. Export‑ready PSD/FIG files.",
    tags: ["Social", "Layout", "Figma", "Photoshop"],
    links: { live: "https://links.kultjur.lk", repo: undefined },
    thumb:
      "https://images.unsplash.com/photo-1515162305280-d9b1dc3a0b51?q=80&w=1600&auto=format&fit=crop",
    status: "Live",
  },
  {
    title: "Poster Series — LankaCore Minimal",
    blurb:
      "Monochrome type‑driven posters exploring Sinhala/English harmony, grid & rhythm.",
    tags: ["Poster", "Grid", "Type", "Print"],
    links: { live: "https://kultjur.lk/posters", repo: undefined },
    thumb:
      "https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?q=80&w=1600&auto=format&fit=crop",
    status: "WIP",
  },
];

const skills = [
  { name: "Adobe Illustrator", level: 90 },
  { name: "Adobe Photoshop", level: 88 },
  { name: "Figma", level: 85 },
  { name: "InDesign", level: 75 },
  { name: "Typography & Grids", level: 90 },
  { name: "Color Systems", level: 85 },
  { name: "After Effects (motion)", level: 78 },
  { name: "Premiere Pro (edits)", level: 80 },
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
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(99,102,241,0.15),transparent_60%)]" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl font-semibold tracking-tight"
          >
            I’m Chenuka — a{" "}
            <span className="text-indigo-400">graphic designer</span> crafting
            bold, clean brand systems and socials. (Video editor on the side.)
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
            <a
              href="#projects"
              className="rounded-2xl bg-indigo-500 px-4 py-2 text-sm font-medium hover:bg-indigo-400 transition"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="rounded-2xl border border-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-900 transition"
            >
              Contact
            </a>
            <div className="ml-auto flex gap-2 text-neutral-300">
              <IconLink href="mailto:chenuka@example.com" label="Email">
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
          subtitle="Real projects, shipped and in progress."
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
                  <LinkPill
                    href={p.links.live}
                    icon={<Globe className="h-4 w-4" />}
                    text="Live"
                  />
                  <LinkPill
                    href={p.links.repo}
                    icon={<Github className="h-4 w-4" />}
                    text="Repo"
                  />
                  <LinkPill
                    href="#"
                    icon={<PlayCircle className="h-4 w-4" />}
                    text="Demo"
                  />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <Header title="Core Skills" subtitle="Design + code + motion." />
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
                Brand identities, social packs, and kinetic‑type add‑ons. Video
                editing optional.
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="mailto:chenuka@example.com"
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

function LinkPill({
  href,
  icon,
  text,
}: {
  href?: string;
  icon: React.ReactNode;
  text: string;
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-200 hover:bg-neutral-900 transition"
    >
      {icon} {text}
    </a>
  );
}
