"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { EarlierRole, FeaturedRole, SkillEntry } from "@/lib/resume";
import { extractPainPoints, topWeapons } from "@/lib/arcadeContent";

const CANVAS_W = 480;
const CANVAS_H = 320;
const PLAYER_W = 34;
const PLAYER_H = 10;
const PLAYER_Y = CANVAS_H - 24;
const PLAYER_SPEED = 3.4;
const BULLET_SPEED = 4.5;
const ENEMY_W = 96;
const ENEMY_H = 22;
const ENEMY_COLS = 4;
const ENEMY_ROWS = 3;
const ENEMY_GAP_X = 10;
const ENEMY_GAP_Y = 12;
const BASE_ENEMY_SPEED = 0.4;
const ENEMY_SPEED_PER_WAVE = 0.12;
const ENEMY_DROP = 14;
const WAVE_COUNT = 4;
const SHOT_COOLDOWN_MS = 220;
const MOVE_KEYS = new Set(["arrowleft", "arrowright", "a", "d", " "]);
const WEAPON_KEYS = new Set(["q", "e", "[", "]"]);

// Pure black/white/neon-lime — the game screen is one more "confident
// accent" section in the brutalist page, not a different color language.
const COLOR_BG = "#000000";
const COLOR_INK = "#ffffff";
const COLOR_ACCENT = "#d6ff1f";
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
  // Offset by a non-multiple of cols*rows so each wave shows the pain-point
  // pool in a different rotation instead of the exact same order every time.
  let labelIdx = waveIndex * 5;
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

function waveReveal(
  waveIndex: number,
  featured: FeaturedRole[],
  earlier: EarlierRole[],
): { title: string; subtitle: string } {
  const role = featured[waveIndex];
  if (role) return { title: role.company, subtitle: role.role };
  return {
    title: "Earlier Career",
    subtitle: earlier.map((r) => r.company).join(" · "),
  };
}

export function ArcadeGame({
  summary,
  featured,
  earlier,
  skills,
}: {
  summary: string;
  featured: FeaturedRole[];
  earlier: EarlierRole[];
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
  const lastWeaponSwitchRef = useRef(0);
  const rafRef = useRef(0);

  const [status, setStatus] = useState<Status>("idle");
  const [waveIndex, setWaveIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [weaponIndex, setWeaponIndex] = useState(0);

  const painPoints = useMemo(
    () => extractPainPoints(summary, featured, earlier),
    [summary, featured, earlier],
  );
  const weapons = useMemo(() => topWeapons(skills), [skills]);
  const activeWeapon = weapons[weaponIndex % weapons.length] ?? "Python";

  const setupWave = useCallback(
    (idx: number) => {
      enemiesRef.current = buildWave(painPoints, idx);
      bulletsRef.current = [];
      dirRef.current = 1;
      dropRef.current = 0;
      offsetXRef.current = 0;
      playerXRef.current = (CANVAS_W - PLAYER_W) / 2;
    },
    [painPoints],
  );

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = COLOR_BG;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      ctx.fillStyle = COLOR_ACCENT;
      ctx.fillRect(playerXRef.current, PLAYER_Y, PLAYER_W, PLAYER_H);
      ctx.font = FONT;
      ctx.fillStyle = COLOR_ACCENT;
      ctx.textAlign = "center";
      ctx.fillText(activeWeapon, playerXRef.current + PLAYER_W / 2, PLAYER_Y - 4);

      ctx.fillStyle = COLOR_ACCENT;
      for (const b of bulletsRef.current) {
        ctx.fillRect(b.x - 1.5, b.y, 3, 8);
      }

      ctx.font = FONT;
      for (const e of enemiesRef.current) {
        if (!e.alive) continue;
        const x = e.baseX + offsetXRef.current;
        const y = e.baseY + dropRef.current;
        ctx.strokeStyle = COLOR_INK;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, y, ENEMY_W, ENEMY_H);
        ctx.fillStyle = COLOR_INK;
        ctx.textAlign = "center";
        const lines = wrapLabel(ctx, e.label, ENEMY_W - 10);
        const lineH = 9;
        const startY = y + ENEMY_H / 2 - ((lines.length - 1) * lineH) / 2 + 3;
        lines.forEach((line, i) => ctx.fillText(line, x + ENEMY_W / 2, startY + i * lineH));
      }
    },
    [activeWeapon],
  );

  // Self-referencing RAF loop defined inline so it isn't a stale closure
  // problem for eslint's hook-dependency checks — `loop` is only ever
  // called after its own `const` assignment has completed.
  useEffect(() => {
    if (status !== "playing") return;

    const enemySpeed = BASE_ENEMY_SPEED + waveIndex * ENEMY_SPEED_PER_WAVE;

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

      offsetXRef.current += dirRef.current * enemySpeed;
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
  }, [status, waveIndex, draw]);

  // Initial idle-state paint so the canvas isn't blank before the first play.
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) draw(ctx);
  }, [draw]);

  const beginGame = () => {
    setWaveIndex(0);
    setScore(0);
    setWeaponIndex(0);
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

  const cycleWeapon = (dir: 1 | -1) => {
    const now = performance.now();
    if (now - lastWeaponSwitchRef.current < 150) return;
    lastWeaponSwitchRef.current = now;
    setWeaponIndex((i) => (i + dir + weapons.length) % weapons.length);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLCanvasElement>) => {
    const key = e.key.toLowerCase();
    if (MOVE_KEYS.has(key) || WEAPON_KEYS.has(key)) e.preventDefault();

    if (status === "idle") {
      if (key === " ") beginGame();
      return;
    }
    if (status === "levelClear") {
      if (key === " ") advanceWave();
      return;
    }
    if (status === "complete") return;

    if (key === "q" || key === "[") {
      cycleWeapon(-1);
      return;
    }
    if (key === "e" || key === "]") {
      cycleWeapon(1);
      return;
    }

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

  const reveal = waveReveal(waveIndex, featured, earlier);

  return (
    <section className="border-b-8 border-ink bg-ink px-6 py-16 text-paper sm:px-10 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <p className="brutal-tag text-accent text-sm font-bold">008 / ARCADE.EXE</p>
        <h2 className="mt-2 text-5xl font-black tracking-tighter uppercase sm:text-7xl">
          Data Invaders
        </h2>
        <p className="mt-3 max-w-2xl font-serif text-lg text-paper/80">
          Shoot down real problems from 18 years of real work. Arrow keys / A-D to move, Space
          to fire, Q/E to switch weapons. Clear a wave to unlock what came next.
        </p>

        <div className="relative mx-auto mt-8 w-full max-w-2xl">
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            className="border-accent w-full border-8 outline-none [image-rendering:pixelated]"
            aria-label="Data Invaders mini-game canvas"
          />

          {status === "idle" && (
            <button
              type="button"
              onClick={beginGame}
              className="bg-ink/90 absolute inset-0 flex flex-col items-center justify-center gap-2 font-mono"
            >
              <span className="text-accent text-lg font-black uppercase">Press Start</span>
              <span className="text-paper/60 text-xs">
                arrows / a-d move · space shoots · q/e switch weapon
              </span>
            </button>
          )}

          {status === "levelClear" && (
            <div className="bg-ink/90 absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center font-mono">
              <span className="text-accent text-lg font-black uppercase">Wave Clear</span>
              <span className="text-paper text-sm font-bold">{reveal.title}</span>
              <span className="text-paper/70 text-xs">{reveal.subtitle}</span>
              <span className="text-paper/50 mt-2 animate-pulse text-xs">
                press space to continue
              </span>
            </div>
          )}

          {status === "complete" && (
            <div className="bg-ink/90 absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center font-mono">
              <span className="text-accent text-lg font-black uppercase">
                All Systems Clear
              </span>
              <span className="text-paper text-sm">
                Score: {score} — full experience below ↓
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {weapons.map((w, i) => (
            <span
              key={w}
              className={`brutal-tag border-2 px-2 py-1 text-xs font-bold ${
                i === weaponIndex % weapons.length
                  ? "bg-accent border-accent text-ink"
                  : "border-paper/30 text-paper/60"
              }`}
            >
              {w}
            </span>
          ))}
        </div>

        <p className="text-paper/50 mt-3 font-mono text-xs">
          Score {score} · Wave {Math.min(waveIndex + 1, WAVE_COUNT)}/{WAVE_COUNT} · Armed with{" "}
          {activeWeapon}
        </p>
      </div>
    </section>
  );
}
