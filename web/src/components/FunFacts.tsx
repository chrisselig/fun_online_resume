export function FunFacts({ facts }: { facts: string[] }) {
  return (
    <section className="bg-navy px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
          Technically irrelevant
        </p>
        <h2 className="mt-2 text-4xl font-black tracking-tight text-ink sm:text-5xl">
          Skills that won&apos;t make the cut anywhere else
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {facts.map((fact) => (
            <li
              key={fact}
              className="border-2 border-navy-soft bg-navy-soft/40 p-5 text-ink"
            >
              {fact}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
