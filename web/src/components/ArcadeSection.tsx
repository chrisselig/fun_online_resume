"use client";

import { useState } from "react";
import type { EarlierRole, FeaturedRole, SkillEntry } from "@/lib/resume";
import { ArcadeInvaders } from "./ArcadeInvaders";
import { ArcadeBreakout } from "./ArcadeBreakout";
import { ArcadeSnake } from "./ArcadeSnake";

type GameId = "invaders" | "breakout" | "snake";

const GAMES: { id: GameId; title: string; tagline: string }[] = [
  {
    id: "invaders",
    title: "Data Invaders",
    tagline: "Shoot down 18 years of real pain-points with real tools.",
  },
  {
    id: "breakout",
    title: "Spreadsheet Breaker",
    tagline: "Smash through every tool brick before the ball gets past you.",
  },
  {
    id: "snake",
    title: "Data Pipeline",
    tagline: "Classic snake — grow a pipeline one tool at a time.",
  },
];

export function ArcadeSection({
  summary,
  featured,
  earlier,
  earlierRewards,
  skills,
  hireMePool,
  variant = "ink",
}: {
  summary: string;
  featured: FeaturedRole[];
  earlier: EarlierRole[];
  earlierRewards: string[];
  skills: SkillEntry[];
  hireMePool: string[];
  /** "manila" swaps the black wrapper for the case-file's folder color — the games themselves are unaffected, they're already self-contained black screens. */
  variant?: "ink" | "manila";
}) {
  const [selected, setSelected] = useState<GameId | null>(null);
  const isManila = variant === "manila";

  return (
    <section
      className={
        isManila
          ? "border-2 border-[#8a7752] bg-[#d9c48f] px-6 py-16 text-[#2b2117] sm:px-10 sm:py-24"
          : "border-b-8 border-line bg-ink px-6 py-16 text-paper sm:px-10 sm:py-24"
      }
    >
      <div className="mx-auto max-w-4xl">
        <p
          className={`brutal-tag inline-block text-sm font-bold ${
            isManila ? "bg-[#2b2117] px-2 py-0.5 text-[#d6ff1f]" : "text-accent"
          }`}
        >
          008 / ARCADE.EXE
        </p>
        <h2 className="mt-2 text-5xl font-black tracking-tighter uppercase sm:text-7xl">
          Pick a game
        </h2>
        <p
          className={`mt-3 max-w-2xl font-serif text-lg ${isManila ? "text-[#2b2117]/80" : "text-paper/80"}`}
        >
          Three bonus minigames, all built on real resume data. Fully optional — the rest of the
          resume still scrolls normally below.
        </p>

        {selected === null ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {GAMES.map((game, i) => (
              <button
                key={game.id}
                type="button"
                onClick={() => setSelected(game.id)}
                className={`group relative overflow-hidden border-4 p-6 text-left transition-colors ${
                  isManila
                    ? "border-[#2b2117] hover:bg-[#2b2117] hover:text-[#d9c48f]"
                    : "border-paper hover:bg-paper hover:text-ink"
                }`}
              >
                <span
                  aria-hidden
                  className={`pointer-events-none absolute -top-4 -right-2 font-mono text-7xl font-black select-none ${
                    isManila
                      ? "text-[#2b2117]/10 group-hover:text-[#d9c48f]/10"
                      : "text-paper/10 group-hover:text-ink/10"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="relative text-xl font-black uppercase">{game.title}</h3>
                <p
                  className={`relative mt-2 text-sm ${
                    isManila
                      ? "text-[#2b2117]/70 group-hover:text-[#d9c48f]/70"
                      : "text-paper/70 group-hover:text-ink/70"
                  }`}
                >
                  {game.tagline}
                </p>
                <span className="bg-accent text-ink relative mt-4 inline-block px-2 py-1 font-mono text-xs font-bold uppercase">
                  Play ↗
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className={`brutal-tag mb-6 inline-block border-2 px-3 py-1 text-xs font-bold uppercase ${
                isManila
                  ? "border-[#2b2117] text-[#2b2117] hover:bg-[#2b2117] hover:text-[#d9c48f]"
                  : "border-paper text-paper hover:bg-paper hover:text-ink"
              }`}
            >
              ← Back to games
            </button>

            {selected === "invaders" && (
              <ArcadeInvaders
                summary={summary}
                featured={featured}
                earlier={earlier}
                earlierRewards={earlierRewards}
                skills={skills}
                hireMePool={hireMePool}
              />
            )}
            {selected === "breakout" && (
              <ArcadeBreakout skills={skills} hireMePool={hireMePool} />
            )}
            {selected === "snake" && <ArcadeSnake skills={skills} hireMePool={hireMePool} />}
          </div>
        )}
      </div>
    </section>
  );
}
