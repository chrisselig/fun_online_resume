import { describe, expect, it } from "vitest";
import { packCircles, packedBounds } from "./circlePack";

describe("packCircles", () => {
  it("returns one circle per value", () => {
    const circles = packCircles([10, 20, 30]);
    expect(circles).toHaveLength(3);
  });

  it("returns an empty array for no values", () => {
    expect(packCircles([])).toEqual([]);
  });

  it("sizes the largest value with the largest radius", () => {
    const circles = packCircles([5, 50, 10], { minRadius: 10, maxRadius: 50 });
    const [a, b, c] = circles;
    expect(b.r).toBeGreaterThan(a.r);
    expect(b.r).toBeGreaterThan(c.r);
    expect(b.r).toBeCloseTo(50);
  });

  it("clamps radii within [minRadius, maxRadius]", () => {
    const circles = packCircles([1, 2, 3, 100], {
      minRadius: 8,
      maxRadius: 40,
    });
    for (const c of circles) {
      expect(c.r).toBeGreaterThanOrEqual(8 - 1e-6);
      expect(c.r).toBeLessThanOrEqual(40 + 1e-6);
    }
  });

  it("does not leave overlapping circles after relaxation", () => {
    const circles = packCircles([10, 10, 10, 10, 10, 10], {
      minRadius: 20,
      maxRadius: 20,
      padding: 1,
      iterations: 400,
    });
    for (let i = 0; i < circles.length; i++) {
      for (let j = i + 1; j < circles.length; j++) {
        const a = circles[i];
        const b = circles[j];
        const dist = Math.hypot(b.x - a.x, b.y - a.y);
        // small numerical slack from the iterative relaxation
        expect(dist).toBeGreaterThanOrEqual(a.r + b.r + 1 - 0.5);
      }
    }
  });

  it("is deterministic across repeated calls", () => {
    const a = packCircles([3, 9, 27, 4]);
    const b = packCircles([3, 9, 27, 4]);
    expect(a).toEqual(b);
  });
});

describe("packedBounds", () => {
  it("returns a zero-size box for no circles", () => {
    expect(packedBounds([])).toEqual({ minX: 0, minY: 0, width: 0, height: 0 });
  });

  it("encloses every circle including its radius", () => {
    const circles = packCircles([10, 20, 30, 15]);
    const bounds = packedBounds(circles);
    for (const c of circles) {
      expect(c.x - c.r).toBeGreaterThanOrEqual(bounds.minX);
      expect(c.x + c.r).toBeLessThanOrEqual(bounds.minX + bounds.width);
      expect(c.y - c.r).toBeGreaterThanOrEqual(bounds.minY);
      expect(c.y + c.r).toBeLessThanOrEqual(bounds.minY + bounds.height);
    }
  });
});
