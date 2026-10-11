import { describe, expect, it } from "vitest";
import { stepBody } from "./spaceStationPhysics";

const bounds = { width: 200, height: 200 };

describe("stepBody", () => {
  it("moves a body by its velocity when well within bounds", () => {
    const body = { x: 50, y: 50, vx: 10, vy: 0, w: 20, h: 20 };
    const next = stepBody(body, { x: 0, y: 0 }, bounds, 1);
    expect(next.x).toBeGreaterThan(50);
    expect(next.y).toBeCloseTo(50, 0);
  });

  it("applies gravity to accelerate velocity over time", () => {
    const body = { x: 50, y: 50, vx: 0, vy: 0, w: 20, h: 20 };
    const next = stepBody(body, { x: 0, y: 5 }, bounds, 1);
    expect(next.vy).toBeGreaterThan(0);
  });

  it("bounces off the right wall and damps velocity", () => {
    const body = { x: 190, y: 50, vx: 20, vy: 0, w: 20, h: 20 };
    const next = stepBody(body, { x: 0, y: 0 }, bounds, 1);
    expect(next.x).toBeLessThanOrEqual(bounds.width - body.w);
    expect(next.vx).toBeLessThan(0);
  });

  it("bounces off the left wall", () => {
    const body = { x: 2, y: 50, vx: -20, vy: 0, w: 20, h: 20 };
    const next = stepBody(body, { x: 0, y: 0 }, bounds, 1);
    expect(next.x).toBeGreaterThanOrEqual(0);
    expect(next.vx).toBeGreaterThan(0);
  });

  it("bounces off the bottom wall", () => {
    const body = { x: 50, y: 190, vx: 0, vy: 20, w: 20, h: 20 };
    const next = stepBody(body, { x: 0, y: 0 }, bounds, 1);
    expect(next.y).toBeLessThanOrEqual(bounds.height - body.h);
    expect(next.vy).toBeLessThan(0);
  });

  it("applies drag so velocity decays without gravity or walls", () => {
    const body = { x: 50, y: 50, vx: 10, vy: 0, w: 20, h: 20 };
    const next = stepBody(body, { x: 0, y: 0 }, bounds, 1);
    expect(Math.abs(next.vx)).toBeLessThan(10);
  });
});
