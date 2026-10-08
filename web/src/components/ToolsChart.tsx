import type { SkillEntry } from "@/lib/resume";
import { renderBar } from "@/lib/barChart";
import { Prompt } from "./Prompt";

const BAR_WIDTH = 28;

export function ToolsChart({ skills }: { skills: SkillEntry[] }) {
  const sorted = [...skills].sort((a, b) => b.endorsements - a.endorsements);
  const max = sorted[0]?.endorsements ?? 1;

  return (
    <section className="border-b border-border px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <Prompt command="grep -ro '{tool}' ./career --count | sort -rn" />
        <p className="mt-1 text-xs text-dim">
          # bar length = mentions across 18 years of real work, not LinkedIn endorsements
        </p>
        <div className="mt-6 space-y-1.5">
          {sorted.map((skill) => {
            const bar = renderBar(skill.endorsements, max, BAR_WIDTH);
            return (
              <div
                key={skill.name}
                className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:gap-3"
              >
                <span className="text-fg sm:w-36 sm:shrink-0">{skill.name}</span>
                <span className="tracking-[-0.05em] text-accent">{bar}</span>
                <span className="text-dim">{skill.endorsements}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
