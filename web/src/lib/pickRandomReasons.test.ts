import { describe, expect, it } from "vitest";
import { pickRandomReasons } from "./pickRandomReasons";

const POOL = ["a", "b", "c", "d", "e"];

describe("pickRandomReasons", () => {
  it("picks N distinct items", () => {
    const picked = pickRandomReasons(POOL, 3, () => 0);
    expect(picked).toHaveLength(3);
    expect(new Set(picked).size).toBe(3);
  });

  it("does not mutate the input pool", () => {
    const original = [...POOL];
    pickRandomReasons(POOL, 3, () => 0.5);
    expect(POOL).toEqual(original);
  });

  it("caps count at the pool size", () => {
    const picked = pickRandomReasons(POOL, 10, () => 0);
    expect(picked).toHaveLength(POOL.length);
  });

  it("is deterministic given a fixed rng", () => {
    const a = pickRandomReasons(POOL, 2, () => 0.5);
    const b = pickRandomReasons(POOL, 2, () => 0.5);
    expect(a).toEqual(b);
  });
});
