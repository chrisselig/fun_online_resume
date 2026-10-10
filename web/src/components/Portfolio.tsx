import type { PortfolioItem } from "@/lib/resume";

const ROTATIONS = ["-rotate-1", "rotate-1", "rotate-2", "-rotate-2"];

export function Portfolio({ portfolio }: { portfolio: PortfolioItem[] }) {
  return (
    <section className="border-b-8 border-ink bg-paper px-6 py-16 sm:px-10 sm:py-24">
      <p className="brutal-tag text-sm font-bold">006 / PORTFOLIO.LINKS</p>
      <h2 className="mt-2 text-5xl font-black tracking-tighter uppercase sm:text-7xl">
        Proof, not claims
      </h2>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        {portfolio.map((item, i) => (
          <a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className={`group relative block overflow-hidden border-4 border-ink bg-paper p-6 text-ink transition-all duration-150 hover:-translate-y-1 hover:rotate-0 hover:bg-ink hover:text-paper ${ROTATIONS[i % ROTATIONS.length]}`}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -top-6 -right-2 font-mono text-8xl font-black text-ink/10 select-none group-hover:text-paper/10 sm:text-9xl"
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="relative">
              <span className="bg-accent text-ink inline-block px-2 py-1 font-mono text-xs font-bold uppercase">
                View Project
              </span>
              <h3 className="mt-4 text-2xl font-black uppercase sm:text-3xl">{item.title}</h3>
              <p className="mt-3 inline-block font-mono text-sm font-bold underline decoration-2 underline-offset-4 group-hover:text-accent">
                {item.url.replace(/^https?:\/\//, "")} ↗
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
