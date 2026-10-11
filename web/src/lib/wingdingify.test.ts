import { describe, expect, it } from "vitest";
import { wingdingify } from "./wingdingify";

describe("wingdingify", () => {
  it("maps the same letter to the same symbol every time", () => {
    const result = wingdingify("aa");
    expect(result[0]).toBe(result[1]);
  });

  it("is case-insensitive about which symbol a letter maps to", () => {
    const lower = wingdingify("a");
    const upper = wingdingify("A");
    expect(lower).toBe(upper);
  });

  it("maps different letters to different symbols", () => {
    const result = wingdingify("ab");
    expect(result[0]).not.toBe(result[1]);
  });

  it("leaves digits, spaces, and punctuation untouched", () => {
    expect(wingdingify("18+ years, R&D!")).toContain("18+");
    expect(wingdingify("18+ years, R&D!")).toContain(",");
    expect(wingdingify("18+ years, R&D!")).toContain("!");
  });

  it("preserves string length", () => {
    const input = "Chris Selig, MBA";
    expect(wingdingify(input).length).toBe(input.length);
  });
});
