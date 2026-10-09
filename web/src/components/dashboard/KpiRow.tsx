import type { Stat } from "@/lib/resume";

// Deterministic per-tile "trend" shape — decorative, not real time series.
const SPARK_PATHS = [
  "M0,18 L8,14 L16,15 L24,9 L32,10 L40,4",
  "M0,16 L8,17 L16,11 L24,12 L32,6 L40,7",
  "M0,10 L8,12 L16,8 L24,9 L32,5 L40,3",
  "M0,19 L8,13 L16,14 L24,7 L32,8 L40,2",
];

export function KpiRow({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="rounded-lg border border-border bg-panel p-5 shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
        >
          <p className="text-xs font-medium text-muted uppercase">
            {stat.label}
          </p>
          <div className="mt-2 flex items-end justify-between gap-2">
            <p className="text-3xl font-semibold text-ink">{stat.value}</p>
            <svg
              viewBox="0 0 40 20"
              className="h-5 w-10 shrink-0"
              aria-hidden
            >
              <path
                d={SPARK_PATHS[i % SPARK_PATHS.length]}
                fill="none"
                stroke="var(--color-gold)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
