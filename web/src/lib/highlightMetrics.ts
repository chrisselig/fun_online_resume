/**
 * Splits a sentence into plain/highlighted segments so the UI can bold the
 * concrete numeric proof-points (dollar amounts, percentages, day/hour/minute
 * counts, "165-query"-style compounds, bare counts) without touching the
 * original wording.
 */
export interface TextSegment {
  text: string;
  highlight: boolean;
}

const TIME_UNIT = String.raw`days?|hours?|minutes?|weeks?|months?|years?`;

// Ordered most-specific-first: alternation picks the first branch that
// matches at a given position, so broader fallbacks must come last or they'd
// swallow part of a more specific match (e.g. the "165" in "165-query").
const METRIC_PATTERN = new RegExp(
  [
    // dollar amounts: $500,000  $1.2M
    String.raw`\$\d[\d,]*(?:\.\d+)?[kKmMbB]?\b`,
    // ranges with a unit: 3-5 days, 3–5 days
    String.raw`\d+(?:\.\d+)?\s?[-–]\s?\d+(?:\.\d+)?\s?(?:${TIME_UNIT})\b`,
    // percentages: 60%  12.5%
    String.raw`\d+(?:\.\d+)?%`,
    // number-word compounds: 165-query
    String.raw`\d+-[a-zA-Z]+`,
    // single number with a unit: 4 days, 10 hours, 10 minutes
    String.raw`\d+(?:\.\d+)?\s?(?:${TIME_UNIT})\b`,
    // comma-grouped counts: 1,200 (not hyphen-glued, e.g. "COVID-19")
    String.raw`(?<!-)\b\d{1,3}(?:,\d{3})+\b`,
    // bare multi-digit counts: 300 (not hyphen-glued, e.g. "COVID-19")
    String.raw`(?<!-)\b\d{2,}\b`,
  ].join("|"),
  "gi",
);

export function highlightMetrics(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(METRIC_PATTERN)) {
    const start = match.index;
    if (start > lastIndex) {
      segments.push({ text: text.slice(lastIndex, start), highlight: false });
    }
    segments.push({ text: match[0], highlight: true });
    lastIndex = start + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), highlight: false });
  }

  return segments.length > 0 ? segments : [{ text, highlight: false }];
}
