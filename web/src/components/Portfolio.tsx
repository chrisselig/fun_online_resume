import type { PortfolioItem } from "@/lib/resume";

const CARD_COLORS = [
  "var(--color-cat-lang)",
  "var(--color-cat-bi)",
  "var(--color-cat-auto)",
  "var(--color-cat-platform)",
];

export function Portfolio({ portfolio }: { portfolio: PortfolioItem[] }) {
  return (
    <section className="border-b-4 border-ink bg-paper px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-xs tracking-[0.3em] text-cat-bi uppercase">
          Proof, not just claims
        </p>
        <h2 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
          Portfolio
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {portfolio.map((item, i) => {
            const color = CARD_COLORS[i % CARD_COLORS.length];
            return (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="group relative overflow-hidden border-2 border-ink p-5 transition-colors hover:text-paper"
                style={{ "--card-color": color } as React.CSSProperties}
              >
                <div className="absolute inset-0 -z-10 bg-[var(--card-color)] opacity-0 transition-opacity group-hover:opacity-100" />
                <p className="relative font-bold group-hover:text-paper">{item.title}</p>
                <p
                  className="relative mt-1 font-mono text-sm group-hover:text-paper"
                  style={{ color }}
                >
                  {item.url.replace(/^https?:\/\//, "")} ↗
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
