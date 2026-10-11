import Link from "next/link";
import type { Resume } from "@/lib/resume";

// Okabe-Ito colorblind-safe palette. Used only for decorative variety
// (which card gets which accent) — no information is ever conveyed by
// color alone, every value also has a text label.
const ACCENTS = ["#0072B2", "#009E73", "#E69F00", "#CC79A7", "#56B4E9", "#D55E00"];

function KpiCard({ value, label, accent }: { value: string; label: string; accent: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="h-1 w-10 rounded-full" style={{ backgroundColor: accent }} />
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}

function SkillBar({ name, value, max }: { name: string; value: number; max: number }) {
  const pct = Math.max(6, Math.round((value / max) * 100));
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-medium text-slate-800">{name}</span>
        <span className="text-slate-500">{value}</span>
      </div>
      <div className="mt-1 h-2 w-full rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-[#0072B2]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-sm font-semibold tracking-wide text-slate-400 uppercase">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function Dashboard({ resume }: { resume: Resume }) {
  const maxEndorsements = Math.max(...resume.skills.map((s) => s.endorsements));
  const sortedSkills = [...resume.skills].sort((a, b) => b.endorsements - a.endorsements);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 font-sans text-slate-900 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[#0072B2]">Resume Dashboard</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
              {resume.profile.name.replace(", MBA", "")}
            </h1>
            <p className="mt-1 text-slate-500">
              {resume.profile.headline} · {resume.profile.location}
            </p>
          </div>
          <Link
            href="/"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm hover:border-[#0072B2] hover:text-[#0072B2]"
          >
            ← Other versions
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {resume.stats.map((stat, i) => (
            <KpiCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              accent={ACCENTS[i % ACCENTS.length]}
            />
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card title="Summary">
              <p className="leading-relaxed text-slate-700">{resume.profile.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {resume.profile.focus_areas.map((area, i) => (
                  <span
                    key={area}
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: `${ACCENTS[i % ACCENTS.length]}1a`,
                      color: ACCENTS[i % ACCENTS.length],
                    }}
                  >
                    {area}
                  </span>
                ))}
              </div>
            </Card>

            <Card title="Experience">
              <div className="space-y-6">
                {resume.experience.featured.map((role) => (
                  <div key={role.company} className="border-l-2 border-slate-100 pl-4">
                    <p className="text-xs font-medium text-slate-400">{role.date_range}</p>
                    <p className="font-semibold text-slate-900">
                      {role.role} · {role.company}
                    </p>
                    {role.summary && <p className="mt-1 text-sm text-slate-600">{role.summary}</p>}
                    <ul className="mt-2 space-y-1 text-sm text-slate-700">
                      {role.bullets.slice(0, 4).map((b) => (
                        <li key={b} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0072B2]" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Portfolio">
              <div className="grid gap-4 sm:grid-cols-2">
                {resume.portfolio.map((item) => (
                  <div key={item.title} className="rounded-lg border border-slate-100 p-4">
                    <p className="font-medium text-slate-900">{item.title}</p>
                    <div className="mt-2 flex flex-wrap gap-3">
                      {item.links.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-medium text-[#0072B2] hover:underline"
                        >
                          {link.label} ↗
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Tools">
              <div className="space-y-3">
                {sortedSkills.slice(0, 10).map((s) => (
                  <SkillBar key={s.name} name={s.name} value={s.endorsements} max={maxEndorsements} />
                ))}
              </div>
            </Card>

            <Card title="Education">
              <div className="space-y-3 text-sm">
                {resume.education.map((ed) => (
                  <div key={ed.degree}>
                    <p className="font-medium text-slate-900">{ed.degree}</p>
                    <p className="text-slate-500">{ed.school}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Business Domains">
              <div className="flex flex-wrap gap-2">
                {resume.profile.business_domains.map((d, i) => (
                  <span
                    key={d}
                    className="rounded-full px-3 py-1 text-xs font-medium text-white"
                    style={{ backgroundColor: ACCENTS[(i + 2) % ACCENTS.length] }}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
