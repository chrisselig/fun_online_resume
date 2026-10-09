import { describe, expect, it } from "vitest";
import { niceTicks } from "./chart";

describe("niceTicks", () => {
  it("returns count evenly spaced ticks from 0 to max", () => {
    expect(niceTicks(20, 5)).toEqual([0, 5, 10, 15, 20]);
  });

  it("rounds to whole numbers", () => {
    expect(niceTicks(10, 4)).toEqual([0, 3, 7, 10]);
  });

  it("returns [0] for a non-positive max", () => {
    expect(niceTicks(0)).toEqual([0]);
    expect(niceTicks(-5)).toEqual([0]);
  });
});
