import type { Profile } from "@/lib/resume";

export function Hero({ profile }: { profile: Profile }) {
  return (
    <header className="border-b-4 border-ink px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
          A visual resume
        </p>
        <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-7xl">
          {profile.name}
        </h1>
        <p className="mt-4 max-w-2xl text-xl font-medium text-navy sm:text-2xl">
          {profile.headline}
        </p>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/80">
          {profile.summary}
        </p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {profile.focus_areas.map((area) => (
            <li
              key={area}
              className="rounded-full border-2 border-navy px-3 py-1 font-mono text-xs font-semibold text-navy uppercase"
            >
              {area}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-sm text-ink/70">
          <span>{profile.location}</span>
          {profile.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="text-accent underline decoration-2 underline-offset-4 hover:text-ink"
            >
              LinkedIn ↗
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
