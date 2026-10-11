import { describe, expect, it } from "vitest";
import { highlightMetrics } from "./highlightMetrics";

function rejoin(segments: { text: string }[]): string {
  return segments.map((s) => s.text).join("");
}

describe("highlightMetrics", () => {
  it("passes a sentence with no matches through unchanged", () => {
    const text = "Led stakeholder workshops and wrote documentation.";
    const segments = highlightMetrics(text);
    expect(segments).toEqual([{ text, highlight: false }]);
  });

  it("highlights a dollar amount", () => {
    const segments = highlightMetrics("Saved the business $1.2M annually.");
    expect(segments.some((s) => s.highlight && s.text === "$1.2M")).toBe(true);
    expect(rejoin(segments)).toBe("Saved the business $1.2M annually.");
  });

  it("highlights a comma-grouped dollar amount", () => {
    const segments = highlightMetrics("Reduced spend by $500,000 per year.");
    expect(segments.some((s) => s.highlight && s.text === "$500,000")).toBe(true);
  });

  it("highlights a percentage", () => {
    const segments = highlightMetrics("Cut processing errors by 60%.");
    expect(segments.some((s) => s.highlight && s.text === "60%")).toBe(true);
  });

  it("highlights a day count", () => {
    const text =
      "Developed an AI-based model that reads different file formats and extracts the data into tables — saving end users 4 days of work each time new files were sent to the team.";
    const segments = highlightMetrics(text);
    expect(segments.some((s) => s.highlight && s.text === "4 days")).toBe(true);
    expect(rejoin(segments)).toBe(text);
  });

  it("highlights an hour count embedded mid-sentence", () => {
    const text =
      "Built a Power Automate flow using AI to extract information from PDF files, saving 10 hours a month and enabling consolidated analysis for the first time.";
    const segments = highlightMetrics(text);
    expect(segments.some((s) => s.highlight && s.text === "10 hours")).toBe(true);
    expect(rejoin(segments)).toBe(text);
  });

  it("highlights a day/minute range and a separate minute count as distinct matches", () => {
    const text =
      "Streamlined the financial management process from 3–5 days down to 10 minutes, including more user-friendly Excel input files and a best-practice Power BI data model.";
    const segments = highlightMetrics(text);
    const highlighted = segments.filter((s) => s.highlight).map((s) => s.text);
    expect(highlighted).toEqual(["3–5 days", "10 minutes"]);
    expect(rejoin(segments)).toBe(text);
  });

  it("highlights a number-word compound like 165-query", () => {
    const text =
      "Built a 165-query Power BI report that automated data ingestion into a dashboard for my clients' clients.";
    const segments = highlightMetrics(text);
    expect(segments.some((s) => s.highlight && s.text === "165-query")).toBe(true);
    expect(rejoin(segments)).toBe(text);
  });

  it("highlights a bare multi-digit count", () => {
    const text =
      "Produced over 300 R Markdown reports for participants in a university medical study.";
    const segments = highlightMetrics(text);
    expect(segments.some((s) => s.highlight && s.text === "300")).toBe(true);
    expect(rejoin(segments)).toBe(text);
  });

  it("does not treat a hyphen-glued proper noun like COVID-19 as a metric", () => {
    const text = "Created R/ggplot2 data visualizations for an academic study on the mental-health effects of COVID-19.";
    const segments = highlightMetrics(text);
    expect(segments).toEqual([{ text, highlight: false }]);
  });

  it("never mangles the original text when segments are rejoined", () => {
    const texts = [
      "Saved $1.2M and cut errors by 60% over 3–5 days down to 10 minutes using a 165-query report.",
      "No numbers here at all.",
      "A lone number 7 with no unit.",
    ];
    for (const text of texts) {
      expect(rejoin(highlightMetrics(text))).toBe(text);
    }
  });
});
