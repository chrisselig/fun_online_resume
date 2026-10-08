import type { EarlierRole, Engagement, Experience, FeaturedRole } from "@/lib/resume";
import { Section } from "@/components/Section";

function EngagementRow({ engagement }: { engagement: Engagement }) {
  return (
    <div className="border-l border-rule pl-5">
      <p className="flex flex-wrap items-baseline gap-x-2 text-sm font-semibold">
        {engagement.client}
        {engagement.former && (
          <span className="font-mono text-[11px] font-normal text-ink/40 uppercase">
            former
          </span>
        )}
      </p>
      {engagement.role && (
        <p className="text-sm text-ink/50 italic">{engagement.role}</p>
      )}
      <ul className="mt-2 space-y-1.5 text-sm text-ink/75">
        {engagement.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </div>
  );
}

function FeaturedRoleBlock({ role }: { role: FeaturedRole }) {
  return (
    <article className="border-t border-rule py-10 first:border-t-0 first:pt-0">
      <div className="grid gap-x-8 gap-y-2 sm:grid-cols-[10rem_1fr]">
        <p className="font-mono text-sm text-red">{role.date_range}</p>
        <div>
          <h3 className="text-xl font-semibold">{role.role}</h3>
          <p className="text-ink/60">
            {role.company}
            {role.location ? ` · ${role.location}` : ""}
          </p>

          {role.summary && (
            <p className="mt-3 max-w-[60ch] text-ink/75">{role.summary}</p>
          )}

          {role.bullets.length > 0 && (
            <ul className="mt-3 max-w-[60ch] space-y-1.5 text-ink/75">
              {role.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          )}

          {role.engagements.length > 0 && (
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {role.engagements.map((engagement) => (
                <EngagementRow key={engagement.client} engagement={engagement} />
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function EarlierRow({ role }: { role: EarlierRole }) {
  return (
    <div className="grid gap-x-8 gap-y-1 border-t border-rule py-5 sm:grid-cols-[10rem_1fr]">
      <p className="font-mono text-sm text-ink/40">{role.date_range}</p>
      <div>
        <p className="font-semibold">
          {role.company} <span className="font-normal text-ink/50">— {role.role}</span>
        </p>
        <p className="mt-1 max-w-[60ch] text-sm text-ink/70">{role.highlight}</p>
      </div>
    </div>
  );
}

export function ExperienceTimeline({ experience }: { experience: Experience }) {
  return (
    <Section number="01" title="Experience">
      <div>{experience.featured.map((role) => (
        <FeaturedRoleBlock key={role.company} role={role} />
      ))}</div>

      <div className="mt-12">
        <p className="font-mono text-xs tracking-[0.2em] text-ink/40 uppercase">
          Earlier career
        </p>
        {experience.earlier.map((role) => (
          <EarlierRow key={role.company} role={role} />
        ))}
      </div>
    </Section>
  );
}
