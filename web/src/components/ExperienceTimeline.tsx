import type {
  EarlierRole,
  Engagement,
  Experience,
  FeaturedRole,
} from "@/lib/resume";
import { Prompt } from "./Prompt";

function Bullets({ bullets }: { bullets: string[] }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {bullets.map((bullet) => (
        <li key={bullet} className="flex gap-2 text-sm text-fg/90">
          <span className="shrink-0 text-accent">{">"}</span>
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
  );
}

function EngagementBlock({ engagement }: { engagement: Engagement }) {
  return (
    <div className="border-l-2 border-accent-dim pl-4">
      <p className="text-sm">
        <span className="text-accent">{engagement.client}</span>
        {engagement.role && <span className="text-dim"> — {engagement.role}</span>}
        {engagement.former && (
          <span className="ml-2 text-xs text-dim">[former client]</span>
        )}
      </p>
      <Bullets bullets={engagement.bullets} />
    </div>
  );
}

function FeaturedRoleBlock({ role }: { role: FeaturedRole }) {
  return (
    <div className="border-l border-border pl-5">
      <p className="text-sm text-dim">
        [{role.date_range}]{" "}
        <span className="text-fg">
          {role.role} @ {role.company}
        </span>
        {role.location && <span className="text-dim"> · {role.location}</span>}
      </p>

      {role.summary && (
        <p className="mt-2 text-sm text-dim">
          <span className="select-none"># </span>
          {role.summary}
        </p>
      )}

      {role.bullets.length > 0 && <Bullets bullets={role.bullets} />}

      {role.engagements.length > 0 && (
        <div className="mt-3 space-y-5">
          {role.engagements.map((engagement) => (
            <EngagementBlock key={engagement.client} engagement={engagement} />
          ))}
        </div>
      )}
    </div>
  );
}

function EarlierRoleLine({ role }: { role: EarlierRole }) {
  return (
    <div className="border-l border-border pl-5">
      <p className="text-sm text-dim">
        [{role.date_range}]{" "}
        <span className="text-fg">
          {role.role} @ {role.company}
        </span>
      </p>
      <p className="mt-1 text-sm text-fg/80">{role.highlight}</p>
    </div>
  );
}

export function ExperienceTimeline({ experience }: { experience: Experience }) {
  return (
    <section className="border-b border-border px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <Prompt command="cat experience.log" />

        <div className="mt-6 space-y-10">
          {experience.featured.map((role) => (
            <FeaturedRoleBlock key={role.company} role={role} />
          ))}
        </div>

        <div className="mt-12">
          <Prompt command="cat earlier_career.log" />
        </div>
        <div className="mt-6 space-y-6">
          {experience.earlier.map((role) => (
            <EarlierRoleLine key={role.company} role={role} />
          ))}
        </div>
      </div>
    </section>
  );
}
