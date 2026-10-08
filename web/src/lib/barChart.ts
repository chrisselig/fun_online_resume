/** Render a value as a block-character bar, e.g. "████░░░░" for an ASCII meter. */
export function renderBar(value: number, max: number, width: number): string {
  const filled = Math.max(1, Math.round((value / max) * width));
  return "█".repeat(filled) + "░".repeat(width - filled);
}
