import { describe, expect, it } from "vitest";
import { buildBricks, reflectOffPaddle } from "./breakoutPhysics";

describe("buildBricks", () => {
  it("creates cols * rows bricks", () => {
    const bricks = buildBricks(["R", "SQL"], 4, 3, 480, 60, 20, 6, 20);
    expect(bricks).toHaveLength(12);
  });

  it("cycles through labels when there are fewer labels than bricks", () => {
    const bricks = buildBricks(["R", "SQL"], 4, 1, 480, 60, 20, 6, 20);
    expect(bricks.map((b) => b.label)).toEqual(["R", "SQL", "R", "SQL"]);
  });

  it("centers the grid horizontally", () => {
    const bricks = buildBricks(["R"], 2, 1, 480, 100, 20, 0, 20);
    const totalW = 2 * 100;
    const expectedStartX = (480 - totalW) / 2;
    expect(bricks[0].x).toBe(expectedStartX);
  });

  it("marks every brick alive initially", () => {
    const bricks = buildBricks(["R"], 3, 2, 480, 60, 20, 6, 20);
    expect(bricks.every((b) => b.alive)).toBe(true);
  });
});

describe("reflectOffPaddle", () => {
  it("bounces straight up when hit dead center", () => {
    const { vx, vy } = reflectOffPaddle(50, 20, 60, 4);
    expect(vx).toBeCloseTo(0, 5);
    expect(vy).toBeLessThan(0);
  });

  it("steers right when hit on the right side of the paddle", () => {
    const { vx } = reflectOffPaddle(80, 20, 60, 4);
    expect(vx).toBeGreaterThan(0);
  });

  it("steers left when hit on the left side of the paddle", () => {
    const { vx } = reflectOffPaddle(20, 20, 60, 4);
    expect(vx).toBeLessThan(0);
  });

  it("always bounces upward regardless of hit position", () => {
    for (const x of [20, 35, 50, 65, 80]) {
      const { vy } = reflectOffPaddle(x, 20, 60, 4);
      expect(vy).toBeLessThan(0);
    }
  });

  it("clamps extreme hit positions instead of overshooting", () => {
    const farRight = reflectOffPaddle(1000, 20, 60, 4);
    const edgeRight = reflectOffPaddle(80, 20, 60, 4);
    expect(farRight.vx).toBeCloseTo(edgeRight.vx, 5);
  });
});
