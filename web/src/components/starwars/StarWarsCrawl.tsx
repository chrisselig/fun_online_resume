"use client";

import { useState } from "react";
import Link from "next/link";
import type { Resume } from "@/lib/resume";

export function StarWarsCrawl({ resume }: { resume: Resume }) {
  const [playKey, setPlayKey] = useState(0);

  return (
    <main className="relative h-screen overflow-hidden bg-black text-[#ffe81f]">
      <style>{`
        @keyframes sw-crawl {
          0% { top: 100%; }
          100% { top: -400%; }
        }
        .sw-crawl-text {
          animation: sw-crawl 65s linear forwards;
        }
      `}</style>

      <Link
        href="/"
        className="absolute top-4 left-4 z-10 font-mono text-xs text-[#ffe81f]/70 hover:text-[#ffe81f]"
      >
        ← Other versions
      </Link>
      <button
        type="button"
        onClick={() => setPlayKey((k) => k + 1)}
        className="absolute top-4 right-4 z-10 font-mono text-xs text-[#ffe81f]/70 hover:text-[#ffe81f]"
      >
        ↻ Replay
      </button>

      <div
        className="absolute inset-0"
        style={{ perspective: "400px", perspectiveOrigin: "50% 100%" }}
      >
        <div
          key={playKey}
          className="sw-crawl-text absolute left-1/2 w-[92%] max-w-3xl text-center sm:w-[78%]"
          style={{ transformOrigin: "50% 100%", transform: "translateX(-50%) rotateX(25deg)" }}
        >
          <p className="mb-16 text-xl tracking-[0.3em] sm:text-3xl">EPISODE XVIII</p>
          <h1 className="mb-12 text-4xl leading-tight font-bold sm:text-6xl">A NEW QUERY</h1>
          {resume.star_wars_crawl.map((paragraph, i) => (
            <p key={i} className="mb-10 text-2xl leading-relaxed font-semibold sm:text-4xl">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </main>
  );
}
