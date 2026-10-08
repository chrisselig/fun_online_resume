import type { CertificationEntry, EducationEntry } from "@/lib/resume";
import { Prompt } from "./Prompt";

export function EducationCertifications({
  education,
  certifications,
}: {
  education: EducationEntry[];
  certifications: CertificationEntry[];
}) {
  return (
    <section className="border-b border-border px-6 py-16 sm:px-10">
      <div className="mx-auto max-w-3xl">
        <Prompt command="ls -la ./education" />
        <div className="mt-4 space-y-3">
          {education.map((ed) => (
            <div key={ed.school} className="flex flex-wrap gap-x-3 text-sm">
              <span className="text-dim">
                {ed.end_year ? ed.end_year : "----"}
              </span>
              <span className="text-accent">{ed.degree}</span>
              <span className="text-fg/80">
                {ed.field_of_study ? `${ed.field_of_study} · ` : ""}
                {ed.school}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Prompt command="pip list --format=columns | grep professional-development" />
          <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-1.5 text-sm">
            {certifications.map((cert, i) => (
              <li key={cert.name} title={cert.authority || undefined}>
                <span className="text-dim">{i + 1}.</span>{" "}
                <span className="text-fg/90">{cert.name}</span>
                {cert.issued_date && (
                  <span className="text-dim"> =={cert.issued_date}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
