import type { CertificationEntry, EducationEntry } from "@/lib/resume";

export function EducationCertifications({
  education,
  certifications,
}: {
  education: EducationEntry[];
  certifications: CertificationEntry[];
}) {
  return (
    <section className="border-b-4 border-ink bg-paper px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <div>
          <p className="font-mono text-xs tracking-[0.3em] text-cat-platform uppercase">
            Foundation
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight">Education</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {education.map((ed) => (
              <div
                key={ed.school}
                className="border-l-4 pl-4"
                style={{ borderColor: "var(--color-cat-platform)" }}
              >
                {ed.end_year && (
                  <p className="font-mono text-sm text-ink/60">{ed.end_year}</p>
                )}
                <h3 className="text-lg font-bold">{ed.degree}</h3>
                <p className="text-ink/80">
                  {ed.field_of_study ? `${ed.field_of_study} · ` : ""}
                  {ed.school}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <p className="font-mono text-xs tracking-[0.3em] text-cat-auto uppercase">
            Never stopped learning
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-tight">
            Professional Development
          </h2>
          <ul className="mt-8 flex flex-wrap gap-2">
            {certifications.map((cert) => (
              <li
                key={cert.name}
                title={cert.authority || undefined}
                className="rounded-full border-2 px-3 py-1.5 text-sm font-medium"
                style={{ borderColor: "var(--color-cat-auto)", color: "var(--color-cat-auto)" }}
              >
                {cert.name}
                {cert.issued_date && (
                  <span className="ml-1.5 font-mono text-xs text-ink/50">
                    {cert.issued_date}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
