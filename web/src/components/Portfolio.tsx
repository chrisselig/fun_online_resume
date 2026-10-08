import type { PortfolioItem } from "@/lib/resume";
import { Prompt } from "./Prompt";

export function Portfolio({ portfolio }: { portfolio: PortfolioItem[] }) {
  return (
    <section className="border-b border-border px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <Prompt command="git remote -v" />
        <div className="mt-4 space-y-3">
          {portfolio.map((item) => (
            <a
              key={item.url}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="group block border border-border px-4 py-3 text-sm transition-colors hover:border-accent"
            >
              <span className="text-dim"># </span>
              <span className="text-fg group-hover:text-accent">{item.title}</span>
              <br />
              <span className="text-accent">
                {item.url.replace(/^https?:\/\//, "")}
              </span>
              <span className="text-dim"> (fetch)</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
