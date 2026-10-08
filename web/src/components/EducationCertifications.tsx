import type { CertificationEntry, EducationEntry } from "@/lib/resume";
import { Section } from "@/components/Section";

export function EducationCertifications({
  education,
  certifications,
}: {
  education: EducationEntry[];
  certifications: CertificationEntry[];
}) {
  return (
    <Section number="03" title="Education">
      <div className="grid gap-8 sm:grid-cols-2">
        {education.map((ed) => (
          <div key={ed.school} className="border-l border-rule pl-5">
            {ed.end_year && (
              <p className="font-mono text-sm text-red">{ed.end_year}</p>
            )}
            <h3 className="font-semibold">{ed.degree}</h3>
            <p className="text-sm text-ink/60">
              {ed.field_of_study ? `${ed.field_of_study} · ` : ""}
              {ed.school}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 border-t border-rule pt-8">
        <p className="font-mono text-xs tracking-[0.2em] text-ink/40 uppercase">
          Professional development
        </p>
        <p className="mt-4 max-w-[70ch] text-sm leading-relaxed text-ink/70">
          {certifications.map((cert, i) => (
            <span key={cert.name}>
              {cert.name}
              {cert.issued_date && (
                <span className="text-ink/40"> ({cert.issued_date})</span>
              )}
              {i < certifications.length - 1 ? (
                <span className="text-red"> · </span>
              ) : null}
            </span>
          ))}
        </p>
      </div>
    </Section>
  );
}
