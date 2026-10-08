import type { Profile, Stat } from "@/lib/resume";

export function Hero({ profile, stats }: { profile: Profile; stats: Stat[] }) {
  return (
    <header className="border-b border-rule px-6 py-20 sm:px-12 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs tracking-[0.25em] text-red uppercase">
          Résumé
        </p>
        <h1 className="mt-6 text-6xl leading-[0.95] font-semibold tracking-tight sm:text-8xl">
          Chris Selig
        </h1>
        <p className="mt-6 max-w-xl text-xl text-ink/70">{profile.headline}</p>

        <div className="mt-12 grid gap-10 sm:grid-cols-[2fr_1fr]">
          <p className="max-w-[60ch] text-base leading-relaxed text-ink/80">
            {profile.summary}
          </p>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-l border-rule pl-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-xs text-ink/50">{stat.label}</dt>
                <dd className="font-mono text-2xl text-red">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-rule pt-6 font-mono text-sm text-ink/60">
          <span>{profile.location}</span>
          {profile.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="text-ink underline decoration-red decoration-2 underline-offset-4 hover:text-red"
            >
              LinkedIn ↗
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
