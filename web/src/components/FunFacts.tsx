import { Prompt } from "./Prompt";

export function FunFacts({ facts }: { facts: string[] }) {
  return (
    <section className="px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <Prompt command="grep -r 'TODO\|FIXME\|irrelevant' ./chris" />
        <div className="mt-4 space-y-2 rounded-md border border-border bg-panel p-5">
          {facts.map((fact) => (
            <p key={fact} className="text-sm text-fg/80">
              <span className="text-dim">{"// "}</span>
              {fact}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
