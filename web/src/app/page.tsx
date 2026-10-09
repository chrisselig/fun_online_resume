import { Hero } from "@/components/Hero";
import { StatsBar } from "@/components/StatsBar";
import { ToolsSunburst } from "@/components/ToolsSunburst";
import { CareerArcs } from "@/components/CareerArcs";
import { IndustriesCoxcomb } from "@/components/IndustriesCoxcomb";
import { EducationCertifications } from "@/components/EducationCertifications";
import { Portfolio } from "@/components/Portfolio";
import { FunFacts } from "@/components/FunFacts";
import { resume } from "@/lib/resume";

export default function Home() {
  return (
    <main>
      <Hero profile={resume.profile} />
      <StatsBar stats={resume.stats} />
      <ToolsSunburst skills={resume.skills} />
      <CareerArcs experience={resume.experience} />
      <IndustriesCoxcomb />
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
