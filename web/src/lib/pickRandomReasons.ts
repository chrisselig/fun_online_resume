/**
 * Pick `count` distinct random lines from the shared "reasons to hire me"
 * pool. `rng` is injectable — matches the `pickFoodCell` pattern in
 * snakeLogic.ts — so tests don't depend on Math.random, and callers should
 * only invoke this from a useEffect or a direct user action (game over,
 * level clear), never during initial render, to avoid SSR/hydration
 * mismatches.
 */
export function pickRandomReasons(
  pool: string[],
  count: number,
  rng: () => number = Math.random,
): string[] {
  const remaining = [...pool];
  const picked: string[] = [];
  const n = Math.min(count, remaining.length);
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(rng() * remaining.length);
    picked.push(remaining[idx]);
    remaining.splice(idx, 1);
  }
  return picked;
}
