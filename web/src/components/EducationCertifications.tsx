import type { CertificationEntry, EducationEntry } from "@/lib/resume";

export function EducationCertifications({
  education,
  certifications,
}: {
  education: EducationEntry[];
  certifications: CertificationEntry[];
}) {
  return (
    <section className="border-b-8 border-line px-6 py-16 sm:px-10 sm:py-24">
      <p className="brutal-tag text-sm font-bold">004 / CREDENTIALS.TXT</p>
      <h2 className="mt-2 text-5xl font-black tracking-tighter uppercase sm:text-7xl">
        Education
      </h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {education.map((ed) => (
          <div key={ed.school} className="border-4 border-line p-4">
            {ed.end_year && (
              <p className="brutal-tag text-xs font-bold">{ed.end_year}</p>
            )}
            <h3 className="text-xl font-black uppercase">{ed.degree}</h3>
            <p className="font-serif">
              {ed.field_of_study ? `${ed.field_of_study} · ` : ""}
              {ed.school}
            </p>
          </div>
        ))}
      </div>

      <h2 className="mt-16 text-3xl font-black tracking-tighter uppercase sm:text-5xl">
        Professional Development
      </h2>
      <ul className="mt-6 flex flex-wrap gap-0">
        {certifications.map((cert) => (
          <li
            key={cert.name}
            title={cert.authority || undefined}
            className="brutal-tag -ml-[4px] border-4 border-line px-3 py-1.5 text-xs font-bold first:ml-0"
          >
            {cert.name.toUpperCase()}
            {cert.issued_date && <span className="ml-1.5">[{cert.issued_date}]</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
