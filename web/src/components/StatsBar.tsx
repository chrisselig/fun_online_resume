import type { Stat } from "@/lib/resume";

const STAT_COLORS = [
  "var(--color-cat-lang)",
  "var(--color-cat-bi)",
  "var(--color-cat-auto)",
  "var(--color-cat-platform)",
];

export function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <section className="border-b-4 border-ink bg-navy px-6 py-12 sm:px-10">
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={stat.label}>
            <p
              className="font-mono text-4xl font-black sm:text-5xl"
              style={{ color: STAT_COLORS[i % STAT_COLORS.length] }}
            >
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-paper/80">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
