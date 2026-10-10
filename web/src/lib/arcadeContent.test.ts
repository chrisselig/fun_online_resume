import { describe, expect, it } from "vitest";
import { extractPainPoints, topWeapons, weaponKindFor } from "./arcadeContent";
import type { EarlierRole, FeaturedRole, SkillEntry } from "./resume";

const featured: FeaturedRole[] = [
  {
    company: "Cenovus Energy",
    location: "Calgary, AB",
    date_range: "2024 – Present",
    role: "Senior Advisor, HR Data & Analytics",
    summary: null,
    bullets: [
      "Identified and remediated a data access issue, strengthened permissions.",
      "Reviewed budget variances across the enterprise.",
      "Saved end users 4 days of work each cycle.",
    ],
    engagements: [],
  },
  {
    company: "Bidamia Inc.",
    location: "Calgary, AB",
    date_range: "2018 – 2024",
    role: "Consultant",
    summary: null,
    bullets: [],
    engagements: [
      {
        client: "Camber Capital",
        role: "Technical Lead",
        former: false,
        bullets: ["Streamlined the process from 3–5 days down to 10 minutes."],
      },
    ],
  },
];

const earlier: EarlierRole[] = [
  {
    company: "ConocoPhillips Canada",
    location: "Calgary, AB",
    date_range: "2008 – 2016",
    role: "Business Analyst",
    highlight: "Cut Essbase turnaround time dramatically through automation.",
  },
];

describe("extractPainPoints", () => {
  it("only returns phrases actually present in the source text", () => {
    const points = extractPainPoints(
      "builds pipelines that turn chaos into clarity and retire a few terrible spreadsheets",
      featured,
      earlier,
    );
    expect(points).toContain("chaos");
    expect(points).toContain("terrible spreadsheets");
    expect(points).toContain("data access issue");
    expect(points).toContain("budget variances");
    expect(points).toContain("3–5 days");
    expect(points).toContain("4 days of work");
    expect(points).not.toContain("manual effort");
  });

  it("searches nested engagement bullets, not just top-level bullets", () => {
    const points = extractPainPoints("", featured, []);
    expect(points).toContain("3–5 days");
  });

  it("searches earlier-career highlights, not just featured roles", () => {
    const points = extractPainPoints("", [], earlier);
    expect(points).toContain("essbase turnaround");
  });

  it("defaults to no earlier roles when the argument is omitted", () => {
    const points = extractPainPoints("chaos", featured);
    expect(points).toContain("chaos");
    expect(points).not.toContain("essbase turnaround");
  });

  it("is case-insensitive", () => {
    const points = extractPainPoints("", [
      { ...featured[0], bullets: ["A DATA ACCESS ISSUE was found."] },
    ]);
    expect(points).toContain("data access issue");
  });
});

describe("topWeapons", () => {
  const skills: SkillEntry[] = [
    { name: "R", endorsements: 26 },
    { name: "Power BI", endorsements: 18 },
    { name: "Python", endorsements: 9 },
    { name: "Tableau", endorsements: 1 },
  ];

  it("sorts by endorsements descending", () => {
    expect(topWeapons(skills, 2)).toEqual(["R", "Power BI"]);
  });

  it("respects the count limit", () => {
    expect(topWeapons(skills, 1)).toHaveLength(1);
  });

  it("defaults to up to 8 weapons", () => {
    expect(topWeapons(skills)).toHaveLength(4);
  });

  it("does not mutate the input array", () => {
    const copy = [...skills];
    topWeapons(skills);
    expect(skills).toEqual(copy);
  });

  it("excludes curated-out tools even when they'd otherwise rank highly", () => {
    const withExcluded: SkillEntry[] = [
      { name: "Spotfire", endorsements: 50 },
      { name: "RStudio", endorsements: 40 },
      { name: "Spark", endorsements: 30 },
      { name: "AWS", endorsements: 20 },
      ...skills,
    ];
    const result = topWeapons(withExcluded, 10);
    expect(result).not.toContain("Spotfire");
    expect(result).not.toContain("RStudio");
    expect(result).not.toContain("Spark");
    expect(result).not.toContain("AWS");
    expect(result).toEqual(["R", "Power BI", "Python", "Tableau"]);
  });
});

describe("weaponKindFor", () => {
  it("maps known tools to distinct, thematic firing patterns", () => {
    expect(weaponKindFor("R")).toBe("wave");
    expect(weaponKindFor("Excel / VBA")).toBe("twin");
    expect(weaponKindFor("Power BI")).toBe("spread");
    expect(weaponKindFor("Python")).toBe("rapid");
    expect(weaponKindFor("SQL")).toBe("laser");
  });

  it("falls back to a single shot for unmapped tools", () => {
    expect(weaponKindFor("Some Future Tool")).toBe("single");
  });
});
