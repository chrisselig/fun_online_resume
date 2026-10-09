/** Evenly spaced gridline tick values from 0 to max, inclusive, rounded to whole numbers. */
export function niceTicks(max: number, count = 5): number[] {
  if (max <= 0 || count < 2) return [0];
  const step = 1 / (count - 1);
  return Array.from({ length: count }, (_, i) => Math.round(max * step * i));
}
