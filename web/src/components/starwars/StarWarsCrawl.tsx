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
          className="sw-crawl-text absolute left-1/2 w-[96%] text-center sm:w-[90%] lg:w-[82%] xl:w-[72%]"
          style={{ transformOrigin: "50% 100%", transform: "translateX(-50%) rotateX(25deg)" }}
        >
          <p className="mb-16 text-2xl tracking-[0.3em] sm:text-4xl lg:text-5xl">EPISODE XVIII</p>
          <h1 className="mb-14 text-5xl leading-tight font-bold sm:text-7xl lg:text-8xl xl:text-9xl">
            A NEW QUERY
          </h1>
          {resume.star_wars_crawl.map((paragraph, i) => (
            <p
              key={i}
              className="mb-12 text-3xl leading-relaxed font-semibold sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </main>
  );
}
