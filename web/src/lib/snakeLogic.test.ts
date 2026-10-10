import { describe, expect, it } from "vitest";
import { isCollision, isValidTurn, nextHead, pickFoodCell } from "./snakeLogic";

describe("isValidTurn", () => {
  it("allows perpendicular turns", () => {
    expect(isValidTurn("up", "left")).toBe(true);
    expect(isValidTurn("right", "down")).toBe(true);
  });

  it("allows continuing straight", () => {
    expect(isValidTurn("up", "up")).toBe(true);
  });

  it("rejects a 180-degree reversal", () => {
    expect(isValidTurn("up", "down")).toBe(false);
    expect(isValidTurn("left", "right")).toBe(false);
  });
});

describe("nextHead", () => {
  it("moves one cell in the given direction", () => {
    expect(nextHead({ x: 5, y: 5 }, "up")).toEqual({ x: 5, y: 4 });
    expect(nextHead({ x: 5, y: 5 }, "down")).toEqual({ x: 5, y: 6 });
    expect(nextHead({ x: 5, y: 5 }, "left")).toEqual({ x: 4, y: 5 });
    expect(nextHead({ x: 5, y: 5 }, "right")).toEqual({ x: 6, y: 5 });
  });
});

describe("isCollision", () => {
  it("detects wall collisions on every edge", () => {
    expect(isCollision({ x: -1, y: 0 }, [], 10, 10)).toBe(true);
    expect(isCollision({ x: 10, y: 0 }, [], 10, 10)).toBe(true);
    expect(isCollision({ x: 0, y: -1 }, [], 10, 10)).toBe(true);
    expect(isCollision({ x: 0, y: 10 }, [], 10, 10)).toBe(true);
  });

  it("allows cells within bounds", () => {
    expect(isCollision({ x: 5, y: 5 }, [], 10, 10)).toBe(false);
  });

  it("detects self collision", () => {
    const body = [
      { x: 5, y: 5 },
      { x: 5, y: 6 },
    ];
    expect(isCollision({ x: 5, y: 6 }, body, 10, 10)).toBe(true);
  });

  it("does not collide with an empty body", () => {
    expect(isCollision({ x: 5, y: 5 }, [], 10, 10)).toBe(false);
  });
});

describe("pickFoodCell", () => {
  it("never picks an occupied cell", () => {
    const occupied = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ];
    // 2x1 grid, both cells occupied except none free -> falls back, but
    // use a 2x2 grid so there are free cells to find deterministically.
    const rng = () => 0; // always picks the first free cell
    const cell = pickFoodCell(2, 2, occupied, rng);
    expect(occupied).not.toContainEqual(cell);
  });

  it("is deterministic given a fixed rng", () => {
    const a = pickFoodCell(5, 5, [], () => 0.5);
    const b = pickFoodCell(5, 5, [], () => 0.5);
    expect(a).toEqual(b);
  });

  it("stays within grid bounds", () => {
    const cell = pickFoodCell(4, 3, [], () => 0.999);
    expect(cell.x).toBeGreaterThanOrEqual(0);
    expect(cell.x).toBeLessThan(4);
    expect(cell.y).toBeGreaterThanOrEqual(0);
    expect(cell.y).toBeLessThan(3);
  });
});
