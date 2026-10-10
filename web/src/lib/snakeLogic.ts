export interface Cell {
  x: number;
  y: number;
}

export type Direction = "up" | "down" | "left" | "right";

const DELTA: Record<Direction, Cell> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITE: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

/** A direction change is only valid if it isn't a 180-degree reversal into your own neck. */
export function isValidTurn(current: Direction, next: Direction): boolean {
  return OPPOSITE[current] !== next;
}

export function nextHead(head: Cell, direction: Direction): Cell {
  const d = DELTA[direction];
  return { x: head.x + d.x, y: head.y + d.y };
}

/** Wall or self collision — the two ways a classic snake run ends. */
export function isCollision(head: Cell, body: Cell[], cols: number, rows: number): boolean {
  if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) return true;
  return body.some((segment) => segment.x === head.x && segment.y === head.y);
}

/** Deterministic cell picker — `rng` is injectable so tests don't depend on Math.random. */
export function pickFoodCell(
  cols: number,
  rows: number,
  occupied: Cell[],
  rng: () => number = Math.random,
): Cell {
  const free: Cell[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (!occupied.some((c) => c.x === x && c.y === y)) free.push({ x, y });
    }
  }
  if (free.length === 0) return { x: 0, y: 0 };
  return free[Math.floor(rng() * free.length)];
}
