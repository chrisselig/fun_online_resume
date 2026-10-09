import type { SkillEntry } from "@/lib/resume";
import { groupByCategory } from "@/lib/toolCategories";
import { annularSectorPath, sectorMidpoint, type AnnularSector } from "@/lib/arcs";

const CX = 220;
const CY = 220;
const INNER_R = 60;
const RING_GAP = 4;
const CATEGORY_RING = [INNER_R, INNER_R + 46] as const;
const TOOL_RING = [CATEGORY_RING[1] + RING_GAP, CATEGORY_RING[1] + RING_GAP + 90] as const;

interface ToolArc {
  skill: SkillEntry;
  arc: AnnularSector;
}

export function ToolsSunburst({ skills }: { skills: SkillEntry[] }) {
  const groups = groupByCategory(skills);
  const total = groups.reduce((sum, g) => sum + g.total, 0);

  const categoryArcs = groups.reduce<
    { group: (typeof groups)[number]; arc: AnnularSector; toolArcs: ToolArc[] }[]
  >((acc, group) => {
    const angleCursor = acc.length > 0 ? acc[acc.length - 1].arc.endAngle : 0;
    const span = (group.total / total) * 360;
    const arc: AnnularSector = {
      cx: CX,
      cy: CY,
      innerR: CATEGORY_RING[0],
      outerR: CATEGORY_RING[1],
      startAngle: angleCursor,
      endAngle: angleCursor + span,
    };

    const toolArcs = group.skills.reduce<ToolArc[]>((toolAcc, skill) => {
      const toolAngleCursor =
        toolAcc.length > 0 ? toolAcc[toolAcc.length - 1].arc.endAngle : angleCursor;
      const toolSpan = (skill.endorsements / group.total) * span;
      const toolArc: AnnularSector = {
        cx: CX,
        cy: CY,
        innerR: TOOL_RING[0],
        outerR: TOOL_RING[1],
        startAngle: toolAngleCursor,
        endAngle: toolAngleCursor + toolSpan,
      };
      return [...toolAcc, { skill, arc: toolArc }];
    }, []);

    return [...acc, { group, arc, toolArcs }];
  }, []);

  return (
    <section className="border-b-4 border-ink bg-paper px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs tracking-[0.3em] text-cat-lang uppercase">
          Inner ring: category · outer ring: tool, sized by real mentions
        </p>
        <h2 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
          Tools of the trade
        </h2>

        <div className="mt-10 grid gap-10 lg:grid-cols-[440px_1fr]">
          <svg
            viewBox="0 0 440 440"
            className="mx-auto w-full max-w-md"
            role="img"
            aria-label="Sunburst chart of tools grouped by category, sized by frequency of mention across 18 years of work"
          >
            {categoryArcs.map(({ group, arc, toolArcs }) => (
              <g key={group.key}>
                <path d={annularSectorPath(arc)} fill={group.color} opacity={0.9} />
                {toolArcs.map(({ skill, arc: toolArc }, i) => (
                  <path
                    key={skill.name}
                    d={annularSectorPath(toolArc)}
                    fill={group.color}
                    opacity={0.55 + 0.15 * (i % 2)}
                    stroke="var(--color-paper)"
                    strokeWidth={1.5}
                  >
                    <title>{`${skill.name} — mentioned ${skill.endorsements} times`}</title>
                  </path>
                ))}
                {(() => {
                  const mid = sectorMidpoint(arc);
                  return (
                    <text
                      x={mid.x}
                      y={mid.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-paper text-[11px] font-bold uppercase"
                    >
                      {group.label.split(" ")[0]}
                    </text>
                  );
                })()}
              </g>
            ))}
          </svg>

          <ul className="grid content-start gap-3 sm:grid-cols-2">
            {groups.map((group) => (
              <li key={group.key}>
                <p
                  className="font-mono text-xs font-bold tracking-wide uppercase"
                  style={{ color: group.color }}
                >
                  {group.label}
                </p>
                <ul className="mt-1 space-y-0.5 text-sm text-ink/80">
                  {group.skills.map((skill) => (
                    <li key={skill.name} className="flex justify-between gap-2">
                      <span>{skill.name}</span>
                      <span className="font-mono text-ink/40">{skill.endorsements}×</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
