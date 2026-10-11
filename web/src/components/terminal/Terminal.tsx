"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Resume } from "@/lib/resume";

interface Entry {
  command: string;
  output: ReactNode;
}

interface Command {
  id: string;
  label: string;
  run: (resume: Resume) => ReactNode;
}

function Line({ children }: { children?: ReactNode }) {
  return <p className="leading-relaxed whitespace-pre-wrap">{children ?? " "}</p>;
}

function whoami(resume: Resume): ReactNode {
  return (
    <>
      <Line>{resume.profile.name}</Line>
      <Line>{resume.profile.headline}</Line>
      <Line>{resume.profile.location}</Line>
    </>
  );
}

function catProfile(resume: Resume): ReactNode {
  return (
    <>
      <Line>{resume.profile.summary}</Line>
      <Line />
      <Line>focus_areas: {resume.profile.focus_areas.join(", ")}</Line>
      <Line>business_domains: {resume.profile.business_domains.join(", ")}</Line>
      <Line />
      {resume.stats.map((s) => (
        <Line key={s.label}>
          {s.value.padEnd(6)} {s.label}
        </Line>
      ))}
    </>
  );
}

function catExperience(resume: Resume): ReactNode {
  return (
    <>
      {resume.experience.featured.map((role) => (
        <div key={role.company} className="mb-4">
          <Line>
            [{role.date_range}] {role.role.toUpperCase()} @ {role.company}
          </Line>
          {role.summary && <Line> {role.summary}</Line>}
          {role.bullets.map((b) => (
            <Line key={b}> {">"} {b}</Line>
          ))}
          {role.engagements.map((eng) => (
            <div key={eng.client} className="ml-2">
              <Line>
                {"  -- "}
                {eng.client}
                {eng.former ? " (former)" : ""}
                {" --"}
              </Line>
              {eng.bullets.map((b) => (
                <Line key={b}>
                  {"    > "}
                  {b}
                </Line>
              ))}
            </div>
          ))}
        </div>
      ))}
      <Line>-- archived (earlier career) --</Line>
      {resume.experience.earlier.map((role) => (
        <div key={role.company} className="mb-3">
          <Line>
            [{role.date_range}] {role.role.toUpperCase()} @ {role.company}
          </Line>
          {role.bullets.map((b) => (
            <Line key={b}> {">"} {b}</Line>
          ))}
        </div>
      ))}
    </>
  );
}

function lsSkills(resume: Resume): ReactNode {
  const sorted = [...resume.skills].sort((a, b) => b.endorsements - a.endorsements);
  return (
    <>
      <Line>total {sorted.length}</Line>
      {sorted.map((s) => (
        <Line key={s.name}>
          -rwxr-xr-x {String(s.endorsements).padStart(3)} refs{" "}
          {s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.sh
        </Line>
      ))}
    </>
  );
}

function catEducation(resume: Resume): ReactNode {
  return (
    <>
      {resume.education.map((ed) => (
        <Line key={ed.degree}>
          {ed.degree}
          {ed.field_of_study ? ` (${ed.field_of_study})` : ""} — {ed.school}
        </Line>
      ))}
      <Line />
      <Line>continuing_education:</Line>
      {resume.certifications.map((c) => (
        <Line key={c.name}>
          {"  [" + c.issued_date + "] " + c.name}
          {c.authority ? ` — ${c.authority}` : ""}
        </Line>
      ))}
    </>
  );
}

function catPortfolio(resume: Resume): ReactNode {
  return (
    <>
      {resume.portfolio.map((item) => (
        <div key={item.title}>
          <Line>{item.title}</Line>
          {item.links.map((link) => (
            <Line key={link.url}>
              {"  "}
              {link.label}: {link.url}
            </Line>
          ))}
        </div>
      ))}
    </>
  );
}

const COMMANDS: Command[] = [
  { id: "whoami", label: "whoami", run: whoami },
  { id: "profile", label: "cat profile.txt", run: catProfile },
  { id: "experience", label: "cat experience.log", run: catExperience },
  { id: "skills", label: "ls -la skills/", run: lsSkills },
  { id: "education", label: "cat education.txt", run: catEducation },
  { id: "portfolio", label: "cat portfolio/", run: catPortfolio },
];

export function Terminal({ resume }: { resume: Resume }) {
  const [history, setHistory] = useState<Entry[]>(() => [
    { command: "whoami", output: whoami(resume) },
    {
      command: "cat welcome.txt",
      output: (
        <Line>
          Type a command below (or tap one) to read more. `help` lists everything available.
        </Line>
      ),
    },
  ]);
  const logRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [history]);

  const run = (cmd: Command) => {
    setHistory((h) => [...h, { command: cmd.label, output: cmd.run(resume) }]);
  };

  const runHelp = () => {
    setHistory((h) => [
      ...h,
      {
        command: "help",
        output: (
          <>
            {COMMANDS.map((c) => (
              <Line key={c.id}>{c.label}</Line>
            ))}
          </>
        ),
      },
    ]);
  };

  return (
    <main className="min-h-screen bg-[#0a0e0a] p-4 sm:p-8">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-md border border-[#2a3a2a]">
        <div className="flex items-center gap-2 bg-[#1a1f1a] px-4 py-2">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
          <span className="ml-3 font-mono text-xs text-[#6b8a6b]">chris@resume: ~</span>
        </div>

        <div className="relative bg-black">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, #33ff33 0px, #33ff33 1px, transparent 1px, transparent 3px)",
            }}
          />
          <div
            ref={logRef}
            className="relative max-h-[65vh] min-h-[50vh] overflow-y-auto p-4 font-mono text-sm text-[#33ff33] sm:text-base"
          >
            {history.map((entry, i) => (
              <div key={i} className="mb-3">
                <Line>
                  <span className="text-[#6bff6b]">$</span> {entry.command}
                </Line>
                <div className="text-[#33ff33]/85">{entry.output}</div>
              </div>
            ))}
            <p>
              <span className="text-[#6bff6b]">$</span>{" "}
              <span className="inline-block h-4 w-2 animate-pulse bg-[#33ff33] align-middle" />
            </p>
          </div>

          <div className="relative flex flex-wrap gap-2 border-t border-[#2a3a2a] bg-[#0a0e0a] p-3">
            {COMMANDS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => run(c)}
                className="border border-[#2a3a2a] px-2 py-1 font-mono text-xs text-[#33ff33] hover:bg-[#1a1f1a]"
              >
                {c.label}
              </button>
            ))}
            <button
              type="button"
              onClick={runHelp}
              className="border border-[#2a3a2a] px-2 py-1 font-mono text-xs text-[#33ff33] hover:bg-[#1a1f1a]"
            >
              help
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
