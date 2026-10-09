import type { EarlierRole, Engagement, Experience, FeaturedRole } from "@/lib/resume";

function EngagementCard({ engagement }: { engagement: Engagement }) {
  return (
    <div className="rounded-md border border-border bg-canvas p-4">
      <p className="flex flex-wrap items-baseline gap-x-2 text-sm font-semibold text-ink">
        {engagement.client}
        {engagement.former && (
          <span className="rounded-full bg-border px-2 py-0.5 text-[10px] font-normal text-muted uppercase">
            former client
          </span>
        )}
      </p>
      {engagement.role && (
        <p className="text-xs font-medium text-primary">{engagement.role}</p>
      )}
      <ul className="mt-2 space-y-1 text-xs text-muted">
        {engagement.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2">
            <span className="shrink-0 text-primary">·</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FeaturedRoleCard({ role }: { role: FeaturedRole }) {
  return (
    <div className="rounded-lg border border-border p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-semibold text-ink">{role.role}</h3>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 font-mono text-xs font-medium text-primary">
          {role.date_range}
        </span>
      </div>
      <p className="text-sm text-muted">
        {role.company}
        {role.location ? ` · ${role.location}` : ""}
      </p>

      {role.summary && (
        <p className="mt-3 text-sm text-ink/80">{role.summary}</p>
      )}

      {role.bullets.length > 0 && (
        <ul className="mt-3 space-y-1.5 text-sm text-ink/80">
          {role.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <span className="shrink-0 text-primary">·</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}

      {role.engagements.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {role.engagements.map((engagement) => (
            <EngagementCard key={engagement.client} engagement={engagement} />
          ))}
        </div>
      )}
    </div>
  );
}

function EarlierRoleRow({ role }: { role: EarlierRole }) {
  return (
    <div className="flex flex-col gap-1 border-t border-border py-3 first:border-t-0 sm:flex-row sm:items-baseline sm:gap-4">
      <span className="w-28 shrink-0 font-mono text-xs text-muted">
        {role.date_range}
      </span>
      <div className="flex-1">
        <span className="font-semibold text-ink">{role.company}</span>
        <span className="text-sm text-muted"> · {role.role}</span>
        <p className="mt-0.5 text-sm text-ink/70">{role.highlight}</p>
      </div>
    </div>
  );
}

export function ExperienceTimeline({ experience }: { experience: Experience }) {
  return (
    <div>
      <div className="space-y-5">
        {experience.featured.map((role) => (
          <FeaturedRoleCard key={role.company} role={role} />
        ))}
      </div>

      <div className="mt-6">
        <p className="text-xs font-semibold tracking-wide text-muted uppercase">
          Earlier career
        </p>
        <div className="mt-2">
          {experience.earlier.map((role) => (
            <EarlierRoleRow key={role.company} role={role} />
          ))}
        </div>
      </div>
    </div>
  );
}
