"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { FeaturedRole, SkillEntry } from "@/lib/resume";
import { topWeapons } from "@/lib/arcadeContent";
import { buildBricks, reflectOffPaddle, type Brick } from "@/lib/breakoutPhysics";
import { useFullscreen } from "@/lib/useFullscreen";

const CANVAS_W = 480;
const CANVAS_H = 320;
const PADDLE_W = 70;
const PADDLE_H = 10;
const PADDLE_Y = CANVAS_H - 24;
const PADDLE_SPEED = 5;
const BALL_R = 5;
const BALL_SPEED = 4;
const BRICK_COLS = 7;
const BRICK_ROWS = 4;
const BRICK_W = 58;
const BRICK_H = 22;
const BRICK_GAP = 6;
const BRICK_TOP = 20;
const START_LIVES = 3;
const MOVE_KEYS = new Set(["arrowleft", "arrowright", "a", "d", " "]);

const COLOR_BG = "#000000";
const COLOR_INK = "#ffffff";
const COLOR_ACCENT = "#d6ff1f";
const FONT = "8px ui-monospace, Menlo, Consolas, monospace";

type Status = "idle" | "playing" | "gameOver" | "complete";

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

export function ArcadeBreakout({
  skills,
  featured,
}: {
  skills: SkillEntry[];
  featured: FeaturedRole[];
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(frameRef);
  const handleToggleFullscreen = () => {
    toggleFullscreen();
    canvasRef.current?.focus();
  };
  const keysRef = useRef<Set<string>>(new Set());
  const paddleXRef = useRef((CANVAS_W - PADDLE_W) / 2);
  const ballRef = useRef({ x: CANVAS_W / 2, y: PADDLE_Y - 20, vx: BALL_SPEED * 0.4, vy: -BALL_SPEED });
  const bricksRef = useRef<Brick[]>([]);
  const rafRef = useRef(0);

  const [status, setStatus] = useState<Status>("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(START_LIVES);

  const labels = topWeapons(skills);
  const bonusReward =
    featured.flatMap((r) => r.rewards)[Math.floor(labels.length) % Math.max(1, featured.length)] ??
    "Breaks through the hardest problems too.";

  const setupBricks = () => {
    bricksRef.current = buildBricks(
      labels,
      BRICK_COLS,
      BRICK_ROWS,
      CANVAS_W,
      BRICK_W,
      BRICK_H,
      BRICK_GAP,
      BRICK_TOP,
    );
  };

  const resetBall = () => {
    paddleXRef.current = (CANVAS_W - PADDLE_W) / 2;
    ballRef.current = { x: CANVAS_W / 2, y: PADDLE_Y - 20, vx: BALL_SPEED * 0.4, vy: -BALL_SPEED };
  };

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = COLOR_BG;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.fillStyle = COLOR_ACCENT;
    ctx.fillRect(paddleXRef.current, PADDLE_Y, PADDLE_W, PADDLE_H);

    ctx.beginPath();
    ctx.arc(ballRef.current.x, ballRef.current.y, BALL_R, 0, Math.PI * 2);
    ctx.fillStyle = COLOR_ACCENT;
    ctx.fill();

    ctx.font = FONT;
    for (const b of bricksRef.current) {
      if (!b.alive) continue;
      ctx.strokeStyle = COLOR_INK;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(b.x, b.y, BRICK_W, BRICK_H);
      ctx.fillStyle = COLOR_INK;
      ctx.textAlign = "center";
      const lines = wrapLabel(ctx, b.label, BRICK_W - 6);
      const lineH = 9;
      const startY = b.y + BRICK_H / 2 - ((lines.length - 1) * lineH) / 2 + 3;
      lines.forEach((line, i) => ctx.fillText(line, b.x + BRICK_W / 2, startY + i * lineH));
    }
  }, []);

  useEffect(() => {
    if (status !== "playing") return;

    const loop = () => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;

      if (keysRef.current.has("arrowleft") || keysRef.current.has("a")) {
        paddleXRef.current = Math.max(4, paddleXRef.current - PADDLE_SPEED);
      }
      if (keysRef.current.has("arrowright") || keysRef.current.has("d")) {
        paddleXRef.current = Math.min(CANVAS_W - PADDLE_W - 4, paddleXRef.current + PADDLE_SPEED);
      }

      const ball = ballRef.current;
      ball.x += ball.vx;
      ball.y += ball.vy;

      if (ball.x - BALL_R < 0 || ball.x + BALL_R > CANVAS_W) ball.vx *= -1;
      if (ball.y - BALL_R < 0) ball.vy *= -1;

      if (
        ball.vy > 0 &&
        ball.y + BALL_R >= PADDLE_Y &&
        ball.y + BALL_R <= PADDLE_Y + PADDLE_H + 6 &&
        ball.x >= paddleXRef.current &&
        ball.x <= paddleXRef.current + PADDLE_W
      ) {
        const { vx, vy } = reflectOffPaddle(ball.x, paddleXRef.current, PADDLE_W, BALL_SPEED);
        ball.vx = vx;
        ball.vy = vy;
      }

      for (const brick of bricksRef.current) {
        if (!brick.alive) continue;
        if (
          ball.x + BALL_R > brick.x &&
          ball.x - BALL_R < brick.x + BRICK_W &&
          ball.y + BALL_R > brick.y &&
          ball.y - BALL_R < brick.y + BRICK_H
        ) {
          brick.alive = false;
          ball.vy *= -1;
          setScore((s) => s + 10);
          break;
        }
      }

      if (ball.y - BALL_R > CANVAS_H) {
        setLives((l) => {
          const remaining = l - 1;
          if (remaining <= 0) {
            setStatus("gameOver");
          } else {
            resetBall();
          }
          return remaining;
        });
        draw(ctx);
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      draw(ctx);

      if (bricksRef.current.every((b) => !b.alive)) {
        setStatus("complete");
        return;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [status, draw]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) draw(ctx);
  }, [draw]);

  // Focus the canvas as soon as this game is picked — otherwise arrow
  // keys scroll the page instead of moving the paddle.
  useEffect(() => {
    canvasRef.current?.focus();
  }, []);

  const beginGame = () => {
    setupBricks();
    resetBall();
    setScore(0);
    setLives(START_LIVES);
    setStatus("playing");
    // Clicking "Press Start"/"Retry" moves focus to that button — pull it
    // back to the canvas so arrow keys control the paddle immediately.
    canvasRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLCanvasElement>) => {
    const key = e.key.toLowerCase();
    if (MOVE_KEYS.has(key)) e.preventDefault();
    if (status === "idle" || status === "gameOver") {
      if (key === " ") beginGame();
      return;
    }
    keysRef.current.add(key);
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLCanvasElement>) => {
    keysRef.current.delete(e.key.toLowerCase());
  };

  return (
    <div>
      <h3 className="text-2xl font-black tracking-tight uppercase sm:text-3xl">
        Spreadsheet Breaker
      </h3>
      <p className="mt-2 max-w-2xl font-serif text-base text-paper/80">
        Smash through every tool brick before the ball gets past you. Arrow keys / A-D to move
        the paddle — where you catch the ball steers the rebound angle.
      </p>

      <button
        type="button"
        onClick={handleToggleFullscreen}
        className="border-paper text-paper hover:bg-paper hover:text-ink brutal-tag mt-4 inline-block border-2 px-3 py-1 text-xs font-bold uppercase"
      >
        ⛶ Fullscreen
      </button>

      <div
        ref={frameRef}
        className={isFullscreen ? "fixed inset-0 flex items-center justify-center bg-ink" : ""}
      >
      <div className={isFullscreen ? "relative" : "relative mx-auto mt-6 w-full max-w-2xl"}>
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
          aria-label="Spreadsheet Breaker mini-game canvas"
        />

        {isFullscreen && (
          <button
            type="button"
            onClick={handleToggleFullscreen}
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
            <span className="text-paper/60 text-xs">arrows / a-d to move the paddle</span>
          </button>
        )}

        {status === "gameOver" && (
          <button
            type="button"
            onClick={beginGame}
            className="bg-ink/95 absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center font-mono"
          >
            <span className="text-accent text-xl font-black uppercase">Game Over</span>
            <span className="text-paper/70 text-xs">Score: {score}</span>
            <span className="text-paper/50 mt-2 animate-pulse text-xs">
              press space to retry
            </span>
          </button>
        )}

        {status === "complete" && (
          <div className="bg-ink/90 absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center font-mono">
            <span className="text-accent text-lg font-black uppercase">All Bricks Cleared</span>
            <span className="text-paper max-w-sm text-xs font-bold">— {bonusReward}</span>
            <span className="text-paper/70 text-xs">Score: {score}</span>
          </div>
        )}
      </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <p className="text-paper/50 font-mono text-xs">Score {score}</p>
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
