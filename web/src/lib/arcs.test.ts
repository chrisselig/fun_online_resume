import { describe, expect, it } from "vitest";
import { annularSectorPath, sectorMidpoint } from "./arcs";

describe("annularSectorPath", () => {
  it("returns a non-empty SVG path string with move/arc/line commands", () => {
    const d = annularSectorPath({
      cx: 0,
      cy: 0,
      innerR: 10,
      outerR: 20,
      startAngle: 0,
      endAngle: 90,
    });
    expect(d).toMatch(/^M /);
    expect(d).toContain("A ");
    expect(d).toContain("L ");
    expect(d.trim().endsWith("Z")).toBe(true);
  });

  it("sets the large-arc flag for sweeps over 180 degrees", () => {
    const wide = annularSectorPath({
      cx: 0,
      cy: 0,
      innerR: 10,
      outerR: 20,
      startAngle: 0,
      endAngle: 200,
    });
    const narrow = annularSectorPath({
      cx: 0,
      cy: 0,
      innerR: 10,
      outerR: 20,
      startAngle: 0,
      endAngle: 90,
    });
    // outer arc command is "A <r> <r> 0 <largeArcFlag> 1 ..."
    expect(wide).toMatch(/A 20 20 0 1 1/);
    expect(narrow).toMatch(/A 20 20 0 0 1/);
  });

  it("renders a full 360-degree sweep as a real ring, not a degenerate sliver", () => {
    // A single SVG arc command can't sweep a full circle (start === end
    // point), so a naive implementation silently draws ~nothing. Assert the
    // path actually contains two half-sweeps, each covering real area.
    const d = annularSectorPath({
      cx: 0,
      cy: 0,
      innerR: 10,
      outerR: 20,
      startAngle: 0,
      endAngle: 360,
    });
    const moveCommands = d.match(/M /g) ?? [];
    const arcCommands = d.match(/A /g) ?? [];
    expect(moveCommands.length).toBeGreaterThanOrEqual(2);
    expect(arcCommands.length).toBeGreaterThanOrEqual(4); // 2 outer + 2 inner arcs
  });
});

describe("sectorMidpoint", () => {
  it("sits on the vertical axis above center for a sector centered on 0 degrees", () => {
    const mid = sectorMidpoint({
      cx: 100,
      cy: 100,
      innerR: 10,
      outerR: 30,
      startAngle: -10,
      endAngle: 10,
    });
    expect(mid.x).toBeCloseTo(100, 0);
    expect(mid.y).toBeLessThan(100); // above center (0deg = 12 o'clock)
  });

  it("uses the average of inner and outer radius", () => {
    const mid = sectorMidpoint({
      cx: 0,
      cy: 0,
      innerR: 10,
      outerR: 30,
      startAngle: 0,
      endAngle: 0,
    });
    const dist = Math.hypot(mid.x, mid.y);
    expect(dist).toBeCloseTo(20, 5);
  });
});
