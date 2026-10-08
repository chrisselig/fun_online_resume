import type { ReactNode } from "react";

export function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-rule px-6 py-16 sm:px-12 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-sm text-red">{number}</span>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
