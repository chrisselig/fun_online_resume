import type { EarlierRole, FeaturedRole, SkillEntry } from "./resume";

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
  "4 days of work",
  "10 hours a month",
  "data-submission errors",
  "essbase turnaround",
  "days each month",
] as const;

/**
 * Enemy labels: pain-point phrases confirmed present in the real resume
 * text — profile summary, every featured role (including nested client
 * engagements), and every earlier-career highlight.
 */
export function extractPainPoints(
  summary: string,
  featured: FeaturedRole[],
  earlier: EarlierRole[] = [],
): string[] {
  const haystack = [
    summary,
    ...featured.flatMap((role) => [
      role.summary ?? "",
      ...role.bullets,
      ...role.engagements.flatMap((e) => e.bullets),
    ]),
    ...earlier.flatMap((role) => [role.summary ?? "", ...role.bullets]),
  ]
    .join(" \n ")
    .toLowerCase();

  return CANDIDATE_PAIN_POINTS.filter((phrase) => haystack.includes(phrase.toLowerCase()));
}

/**
 * Tools that exist in the real skills data but shouldn't appear as a
 * playable weapon (curation call, not a reflection of real usage).
 */
const EXCLUDED_WEAPONS = new Set(["Spotfire", "RStudio", "Spark", "AWS"]);

/** Weapon labels: the real top tools by how often they show up in the career history. */
export function topWeapons(skills: SkillEntry[], count = 8): string[] {
  return [...skills]
    .filter((s) => !EXCLUDED_WEAPONS.has(s.name))
    .sort((a, b) => b.endorsements - a.endorsements)
    .slice(0, count)
    .map((s) => s.name);
}

export type WeaponKind = "single" | "rapid" | "twin" | "spread" | "wave" | "laser";

/**
 * Each weapon fires differently — a direct, thematic mapping rather than a
 * generic default, so switching tools actually changes how the ship fights.
 */
const WEAPON_KIND_BY_TOOL: Record<string, WeaponKind> = {
  R: "wave",
  "Excel / VBA": "twin",
  "Power BI": "spread",
  Python: "rapid",
  SQL: "laser",
  Databricks: "wave",
  "Power Automate": "rapid",
  Azure: "spread",
};

export function weaponKindFor(tool: string): WeaponKind {
  return WEAPON_KIND_BY_TOOL[tool] ?? "single";
}
