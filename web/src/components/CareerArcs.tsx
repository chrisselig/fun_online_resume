import type { EarlierRole, Engagement, Experience, FeaturedRole } from "@/lib/resume";
import { annularSectorPath } from "@/lib/arcs";

const CX = 240;
const CY = 240;

interface Era {
  label: string;
  dateRange: string;
  color: string;
  innerR: number;
  outerR: number;
}

const ERAS: Era[] = [
  {
    label: "Earlier career",
    dateRange: "2006 – 2017",
    color: "var(--color-cat-platform)",
    innerR: 48,
    outerR: 88,
  },
  {
    label: "Bidamia Inc.",
    dateRange: "2018 – 2024",
    color: "var(--color-cat-bi)",
    innerR: 94,
    outerR: 136,
  },
  {
    label: "SELICA Analytics",
    dateRange: "2022 – 2023",
    color: "var(--color-cat-auto)",
    innerR: 142,
    outerR: 170,
  },
  {
    label: "Cenovus Energy",
    dateRange: "2024 – Present",
    color: "var(--color-cat-lang)",
    innerR: 176,
    outerR: 214,
  },
];

function EngagementCard({ engagement }: { engagement: Engagement }) {
  return (
    <div className="border-l-4 border-cat-bi/60 bg-paper pl-4">
      <p className="flex flex-wrap items-baseline gap-x-2 font-bold">
        {engagement.client}
        {engagement.former && (
          <span className="font-mono text-xs font-normal text-ink/50 uppercase">
            former client
          </span>
        )}
      </p>
      {engagement.role && <p className="text-sm italic text-cat-bi">{engagement.role}</p>}
      <ul className="mt-2 space-y-1 text-sm text-ink/80">
        {engagement.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2">
            <span className="shrink-0 text-cat-bi">—</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FeaturedRoleBlock({ role, color }: { role: FeaturedRole; color: string }) {
  return (
    <div className="border-l-4 pl-5" style={{ borderColor: color }}>
      <p className="font-mono text-sm text-ink/60">{role.date_range}</p>
      <h3 className="mt-1 text-2xl font-bold">{role.role}</h3>
      <p className="text-lg font-medium" style={{ color }}>
        {role.company}
        {role.location ? ` · ${role.location}` : ""}
      </p>

      {role.summary && <p className="mt-3 max-w-2xl text-ink/80">{role.summary}</p>}

      {role.bullets.length > 0 && (
        <ul className="mt-3 space-y-1 text-ink/80">
          {role.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <span className="shrink-0" style={{ color }}>
                —
              </span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}

      {role.engagements.length > 0 && (
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {role.engagements.map((engagement) => (
            <EngagementCard key={engagement.client} engagement={engagement} />
          ))}
        </div>
      )}
    </div>
  );
}

function EarlierRoleCard({ role }: { role: EarlierRole }) {
  return (
    <div className="border-l-4 pl-4" style={{ borderColor: "var(--color-cat-platform)" }}>
      <p className="font-mono text-sm text-ink/60">{role.date_range}</p>
      <h4 className="font-bold">{role.company}</h4>
      <p className="text-sm" style={{ color: "var(--color-cat-platform)" }}>
        {role.role}
      </p>
      <p className="mt-1 text-sm text-ink/80">{role.highlight}</p>
    </div>
  );
}

export function CareerArcs({ experience }: { experience: Experience }) {
  const featuredByCompany = Object.fromEntries(
    experience.featured.map((role) => [role.company, role]),
  );

  return (
    <section className="border-b-4 border-ink bg-paper px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-xs tracking-[0.3em] text-cat-lang uppercase">
          Radius grows with time — outermost ring is now
        </p>
        <h2 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
          18 years, four eras
        </h2>

        <div className="grid items-center gap-8 lg:grid-cols-[480px_1fr]">
          <svg
            viewBox="0 0 480 480"
            className="mx-auto w-full max-w-md"
            role="img"
            aria-label="Concentric rings showing four eras of a data career, radius increasing with recency"
          >
            {ERAS.map((era) => (
              <path
                key={era.label}
                d={annularSectorPath({
                  cx: CX,
                  cy: CY,
                  innerR: era.innerR,
                  outerR: era.outerR,
                  startAngle: 0,
                  endAngle: 360,
                })}
                fill={era.color}
                opacity={0.85}
              >
                <title>{`${era.label} — ${era.dateRange}`}</title>
              </path>
            ))}
          </svg>

          <ul className="space-y-3">
            {[...ERAS].reverse().map((era) => (
              <li key={era.label} className="flex items-center gap-3">
                <span
                  className="h-4 w-4 shrink-0 rounded-full"
                  style={{ backgroundColor: era.color }}
                  aria-hidden
                />
                <span className="font-bold">{era.label}</span>
                <span className="font-mono text-sm text-ink/50">{era.dateRange}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 space-y-16">
          {featuredByCompany["Cenovus Energy"] && (
            <FeaturedRoleBlock
              role={featuredByCompany["Cenovus Energy"]}
              color="var(--color-cat-lang)"
            />
          )}
          {featuredByCompany["Bidamia Inc."] && (
            <FeaturedRoleBlock
              role={featuredByCompany["Bidamia Inc."]}
              color="var(--color-cat-bi)"
            />
          )}
          {featuredByCompany["SELICA Analytics Inc."] && (
            <FeaturedRoleBlock
              role={featuredByCompany["SELICA Analytics Inc."]}
              color="var(--color-cat-auto)"
            />
          )}
        </div>

        <div className="mt-16">
          <p className="font-mono text-xs tracking-[0.3em] text-ink/50 uppercase">
            Earlier career
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {experience.earlier.map((role) => (
              <EarlierRoleCard key={role.company} role={role} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
