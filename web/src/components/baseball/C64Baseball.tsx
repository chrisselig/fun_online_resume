"use client";

import { useState } from "react";
import Link from "next/link";
import type { Resume } from "@/lib/resume";
import { advanceRunners, EMPTY_BASES, resolveAtBat, type BaseState } from "@/lib/baseballLogic";

function buildFacts(resume: Resume): string[] {
  const facts: string[] = [resume.profile.summary];
  for (const stat of resume.stats) {
    facts.push(`${stat.value} ${stat.label}.`);
  }
  for (const role of resume.experience.featured) {
    facts.push(`${role.role} at ${role.company} (${role.date_range}).`);
    facts.push(...role.bullets);
  }
  for (const role of resume.experience.earlier) {
    facts.push(`${role.role} at ${role.company} (${role.date_range}).`);
    facts.push(...role.bullets);
  }
  facts.push(`Tools: ${resume.skills.map((s) => s.name).join(", ")}.`);
  return facts;
}

interface LogEntry {
  type: "hit" | "out";
  text: string;
}

function DiamondBase({ occupied, label }: { occupied: boolean; label: string }) {
  return (
    <div
      className={`h-4 w-4 rotate-45 border-2 ${
        occupied ? "border-[#ffff00] bg-[#ffff00]" : "border-[#a8a8ff] bg-transparent"
      }`}
      aria-label={`${label} base ${occupied ? "occupied" : "empty"}`}
    />
  );
}

export function C64Baseball({ resume }: { resume: Resume }) {
  const facts = buildFacts(resume);
  const [factIndex, setFactIndex] = useState(0);
  const [reasonIndex, setReasonIndex] = useState(0);
  const [bases, setBases] = useState<BaseState>(EMPTY_BASES);
  const [outs, setOuts] = useState(0);
  const [inning, setInning] = useState(1);
  const [score, setScore] = useState(0);
  const [log, setLog] = useState<LogEntry[]>([]);

  const swing = () => {
    const result = resolveAtBat(Math.random());

    if (result === "hit") {
      const { bases: nextBases, runsScored } = advanceRunners(bases);
      setBases(nextBases);
      setScore((s) => s + runsScored);
      const text = facts[factIndex % facts.length];
      setFactIndex((i) => i + 1);
      const entry: LogEntry = { type: "hit", text };
      setLog((l) => [...l, entry].slice(-6));
    } else {
      const nextOuts = outs + 1;
      const text = resume.hire_me_pool[reasonIndex % resume.hire_me_pool.length];
      setReasonIndex((i) => i + 1);
      const entry: LogEntry = { type: "out", text };
      setLog((l) => [...l, entry].slice(-6));

      if (nextOuts >= 3) {
        setOuts(0);
        setBases(EMPTY_BASES);
        setInning((i) => i + 1);
      } else {
        setOuts(nextOuts);
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#4040e0] px-4 py-8 font-mono text-white sm:px-8">
      <div className="mx-auto max-w-2xl border-8 border-[#7878ff] bg-[#4040e0] p-4 sm:p-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xs text-[#a8a8ff] hover:text-white">
            ← OTHER VERSIONS
          </Link>
          <p className="text-xs text-[#a8a8ff]">READY.</p>
        </div>

        <h1 className="mt-2 text-center text-2xl font-bold tracking-widest sm:text-3xl">
          *** DATA LEAGUE BASEBALL ***
        </h1>
        <p className="mt-1 text-center text-sm text-[#a8a8ff]">
          {resume.profile.name.toUpperCase()} AT THE PLATE
        </p>

        <div className="mt-6 flex justify-center gap-8 text-sm sm:text-base">
          <p>INNING {inning}</p>
          <p>SCORE {score}</p>
          <p>OUTS {"●".repeat(outs)}{"○".repeat(3 - outs)}</p>
        </div>

        <div className="relative mx-auto mt-6 h-40 w-40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2">
            <DiamondBase occupied={bases.second} label="Second" />
          </div>
          <div className="absolute top-1/2 left-0 -translate-y-1/2">
            <DiamondBase occupied={bases.third} label="Third" />
          </div>
          <div className="absolute top-1/2 right-0 -translate-y-1/2">
            <DiamondBase occupied={bases.first} label="First" />
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
            <div className="h-4 w-4 rotate-45 border-2 border-white bg-white" aria-label="Home plate" />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={swing}
            className="border-4 border-white bg-[#ffff00] px-8 py-3 text-xl font-bold tracking-widest text-[#4040e0] hover:bg-white"
          >
            SWING
          </button>
        </div>

        <div className="mt-6 min-h-40 border-2 border-[#a8a8ff] bg-[#2020a0] p-3 text-sm leading-relaxed">
          {log.length === 0 && <p className="text-[#a8a8ff]">PRESS SWING TO PLAY BALL.</p>}
          {log.map((entry, i) => (
            <p key={i} className={entry.type === "hit" ? "text-[#ffff00]" : "text-[#a8a8ff]"}>
              {entry.type === "hit" ? "HIT! > " : "OUT.  > "}
              {entry.text}
            </p>
          ))}
          <p className="mt-1 text-[#ffff00]">
            READY<span className="animate-pulse">_</span>
          </p>
        </div>
      </div>
    </main>
  );
}
