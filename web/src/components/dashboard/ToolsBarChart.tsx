import type { SkillEntry } from "@/lib/resume";
import { niceTicks } from "@/lib/chart";

export function ToolsBarChart({ skills }: { skills: SkillEntry[] }) {
  const sorted = [...skills].sort((a, b) => b.endorsements - a.endorsements);
  const max = sorted[0]?.endorsements ?? 1;
  const ticks = niceTicks(max);

  return (
    <div>
      <div className="relative pl-28">
        {/* gridlines */}
        <div className="pointer-events-none absolute inset-0 left-28 flex justify-between">
          {ticks.map((t) => (
            <div key={t} className="w-px bg-border" />
          ))}
        </div>

        <ul className="relative space-y-2">
          {sorted.map((skill) => (
            <li key={skill.name} className="flex items-center gap-3">
              <span className="w-28 shrink-0 truncate text-right text-sm text-ink">
                {skill.name}
              </span>
              <div className="relative h-5 flex-1">
                <div
                  className="h-5 rounded-r-sm bg-primary"
                  style={{ width: `${(skill.endorsements / max) * 100}%` }}
                  title={`${skill.name} — mentioned ${skill.endorsements} times`}
                />
              </div>
              <span className="w-6 shrink-0 font-mono text-xs text-muted">
                {skill.endorsements}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-border pt-3 text-xs text-muted">
        <span className="h-2.5 w-2.5 rounded-sm bg-primary" aria-hidden />
        Mentions across 18 years of resume bullets
      </div>
    </div>
  );
}
