import { describe, expect, it } from "vitest";
import {
  createSolvedCube,
  FACES,
  isSolved,
  scramble,
  turnFace,
  type CubeState,
  type Face,
} from "./rubiksCube";

function flatten(state: CubeState): number[] {
  return FACES.flatMap((f) => state[f]);
}

describe("createSolvedCube / isSolved", () => {
  it("starts solved", () => {
    expect(isSolved(createSolvedCube())).toBe(true);
  });

  it("detects an unsolved cube", () => {
    const state = turnFace(createSolvedCube(), "F", "cw");
    expect(isSolved(state)).toBe(false);
  });
});

describe.each(FACES)("turnFace(%s)", (face: Face) => {
  it("is a valid permutation (no stickers lost or duplicated)", () => {
    const before = flatten(createSolvedCube()).sort();
    const after = flatten(turnFace(createSolvedCube(), face, "cw")).sort();
    expect(after).toEqual(before);
  });

  it("returns to solved after 4 clockwise turns", () => {
    let state = createSolvedCube();
    for (let i = 0; i < 4; i++) state = turnFace(state, face, "cw");
    expect(state).toEqual(createSolvedCube());
  });

  it("counter-clockwise undoes clockwise", () => {
    const turned = turnFace(createSolvedCube(), face, "cw");
    const undone = turnFace(turned, face, "ccw");
    expect(undone).toEqual(createSolvedCube());
  });

  it("mixes stickers across multiple faces, not just its own", () => {
    const turned = turnFace(createSolvedCube(), face, "cw");
    const changedFaces = FACES.filter(
      (f) => JSON.stringify(turned[f]) !== JSON.stringify(createSolvedCube()[f]),
    );
    expect(changedFaces.length).toBeGreaterThan(1);
  });
});

describe("scramble", () => {
  it("applying a scramble then its exact inverse in reverse order restores solved", () => {
    const moves: { face: Face; direction: "cw" | "ccw" }[] = [
      { face: "F", direction: "cw" },
      { face: "U", direction: "cw" },
      { face: "R", direction: "ccw" },
      { face: "L", direction: "cw" },
    ];
    const scrambled = scramble(createSolvedCube(), moves);
    expect(isSolved(scrambled)).toBe(false);

    const inverse = [...moves].reverse().map((m) => ({
      face: m.face,
      direction: (m.direction === "cw" ? "ccw" : "cw") as "cw" | "ccw",
    }));
    const restored = scramble(scrambled, inverse);
    expect(isSolved(restored)).toBe(true);
  });
});
