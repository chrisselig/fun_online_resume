import type { ReactNode } from "react";

export function Panel({
  id,
  title,
  eyebrow,
  children,
}: {
  id?: string;
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-20 rounded-lg border border-border bg-panel p-6 shadow-[0_1px_2px_rgba(0,0,0,0.06)] sm:p-8"
    >
      {eyebrow && (
        <p className="font-mono text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-1 text-xl font-semibold text-ink">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}
