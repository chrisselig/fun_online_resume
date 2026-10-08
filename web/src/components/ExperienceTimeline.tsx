import type { EarlierRole, Engagement, Experience, FeaturedRole } from "@/lib/resume";

function EngagementCard({ engagement }: { engagement: Engagement }) {
  return (
    <div className="border-l-4 border-accent/60 bg-paper pl-4">
      <p className="flex flex-wrap items-baseline gap-x-2 font-bold">
        {engagement.client}
        {engagement.former && (
          <span className="font-mono text-xs font-normal text-ink/50 uppercase">
            former client
          </span>
        )}
      </p>
      {engagement.role && (
        <p className="text-sm text-navy italic">{engagement.role}</p>
      )}
      <ul className="mt-2 space-y-1 text-sm text-ink/80">
        {engagement.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2">
            <span className="shrink-0 text-accent">—</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FeaturedRoleBlock({ role }: { role: FeaturedRole }) {
  return (
    <li className="relative mb-16 last:mb-0">
      <span
        className="absolute top-1.5 -left-[2.3rem] h-4 w-4 rounded-full border-4 border-paper bg-accent"
        aria-hidden
      />
      <p className="font-mono text-sm text-ink/60">{role.date_range}</p>
      <h3 className="mt-1 text-2xl font-bold">{role.role}</h3>
      <p className="text-lg font-medium text-navy">
        {role.company}
        {role.location ? ` · ${role.location}` : ""}
      </p>

      {role.summary && (
        <p className="mt-3 max-w-2xl text-ink/80">{role.summary}</p>
      )}

      {role.bullets.length > 0 && (
        <ul className="mt-3 space-y-1 text-ink/80">
          {role.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <span className="shrink-0 text-accent">—</span>
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
    </li>
  );
}

function EarlierRoleCard({ role }: { role: EarlierRole }) {
  return (
    <div className="border-l-4 border-navy pl-4">
      <p className="font-mono text-sm text-ink/60">{role.date_range}</p>
      <h4 className="font-bold">{role.company}</h4>
      <p className="text-sm text-navy">{role.role}</p>
      <p className="mt-1 text-sm text-ink/80">{role.highlight}</p>
    </div>
  );
}

export function ExperienceTimeline({ experience }: { experience: Experience }) {
  return (
    <section className="border-b-4 border-ink px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
          Where the work happened
        </p>
        <h2 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
          Experience
        </h2>

        <ol className="mt-12 border-l-2 border-ink/15 pl-8">
          {experience.featured.map((role) => (
            <FeaturedRoleBlock key={role.company} role={role} />
          ))}
        </ol>

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
