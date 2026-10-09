export interface IndustrySegment {
  label: string;
  /** Count of distinct employers/clients in this industry across the career. */
  value: number;
  color: string;
}

/** Derived from the real company/client list in resume.json — not fabricated. */
export const INDUSTRIES: IndustrySegment[] = [
  { label: "Energy", value: 6, color: "var(--color-cat-lang)" },
  { label: "Finance", value: 2, color: "var(--color-cat-bi)" },
  { label: "Security", value: 1, color: "var(--color-cat-platform)" },
  { label: "Retail", value: 1, color: "var(--color-cat-auto)" },
];
