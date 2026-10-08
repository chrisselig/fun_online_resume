import type { PortfolioItem } from "@/lib/resume";

export function Portfolio({ portfolio }: { portfolio: PortfolioItem[] }) {
  return (
    <section className="border-b-4 border-ink px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
          Proof, not just claims
        </p>
        <h2 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
          Portfolio
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {portfolio.map((item) => (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="group border-2 border-ink p-5 transition-colors hover:border-accent hover:bg-navy"
            >
              <p className="font-bold group-hover:text-paper">{item.title}</p>
              <p className="mt-1 font-mono text-sm text-accent group-hover:text-accent">
                {item.url.replace(/^https?:\/\//, "")} ↗
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
