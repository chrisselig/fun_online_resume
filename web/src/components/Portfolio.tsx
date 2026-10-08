import type { PortfolioItem } from "@/lib/resume";
import { Section } from "@/components/Section";

export function Portfolio({ portfolio }: { portfolio: PortfolioItem[] }) {
  return (
    <Section number="04" title="Portfolio">
      <ol>
        {portfolio.map((item, i) => (
          <li
            key={item.url}
            className="grid grid-cols-[2rem_1fr] items-baseline gap-4 border-t border-rule py-4 first:border-t-0"
          >
            <span className="font-mono text-xs text-ink/40">
              {String(i + 1).padStart(2, "0")}
            </span>
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
            >
              <span className="font-medium group-hover:text-red">
                {item.title}
              </span>
              <span className="font-mono text-sm text-ink/40 group-hover:text-red">
                {item.url.replace(/^https?:\/\//, "")} ↗
              </span>
            </a>
          </li>
        ))}
      </ol>
    </Section>
  );
}
