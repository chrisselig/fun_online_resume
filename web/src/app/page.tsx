import { Hero } from "@/components/Hero";
import { StatsBar } from "@/components/StatsBar";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { EducationCertifications } from "@/components/EducationCertifications";
import { Portfolio } from "@/components/Portfolio";
import { FunFacts } from "@/components/FunFacts";
import { ArcadeGame } from "@/components/ArcadeGame";
import { resume } from "@/lib/resume";

export default function Home() {
  return (
    <main>
      <Hero profile={resume.profile} />
      <StatsBar stats={resume.stats} />
      <ExperienceTimeline experience={resume.experience} />
      <EducationCertifications
        education={resume.education}
        certifications={resume.certifications}
      />
      <Portfolio portfolio={resume.portfolio} />
      <FunFacts facts={resume.fun_facts} />
      <ArcadeGame
        summary={resume.profile.summary}
        featured={resume.experience.featured}
        earlier={resume.experience.earlier}
        earlierRewards={resume.experience.earlier_rewards}
        skills={resume.skills}
      />
      <footer className="brutal-tag px-6 py-8 text-center text-xs font-bold">
        008 / EOF — {resume.profile.name.toUpperCase()}
      </footer>
    </main>
  );
}
