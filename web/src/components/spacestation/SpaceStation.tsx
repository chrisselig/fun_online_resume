"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import type { Resume } from "@/lib/resume";
import { stepBody, type Body, type Vector } from "@/lib/spaceStationPhysics";
import { StarField } from "./StarField";
import { ShipFrame } from "./ShipFrame";

interface Module {
  id: string;
  title: string;
  summary: string;
  detail: ReactNode;
  accent: string;
}

const MODULE_W = 160;
const MODULE_H = 110;

function buildModules(resume: Resume): Module[] {
  return [
    {
      id: "profile",
      title: "Crew Profile",
      summary: resume.profile.headline,
      accent: "#7dd3fc",
      detail: (
        <>
          <p>{resume.profile.summary}</p>
          <p className="mt-2 text-sm opacity-80">{resume.profile.location}</p>
        </>
      ),
    },
    ...resume.experience.featured.map((role, i) => ({
      id: `role-${i}`,
      title: role.company,
      summary: role.role,
      accent: ["#f472b6", "#facc15", "#34d399"][i % 3],
      detail: (
        <>
          <p className="opacity-70">{role.date_range}</p>
          {role.summary && <p className="mt-2">{role.summary}</p>}
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {role.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </>
      ),
    })),
    {
      id: "earlier",
      title: "Earlier Career",
      summary: `${resume.experience.earlier.length} prior postings`,
      accent: "#a78bfa",
      detail: (
        <div className="space-y-3">
          {resume.experience.earlier.map((role) => (
            <div key={role.company}>
              <p className="font-bold">
                {role.role} — {role.company} ({role.date_range})
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {role.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "skills",
      title: "Tool Inventory",
      summary: `${resume.skills.length} tools mastered`,
      accent: "#fb923c",
      detail: (
        <ul className="grid grid-cols-2 gap-1">
          {[...resume.skills]
            .sort((a, b) => b.endorsements - a.endorsements)
            .map((s) => (
              <li key={s.name}>
                {s.name} <span className="opacity-60">· {s.endorsements}</span>
              </li>
            ))}
        </ul>
      ),
    },
    {
      id: "education",
      title: "Training Records",
      summary: `${resume.education.length} credentials`,
      accent: "#38bdf8",
      detail: (
        <>
          {resume.education.map((ed) => (
            <p key={ed.degree}>
              {ed.degree} — {ed.school}
            </p>
          ))}
          <p className="mt-2 opacity-70">
            + {resume.certifications.length} professional development courses
          </p>
        </>
      ),
    },
    {
      id: "portfolio",
      title: "Mission Exhibits",
      summary: `${resume.portfolio.length} side projects`,
      accent: "#4ade80",
      detail: (
        <div className="space-y-2">
          {resume.portfolio.map((item) => (
            <div key={item.title}>
              <p className="font-bold">{item.title}</p>
              {item.links.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="underline">
                  {l.label} ↗
                </a>
              ))}
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "stats",
      title: "Flight Stats",
      summary: `${resume.stats[0]?.value ?? ""} ${resume.stats[0]?.label.toLowerCase() ?? ""}`,
      accent: "#fbbf24",
      detail: (
        <ul className="space-y-1">
          {resume.stats.map((s) => (
            <li key={s.label}>
              {s.value} — {s.label}
            </li>
          ))}
        </ul>
      ),
    },
  ];
}

const GRAVITY_PRESETS: { id: string; label: string; vector: Vector }[] = [
  { id: "zero", label: "Zero-G", vector: { x: 0, y: 0 } },
  { id: "down", label: "Floor ↓", vector: { x: 0, y: 0.6 } },
  { id: "up", label: "Ceiling ↑", vector: { x: 0, y: -0.6 } },
  { id: "left", label: "Port ←", vector: { x: -0.6, y: 0 } },
  { id: "right", label: "Starboard →", vector: { x: 0.6, y: 0 } },
];

export function SpaceStation({ resume }: { resume: Resume }) {
  const modules = useMemo(() => buildModules(resume), [resume]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const bodiesRef = useRef<Body[]>([]);
  const gravityRef = useRef<Vector>({ x: 0, y: 0 });
  const rafRef = useRef(0);

  const [gravityId, setGravityId] = useState("zero");
  const [selected, setSelected] = useState<Module | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    // Client-only random layout: safe here because this effect only runs
    // after mount, never during the server-rendered first paint.
    bodiesRef.current = modules.map(() => ({
      x: Math.random() * Math.max(1, width - MODULE_W),
      y: Math.random() * Math.max(1, height - MODULE_H),
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      w: MODULE_W,
      h: MODULE_H,
    }));
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready) return;

    const loop = () => {
      const el = containerRef.current;
      if (!el) return;
      const bounds = { width: el.clientWidth, height: el.clientHeight };

      bodiesRef.current = bodiesRef.current.map((b) => {
        const next = stepBody(b, gravityRef.current, bounds, 1);
        // Gentle ambient drift so things keep moving in zero-g instead of
        // settling into a dead stop.
        if (gravityRef.current.x === 0 && gravityRef.current.y === 0) {
          next.vx += (Math.random() - 0.5) * 0.04;
          next.vy += (Math.random() - 0.5) * 0.04;
        }
        return next;
      });

      bodiesRef.current.forEach((b, i) => {
        const node = nodeRefs.current[i];
        if (node) node.style.transform = `translate(${b.x}px, ${b.y}px)`;
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [ready]);

  const setGravity = (id: string) => {
    setGravityId(id);
    gravityRef.current = GRAVITY_PRESETS.find((g) => g.id === id)?.vector ?? { x: 0, y: 0 };
  };

  return (
    <main className="min-h-screen bg-[#05070d] p-4 text-[#e8f1ff] sm:p-8">
      <StarField />
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-xs tracking-[0.3em] text-[#7dd3fc] uppercase">
            Deep Space Resume Module
          </p>
          <Link
            href="/"
            className="rounded border border-[#2a3a52] px-2 py-1 font-mono text-xs text-[#9db4d4] uppercase hover:border-[#7dd3fc] hover:text-[#7dd3fc]"
          >
            ← Dock / other versions
          </Link>
        </div>
        <h1 className="mt-1 text-3xl font-black tracking-tight uppercase sm:text-5xl">
          {resume.profile.name.replace(", MBA", "")}
        </h1>
        <p className="mt-2 max-w-xl font-mono text-sm text-[#9db4d4]">
          Cargo drifts freely in zero-g. Fire a thruster to pull everything toward a wall, or tap
          a module to open its full record.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {GRAVITY_PRESETS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGravity(g.id)}
              aria-pressed={gravityId === g.id}
              className={`rounded border px-3 py-1 font-mono text-xs uppercase ${
                gravityId === g.id
                  ? "border-[#7dd3fc] bg-[#7dd3fc] text-[#05070d]"
                  : "border-[#2a3a52] text-[#9db4d4] hover:border-[#7dd3fc]"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div className="relative mt-6 px-10 py-16 sm:px-20 sm:py-20">
          <ShipFrame />
          <div
            ref={containerRef}
            className="relative z-10 h-[60vh] min-h-[420px] overflow-hidden rounded-lg border border-[#2a3a52] bg-[radial-gradient(circle_at_20%_20%,#0d1526,#05070d)]"
          >
          {modules.map((m, i) => (
            <button
              key={m.id}
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              type="button"
              onClick={() => setSelected(m)}
              style={{
                width: MODULE_W,
                height: MODULE_H,
                borderColor: m.accent,
                opacity: ready ? 1 : 0,
              }}
              className="absolute top-0 left-0 flex flex-col justify-between rounded border-2 bg-[#0d1526]/90 p-3 text-left shadow-lg transition-opacity"
            >
              <p className="font-mono text-[10px] tracking-wide uppercase" style={{ color: m.accent }}>
                {m.title}
              </p>
              <p className="line-clamp-3 text-xs text-[#e8f1ff]">{m.summary}</p>
            </button>
          ))}
          </div>
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-lg border-2 bg-[#0d1526] p-6"
            style={{ borderColor: selected.accent }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-mono text-xs uppercase" style={{ color: selected.accent }}>
              {selected.title}
            </p>
            <div className="mt-3 text-sm leading-relaxed text-[#e8f1ff]">{selected.detail}</div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-4 rounded border border-[#2a3a52] px-3 py-1 font-mono text-xs uppercase hover:border-[#7dd3fc]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
