import type { SkillEntry } from "@/lib/resume";
import { Section } from "@/components/Section";

export function SkillsRanked({ skills }: { skills: SkillEntry[] }) {
  const sorted = [...skills].sort((a, b) => b.endorsements - a.endorsements);
  const max = sorted[0]?.endorsements ?? 1;

  return (
    <Section number="02" title="Tools of the trade">
      <p className="mb-8 max-w-[60ch] text-sm text-ink/50">
        Ranked by how often each tool shows up across 18 years of real work —
        not endorsement counts.
      </p>
      <ol className="space-y-3">
        {sorted.map((skill, i) => (
          <li
            key={skill.name}
            className="grid grid-cols-[2rem_10rem_1fr_3rem] items-center gap-4 border-b border-rule py-2 sm:grid-cols-[2rem_12rem_1fr_3rem]"
          >
            <span className="font-mono text-xs text-ink/40">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="truncate font-medium">{skill.name}</span>
            <span className="h-1.5 bg-ink/10">
              <span
                className="block h-full bg-red"
                style={{ width: `${(skill.endorsements / max) * 100}%` }}
              />
            </span>
            <span className="text-right font-mono text-sm text-ink/60">
              {skill.endorsements}
            </span>
          </li>
        ))}
      </ol>
    </Section>
  );
}
