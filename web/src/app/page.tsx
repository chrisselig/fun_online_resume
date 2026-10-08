import { Hero } from "@/components/Hero";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { SkillsRanked } from "@/components/SkillsRanked";
import { EducationCertifications } from "@/components/EducationCertifications";
import { Portfolio } from "@/components/Portfolio";
import { FunFacts } from "@/components/FunFacts";
import { resume } from "@/lib/resume";

export default function Home() {
  return (
    <main>
      <Hero profile={resume.profile} stats={resume.stats} />
      <ExperienceTimeline experience={resume.experience} />
      <SkillsRanked skills={resume.skills} />
      <EducationCertifications
        education={resume.education}
        certifications={resume.certifications}
      />
      <Portfolio portfolio={resume.portfolio} />
      <FunFacts facts={resume.fun_facts} />
      <footer className="border-t border-rule px-6 py-8 text-center font-mono text-xs text-ink/40">
        {resume.profile.name} · built as a visual resume
      </footer>
    </main>
  );
}
