import { highlightMetrics } from "@/lib/highlightMetrics";
import type { EarlierRole, Engagement, Experience, FeaturedRole } from "@/lib/resume";

function HighlightedBullet({ text }: { text: string }) {
  return (
    <>
      {highlightMetrics(text).map((segment, i) =>
        segment.highlight ? (
          <span key={i} className="bg-accent text-ink px-0.5 font-bold">
            {segment.text}
          </span>
        ) : (
          <span key={i}>{segment.text}</span>
        ),
      )}
    </>
  );
}

function EngagementCard({ engagement }: { engagement: Engagement }) {
  return (
    <div className="border-4 border-line p-4">
      <p className="flex flex-wrap items-baseline gap-x-2 text-lg font-black uppercase">
        {engagement.client}
        {engagement.former && (
          <span className="brutal-tag border-2 border-line bg-accent px-1 text-[10px] font-bold">
            FORMER
          </span>
        )}
      </p>
      {engagement.role && (
        <p className="brutal-tag text-xs font-bold uppercase">{engagement.role}</p>
      )}
      <ul className="mt-3 space-y-2 font-serif text-sm">
        {engagement.bullets.map((bullet, i) => (
          <li key={bullet} className="flex gap-2">
            <span className="brutal-tag mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border-2 border-line bg-ink text-[9px] font-bold text-paper">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>
              <HighlightedBullet text={bullet} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FeaturedRoleBlock({ role, index }: { role: FeaturedRole; index: number }) {
  return (
    <div className="border-b-8 border-line px-6 py-12 sm:px-10 sm:py-16">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <span className="brutal-tag border-4 border-line bg-ink px-2 py-1 text-xs font-bold text-paper">
          0{index}
        </span>
        <p className="brutal-tag text-sm font-bold">{role.date_range}</p>
      </div>
      <h3 className="mt-4 text-3xl font-black tracking-tighter uppercase sm:text-5xl">
        {role.role}
      </h3>
      <p className="mt-1 inline-block border-b-4 border-line text-lg font-bold">
        {role.company} — {role.location}
      </p>

      {role.summary && (
        <p className="mt-4 max-w-2xl border-l-8 border-line pl-4 font-serif text-base">
          {role.summary}
        </p>
      )}

      {role.bullets.length > 0 && (
        <ul className="mt-4 max-w-2xl space-y-2 font-serif text-base">
          {role.bullets.map((bullet, i) => (
            <li key={bullet} className="flex gap-3">
              <span className="brutal-tag mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 border-line bg-ink text-[10px] font-bold text-paper">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <HighlightedBullet text={bullet} />
              </span>
            </li>
          ))}
        </ul>
      )}

      {role.engagements.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
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
    <div className="border-4 border-line p-4">
      <p className="brutal-tag text-xs font-bold">{role.date_range}</p>
      <h4 className="text-xl font-black uppercase">{role.company}</h4>
      <p className="brutal-tag text-xs font-bold uppercase">{role.role}</p>
      {role.summary && <p className="mt-2 font-serif text-sm">{role.summary}</p>}
      <ul className="mt-3 space-y-2 font-serif text-sm">
        {role.bullets.map((bullet, i) => (
          <li key={bullet} className="flex gap-2">
            <span className="brutal-tag mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border-2 border-line bg-ink text-[9px] font-bold text-paper">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>
              <HighlightedBullet text={bullet} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ExperienceTimeline({ experience }: { experience: Experience }) {
  return (
    <section className="border-b-8 border-line">
      <div className="border-b-8 border-line px-6 py-8 sm:px-10">
        <p className="brutal-tag text-sm font-bold">003 / EXPERIENCE.LOG</p>
        <h2 className="mt-2 text-5xl font-black tracking-tighter uppercase sm:text-7xl">
          Where the work happened
        </h2>
      </div>

      {experience.featured.map((role, i) => (
        <FeaturedRoleBlock key={role.company} role={role} index={i + 1} />
      ))}

      <div className="px-6 py-12 sm:px-10 sm:py-16">
        <p className="brutal-tag text-sm font-bold uppercase">Earlier career</p>
        <div className="mt-6 grid items-start gap-4 sm:grid-cols-2">
          {experience.earlier.map((role) => (
            <EarlierRoleCard key={role.company} role={role} />
          ))}
        </div>
      </div>
    </section>
  );
}
