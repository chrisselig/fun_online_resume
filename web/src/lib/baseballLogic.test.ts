import { describe, expect, it } from "vitest";
import { advanceRunners, EMPTY_BASES, resolveAtBat } from "./baseballLogic";

describe("resolveAtBat", () => {
  it("is a hit for low rolls", () => {
    expect(resolveAtBat(0)).toBe("hit");
    expect(resolveAtBat(0.4)).toBe("hit");
  });

  it("is an out for high rolls", () => {
    expect(resolveAtBat(0.6)).toBe("out");
    expect(resolveAtBat(0.999)).toBe("out");
  });
});

describe("advanceRunners", () => {
  it("puts the batter on first with the bases empty", () => {
    const { bases, runsScored } = advanceRunners(EMPTY_BASES);
    expect(bases).toEqual({ first: true, second: false, third: false });
    expect(runsScored).toBe(0);
  });

  it("advances existing runners and scores from third", () => {
    const loaded = { first: true, second: true, third: true };
    const { bases, runsScored } = advanceRunners(loaded);
    expect(bases).toEqual({ first: true, second: true, third: true });
    expect(runsScored).toBe(1);
  });

  it("moves a runner from first to second", () => {
    const { bases } = advanceRunners({ first: true, second: false, third: false });
    expect(bases.second).toBe(true);
    expect(bases.first).toBe(true);
  });
});
