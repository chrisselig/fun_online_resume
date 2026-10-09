import type { Profile } from "@/lib/resume";

const TAG_COLORS = [
  "var(--color-cat-lang)",
  "var(--color-cat-bi)",
  "var(--color-cat-platform)",
  "var(--color-cat-auto)",
];

export function Hero({ profile }: { profile: Profile }) {
  return (
    <header className="border-b-4 border-ink px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-xs tracking-[0.3em] text-cat-lang uppercase">
          A visual resume, maximalist edition
        </p>
        <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-7xl">
          {profile.name}
        </h1>
        <p className="mt-4 max-w-2xl text-xl font-medium text-cat-platform sm:text-2xl">
          {profile.headline}
        </p>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/80">
          {profile.summary}
        </p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {profile.focus_areas.map((area, i) => {
            const color = TAG_COLORS[i % TAG_COLORS.length];
            return (
              <li
                key={area}
                className="rounded-full border-2 px-3 py-1 font-mono text-xs font-semibold uppercase"
                style={{ borderColor: color, color }}
              >
                {area}
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-sm text-ink/70">
          <span>{profile.location}</span>
          {profile.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="text-cat-lang underline decoration-2 underline-offset-4 hover:text-ink"
            >
              LinkedIn ↗
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
