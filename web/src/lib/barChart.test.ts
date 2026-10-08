import { describe, expect, it } from "vitest";
import { renderBar } from "./barChart";

describe("renderBar", () => {
  it("fully fills the bar for the max value", () => {
    expect(renderBar(10, 10, 10)).toBe("██████████");
  });

  it("renders at least one filled block for a small nonzero value", () => {
    const bar = renderBar(1, 1000, 20);
    expect(bar.startsWith("█")).toBe(true);
    expect(bar).toHaveLength(20);
  });

  it("proportions the fill to the value/max ratio", () => {
    expect(renderBar(5, 10, 10)).toBe("█████░░░░░");
  });
});
