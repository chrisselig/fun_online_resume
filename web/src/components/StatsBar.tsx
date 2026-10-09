import type { Stat } from "@/lib/resume";

export function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <section className="border-b-8 border-ink">
      <div className="grid grid-cols-2 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`border-r-8 border-b-8 border-ink px-6 py-10 last:border-r-0 sm:border-b-0 ${
              i === 0 ? "bg-accent" : "bg-paper"
            }`}
          >
            <p className="font-mono text-5xl font-black sm:text-6xl">{stat.value}</p>
            <p className="brutal-tag mt-2 text-xs font-bold uppercase">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
