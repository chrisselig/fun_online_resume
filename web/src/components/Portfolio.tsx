import type { PortfolioItem } from "@/lib/resume";

export function Portfolio({ portfolio }: { portfolio: PortfolioItem[] }) {
  return (
    <section className="border-b-8 border-ink px-6 py-16 sm:px-10 sm:py-24">
      <p className="brutal-tag text-sm font-bold">006 / PORTFOLIO.LINKS</p>
      <h2 className="mt-2 text-5xl font-black tracking-tighter uppercase sm:text-7xl">
        Proof, not claims
      </h2>
      <div className="mt-10 border-4 border-ink">
        {portfolio.map((item, i) => (
          <a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className={`group flex flex-wrap items-center justify-between gap-2 px-5 py-4 hover:bg-ink hover:text-paper ${
              i !== 0 ? "border-t-4 border-ink" : ""
            }`}
          >
            <span className="text-lg font-black uppercase">{item.title}</span>
            <span className="brutal-link font-bold group-hover:text-accent group-hover:no-underline">
              {item.url.replace(/^https?:\/\//, "")} →
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
