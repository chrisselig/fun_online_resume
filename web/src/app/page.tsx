import { Hero } from "@/components/Hero";
import { StatsBar } from "@/components/StatsBar";
import { SkillsBubbleChart } from "@/components/SkillsBubbleChart";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { EducationCertifications } from "@/components/EducationCertifications";
import { Portfolio } from "@/components/Portfolio";
import { FunFacts } from "@/components/FunFacts";
import { resume } from "@/lib/resume";

export default function Home() {
  return (
    <main>
      <Hero profile={resume.profile} />
      <StatsBar stats={resume.stats} />
      <SkillsBubbleChart skills={resume.skills} />
      <ExperienceTimeline experience={resume.experience} />
      <EducationCertifications
        education={resume.education}
        certifications={resume.certifications}
      />
      <Portfolio portfolio={resume.portfolio} />
      <FunFacts facts={resume.fun_facts} />
      <footer className="border-t-4 border-ink px-6 py-8 text-center font-mono text-xs text-ink/50">
        {resume.profile.name} · built as a visual resume
      </footer>
    </main>
  );
}
