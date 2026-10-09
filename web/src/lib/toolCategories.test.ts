import { describe, expect, it } from "vitest";
import { groupByCategory } from "./toolCategories";

describe("groupByCategory", () => {
  const skills = [
    { name: "R", endorsements: 26 },
    { name: "Power BI", endorsements: 18 },
    { name: "Databricks", endorsements: 3 },
    { name: "Unknown Tool", endorsements: 1 },
  ];

  it("buckets every skill into exactly one category", () => {
    const groups = groupByCategory(skills);
    const totalSkillsAcrossGroups = groups.reduce((n, g) => n + g.skills.length, 0);
    expect(totalSkillsAcrossGroups).toBe(skills.length);
  });

  it("falls back unknown tools to the auto category rather than dropping them", () => {
    const groups = groupByCategory(skills);
    const auto = groups.find((g) => g.key === "auto");
    expect(auto?.skills.some((s) => s.name === "Unknown Tool")).toBe(true);
  });

  it("sums endorsements per category into `total`", () => {
    const groups = groupByCategory(skills);
    const lang = groups.find((g) => g.key === "lang");
    expect(lang?.total).toBe(26);
  });

  it("sorts skills within a category by endorsements descending", () => {
    const groups = groupByCategory([
      { name: "Spotfire", endorsements: 8 },
      { name: "Tableau", endorsements: 1 },
      { name: "Power BI", endorsements: 18 },
    ]);
    const bi = groups.find((g) => g.key === "bi");
    expect(bi?.skills.map((s) => s.name)).toEqual(["Power BI", "Spotfire", "Tableau"]);
  });
});
