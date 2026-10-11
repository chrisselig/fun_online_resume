// Deterministic letter -> symbol substitution. Uses standard Unicode
// Dingbats/Miscellaneous Symbols rather than the actual Wingdings font,
// which is a proprietary Microsoft font not guaranteed to be installed
// (or legally embeddable) cross-platform — this renders the joke
// consistently on every OS/browser instead of silently falling back to
// readable text wherever Wingdings happens to be missing.
const SYMBOLS = "✌☎✉☀☁☂☃★☆☕✈⚓⚡☯☮♠♣♥♦✂✎✓✗☺☻♪".split("");

const LETTER_MAP: Record<string, string> = Object.fromEntries(
  "abcdefghijklmnopqrstuvwxyz".split("").map((letter, i) => [letter, SYMBOLS[i]]),
);

export function wingdingify(text: string): string {
  return text.replace(/[a-zA-Z]/g, (ch) => LETTER_MAP[ch.toLowerCase()] ?? ch);
}
