import type { Profile } from "@/lib/resume";

export function Hero({ profile }: { profile: Profile }) {
  return (
    <header className="relative border-b-8 border-ink px-6 pt-10 pb-20 sm:px-10 sm:pt-16 sm:pb-28">
      <p className="brutal-tag text-sm font-bold">001 / RESUME.EXE</p>

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
        {profile.focus_areas.map((area) => (
          <li
            key={area}
            className="brutal-tag -ml-[4px] border-4 border-ink px-3 py-1 text-xs font-bold uppercase first:ml-0"
          >
            {area}
          </li>
        ))}
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
          <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="brutal-link">
            LINKEDIN.COM/IN/CHRIS-SELIG →
          </a>
        )}
      </div>
    </header>
  );
}
