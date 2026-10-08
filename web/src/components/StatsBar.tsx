import type { Stat } from "@/lib/resume";
import { Prompt } from "./Prompt";

export function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <section className="border-b border-border px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <Prompt command="neofetch --section career" />
        <div className="mt-4 overflow-hidden rounded-md border border-border">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex items-baseline justify-between px-5 py-4 ${
                i !== stats.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="text-sm text-dim">{stat.label}</span>
              <span className="text-2xl font-bold text-accent">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
