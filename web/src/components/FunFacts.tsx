const CARD_COLORS = [
  "var(--color-cat-lang)",
  "var(--color-cat-bi)",
  "var(--color-cat-auto)",
  "var(--color-cat-platform)",
];

export function FunFacts({ facts }: { facts: string[] }) {
  return (
    <section className="bg-navy px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-xs tracking-[0.3em] text-cat-auto uppercase">
          Technically irrelevant
        </p>
        <h2 className="mt-2 text-4xl font-black tracking-tight text-paper sm:text-5xl">
          Skills that won&apos;t make the cut anywhere else
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {facts.map((fact, i) => (
            <li
              key={fact}
              className="border-2 bg-navy-soft/40 p-5 text-paper"
              style={{ borderColor: CARD_COLORS[i % CARD_COLORS.length] }}
            >
              {fact}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
