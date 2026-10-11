import { describe, expect, it } from "vitest";
import { axisLines, computeRadarPoints, gridRingPoints, polygonPoints } from "./personalityRadar";

describe("computeRadarPoints", () => {
  it("places a 100-value point at the top edge of the circle", () => {
    const [p] = computeRadarPoints([{ trait: "Max", value: 100 }], 200);
    expect(p.x).toBeCloseTo(100, 5);
    expect(p.y).toBeCloseTo(0, 5);
  });

  it("places a 0-value point at the center", () => {
    const points = computeRadarPoints(
      [
        { trait: "A", value: 0 },
        { trait: "B", value: 100 },
      ],
      200,
    );
    expect(points[0].x).toBeCloseTo(100, 5);
    expect(points[0].y).toBeCloseTo(100, 5);
  });

  it("clamps out-of-range values into 0-100", () => {
    const [low] = computeRadarPoints([{ trait: "Low", value: -50 }], 200);
    const [high] = computeRadarPoints([{ trait: "High", value: 500 }], 200);
    expect(low.x).toBeCloseTo(100, 5);
    expect(low.y).toBeCloseTo(100, 5);
    expect(high.y).toBeCloseTo(0, 5);
  });

  it("distributes points evenly around the circle for 4 traits", () => {
    const points = computeRadarPoints(
      [
        { trait: "N", value: 100 },
        { trait: "E", value: 100 },
        { trait: "S", value: 100 },
        { trait: "W", value: 100 },
      ],
      200,
    );
    expect(points[0]).toMatchObject({ x: expect.closeTo(100), y: expect.closeTo(0) });
    expect(points[1].x).toBeCloseTo(200, 5);
    expect(points[2].x).toBeCloseTo(100, 5);
    expect(points[2].y).toBeCloseTo(200, 5);
    expect(points[3].x).toBeCloseTo(0, 5);
  });
});

describe("polygonPoints", () => {
  it("formats points as an SVG points string", () => {
    expect(
      polygonPoints([
        { x: 1, y: 2 },
        { x: 3, y: 4 },
      ]),
    ).toBe("1,2 3,4");
  });
});

describe("gridRingPoints", () => {
  it("scales down linearly with the ring fraction", () => {
    const full = gridRingPoints(4, 200, 1);
    const half = gridRingPoints(4, 200, 0.5);
    expect(full).not.toBe(half);
    expect(half.split(" ")[0]).toBe("100,50");
  });
});

describe("axisLines", () => {
  it("returns one spoke per trait, all starting at the center", () => {
    const lines = axisLines(3, 200);
    expect(lines).toHaveLength(3);
    for (const line of lines) {
      expect(line.x1).toBe(100);
      expect(line.y1).toBe(100);
    }
  });
});
