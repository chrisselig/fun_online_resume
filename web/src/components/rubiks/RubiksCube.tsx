"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import type { Resume } from "@/lib/resume";
import {
  createSolvedCube,
  FACES,
  isSolved,
  turnFace,
  type CubeState,
  type Face,
} from "@/lib/rubiksCube";

interface CategoryContent {
  face: Face;
  tag: string;
  color: string;
  title: string;
  detail: string[];
}

function buildCategories(resume: Resume): CategoryContent[] {
  return [
    {
      face: "U",
      tag: "WORK",
      color: "#ef4444",
      title: "Experience",
      detail: resume.experience.featured.map(
        (r) => `${r.role} — ${r.company} (${r.date_range})`,
      ),
    },
    {
      face: "D",
      tag: "TOOLS",
      color: "#3b82f6",
      title: "Skills",
      detail: [resume.skills.map((s) => s.name).join(", ")],
    },
    {
      face: "L",
      tag: "SCHOOL",
      color: "#eab308",
      title: "Education",
      detail: resume.education.map((e) => `${e.degree} — ${e.school}`),
    },
    {
      face: "R",
      tag: "BUILT",
      color: "#22c55e",
      title: "Portfolio",
      detail: resume.portfolio.map((p) => p.title),
    },
    {
      face: "F",
      tag: "ABOUT",
      color: "#f97316",
      title: "Profile",
      detail: [resume.profile.summary],
    },
    {
      face: "B",
      tag: "FUN",
      color: "#a855f7",
      title: "Fun facts",
      detail: resume.fun_facts,
    },
  ];
}

const NET_LAYOUT: { face: Face; gridArea: string }[] = [
  { face: "U", gridArea: "1 / 2" },
  { face: "L", gridArea: "2 / 1" },
  { face: "F", gridArea: "2 / 2" },
  { face: "R", gridArea: "2 / 3" },
  { face: "B", gridArea: "2 / 4" },
  { face: "D", gridArea: "3 / 2" },
];

export function RubiksCube({ resume }: { resume: Resume }) {
  const categories = buildCategories(resume);
  const categoryByFace = Object.fromEntries(categories.map((c) => [c.face, c])) as Record<
    Face,
    CategoryContent
  >;

  const [cube, setCube] = useState<CubeState>(createSolvedCube());
  const [activeFace, setActiveFace] = useState<Face>("F");
  const [solved, setSolved] = useState(false);
  const [tilt, setTilt] = useState({ x: -15, y: 20 });
  const dragRef = useRef<{ x: number; y: number } | null>(null);

  const turn = (face: Face) => {
    const next = turnFace(cube, face, "cw");
    setCube(next);
    if (isSolved(next)) setSolved(true);
  };

  const doScramble = () => {
    setSolved(false);
    let state = cube;
    for (let i = 0; i < 14; i++) {
      const face = FACES[Math.floor(Math.random() * FACES.length)];
      state = turnFace(state, face, "cw");
    }
    setCube(state);
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    dragRef.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    dragRef.current = { x: e.clientX, y: e.clientY };
    setTilt((t) => ({
      x: Math.max(-40, Math.min(40, t.x - dy * 0.4)),
      y: Math.max(-60, Math.min(60, t.y + dx * 0.4)),
    }));
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  const active = categoryByFace[activeFace];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-black px-4 py-8 text-white sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-slate-400 hover:text-white">
            ← Other versions
          </Link>
          <button
            type="button"
            onClick={doScramble}
            className="rounded border border-slate-600 px-3 py-1 text-sm text-slate-300 hover:border-white hover:text-white"
          >
            🔀 Scramble
          </button>
        </div>

        <h1 className="mt-4 text-center text-3xl font-bold sm:text-4xl">
          {resume.profile.name.replace(", MBA", "")}&apos;s Cube
        </h1>
        <p className="mt-2 text-center text-sm text-slate-400">
          Drag the cube to look around. Turn a face, hover any square to read more. Solve it for a
          surprise.
        </p>

        <div
          className="mt-8 touch-none select-none"
          style={{ perspective: 800 }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <div
            className="mx-auto grid w-fit gap-1 transition-transform"
            style={{
              gridTemplateColumns: "repeat(4, 3.5rem)",
              gridTemplateRows: "repeat(3, 3.5rem)",
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            {NET_LAYOUT.map(({ face, gridArea }) => {
              return (
                <div
                  key={face}
                  style={{ gridArea }}
                  className="grid grid-cols-2 grid-rows-2 gap-0.5 border-2 border-black/40 p-0.5"
                >
                  {cube[face].map((stickerValue, i) => {
                    const stickerCategory = categories[stickerValue];
                    return (
                      <button
                        key={i}
                        type="button"
                        onMouseEnter={() => setActiveFace(stickerCategory.face)}
                        onClick={() => setActiveFace(stickerCategory.face)}
                        className="flex items-center justify-center rounded-[2px] text-[8px] font-bold text-black/70"
                        style={{ backgroundColor: stickerCategory.color }}
                      >
                        {stickerCategory.tag}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {FACES.map((face) => (
            <button
              key={face}
              type="button"
              onClick={() => turn(face)}
              className="rounded border border-slate-600 px-3 py-2 text-sm font-mono hover:border-white hover:bg-white/10"
            >
              Turn {face}
            </button>
          ))}
        </div>

        <div
          className="mt-8 rounded-lg border-2 p-5"
          style={{ borderColor: active.color, backgroundColor: `${active.color}15` }}
        >
          <p className="text-xs font-bold tracking-wide uppercase" style={{ color: active.color }}>
            {active.title}
          </p>
          <ul className="mt-2 space-y-1 text-sm text-slate-200">
            {active.detail.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>

      {solved && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSolved(false)}
        >
          <div
            className="max-w-md rounded-lg border-2 border-emerald-400 bg-slate-900 p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-3xl">🎉</p>
            <h2 className="mt-2 text-2xl font-bold text-emerald-400">Solved! Congrats.</h2>
            <p className="mt-3 text-sm text-slate-300">
              Here&apos;s what I can help with, now that you&apos;ve proven you can untangle a
              mess:
            </p>
            <ul className="mt-3 space-y-2 text-left text-sm text-slate-200">
              {resume.hire_me_pool.slice(0, 5).map((reason) => (
                <li key={reason}>— {reason}</li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setSolved(false)}
              className="mt-5 rounded border border-slate-500 px-4 py-2 text-sm hover:border-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
