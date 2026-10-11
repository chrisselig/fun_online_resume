import type { Stat } from "@/lib/resume";

export function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <section className="border-b-8 border-line">
      <div className="grid grid-cols-2 sm:grid-cols-4">
        {stats.map((stat, i) =>
          stat.details ? (
            <button
              key={stat.label}
              type="button"
              className={`group relative block w-full border-r-8 border-b-8 border-line px-6 py-10 text-left last:border-r-0 sm:border-b-0 cursor-help ${
                i === 0 ? "bg-accent" : "bg-paper"
              }`}
            >
              <p className="font-mono text-5xl font-black sm:text-6xl">{stat.value}</p>
              <p className="brutal-tag mt-2 text-xs font-bold uppercase underline decoration-dotted decoration-2 underline-offset-4">
                {stat.label} *
              </p>

              <div className="invisible absolute top-full left-0 z-10 mt-1 w-64 border-4 border-line bg-paper p-4 text-left opacity-0 shadow-[8px_8px_0_0_var(--color-ink)] transition-opacity duration-100 group-hover:visible group-hover:opacity-100 group-focus:visible group-focus:opacity-100">
                <ul className="space-y-1">
                  {stat.details.map((d) => (
                    <li key={d} className="font-serif text-sm text-ink">
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </button>
          ) : (
            <div
              key={stat.label}
              className={`border-r-8 border-b-8 border-line px-6 py-10 last:border-r-0 sm:border-b-0 ${
                i === 0 ? "bg-accent" : "bg-paper"
              }`}
            >
              <p className="font-mono text-5xl font-black sm:text-6xl">{stat.value}</p>
              <p className="brutal-tag mt-2 text-xs font-bold uppercase">{stat.label}</p>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
