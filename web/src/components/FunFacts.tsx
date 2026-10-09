export function FunFacts({ facts }: { facts: string[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {facts.map((fact) => (
        <li
          key={fact}
          className="rounded-md border-l-4 border-gold bg-canvas p-4 text-sm text-ink/80"
        >
          {fact}
        </li>
      ))}
    </ul>
  );
}
