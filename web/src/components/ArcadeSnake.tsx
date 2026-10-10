"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { SkillEntry } from "@/lib/resume";
import { topWeapons } from "@/lib/arcadeContent";
import {
  isCollision,
  isValidTurn,
  nextHead,
  pickFoodCell,
  type Cell,
  type Direction,
} from "@/lib/snakeLogic";
import { useFullscreen } from "@/lib/useFullscreen";

const CANVAS_W = 480;
const CANVAS_H = 320;
const CELL = 20;
const COLS = CANVAS_W / CELL;
const ROWS = CANVAS_H / CELL;
const MOVE_INTERVAL_MS = 120;
const DIR_KEYS: Record<string, Direction> = {
  arrowup: "up",
  w: "up",
  arrowdown: "down",
  s: "down",
  arrowleft: "left",
  a: "left",
  arrowright: "right",
  d: "right",
};

const COLOR_BG = "#000000";
const COLOR_INK = "#ffffff";
const COLOR_ACCENT = "#d6ff1f";

type Status = "idle" | "playing" | "gameOver";

function startingSnake(): Cell[] {
  const midY = Math.floor(ROWS / 2);
  const midX = Math.floor(COLS / 2);
  return [
    { x: midX, y: midY },
    { x: midX - 1, y: midY },
    { x: midX - 2, y: midY },
  ];
}

export function ArcadeSnake({ skills }: { skills: SkillEntry[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(frameRef);
  const snakeRef = useRef<Cell[]>(startingSnake());
  const dirRef = useRef<Direction>("right");
  const pendingDirRef = useRef<Direction>("right");
  const foodRef = useRef<Cell>({ x: 0, y: 0 });
  const lastMoveRef = useRef(0);
  const rafRef = useRef(0);

  const [status, setStatus] = useState<Status>("idle");
  const [collected, setCollected] = useState<string[]>([]);

  const tools = topWeapons(skills, 16);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = COLOR_BG;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    ctx.fillStyle = COLOR_ACCENT;
    ctx.fillRect(foodRef.current.x * CELL + 2, foodRef.current.y * CELL + 2, CELL - 4, CELL - 4);

    snakeRef.current.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? COLOR_ACCENT : COLOR_INK;
      ctx.fillRect(segment.x * CELL + 1, segment.y * CELL + 1, CELL - 2, CELL - 2);
    });
  }, []);

  const beginGame = () => {
    snakeRef.current = startingSnake();
    dirRef.current = "right";
    pendingDirRef.current = "right";
    foodRef.current = pickFoodCell(COLS, ROWS, snakeRef.current);
    setCollected([]);
    lastMoveRef.current = 0;
    setStatus("playing");
  };

  useEffect(() => {
    if (status !== "playing") return;

    const loop = (timestamp: number) => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;

      if (timestamp - lastMoveRef.current >= MOVE_INTERVAL_MS) {
        lastMoveRef.current = timestamp;
        dirRef.current = pendingDirRef.current;

        const head = nextHead(snakeRef.current[0], dirRef.current);
        const body = snakeRef.current.slice(0, -1); // tail cell is vacated this tick

        if (isCollision(head, body, COLS, ROWS)) {
          setStatus("gameOver");
          return;
        }

        const ateFood = head.x === foodRef.current.x && head.y === foodRef.current.y;
        const nextSnake = ateFood
          ? [head, ...snakeRef.current]
          : [head, ...snakeRef.current.slice(0, -1)];
        snakeRef.current = nextSnake;

        if (ateFood) {
          const tool = tools[collected.length % tools.length] ?? "Tool";
          setCollected((c) => [...c, tool]);
          foodRef.current = pickFoodCell(COLS, ROWS, nextSnake);
        }
      }

      draw(ctx);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, draw, collected.length]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) draw(ctx);
  }, [draw]);

  // Focus the canvas as soon as this game is picked — otherwise arrow
  // keys scroll the page instead of steering the snake.
  useEffect(() => {
    canvasRef.current?.focus();
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLCanvasElement>) => {
    const key = e.key.toLowerCase();
    const dir = DIR_KEYS[key];
    if (dir) e.preventDefault();

    if (status === "idle" || status === "gameOver") {
      if (key === " ") beginGame();
      return;
    }
    if (dir && isValidTurn(dirRef.current, dir)) {
      pendingDirRef.current = dir;
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-black tracking-tight uppercase sm:text-3xl">Data Pipeline</h3>
      <p className="mt-2 max-w-2xl font-serif text-base text-paper/80">
        Classic snake — grow a data pipeline one tool at a time. Arrows / WASD to steer. Hit a
        wall or yourself and the pipeline breaks.
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
      <div className={isFullscreen ? "relative" : "relative mx-auto mt-6 w-full max-w-2xl"}>
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className={`border-accent border-8 outline-none [image-rendering:pixelated] ${
            isFullscreen ? "h-[85vh] w-auto" : "w-full"
          }`}
          aria-label="Data Pipeline mini-game canvas"
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
            <span className="text-paper/60 text-xs">arrows / wasd to steer</span>
          </button>
        )}

        {status === "gameOver" && (
          <button
            type="button"
            onClick={beginGame}
            className="bg-ink/95 absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center font-mono"
          >
            <span className="text-accent text-xl font-black uppercase">Pipeline Broke</span>
            <span className="text-paper/70 text-xs">{collected.length} tools collected</span>
            <span className="text-paper/50 mt-2 animate-pulse text-xs">
              press space to retry
            </span>
          </button>
        )}
      </div>
      </div>

      <div className="mt-4">
        <p className="text-paper/50 font-mono text-xs">
          Pipeline length {collected.length + 3}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {collected.map((tool, i) => (
            <span
              key={`${tool}-${i}`}
              className="border-accent text-accent brutal-tag border-2 px-2 py-1 text-xs font-bold"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
