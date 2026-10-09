import type { Profile } from "@/lib/resume";

export function Hero({ profile }: { profile: Profile }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-ink">{profile.name}</h1>
      <p className="mt-1 text-lg font-medium text-primary">
        {profile.headline}
      </p>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
        {profile.summary}
      </p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {profile.focus_areas.map((area) => (
          <li
            key={area}
            className="rounded-full bg-canvas px-3 py-1 text-xs font-medium text-ink"
          >
            {area}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
        <span>{profile.location}</span>
        {profile.linkedin_url && (
          <a
            href={profile.linkedin_url}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-primary hover:underline"
          >
            LinkedIn ↗
          </a>
        )}
      </div>
    </div>
  );
}
