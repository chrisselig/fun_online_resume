"use client";

import { useState } from "react";
import Link from "next/link";
import type { Resume } from "@/lib/resume";

type Row =
  | { kind: "section"; label: string }
  | { kind: "field"; label: string; value: string }
  | { kind: "bullet"; value: string }
  | { kind: "bar"; label: string; value: number; display: string };

function buildRows(resume: Resume): Row[] {
  const rows: Row[] = [];

  rows.push({ kind: "section", label: "PROFILE" });
  rows.push({ kind: "field", label: "Name", value: resume.profile.name });
  rows.push({ kind: "field", label: "Headline", value: resume.profile.headline });
  rows.push({ kind: "field", label: "Location", value: resume.profile.location });
  rows.push({ kind: "field", label: "Summary", value: resume.profile.summary });

  rows.push({ kind: "section", label: "KEY STATS" });
  for (const stat of resume.stats) {
    rows.push({ kind: "field", label: stat.label, value: stat.value });
  }

  rows.push({ kind: "section", label: "EXPERIENCE" });
  for (const role of resume.experience.featured) {
    rows.push({
      kind: "field",
      label: role.date_range,
      value: `${role.role} — ${role.company}`,
    });
    for (const b of role.bullets) rows.push({ kind: "bullet", value: b });
  }

  rows.push({ kind: "section", label: "EARLIER CAREER" });
  for (const role of resume.experience.earlier) {
    rows.push({
      kind: "field",
      label: role.date_range,
      value: `${role.role} — ${role.company}`,
    });
    for (const b of role.bullets) rows.push({ kind: "bullet", value: b });
  }

  rows.push({ kind: "section", label: "SKILLS" });
  const maxEndorsements = Math.max(...resume.skills.map((s) => s.endorsements));
  for (const skill of [...resume.skills].sort((a, b) => b.endorsements - a.endorsements)) {
    rows.push({
      kind: "bar",
      label: skill.name,
      value: (skill.endorsements / maxEndorsements) * 100,
      display: String(skill.endorsements),
    });
  }

  rows.push({ kind: "section", label: "EDUCATION" });
  for (const ed of resume.education) {
    rows.push({ kind: "field", label: ed.degree, value: ed.school });
  }

  return rows;
}

function columnLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

export function SpreadsheetResume({ resume }: { resume: Resume }) {
  const rows = buildRows(resume);
  const [selected, setSelected] = useState<{ ref: string; content: string }>({
    ref: "A1",
    content: resume.profile.name,
  });

  const select = (rowNum: number, col: number, content: string) => {
    setSelected({ ref: `${columnLetter(col)}${rowNum}`, content });
  };

  return (
    <div className="min-h-screen bg-[#f3f2f1] font-sans text-[#1a1a1a]">
      <div className="flex items-center justify-between border-b border-[#d4d4d4] bg-white px-4 py-2">
        <Link href="/" className="text-sm text-[#217346] hover:underline">
          ← Other versions
        </Link>
        <p className="text-sm font-semibold text-[#217346]">
          {resume.profile.name.replace(", MBA", "")}.xlsx
        </p>
      </div>

      <div className="flex items-center gap-2 border-b border-[#d4d4d4] bg-white px-3 py-1.5">
        <span className="font-serif text-sm text-[#217346] italic">fx</span>
        <span className="rounded border border-[#d4d4d4] bg-[#f3f2f1] px-2 py-0.5 text-xs font-semibold">
          {selected.ref}
        </span>
        <span className="truncate text-sm text-[#1a1a1a]">{selected.content}</span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div
            className="grid border-b border-[#d4d4d4] bg-[#f3f2f1] text-center text-xs font-semibold text-[#616161]"
            style={{ gridTemplateColumns: "2.5rem 10rem 1fr 9rem" }}
          >
            <div className="border-r border-[#d4d4d4] py-1" />
            {["A", "B", "C"].map((letter) => (
              <div key={letter} className="border-r border-[#d4d4d4] py-1">
                {letter}
              </div>
            ))}
          </div>

          {rows.map((row, i) => {
            const rowNum = i + 1;
            if (row.kind === "section") {
              return (
                <div
                  key={i}
                  className="grid border-b border-[#d4d4d4] bg-[#e6f2ec]"
                  style={{ gridTemplateColumns: "2.5rem 1fr" }}
                >
                  <div className="border-r border-[#d4d4d4] py-1.5 text-center text-xs text-[#616161]">
                    {rowNum}
                  </div>
                  <button
                    type="button"
                    onClick={() => select(rowNum, 0, row.label)}
                    className="px-2 py-1.5 text-left text-xs font-bold tracking-wide text-[#217346] hover:bg-[#d7ebe1]"
                  >
                    {row.label}
                  </button>
                </div>
              );
            }

            if (row.kind === "bullet") {
              return (
                <div
                  key={i}
                  className="grid border-b border-[#e8e8e8]"
                  style={{ gridTemplateColumns: "2.5rem 1fr" }}
                >
                  <div className="border-r border-[#d4d4d4] bg-[#f3f2f1] py-1.5 text-center text-xs text-[#616161]">
                    {rowNum}
                  </div>
                  <button
                    type="button"
                    onClick={() => select(rowNum, 1, row.value)}
                    className={`border-r border-[#e8e8e8] px-2 py-1.5 text-left text-sm hover:bg-[#f0f7f4] ${
                      selected.ref === `${columnLetter(1)}${rowNum}`
                        ? "outline outline-2 outline-[#217346]"
                        : ""
                    }`}
                  >
                    {row.value}
                  </button>
                </div>
              );
            }

            if (row.kind === "bar") {
              return (
                <div
                  key={i}
                  className="grid border-b border-[#e8e8e8]"
                  style={{ gridTemplateColumns: "2.5rem 10rem 1fr 9rem" }}
                >
                  <div className="border-r border-[#d4d4d4] bg-[#f3f2f1] py-1.5 text-center text-xs text-[#616161]">
                    {rowNum}
                  </div>
                  <button
                    type="button"
                    onClick={() => select(rowNum, 0, row.label)}
                    className={`border-r border-[#e8e8e8] px-2 py-1.5 text-left text-sm hover:bg-[#f0f7f4] ${
                      selected.ref === `A${rowNum}` ? "outline outline-2 outline-[#217346]" : ""
                    }`}
                  >
                    {row.label}
                  </button>
                  <button
                    type="button"
                    onClick={() => select(rowNum, 1, `${row.display} references`)}
                    className={`relative border-r border-[#e8e8e8] px-2 py-1.5 text-left text-sm hover:bg-[#f0f7f4] ${
                      selected.ref === `B${rowNum}` ? "outline outline-2 outline-[#217346]" : ""
                    }`}
                  >
                    <div
                      className="absolute inset-y-1 left-0 bg-[#63c384]/50"
                      style={{ width: `${Math.max(4, row.value)}%` }}
                    />
                    <span className="relative">{row.display}</span>
                  </button>
                  <div />
                </div>
              );
            }

            return (
              <div
                key={i}
                className="grid border-b border-[#e8e8e8]"
                style={{ gridTemplateColumns: "2.5rem 10rem 1fr" }}
              >
                <div className="border-r border-[#d4d4d4] bg-[#f3f2f1] py-1.5 text-center text-xs text-[#616161]">
                  {rowNum}
                </div>
                <button
                  type="button"
                  onClick={() => select(rowNum, 0, row.label)}
                  className={`border-r border-[#e8e8e8] px-2 py-1.5 text-left text-sm font-medium text-[#616161] hover:bg-[#f0f7f4] ${
                    selected.ref === `A${rowNum}` ? "outline outline-2 outline-[#217346]" : ""
                  }`}
                >
                  {row.label}
                </button>
                <button
                  type="button"
                  onClick={() => select(rowNum, 1, row.value)}
                  className={`border-r border-[#e8e8e8] px-2 py-1.5 text-left text-sm hover:bg-[#f0f7f4] ${
                    selected.ref === `B${rowNum}` ? "outline outline-2 outline-[#217346]" : ""
                  }`}
                >
                  {row.value}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
