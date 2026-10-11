"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Resume } from "@/lib/resume";

// Short, per-sentence chunks rather than one giant utterance: very long
// utterances are known to silently fail or truncate on mobile Safari and
// some Android WebViews, and also trip Chrome's ~15s idle cutoff. Each
// chunk is queued as its own speak() call once the previous one ends.
function buildSpeechChunks(resume: Resume): string[] {
  const chunks: string[] = [];
  chunks.push(resume.profile.name);
  chunks.push(resume.profile.headline);
  chunks.push(resume.profile.location);
  chunks.push(resume.profile.summary);

  for (const role of resume.experience.featured) {
    chunks.push(`${role.role} at ${role.company}, ${role.date_range}.`);
    if (role.summary) chunks.push(role.summary);
    chunks.push(...role.bullets);
    for (const eng of role.engagements) {
      chunks.push(`Client engagement: ${eng.client}.`);
      chunks.push(...eng.bullets);
    }
  }

  chunks.push("Earlier career.");
  for (const role of resume.experience.earlier) {
    chunks.push(`${role.role} at ${role.company}, ${role.date_range}.`);
    chunks.push(...role.bullets);
  }

  chunks.push(`Skills include ${resume.skills.map((s) => s.name).join(", ")}.`);
  chunks.push("Education.");
  for (const ed of resume.education) {
    chunks.push(`${ed.degree} from ${ed.school}.`);
  }

  return chunks.filter(Boolean);
}

export function AccessibleResume({ resume }: { resume: Resume }) {
  const [speaking, setSpeaking] = useState(false);
  const [unsupported, setUnsupported] = useState(false);
  // Chrome can garbage-collect an utterance with no other live reference,
  // silently killing speech mid-sentence — keeping it here prevents that.
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const stoppedRef = useRef(false);

  useEffect(() => {
    return () => {
      stoppedRef.current = true;
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakChunk = (chunks: string[], index: number) => {
    if (stoppedRef.current || index >= chunks.length) {
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(chunks[index]);
    utterance.onend = () => speakChunk(chunks, index + 1);
    utterance.onerror = () => setSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const readAloud = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setUnsupported(true);
      return;
    }
    // Reaching here means nothing is currently playing (the button shows
    // "Stop reading" instead while speaking), so there's never a prior
    // queue to cancel — avoids the Chrome race where cancel()
    // immediately followed by speak() silently drops the utterance.
    stoppedRef.current = false;
    setSpeaking(true);
    speakChunk(buildSpeechChunks(resume), 0);
  };

  const stopReading = () => {
    stoppedRef.current = true;
    window.speechSynthesis.cancel();
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
