import Link from "next/link";
import { resume } from "@/lib/resume";

interface ThemeOption {
  slug: string;
  file: string;
  title: string;
  tagline: string;
  href: string | null;
}

const THEMES: ThemeOption[] = [
  {
    slug: "brutalist",
    file: "BRUTALIST.EXE",
    title: "Brutalist infographic",
    tagline: "Raw, ugly-on-purpose, confident. Thick borders, one neon accent, playable arcade.",
    href: "/brutalist",
  },
  {
    slug: "case-file",
    file: "CASE_FILE.DAT",
    title: "The case file",
    tagline: "A redacted dossier you flip through with folder tabs, not a scrollbar.",
    href: "/case-file",
  },
  {
    slug: "terminal",
    file: "TERMINAL.SH",
    title: "Terminal",
    tagline: "Green phosphor, blinking cursor. cat your way through 18 years of experience.",
    href: "/terminal",
  },
  {
    slug: "spreadsheet",
    file: "SPREADSHEET.XLS",
    title: "The spreadsheet",
    tagline: "The resume is now the terrible spreadsheet it keeps bragging about retiring.",
    href: null,
  },
  {
    slug: "space-station",
    file: "SPACESTATION.SYS",
    title: "Space station",
    tagline: "Cargo modules drift in zero-g. Fire a thruster to pull them toward a wall.",
    href: "/space-station",
  },
  {
    slug: "dashboard",
    file: "DASHBOARD.APP",
    title: "The dashboard",
    tagline: "Modern, slick, colorblind-safe. The resume as a KPI dashboard.",
    href: "/dashboard",
  },
  {
    slug: "accessible",
    file: "ACCESSIBLE.TXT",
    title: "Accessible / screen reader",
    tagline: "Plain semantic HTML, high contrast, and a read-aloud button. Built to be heard, not just seen.",
    href: null,
  },
];

export default function ThemePicker() {
  return (
    <main className="bg-paper text-ink min-h-screen px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <p className="brutal-tag text-sm font-bold">000 / SELECT.EXE</p>
        <h1 className="mt-2 text-5xl font-black tracking-tighter uppercase sm:text-7xl">
          Pick a build
        </h1>
        <p className="mt-4 max-w-2xl font-serif text-lg">
          Same resume, same real work — {resume.profile.name.replace(", MBA", "")}, {resume.stats[0]?.value}{" "}
          {resume.stats[0]?.label.toLowerCase()}. {THEMES.length} different ways to read it.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {THEMES.map((theme, i) => {
            const card = (
              <div
                className={`group border-line relative overflow-hidden border-4 p-6 transition-colors ${
                  theme.href ? "hover:bg-ink hover:text-paper" : "text-ink/40"
                }`}
              >
                <span
                  aria-hidden
                  className="text-ink/10 group-hover:text-paper/10 pointer-events-none absolute -top-4 -right-2 font-mono text-7xl font-black select-none"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="brutal-tag relative text-xs font-bold uppercase opacity-60">
                  {theme.file}
                </p>
                <h2 className="relative mt-2 text-2xl font-black uppercase">{theme.title}</h2>
                <p className="relative mt-3 max-w-xs font-serif text-sm">{theme.tagline}</p>
                <span
                  className={`brutal-tag relative mt-4 inline-block px-2 py-1 font-mono text-xs font-bold uppercase ${
                    theme.href ? "bg-accent text-ink" : "border-line border"
                  }`}
                >
                  {theme.href ? "Launch ↗" : "Coming soon"}
                </span>
              </div>
            );

            return theme.href ? (
              <Link key={theme.slug} href={theme.href}>
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
