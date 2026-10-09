"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { FeaturedRole, SkillEntry } from "@/lib/resume";
import { extractPainPoints, topWeapons } from "@/lib/arcadeContent";

const CANVAS_W = 480;
const CANVAS_H = 270;
const PLAYER_W = 34;
const PLAYER_H = 10;
const PLAYER_Y = CANVAS_H - 24;
const PLAYER_SPEED = 3.4;
const BULLET_SPEED = 4.5;
const ENEMY_W = 96;
const ENEMY_H = 24;
const ENEMY_COLS = 4;
const ENEMY_ROWS = 2;
const ENEMY_GAP_X = 10;
const ENEMY_GAP_Y = 14;
const ENEMY_SPEED = 0.45;
const ENEMY_DROP = 16;
const WAVE_COUNT = 3;
const SHOT_COOLDOWN_MS = 260;
const MOVE_KEYS = new Set(["arrowleft", "arrowright", "a", "d", " "]);

const COLOR_BG = "#090b10";
const COLOR_INK = "#eaf6f0";
const COLOR_NAVY = "#1fb6c9";
const COLOR_ACCENT = "#ff2d78";
const FONT = "8px ui-monospace, Menlo, Consolas, monospace";

interface Enemy {
  baseX: number;
  baseY: number;
  alive: boolean;
  label: string;
}

type Status = "idle" | "playing" | "levelClear" | "complete";

function buildWave(labels: string[], waveIndex: number): Enemy[] {
  const totalW = ENEMY_COLS * ENEMY_W + (ENEMY_COLS - 1) * ENEMY_GAP_X;
  const startX = (CANVAS_W - totalW) / 2;
  const enemies: Enemy[] = [];
  let labelIdx = waveIndex * ENEMY_COLS * ENEMY_ROWS;
  for (let row = 0; row < ENEMY_ROWS; row++) {
    for (let col = 0; col < ENEMY_COLS; col++) {
      enemies.push({
        baseX: startX + col * (ENEMY_W + ENEMY_GAP_X),
        baseY: 28 + row * (ENEMY_H + ENEMY_GAP_Y),
        alive: true,
        label: labels[labelIdx % labels.length],
      });
      labelIdx++;
    }
  }
  return enemies;
}

function wrapLabel(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function ArcadeGame({
  summary,
  featured,
  skills,
}: {
  summary: string;
  featured: FeaturedRole[];
  skills: SkillEntry[];
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const playerXRef = useRef((CANVAS_W - PLAYER_W) / 2);
  const bulletsRef = useRef<{ x: number; y: number }[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const offsetXRef = useRef(0);
  const dirRef = useRef(1);
  const dropRef = useRef(0);
  const lastShotRef = useRef(0);
  const rafRef = useRef(0);
  const weaponRef = useRef("Python");

  const [status, setStatus] = useState<Status>("idle");
  const [waveIndex, setWaveIndex] = useState(0);
  const [score, setScore] = useState(0);

  const painPoints = useMemo(() => extractPainPoints(summary, featured), [summary, featured]);
  const weapons = useMemo(() => topWeapons(skills), [skills]);

  const setupWave = useCallback(
    (idx: number) => {
      enemiesRef.current = buildWave(painPoints, idx);
      bulletsRef.current = [];
      dirRef.current = 1;
      dropRef.current = 0;
      offsetXRef.current = 0;
      playerXRef.current = (CANVAS_W - PLAYER_W) / 2;
      weaponRef.current = weapons[idx % weapons.length] ?? "Python";
    },
    [painPoints, weapons],
  );

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = COLOR_BG;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.fillStyle = COLOR_ACCENT;
    ctx.fillRect(playerXRef.current, PLAYER_Y, PLAYER_W, PLAYER_H);
    ctx.font = FONT;
    ctx.fillStyle = COLOR_INK;
    ctx.textAlign = "center";
    ctx.fillText(weaponRef.current, playerXRef.current + PLAYER_W / 2, PLAYER_Y - 4);

    ctx.fillStyle = COLOR_ACCENT;
    for (const b of bulletsRef.current) {
      ctx.fillRect(b.x - 1.5, b.y, 3, 8);
    }

    ctx.font = FONT;
    for (const e of enemiesRef.current) {
      if (!e.alive) continue;
      const x = e.baseX + offsetXRef.current;
      const y = e.baseY + dropRef.current;
      ctx.strokeStyle = COLOR_NAVY;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, ENEMY_W, ENEMY_H);
      ctx.fillStyle = COLOR_NAVY;
      ctx.textAlign = "center";
      const lines = wrapLabel(ctx, e.label, ENEMY_W - 10);
      const lineH = 9;
      const startY = y + ENEMY_H / 2 - ((lines.length - 1) * lineH) / 2 + 3;
      lines.forEach((line, i) => ctx.fillText(line, x + ENEMY_W / 2, startY + i * lineH));
    }
  }, []);

  // Self-referencing RAF loop defined inline so it isn't a stale closure
  // problem for eslint's hook-dependency checks — `loop` is only ever
  // called after its own `const` assignment has completed.
  useEffect(() => {
    if (status !== "playing") return;

    const loop = () => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;

      if (keysRef.current.has("arrowleft") || keysRef.current.has("a")) {
        playerXRef.current = Math.max(4, playerXRef.current - PLAYER_SPEED);
      }
      if (keysRef.current.has("arrowright") || keysRef.current.has("d")) {
        playerXRef.current = Math.min(
          CANVAS_W - PLAYER_W - 4,
          playerXRef.current + PLAYER_SPEED,
        );
      }

      offsetXRef.current += dirRef.current * ENEMY_SPEED;
      const aliveXs = enemiesRef.current.filter((e) => e.alive).map((e) => e.baseX);
      if (aliveXs.length > 0) {
        const minX = Math.min(...aliveXs);
        const maxX = Math.max(...aliveXs) + ENEMY_W;
        if (minX + offsetXRef.current < 6 || maxX + offsetXRef.current > CANVAS_W - 6) {
          dirRef.current *= -1;
          dropRef.current += ENEMY_DROP;
        }
      }

      bulletsRef.current = bulletsRef.current
        .map((b) => ({ x: b.x, y: b.y - BULLET_SPEED }))
        .filter((b) => b.y > -10);

      for (const enemy of enemiesRef.current) {
        if (!enemy.alive) continue;
        const ex = enemy.baseX + offsetXRef.current;
        const ey = enemy.baseY + dropRef.current;
        for (const bullet of bulletsRef.current) {
          if (
            bullet.x > ex &&
            bullet.x < ex + ENEMY_W &&
            bullet.y > ey &&
            bullet.y < ey + ENEMY_H
          ) {
            enemy.alive = false;
            bullet.y = -999;
            setScore((s) => s + 10);
            break;
          }
        }
      }
      bulletsRef.current = bulletsRef.current.filter((b) => b.y > -100);

      draw(ctx);

      if (enemiesRef.current.every((e) => !e.alive)) {
        setStatus("levelClear");
        return;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [status, draw]);

  // Initial idle-state paint so the canvas isn't blank before the first play.
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) draw(ctx);
  }, [draw]);

  const beginGame = () => {
    setWaveIndex(0);
    setScore(0);
    setupWave(0);
    setStatus("playing");
  };

  const advanceWave = () => {
    const next = waveIndex + 1;
    if (next >= WAVE_COUNT) {
      setStatus("complete");
      return;
    }
    setWaveIndex(next);
    setupWave(next);
    setStatus("playing");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLCanvasElement>) => {
    const key = e.key.toLowerCase();
    if (MOVE_KEYS.has(key)) e.preventDefault();

    if (status === "idle") {
      if (key === " ") beginGame();
      return;
    }
    if (status === "levelClear") {
      if (key === " ") advanceWave();
      return;
    }
    if (status === "complete") return;

    keysRef.current.add(key);
    if (key === " " && !e.repeat) {
      const now = performance.now();
      if (now - lastShotRef.current > SHOT_COOLDOWN_MS) {
        bulletsRef.current.push({ x: playerXRef.current + PLAYER_W / 2, y: PLAYER_Y });
        lastShotRef.current = now;
      }
    }
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLCanvasElement>) => {
    keysRef.current.delete(e.key.toLowerCase());
  };

  return (
    <section className="border-b-4 border-ink bg-paper px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
          Bonus level — fully optional
        </p>
        <h2 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Data Invaders</h2>
        <p className="mt-3 max-w-2xl text-ink/80">
          Shoot down real problems from 18 years of real work, armed with real tools. Arrow
          keys / A-D to move, Space to fire. Clear a wave to unlock a job below.
        </p>

        <div className="relative mx-auto mt-8 w-full max-w-2xl">
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            className="w-full border-4 border-navy outline-none [image-rendering:pixelated]"
            aria-label="Data Invaders mini-game canvas"
          />

          {status === "idle" && (
            <button
              type="button"
              onClick={beginGame}
              className="bg-paper/90 absolute inset-0 flex flex-col items-center justify-center gap-2 font-mono"
            >
              <span className="text-accent text-lg font-bold">PRESS START</span>
              <span className="text-ink/60 text-xs">arrows / a-d move · space shoots</span>
            </button>
          )}

          {status === "levelClear" && (
            <div className="bg-paper/90 absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center font-mono">
              <span className="text-accent text-lg font-bold">WAVE CLEAR</span>
              <span className="text-ink text-sm">
                Unlocked: {featured[waveIndex].company} — {featured[waveIndex].role}
              </span>
              <span className="text-ink/60 mt-2 animate-pulse text-xs">
                press space to continue
              </span>
            </div>
          )}

          {status === "complete" && (
            <div className="bg-paper/90 absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center font-mono">
              <span className="text-accent text-lg font-bold">ALL SYSTEMS CLEAR</span>
              <span className="text-ink text-sm">Score: {score} — full experience below ↓</span>
            </div>
          )}
        </div>

        <p className="text-ink/50 mt-4 font-mono text-xs">
          Score {score} · Wave {Math.min(waveIndex + 1, WAVE_COUNT)}/{WAVE_COUNT} · Armed with
          real tools: {weapons.join(", ")}
        </p>
      </div>
    </section>
  );
}
