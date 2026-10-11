import type { FocusAreaExample, PersonalityTrait, Profile } from "@/lib/resume";
import { PersonalityRadar } from "./PersonalityRadar";

export function Hero({
  profile,
  focusAreaExamples,
  personalityTraits,
}: {
  profile: Profile;
  focusAreaExamples: Record<string, FocusAreaExample[]>;
  personalityTraits: PersonalityTrait[];
}) {
  return (
    <header className="relative border-b-8 border-ink px-6 pt-10 pb-20 sm:px-10 sm:pt-16 sm:pb-28">
      <p className="brutal-tag text-sm font-bold">001 / RESUME.EXE</p>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="relative mt-6 max-w-5xl">
            <h1 className="text-[15vw] leading-[0.82] font-black tracking-tighter uppercase sm:text-8xl md:text-9xl">
              {profile.name.replace(", MBA", "")}
            </h1>
            <span className="brutal-tag absolute top-2 right-0 border-4 border-ink bg-accent px-2 py-1 text-xs font-bold whitespace-nowrap sm:top-4 sm:-right-6 sm:rotate-6">
              MBA
            </span>
          </div>

          <p className="mt-6 inline-block border-4 border-ink bg-ink px-3 py-1 text-xl font-bold text-paper sm:text-2xl">
            {profile.headline}
          </p>

          <p className="mt-8 max-w-2xl border-l-8 border-ink pl-4 font-serif text-lg leading-snug">
            {profile.summary}
          </p>

          <ul className="mt-8 flex flex-wrap gap-0">
            {profile.focus_areas.map((area) => {
              const examples = focusAreaExamples[area];
              return (
                <li key={area} className="-ml-[4px] first:ml-0">
                  {examples ? (
                    <button
                      type="button"
                      className="group relative block border-4 border-ink px-3 py-1 text-left cursor-help"
                    >
                      <span className="brutal-tag text-xs font-bold uppercase">{area} *</span>
                      <div className="invisible absolute top-full left-0 z-10 mt-1 w-72 border-4 border-ink bg-paper p-4 text-left opacity-0 shadow-[8px_8px_0_0_var(--color-ink)] transition-opacity duration-100 group-hover:visible group-hover:opacity-100 group-focus:visible group-focus:opacity-100">
                        <ul className="space-y-3">
                          {examples.map((example) => (
                            <li key={example.client}>
                              <p className="brutal-tag text-xs font-bold uppercase">
                                {example.client}
                              </p>
                              <p className="mt-1 font-serif text-sm text-ink">
                                {example.accomplishment}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </button>
                  ) : (
                    <span className="block border-4 border-ink px-3 py-1">
                      <span className="brutal-tag text-xs font-bold uppercase">{area}</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          <p className="brutal-tag mt-8 text-xs font-bold uppercase">
            Supported business functions
          </p>
          <ul className="mt-2 flex flex-wrap gap-0">
            {profile.business_domains.map((domain) => (
              <li
                key={domain}
                className="brutal-tag bg-ink text-paper -ml-[4px] border-4 border-ink px-3 py-1 text-xs font-bold uppercase first:ml-0"
              >
                {domain}
              </li>
            ))}
          </ul>

          <div className="brutal-tag mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-bold">
            <span>{profile.location.toUpperCase()}</span>
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noreferrer"
                className="brutal-link"
              >
                LINKEDIN.COM/IN/CHRIS-SELIG →
              </a>
            )}
          </div>
        </div>

        <div className="hidden w-full shrink-0 lg:mt-6 lg:block lg:w-72 xl:w-80">
          <PersonalityRadar traits={personalityTraits} />
        </div>
      </div>
    </header>
  );
}
