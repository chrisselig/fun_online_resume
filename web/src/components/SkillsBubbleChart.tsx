import type { SkillEntry } from "@/lib/resume";
import { packCircles, packedBounds } from "@/lib/circlePack";

export function SkillsBubbleChart({ skills }: { skills: SkillEntry[] }) {
  const sorted = [...skills].sort((a, b) => b.endorsements - a.endorsements);
  const circles = packCircles(
    sorted.map((s) => s.endorsements),
    { minRadius: 26, maxRadius: 92 },
  );
  const bounds = packedBounds(circles);
  const topEndorsements = sorted[0]?.endorsements ?? 0;

  return (
    <section className="border-b-4 border-ink px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
          Sized by how often it shows up across 18 years of real work
        </p>
        <h2 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
          Tools of the trade
        </h2>
        <svg
          viewBox={`${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`}
          className="mx-auto mt-10 w-full max-w-2xl"
          role="img"
          aria-label="Tools sized by frequency of mention across the career history"
        >
          {circles.map((c, i) => {
            const skill = sorted[i];
            const isTop = skill.endorsements === topEndorsements;
            const fontSize = Math.max(9, c.r * 0.22);
            return (
              <g key={skill.name}>
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={c.r}
                  className="fill-navy"
                  stroke={isTop ? "var(--color-accent)" : "none"}
                  strokeWidth={isTop ? 3 : 0}
                >
                  <title>{`${skill.name} — mentioned ${skill.endorsements} times`}</title>
                </circle>
                <text
                  x={c.x}
                  y={c.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-ink font-sans font-semibold"
                  style={{ fontSize }}
                >
                  {skill.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
