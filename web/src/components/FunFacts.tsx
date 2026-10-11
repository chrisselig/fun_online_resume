export function FunFacts({ facts }: { facts: string[] }) {
  const rotations = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-2"];

  return (
    <section className="bg-accent px-6 py-16 sm:px-10 sm:py-24">
      <p className="brutal-tag text-sm font-bold">007 / OFF_TOPIC.TXT</p>
      <h2 className="mt-2 max-w-3xl text-5xl font-black tracking-tighter uppercase sm:text-7xl">
        Skills that won&apos;t make the cut anywhere else
      </h2>
      <ul className="mt-12 grid gap-8 sm:grid-cols-2">
        {facts.map((fact, i) => (
          <li
            key={fact}
            className={`border-4 border-line bg-paper p-5 font-serif text-lg ${rotations[i % rotations.length]}`}
          >
            {fact}
          </li>
        ))}
      </ul>
    </section>
  );
}
