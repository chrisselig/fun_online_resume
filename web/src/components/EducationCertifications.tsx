import type { CertificationEntry, EducationEntry } from "@/lib/resume";

export function EducationCertifications({
  education,
  certifications,
}: {
  education: EducationEntry[];
  certifications: CertificationEntry[];
}) {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {education.map((ed) => (
          <div key={ed.school} className="rounded-md border border-border p-4">
            {ed.end_year && (
              <p className="font-mono text-xs text-muted">{ed.end_year}</p>
            )}
            <h3 className="text-sm font-semibold text-ink">{ed.degree}</h3>
            <p className="text-sm text-muted">
              {ed.field_of_study ? `${ed.field_of_study} · ` : ""}
              {ed.school}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-border pt-6">
        <p className="text-xs font-semibold tracking-wide text-muted uppercase">
          Professional development
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {certifications.map((cert) => (
            <li
              key={cert.name}
              title={cert.authority || undefined}
              className="rounded-full border border-border px-3 py-1 text-xs font-medium text-ink"
            >
              {cert.name}
              {cert.issued_date && (
                <span className="ml-1.5 font-mono text-[10px] text-muted">
                  {cert.issued_date}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
