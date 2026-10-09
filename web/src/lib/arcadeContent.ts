import type { FeaturedRole, SkillEntry } from "./resume";

/**
 * Candidate pain-point phrases to look for verbatim in the real resume text.
 * Only phrases actually found become enemy labels — nothing here is assumed
 * present, extractPainPoints below proves it.
 */
const CANDIDATE_PAIN_POINTS = [
  "terrible spreadsheets",
  "manual effort",
  "manual process",
  "data access issue",
  "budget variances",
  "chaos",
  "3–5 days",
] as const;

/** Enemy labels: pain-point phrases confirmed present in the real resume text. */
export function extractPainPoints(summary: string, featured: FeaturedRole[]): string[] {
  const haystack = [
    summary,
    ...featured.flatMap((role) => [
      role.summary ?? "",
      ...role.bullets,
      ...role.engagements.flatMap((e) => e.bullets),
    ]),
  ]
    .join(" \n ")
    .toLowerCase();

  return CANDIDATE_PAIN_POINTS.filter((phrase) => haystack.includes(phrase.toLowerCase()));
}

/** Weapon labels: the real top tools by how often they show up in the career history. */
export function topWeapons(skills: SkillEntry[], count = 6): string[] {
  return [...skills]
    .sort((a, b) => b.endorsements - a.endorsements)
    .slice(0, count)
    .map((s) => s.name);
}
