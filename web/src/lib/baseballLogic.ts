export type AtBatResult = "hit" | "out";

const HIT_PROBABILITY = 0.55;

/** Resolves one at-bat from a 0-1 roll (caller supplies Math.random() so this stays pure). */
export function resolveAtBat(roll: number): AtBatResult {
  return roll < HIT_PROBABILITY ? "hit" : "out";
}

export interface BaseState {
  first: boolean;
  second: boolean;
  third: boolean;
}

export const EMPTY_BASES: BaseState = { first: false, second: false, third: false };

/** A hit (single) advances every runner one base; a runner on third scores. */
export function advanceRunners(bases: BaseState): { bases: BaseState; runsScored: number } {
  return {
    bases: { first: true, second: bases.first, third: bases.second },
    runsScored: bases.third ? 1 : 0,
  };
}
