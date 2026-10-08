import { Section } from "@/components/Section";

export function FunFacts({ facts }: { facts: string[] }) {
  return (
    <Section number="05" title="Technically irrelevant">
      <ol className="space-y-5">
        {facts.map((fact, i) => (
          <li key={fact} className="flex gap-4 text-ink/75 italic">
            <span className="font-mono text-xs text-red not-italic">
              {String(i + 1).padStart(2, "0")}
            </span>
            {fact}
          </li>
        ))}
      </ol>
    </Section>
  );
}
