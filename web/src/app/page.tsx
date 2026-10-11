import Link from "next/link";
import { resume } from "@/lib/resume";

interface ThemeOption {
  slug: string;
  icon: string;
  title: string;
  tagline: string;
  accent: string;
  href: string | null;
}

const THEMES: ThemeOption[] = [
  {
    slug: "brutalist",
    icon: "⬛",
    title: "Brutalist infographic",
    tagline: "Raw, ugly-on-purpose, confident. Thick borders, one neon accent, playable arcade.",
    accent: "#d6ff1f",
    href: "/brutalist",
  },
  {
    slug: "case-file",
    icon: "🗂️",
    title: "The case file",
    tagline: "A redacted dossier you flip through with folder tabs, not a scrollbar.",
    accent: "#d9c48f",
    href: "/case-file",
  },
  {
    slug: "terminal",
    icon: "🖥️",
    title: "Terminal",
    tagline: "Green phosphor, blinking cursor. cat your way through 18 years of experience.",
    accent: "#33ff33",
    href: "/terminal",
  },
  {
    slug: "dashboard",
    icon: "📊",
    title: "The dashboard",
    tagline: "Modern, slick, colorblind-safe. The resume as a KPI dashboard.",
    accent: "#0072B2",
    href: "/dashboard",
  },
  {
    slug: "space-station",
    icon: "🚀",
    title: "Space ship",
    tagline: "A crude hand-drawn ship adrift among the stars, hauling cargo.",
    accent: "#7dd3fc",
    href: "/space-station",
  },
  {
    slug: "accessible",
    icon: "🔊",
    title: "Accessible / screen reader",
    tagline: "Plain semantic HTML, high contrast, and a read-aloud button.",
    accent: "#ffffff",
    href: "/accessible",
  },
  {
    slug: "spreadsheet",
    icon: "📈",
    title: "The spreadsheet",
    tagline: "The resume is now the terrible spreadsheet it keeps bragging about retiring.",
    accent: "#22c55e",
    href: null,
  },
  {
    slug: "star-wars",
    icon: "✨",
    title: "A long time ago...",
    tagline: "The resume, told as an opening crawl — scrolling into the stars.",
    accent: "#facc15",
    href: "/star-wars",
  },
  {
    slug: "c64-baseball",
    icon: "⚾",
    title: "Retro baseball",
    tagline: "8-bit diamond. Hits reveal the resume, outs tell you how I can help.",
    accent: "#60a5fa",
    href: null,
  },
  {
    slug: "rubiks-cube",
    icon: "🧩",
    title: "The Rubik's Cube",
    tagline: "Drag it, turn it, solve it. Every face hides another piece of the story.",
    accent: "#f97316",
    href: null,
  },
  {
    slug: "wingdings",
    icon: "🔣",
    title: "Wingdings",
    tagline: "The same resume. You just can't read it anymore.",
    accent: "#a855f7",
    href: null,
  },
];

export default function ThemePicker() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#1e293b,_#0b1120)] px-6 py-16 text-white sm:px-10 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-medium tracking-wide text-slate-400 uppercase">
          Chris Selig · {resume.stats[0]?.value} {resume.stats[0]?.label.toLowerCase()}
        </p>
        <h1 className="mt-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl">
          Pick which theme you want to use to view my resume
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-400">
          Same resume, same real work, {THEMES.length} different ways to explore it.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {THEMES.map((theme) => {
            const card = (
              <div
                className={`group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition-all ${
                  theme.href
                    ? "cursor-pointer hover:-translate-y-1 hover:border-white/25 hover:bg-white/10"
                    : "opacity-50"
                }`}
              >
                <div
                  className="absolute inset-x-0 top-0 h-1 rounded-t-2xl"
                  style={{ backgroundColor: theme.accent }}
                />
                <span className="text-3xl" aria-hidden>
                  {theme.icon}
                </span>
                <h2 className="mt-3 text-lg font-semibold text-white">{theme.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{theme.tagline}</p>
                <span
                  className={`mt-4 inline-block text-xs font-semibold tracking-wide uppercase ${
                    theme.href ? "" : "text-slate-500"
                  }`}
                  style={theme.href ? { color: theme.accent } : undefined}
                >
                  {theme.href ? "Open →" : "Coming soon"}
                </span>
              </div>
            );

            return theme.href ? (
              <Link key={theme.slug} href={theme.href} className="h-full">
                {card}
              </Link>
            ) : (
              <div key={theme.slug} aria-disabled="true">
                {card}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
