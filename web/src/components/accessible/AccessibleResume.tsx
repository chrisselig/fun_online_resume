"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Resume } from "@/lib/resume";

function buildSpeechText(resume: Resume): string {
  const parts: string[] = [];
  parts.push(`${resume.profile.name}. ${resume.profile.headline}. ${resume.profile.location}.`);
  parts.push(resume.profile.summary);

  for (const role of resume.experience.featured) {
    parts.push(`${role.role} at ${role.company}, ${role.date_range}.`);
    if (role.summary) parts.push(role.summary);
    parts.push(...role.bullets);
    for (const eng of role.engagements) {
      parts.push(`Client engagement: ${eng.client}.`);
      parts.push(...eng.bullets);
    }
  }

  parts.push("Earlier career.");
  for (const role of resume.experience.earlier) {
    parts.push(`${role.role} at ${role.company}, ${role.date_range}.`);
    parts.push(...role.bullets);
  }

  parts.push(`Skills include ${resume.skills.map((s) => s.name).join(", ")}.`);
  parts.push("Education.");
  for (const ed of resume.education) {
    parts.push(`${ed.degree} from ${ed.school}.`);
  }

  return parts.join(" ");
}

export function AccessibleResume({ resume }: { resume: Resume }) {
  const [speaking, setSpeaking] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  // Chrome can garbage-collect an utterance with no other live reference,
  // silently killing speech mid-sentence — keeping it here prevents that.
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  // Chrome keepalive workaround: long utterances otherwise go silent after
  // ~15s because the synthesis engine pauses itself.
  const keepAliveRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (keepAliveRef.current !== null) window.clearInterval(keepAliveRef.current);
    };
  }, []);

  const readAloud = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setUnsupported(true);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(buildSpeechText(resume));
    utterance.onend = () => {
      setSpeaking(false);
      if (keepAliveRef.current !== null) window.clearInterval(keepAliveRef.current);
    };
    utterance.onerror = () => {
      setSpeaking(false);
      if (keepAliveRef.current !== null) window.clearInterval(keepAliveRef.current);
    };
    utteranceRef.current = utterance;

    const speakNow = () => {
      window.speechSynthesis.speak(utterance);
      keepAliveRef.current = window.setInterval(() => {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }, 10000);
    };

    // Calling speak() in the same tick as cancel() can silently no-op in
    // Chrome — deferring a tick avoids that race.
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
      setTimeout(speakNow, 50);
    } else {
      speakNow();
    }
    setSpeaking(true);
  };

  const stopReading = () => {
    window.speechSynthesis.cancel();
    if (keepAliveRef.current !== null) window.clearInterval(keepAliveRef.current);
    setSpeaking(false);
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-black focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>

      <div className="min-h-screen bg-white text-black">
        <header className="border-b-2 border-black px-4 py-6 sm:px-8">
          <nav aria-label="Resume versions" className="mb-4">
            <Link href="/" className="text-lg underline decoration-2 underline-offset-4">
              ← Back to all resume versions
            </Link>
          </nav>
          <h1 className="text-4xl font-bold sm:text-5xl">{resume.profile.name}</h1>
          <p className="mt-2 text-xl">{resume.profile.headline}</p>
          <p className="mt-1 text-lg">{resume.profile.location}</p>

          <button
            type="button"
            onClick={speaking ? stopReading : readAloud}
            className="mt-4 rounded border-2 border-black px-4 py-2 text-lg font-semibold hover:bg-black hover:text-white"
          >
            {speaking ? "⏹ Stop reading" : "🔊 Read this page aloud"}
          </button>
          {unsupported && (
            <p role="alert" className="mt-2 text-sm">
              Your browser doesn&apos;t support text-to-speech — try a screen reader instead, or
              read the text below directly.
            </p>
          )}
        </header>

        <main id="main-content" className="mx-auto max-w-3xl px-4 py-8 text-lg sm:px-8">
          <section aria-labelledby="summary-heading" className="mb-10">
            <h2 id="summary-heading" className="text-2xl font-bold">
              Summary
            </h2>
            <p className="mt-3 leading-relaxed">{resume.profile.summary}</p>
          </section>

          <section aria-labelledby="stats-heading" className="mb-10">
            <h2 id="stats-heading" className="text-2xl font-bold">
              At a glance
            </h2>
            <ul className="mt-3 space-y-2">
              {resume.stats.map((s) => (
                <li key={s.label}>
                  <strong>{s.value}</strong> — {s.label}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="experience-heading" className="mb-10">
            <h2 id="experience-heading" className="text-2xl font-bold">
              Experience
            </h2>
            {resume.experience.featured.map((role) => (
              <div key={role.company} className="mt-6">
                <h3 className="text-xl font-semibold">
                  {role.role}, {role.company} ({role.date_range})
                </h3>
                {role.summary && <p className="mt-2">{role.summary}</p>}
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  {role.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                {role.engagements.map((eng) => (
                  <div key={eng.client} className="mt-3 pl-4">
                    <h4 className="font-semibold">
                      {eng.client}
                      {eng.former ? " (former client)" : ""}
                    </h4>
                    <ul className="mt-1 list-disc space-y-1 pl-6">
                      {eng.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}

            <h3 className="mt-8 text-xl font-semibold">Earlier career</h3>
            {resume.experience.earlier.map((role) => (
              <div key={role.company} className="mt-4">
                <h4 className="font-semibold">
                  {role.role}, {role.company} ({role.date_range})
                </h4>
                <ul className="mt-1 list-disc space-y-1 pl-6">
                  {role.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section aria-labelledby="skills-heading" className="mb-10">
            <h2 id="skills-heading" className="text-2xl font-bold">
              Skills
            </h2>
            <ul className="mt-3 columns-2 gap-4">
              {[...resume.skills]
                .sort((a, b) => b.endorsements - a.endorsements)
                .map((s) => (
                  <li key={s.name}>{s.name}</li>
                ))}
            </ul>
          </section>

          <section aria-labelledby="education-heading" className="mb-10">
            <h2 id="education-heading" className="text-2xl font-bold">
              Education
            </h2>
            <ul className="mt-3 space-y-2">
              {resume.education.map((ed) => (
                <li key={ed.degree}>
                  <strong>{ed.degree}</strong>
                  {ed.field_of_study ? `, ${ed.field_of_study}` : ""} — {ed.school}
                </li>
              ))}
            </ul>
            <h3 className="mt-6 text-xl font-semibold">Professional development</h3>
            <ul className="mt-2 space-y-1">
              {resume.certifications.map((c) => (
                <li key={c.name}>
                  {c.name}
                  {c.authority ? `, ${c.authority}` : ""} ({c.issued_date})
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="portfolio-heading">
            <h2 id="portfolio-heading" className="text-2xl font-bold">
              Portfolio
            </h2>
            <ul className="mt-3 space-y-3">
              {resume.portfolio.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>
                  {": "}
                  {item.links.map((link, i) => (
                    <span key={link.url}>
                      {i > 0 && ", "}
                      <a href={link.url} className="underline decoration-2 underline-offset-4">
                        {link.label}
                      </a>
                    </span>
                  ))}
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </>
  );
}
