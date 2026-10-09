import { Hero } from "@/components/Hero";
import { ExperienceTimeline } from "@/components/ExperienceTimeline";
import { EducationCertifications } from "@/components/EducationCertifications";
import { Portfolio } from "@/components/Portfolio";
import { FunFacts } from "@/components/FunFacts";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { KpiRow } from "@/components/dashboard/KpiRow";
import { ToolsBarChart } from "@/components/dashboard/ToolsBarChart";
import { Panel } from "@/components/dashboard/Panel";
import { resume } from "@/lib/resume";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar name={resume.profile.name} />

      <main className="min-w-0 flex-1">
        <Topbar />

        <div className="mx-auto max-w-5xl space-y-6 px-6 py-8 sm:px-10">
          <KpiRow stats={resume.stats} />

          <Panel id="profile" eyebrow="Overview" title="Profile">
            <Hero profile={resume.profile} />
          </Panel>

          <Panel
            id="skills"
            eyebrow="Mentions · last 18 years"
            title="Tools & Technologies"
          >
            <ToolsBarChart skills={resume.skills} />
          </Panel>

          <Panel id="experience" eyebrow="Timeline" title="Experience">
            <ExperienceTimeline experience={resume.experience} />
          </Panel>

          <Panel id="education" eyebrow="Credentials" title="Education">
            <EducationCertifications
              education={resume.education}
              certifications={resume.certifications}
            />
          </Panel>

          <Panel id="portfolio" eyebrow="Links out" title="Portfolio">
            <Portfolio portfolio={resume.portfolio} />
          </Panel>

          <Panel eyebrow="Technically irrelevant" title="Notes">
            <FunFacts facts={resume.fun_facts} />
          </Panel>

          <footer className="py-6 text-center text-xs text-muted">
            {resume.profile.name} · rendered as a dashboard, because why not
          </footer>
        </div>
      </main>
    </div>
  );
}
