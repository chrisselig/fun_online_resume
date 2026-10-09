import type { Stat } from "@/lib/resume";

export function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <section className="border-b-4 border-ink bg-navy px-6 py-12 sm:px-10">
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="font-mono text-4xl font-black text-accent sm:text-5xl">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-ink/80">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
