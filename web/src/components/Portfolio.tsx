import type { PortfolioItem } from "@/lib/resume";

export function Portfolio({ portfolio }: { portfolio: PortfolioItem[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {portfolio.map((item) => (
        <a
          key={item.url}
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="group rounded-md border border-border p-4 transition-colors hover:border-primary"
        >
          <p className="text-sm font-semibold text-ink group-hover:text-primary">
            {item.title}
          </p>
          <p className="mt-1 font-mono text-xs text-primary">
            {item.url.replace(/^https?:\/\//, "")} ↗
          </p>
        </a>
      ))}
    </div>
  );
}
