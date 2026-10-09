import type { SkillEntry } from "@/lib/resume";

export function SkillsBarChart({ skills }: { skills: SkillEntry[] }) {
  const sorted = [...skills].sort((a, b) => b.endorsements - a.endorsements);
  const max = sorted[0]?.endorsements ?? 1;

  return (
    <section className="border-b-8 border-ink px-6 py-16 sm:px-10 sm:py-24">
      <p className="brutal-tag text-sm font-bold">003 / TOOLS.LOG</p>
      <h2 className="mt-2 text-5xl font-black tracking-tighter uppercase sm:text-7xl">
        Tools of the trade
      </h2>
      <p className="brutal-tag mt-2 text-xs font-bold uppercase">
        Width = mentions counted across 18 years of real work, not vibes
      </p>

      <div className="mt-10 max-w-3xl border-4 border-ink">
        {sorted.map((skill, i) => (
          <div
            key={skill.name}
            className={`flex items-stretch ${i !== 0 ? "border-t-4 border-ink" : ""}`}
          >
            <div className="brutal-tag flex w-28 shrink-0 items-center justify-end border-r-4 border-ink px-3 py-2 text-right text-xs font-bold uppercase sm:w-40">
              {skill.name}
            </div>
            <div className="flex flex-1 items-center py-1">
              <div
                className={`h-6 ${i === 0 ? "bg-accent" : "bg-ink"}`}
                style={{ width: `${Math.max(4, (skill.endorsements / max) * 100)}%` }}
              />
              <span className="brutal-tag ml-2 text-sm font-bold">
                {skill.endorsements}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
