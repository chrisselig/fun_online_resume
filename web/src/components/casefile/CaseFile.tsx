"use client";

import { useState } from "react";
import Link from "next/link";
import type { Resume } from "@/lib/resume";
import { JailCellPortrait } from "./JailCellPortrait";
import { ArcadeSection } from "@/components/ArcadeSection";

type TabId = "profile" | "experience" | "skills" | "education" | "exhibits" | "yard";

const TABS: { id: TabId; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "experience", label: "Service Record" },
  { id: "skills", label: "Evidence Log" },
  { id: "education", label: "Credentials" },
  { id: "exhibits", label: "Exhibits" },
  { id: "yard", label: "Yard Time" },
];

const INK = "text-[#2b2117]";
const PAPER = "bg-[#f3e9d2]";
const MANILA = "bg-[#d9c48f]";
const MANILA_LINE = "border-[#8a7752]";
const STAMP_RED = "text-[#9c2a1f]";

function Stamp() {
  return (
    <div
      className={`-rotate-3 border-4 ${STAMP_RED} border-[#9c2a1f]/70 mt-4 inline-block px-3 py-1 font-mono text-sm font-bold tracking-widest uppercase opacity-80`}
    >
      Available for hire
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <p className="font-mono text-xs tracking-wide uppercase">
      <span className="opacity-60">{label}:</span> <span className="font-bold">{value}</span>
    </p>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol className="mt-2 space-y-2">
      {items.map((item, i) => (
        <li key={item} className="flex gap-3 font-mono text-sm leading-relaxed">
          <span className="shrink-0 font-bold opacity-60">{String(i + 1).padStart(2, "0")}.</span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

function SkillBar({ name, value, max }: { name: string; value: number; max: number }) {
  const pct = Math.max(8, Math.round((value / max) * 100));
  return (
    <div>
      <div className="flex items-baseline justify-between font-mono text-xs uppercase">
        <span className="font-bold">{name}</span>
        <span className="opacity-60">{value} refs</span>
      </div>
      <div className={`mt-1 h-3 w-full border ${MANILA_LINE} bg-[#ece0c0]`}>
        <div className="h-full bg-[#9c2a1f]/70" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function CaseFile({ resume }: { resume: Resume }) {
  const [tab, setTab] = useState<TabId>("profile");
  const maxEndorsements = Math.max(...resume.skills.map((s) => s.endorsements));

  return (
    <main className="min-h-screen bg-[#2b251e] px-4 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-2 inline-block font-mono text-xs text-[#9c927c] uppercase hover:text-[#f3e9d2]"
        >
          ← Pull a different file
        </Link>
        <div className="flex gap-1 overflow-x-auto" role="tablist" aria-label="Case file sections">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-t-md border border-b-0 px-4 py-2 font-mono text-xs font-bold tracking-wide uppercase ${MANILA_LINE} ${
                tab === t.id ? `${PAPER} ${INK}` : `${MANILA} text-[#4a3f2c]`
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className={`relative border-2 ${MANILA_LINE} ${PAPER} ${INK} p-6 shadow-2xl shadow-black/50 sm:p-10`}>
          <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
            <div>
              <p className="font-mono text-xs tracking-[0.3em] uppercase opacity-60">Case File</p>
              <h1 className="mt-1 max-w-sm font-mono text-3xl font-black tracking-tight uppercase sm:text-4xl">
                {resume.profile.name.replace(", MBA", "")}
              </h1>
              <Stamp />
              <div className="mt-3 space-y-1">
                <Field label="Occupation" value={resume.profile.headline} />
                <Field label="Location" value={resume.profile.location} />
                <Field label="Case No." value="2008-ONGOING" />
                <p className="font-mono text-xs tracking-wide uppercase">
                  <span className="opacity-60">Handler:</span>{" "}
                  <span className="bg-[#2b2117] px-2 py-0.5 text-[#2b2117] select-none">
                    REDACTED
                  </span>
                </p>
              </div>
            </div>

            <JailCellPortrait />
          </div>

          <div className={`mt-6 border-t-2 border-dashed ${MANILA_LINE} pt-6`}>
            {tab === "profile" && (
              <div className="space-y-6">
                <p className="max-w-2xl font-mono text-sm leading-relaxed">{resume.profile.summary}</p>

                <div>
                  <p className="font-mono text-xs font-bold tracking-wide uppercase opacity-60">
                    Areas of operation
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {resume.profile.focus_areas.map((area) => (
                      <span
                        key={area}
                        className={`border ${MANILA_LINE} px-2 py-1 font-mono text-xs uppercase`}
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-mono text-xs font-bold tracking-wide uppercase opacity-60">
                    Known to operate within
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {resume.profile.business_domains.map((domain) => (
                      <span key={domain} className="bg-[#2b2117] px-2 py-1 font-mono text-xs text-[#f3e9d2] uppercase">
                        {domain}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {resume.stats.map((stat) => (
                    <div key={stat.label} className={`border ${MANILA_LINE} p-3`}>
                      <p className="font-mono text-3xl font-black">{stat.value}</p>
                      <p className="font-mono text-[10px] uppercase opacity-60">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="font-mono text-xs font-bold tracking-wide uppercase opacity-60">
                    Psychological profile (self-reported)
                  </p>
                  <ul className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
                    {[...resume.personality_traits]
                      .sort((a, b) => b.value - a.value)
                      .slice(0, 9)
                      .map((t) => (
                        <li key={t.trait} className="font-mono text-xs uppercase">
                          {t.trait} <span className="opacity-60">· {t.value}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}

            {tab === "experience" && (
              <div className="space-y-8">
                {resume.experience.featured.map((role, i) => (
                  <div key={role.company}>
                    <p className="font-mono text-xs opacity-60">
                      Entry {String(i + 1).padStart(2, "0")} · {role.date_range}
                    </p>
                    <h3 className="font-mono text-lg font-bold uppercase">
                      {role.role} — {role.company}
                    </h3>
                    {role.summary && (
                      <p className="mt-1 font-mono text-sm leading-relaxed opacity-80">{role.summary}</p>
                    )}
                    {role.bullets.length > 0 && <NumberedList items={role.bullets} />}
                    {role.engagements.map((eng) => (
                      <div key={eng.client} className={`mt-3 border-l-4 ${MANILA_LINE} pl-4`}>
                        <p className="font-mono text-sm font-bold uppercase">
                          {eng.client}
                          {eng.former ? " (closed)" : ""}
                        </p>
                        <NumberedList items={eng.bullets} />
                      </div>
                    ))}
                  </div>
                ))}

                <div>
                  <p className="font-mono text-xs opacity-60">Closed cases — earlier career</p>
                  {resume.experience.earlier.map((role) => (
                    <div key={role.company} className="mt-4">
                      <h4 className="font-mono text-sm font-bold uppercase">
                        {role.role} — {role.company} ({role.date_range})
                      </h4>
                      <NumberedList items={role.bullets} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "skills" && (
              <div className="space-y-3">
                <p className="font-mono text-xs opacity-60">
                  Tools recovered from the field, sorted by frequency of use.
                </p>
                {[...resume.skills]
                  .sort((a, b) => b.endorsements - a.endorsements)
                  .map((skill) => (
                    <SkillBar
                      key={skill.name}
                      name={skill.name}
                      value={skill.endorsements}
                      max={maxEndorsements}
                    />
                  ))}
              </div>
            )}

            {tab === "education" && (
              <div className="space-y-6">
                <div>
                  <p className="font-mono text-xs font-bold tracking-wide uppercase opacity-60">
                    Formal training
                  </p>
                  <div className="mt-2 space-y-3">
                    {resume.education.map((ed) => (
                      <div key={ed.degree}>
                        <p className="font-mono text-sm font-bold uppercase">{ed.degree}</p>
                        <p className="font-mono text-xs opacity-70">
                          {ed.field_of_study ? `${ed.field_of_study} · ` : ""}
                          {ed.school}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-mono text-xs font-bold tracking-wide uppercase opacity-60">
                    Continuing education record
                  </p>
                  <div className="mt-2 space-y-1">
                    {resume.certifications.map((cert) => (
                      <p key={cert.name} className="font-mono text-xs">
                        <span className="opacity-60">[{cert.issued_date}]</span> {cert.name}
                        {cert.authority ? ` — ${cert.authority}` : ""}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === "exhibits" && (
              <div className="grid gap-4 sm:grid-cols-2">
                {resume.portfolio.map((item, i) => (
                  <div key={item.title} className={`border ${MANILA_LINE} p-4`}>
                    <p className="font-mono text-xs opacity-60">
                      Exhibit {String.fromCharCode(65 + i)}
                    </p>
                    <p className="mt-1 font-mono text-sm font-bold uppercase">{item.title}</p>
                    <div className="mt-2 flex flex-wrap gap-3">
                      {item.links.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-xs underline decoration-2 underline-offset-2"
                        >
                          {link.label} ↗
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "yard" && (
              <div>
                <p className="mb-4 font-mono text-xs opacity-60">
                  Recreational privileges, revoked at any time.
                </p>
                <ArcadeSection
                  summary={resume.profile.summary}
                  featured={resume.experience.featured}
                  earlier={resume.experience.earlier}
                  earlierRewards={resume.experience.earlier_rewards}
                  skills={resume.skills}
                  hireMePool={resume.hire_me_pool}
                  variant="manila"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
