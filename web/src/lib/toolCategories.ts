import type { SkillEntry } from "./resume";

export type CategoryKey = "lang" | "bi" | "platform" | "auto";

export const CATEGORIES: Record<CategoryKey, { label: string; color: string }> = {
  lang: { label: "Languages & Querying", color: "var(--color-cat-lang)" },
  bi: { label: "BI & Visualization", color: "var(--color-cat-bi)" },
  platform: { label: "Data Platforms & Cloud", color: "var(--color-cat-platform)" },
  auto: { label: "Automation & Tools", color: "var(--color-cat-auto)" },
};

const TOOL_CATEGORY: Record<string, CategoryKey> = {
  R: "lang",
  Python: "lang",
  SQL: "lang",
  "Power BI": "bi",
  Spotfire: "bi",
  Cognos: "bi",
  Tableau: "bi",
  Spark: "platform",
  AWS: "platform",
  Databricks: "platform",
  Azure: "platform",
  Essbase: "platform",
  "Excel / VBA": "auto",
  RStudio: "auto",
  "Power Automate": "auto",
  KNIME: "auto",
};

export function categoryFor(skillName: string): CategoryKey {
  return TOOL_CATEGORY[skillName] ?? "auto";
}

export interface CategoryGroup {
  key: CategoryKey;
  label: string;
  color: string;
  total: number;
  skills: SkillEntry[];
}

/** Group skills by category, each sorted by mentions descending. */
export function groupByCategory(skills: SkillEntry[]): CategoryGroup[] {
  const groups = new Map<CategoryKey, SkillEntry[]>();
  for (const skill of skills) {
    const key = categoryFor(skill.name);
    const list = groups.get(key) ?? [];
    list.push(skill);
    groups.set(key, list);
  }

  return (Object.keys(CATEGORIES) as CategoryKey[])
    .filter((key) => groups.has(key))
    .map((key) => {
      const skillsInGroup = [...(groups.get(key) ?? [])].sort(
        (a, b) => b.endorsements - a.endorsements,
      );
      return {
        key,
        label: CATEGORIES[key].label,
        color: CATEGORIES[key].color,
        total: skillsInGroup.reduce((sum, s) => sum + s.endorsements, 0),
        skills: skillsInGroup,
      };
    });
}
