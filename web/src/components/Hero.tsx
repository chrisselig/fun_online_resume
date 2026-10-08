import type { Profile } from "@/lib/resume";
import { Prompt } from "./Prompt";

export function Hero({ profile }: { profile: Profile }) {
  return (
    <header className="border-b border-border px-6 py-16 sm:px-10 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="overflow-hidden rounded-md border border-border bg-panel shadow-[0_0_40px_-10px_rgba(61,220,106,0.15)]">
          <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-dim/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-dim/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-dim/40" />
            <span className="ml-3 text-xs text-dim">chris@resume: ~</span>
          </div>
          <div className="p-6 sm:p-8">
            <Prompt command="whoami" />
            <h1 className="mt-2 text-3xl font-bold text-accent sm:text-4xl">
              {profile.name}
            </h1>
            <p className="mt-1 text-lg text-fg">{profile.headline}</p>

            <p className="mt-6 text-sm">
              <span className="text-dim"># </span>
              <span className="text-dim">{"summary.txt"}</span>
            </p>
            <p className="mt-2 max-w-2xl leading-relaxed text-fg/90">
              {profile.summary}
            </p>

            <p className="mt-6 text-sm">
              <span className="text-dim">$ </span>
              <span className="text-fg">export FOCUS=(</span>
            </p>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 pl-4">
              {profile.focus_areas.map((area) => (
                <li key={area} className="text-sm text-accent">
                  &quot;{area}&quot;
                </li>
              ))}
            </ul>
            <p className="text-sm text-fg">)</p>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-dim">
              <span>{profile.location}</span>
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent underline decoration-accent-dim underline-offset-4 hover:text-fg"
                >
                  linkedin ↗
                </a>
              )}
            </div>

            <p className="mt-6">
              <span className="text-dim">$ </span>
              <span className="cursor" aria-hidden />
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
