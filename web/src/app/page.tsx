import { Hero } from "@/components/Hero";
import { StatsBar } from "@/components/StatsBar";
import { SkillsBarChart } from "@/components/SkillsBarChart";
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
      <SkillsBarChart skills={resume.skills} />
      <ExperienceTimeline experience={resume.experience} />
      <EducationCertifications
        education={resume.education}
        certifications={resume.certifications}
      />
      <Portfolio portfolio={resume.portfolio} />
      <FunFacts facts={resume.fun_facts} />
      <footer className="brutal-tag px-6 py-8 text-center text-xs font-bold">
        008 / EOF — {resume.profile.name.toUpperCase()}
      </footer>
    </main>
  );
}
