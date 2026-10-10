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
import { extractPainPoints, topWeapons, weaponKindFor, type WeaponKind } from "@/lib/arcadeContent";
import { useFullscreen } from "@/lib/useFullscreen";

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
const ENEMY_DROP = 20;
// Lose condition: the formation only has to get this close to the ship's
// row, not literally overlap it — keeps a bonus minigame from dragging on.
const DANGER_Y = PLAYER_Y - 26;
const WAVE_COUNT = 4;
const START_LIVES = 3;
const SHOT_COOLDOWN_MS = 220;
const RAPID_COOLDOWN_MS = 110;
const LASER_COOLDOWN_MS = 300;
const SPREAD_VX = 1.7;
const WAVE_AMPLITUDE = 22;
const WAVE_FREQ = 0.045;
const HIT_FLASH_MS = 180;
const LASER_FLASH_MS = 140;
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

interface Bullet {
  x: number;
  y: number;
  vx: number;
  wave?: { spawnX: number; spawnY: number };
}

interface LaserFlash {
  x: number;
  bornAt: number;
}

type Status = "idle" | "playing" | "levelClear" | "gameOver" | "complete";

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
  earlierRewards: string[],
): { company: string; rewards: string[] } {
  const role = featured[waveIndex];
  if (role) return { company: role.company, rewards: role.rewards };
  return { company: "18 years of earlier career", rewards: earlierRewards };
}

/** Spawn the bullet(s) for one shot of a given weapon kind, from the ship's muzzle position. */
function spawnShot(kind: WeaponKind, muzzleX: number, muzzleY: number): Bullet[] {
  switch (kind) {
    case "twin":
      return [
        { x: muzzleX - 6, y: muzzleY, vx: 0 },
        { x: muzzleX + 6, y: muzzleY, vx: 0 },
      ];
    case "spread":
      return [
        { x: muzzleX, y: muzzleY, vx: -SPREAD_VX },
        { x: muzzleX, y: muzzleY, vx: 0 },
        { x: muzzleX, y: muzzleY, vx: SPREAD_VX },
      ];
    case "wave":
      return [{ x: muzzleX, y: muzzleY, vx: 0, wave: { spawnX: muzzleX, spawnY: muzzleY } }];
    case "rapid":
    case "single":
    case "laser":
    default:
      return [{ x: muzzleX, y: muzzleY, vx: 0 }];
  }
}

export function ArcadeInvaders({
  summary,
  featured,
  earlier,
  earlierRewards,
  skills,
}: {
  summary: string;
  featured: FeaturedRole[];
  earlier: EarlierRole[];
  earlierRewards: string[];
  skills: SkillEntry[];
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(frameRef);
  const keysRef = useRef<Set<string>>(new Set());
  const playerXRef = useRef((CANVAS_W - PLAYER_W) / 2);
  const bulletsRef = useRef<Bullet[]>([]);
  const laserFlashesRef = useRef<LaserFlash[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const offsetXRef = useRef(0);
  const dirRef = useRef(1);
  const dropRef = useRef(0);
  const lastShotRef = useRef(0);
  const lastWeaponSwitchRef = useRef(0);
  const hitFlashUntilRef = useRef(0);
  const pendingLaserXRef = useRef<number | null>(null);
  const rafRef = useRef(0);

  const [status, setStatus] = useState<Status>("idle");
  const [waveIndex, setWaveIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(START_LIVES);
  const [weaponIndex, setWeaponIndex] = useState(0);

  const painPoints = useMemo(
    () => extractPainPoints(summary, featured, earlier),
    [summary, featured, earlier],
  );
  const weapons = useMemo(() => topWeapons(skills), [skills]);
  const activeWeapon = weapons[weaponIndex % weapons.length] ?? "Python";
  const activeKind = weaponKindFor(activeWeapon);

  const setupWave = useCallback(
    (idx: number) => {
      enemiesRef.current = buildWave(painPoints, idx);
      bulletsRef.current = [];
      laserFlashesRef.current = [];
      dirRef.current = 1;
      dropRef.current = 0;
      offsetXRef.current = 0;
      playerXRef.current = (CANVAS_W - PLAYER_W) / 2;
    },
    [painPoints],
  );

  const resetFormationPosition = () => {
    dirRef.current = 1;
    dropRef.current = 0;
    offsetXRef.current = 0;
    bulletsRef.current = [];
  };

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

      const now = performance.now();
      for (const flash of laserFlashesRef.current) {
        const age = now - flash.bornAt;
        if (age > LASER_FLASH_MS) continue;
        ctx.globalAlpha = 1 - age / LASER_FLASH_MS;
        ctx.fillStyle = COLOR_ACCENT;
        ctx.fillRect(flash.x - 2, 0, 4, PLAYER_Y);
        ctx.globalAlpha = 1;
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

      if (now < hitFlashUntilRef.current) {
        ctx.fillStyle = COLOR_INK;
        ctx.globalAlpha = 0.5;
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        ctx.globalAlpha = 1;
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

      if (pendingLaserXRef.current !== null) {
        const laserX = pendingLaserXRef.current;
        pendingLaserXRef.current = null;
        let hits = 0;
        for (const enemy of enemiesRef.current) {
          if (!enemy.alive) continue;
          const ex = enemy.baseX + offsetXRef.current;
          if (laserX > ex && laserX < ex + ENEMY_W) {
            enemy.alive = false;
            hits++;
          }
        }
        if (hits > 0) setScore((s) => s + 10 * hits);
      }

      offsetXRef.current += dirRef.current * enemySpeed;
      const aliveEnemies = enemiesRef.current.filter((e) => e.alive);
      const aliveXs = aliveEnemies.map((e) => e.baseX);
      if (aliveXs.length > 0) {
        const minX = Math.min(...aliveXs);
        const maxX = Math.max(...aliveXs) + ENEMY_W;
        if (minX + offsetXRef.current < 6 || maxX + offsetXRef.current > CANVAS_W - 6) {
          dirRef.current *= -1;
          dropRef.current += ENEMY_DROP;
        }
      }

      // Lose condition: the formation reached the danger line.
      const deepestY = Math.max(0, ...aliveEnemies.map((e) => e.baseY + dropRef.current + ENEMY_H));
      if (aliveEnemies.length > 0 && deepestY >= DANGER_Y) {
        hitFlashUntilRef.current = performance.now() + HIT_FLASH_MS;
        draw(ctx);
        setLives((l) => {
          const remaining = l - 1;
          if (remaining <= 0) {
            setStatus("gameOver");
          } else {
            resetFormationPosition();
          }
          return remaining;
        });
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      bulletsRef.current = bulletsRef.current
        .map((b) => {
          const y = b.y - BULLET_SPEED;
          if (b.wave) {
            const traveled = b.wave.spawnY - y;
            return {
              ...b,
              y,
              x: b.wave.spawnX + WAVE_AMPLITUDE * Math.sin(traveled * WAVE_FREQ),
            };
          }
          return { ...b, y, x: b.x + b.vx };
        })
        .filter((b) => b.y > -10 && b.x > -10 && b.x < CANVAS_W + 10);

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
      laserFlashesRef.current = laserFlashesRef.current.filter(
        (f) => performance.now() - f.bornAt < LASER_FLASH_MS,
      );

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

  // Focus the canvas as soon as this game is picked — otherwise arrow
  // keys scroll the page instead of controlling the ship until the
  // player happens to click the canvas first.
  useEffect(() => {
    canvasRef.current?.focus();
  }, []);

  const beginGame = () => {
    setWaveIndex(0);
    setScore(0);
    setLives(START_LIVES);
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

  const fire = () => {
    const now = performance.now();
    const cooldown =
      activeKind === "rapid" ? RAPID_COOLDOWN_MS : activeKind === "laser" ? LASER_COOLDOWN_MS : SHOT_COOLDOWN_MS;
    if (now - lastShotRef.current <= cooldown) return;
    lastShotRef.current = now;

    const muzzleX = playerXRef.current + PLAYER_W / 2;

    if (activeKind === "laser") {
      laserFlashesRef.current.push({ x: muzzleX, bornAt: now });
      // Actual hit detection happens on the next animation-loop tick — it
      // owns all enemiesRef mutation, this just queues the intent.
      pendingLaserXRef.current = muzzleX;
      return;
    }

    bulletsRef.current.push(...spawnShot(activeKind, muzzleX, PLAYER_Y));
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
    if (status === "gameOver") {
      if (key === " ") beginGame();
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
    if (key === " " && !e.repeat) fire();
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLCanvasElement>) => {
    keysRef.current.delete(e.key.toLowerCase());
  };

  const reveal = waveReveal(waveIndex, featured, earlierRewards);

  return (
    <div>
        <h3 className="text-2xl font-black tracking-tight uppercase sm:text-3xl">
          Data Invaders
        </h3>
        <p className="mt-2 max-w-2xl font-serif text-base text-paper/80">
          Shoot down real problems from 18 years of real work before they reach you. Arrow keys
          / A-D to move, Space to fire, Q/E to switch weapons. Clear a wave to unlock what came
          next — lose all 3 lives and it&apos;s back to wave one.
        </p>

        <button
          type="button"
          onClick={toggleFullscreen}
          className="border-paper text-paper hover:bg-paper hover:text-ink brutal-tag mt-4 inline-block border-2 px-3 py-1 text-xs font-bold uppercase"
        >
          ⛶ Fullscreen
        </button>

        <div
          ref={frameRef}
          className={isFullscreen ? "fixed inset-0 flex items-center justify-center bg-ink" : ""}
        >
          <div className={isFullscreen ? "relative" : "relative mx-auto mt-8 w-full max-w-2xl"}>
            <canvas
              ref={canvasRef}
              width={CANVAS_W}
              height={CANVAS_H}
              tabIndex={0}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              className={`border-accent border-8 outline-none [image-rendering:pixelated] ${
                isFullscreen ? "h-[85vh] w-auto" : "w-full"
              }`}
              aria-label="Data Invaders mini-game canvas"
            />

            {isFullscreen && (
              <button
                type="button"
                onClick={toggleFullscreen}
                className="border-paper bg-ink/80 text-paper hover:bg-paper hover:text-ink brutal-tag absolute top-2 left-2 z-10 border-2 px-3 py-1 text-xs font-bold uppercase"
              >
                ← Back
              </button>
            )}

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
              <span className="text-accent text-lg font-black uppercase">
                Hire me, you get:
              </span>
              <ul className="space-y-1">
                {reveal.rewards.map((reward) => (
                  <li key={reward} className="text-paper max-w-sm text-xs font-bold">
                    — {reward}
                  </li>
                ))}
              </ul>
              <span className="text-paper/50 text-[10px] uppercase">
                proven at {reveal.company}
              </span>
              <span className="text-paper/50 mt-2 animate-pulse text-xs">
                press space to continue
              </span>
            </div>
          )}

          {status === "gameOver" && (
            <div className="bg-ink/95 absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center font-mono">
              <span className="text-accent text-xl font-black uppercase">Game Over</span>
              <span className="text-paper text-sm">Buried in spreadsheets.</span>
              <span className="text-paper/70 text-xs">Score: {score}</span>
              <span className="text-paper/50 mt-2 animate-pulse text-xs">
                press space to retry from wave one
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
              {w} <span className="opacity-60">[{weaponKindFor(w)}]</span>
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <p className="text-paper/50 font-mono text-xs">
            Score {score} · Wave {Math.min(waveIndex + 1, WAVE_COUNT)}/{WAVE_COUNT} · Armed
            with {activeWeapon} ({activeKind})
          </p>
          <div className="flex items-center gap-1" aria-label={`${lives} lives remaining`}>
            {Array.from({ length: START_LIVES }).map((_, i) => (
              <span
                key={i}
                className={`h-3 w-3 border-2 border-paper/40 ${i < lives ? "bg-accent" : "bg-transparent"}`}
              />
            ))}
          </div>
        </div>
    </div>
  );
}
