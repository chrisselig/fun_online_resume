"use client";

import { useState } from "react";
import Link from "next/link";
import type { Resume } from "@/lib/resume";
import { wingdingify } from "@/lib/wingdingify";

function T({ text, translate }: { text: string; translate: boolean }) {
  return <>{translate ? text : wingdingify(text)}</>;
}

export function WingdingsResume({ resume }: { resume: Resume }) {
  const [translate, setTranslate] = useState(false);

  return (
    <div className="min-h-screen bg-[#1a0f2e] px-4 py-8 text-[#e9d5ff] sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="text-sm text-[#c084fc] hover:text-white">
            <T text="← Other versions" translate={translate} />
          </Link>
          <button
            type="button"
            onClick={() => setTranslate((t) => !t)}
            className="rounded border-2 border-[#a855f7] bg-[#a855f7]/10 px-4 py-2 text-sm font-semibold hover:bg-[#a855f7]/20"
          >
            {translate ? "🔣 Scramble it again" : "🔤 Translate to English"}
          </button>
        </div>

        <h1 className="mt-6 text-4xl leading-tight font-bold sm:text-5xl">
          <T text={resume.profile.name} translate={translate} />
        </h1>
        <p className="mt-2 text-xl">
          <T text={resume.profile.headline} translate={translate} />
        </p>
        <p className="mt-1 text-lg text-[#c084fc]">
          <T text={resume.profile.location} translate={translate} />
        </p>

        {!translate && (
          <p className="mt-4 text-sm text-[#c084fc] italic">
            The same resume. You just can&apos;t read it anymore.
          </p>
        )}

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-[#c084fc]">
            <T text="Summary" translate={translate} />
          </h2>
          <p className="mt-3 text-lg leading-relaxed">
            <T text={resume.profile.summary} translate={translate} />
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-[#c084fc]">
            <T text="Experience" translate={translate} />
          </h2>
          {resume.experience.featured.map((role) => (
            <div key={role.company} className="mt-6">
              <h3 className="text-xl font-semibold">
                <T text={`${role.role}, ${role.company} (${role.date_range})`} translate={translate} />
              </h3>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-base">
                {role.bullets.map((b) => (
                  <li key={b}>
                    <T text={b} translate={translate} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-[#c084fc]">
            <T text="Skills" translate={translate} />
          </h2>
          <p className="mt-3 text-lg leading-relaxed">
            <T text={resume.skills.map((s) => s.name).join(", ")} translate={translate} />
          </p>
        </section>

        <section className="mt-10 mb-10">
          <h2 className="text-2xl font-bold text-[#c084fc]">
            <T text="Education" translate={translate} />
          </h2>
          <ul className="mt-3 space-y-2 text-lg">
            {resume.education.map((ed) => (
              <li key={ed.degree}>
                <T text={`${ed.degree} — ${ed.school}`} translate={translate} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
