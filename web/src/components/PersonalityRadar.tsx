import type { PersonalityTrait } from "@/lib/resume";
import { axisLines, computeRadarPoints, gridRingPoints, polygonPoints } from "@/lib/personalityRadar";

const SIZE = 240;
const LABEL_OFFSET = 50;
const PADDING = SIZE / 2 + LABEL_OFFSET + 120;
const VIEWBOX = PADDING * 2;
const OFFSET = PADDING - SIZE / 2;

export function PersonalityRadar({ traits }: { traits: PersonalityTrait[] }) {
  const points = computeRadarPoints(traits, SIZE, LABEL_OFFSET);

  return (
    <section className="border-b-8 border-ink bg-paper px-6 py-16 sm:px-10 sm:py-24">
      <p className="brutal-tag text-sm font-bold">007 / PERSONALITY.DAT</p>
      <h2 className="mt-2 text-5xl font-black tracking-tighter uppercase sm:text-7xl">
        Self-reported, not audited
      </h2>
      <p className="mt-3 max-w-2xl font-serif text-lg">
        Pulled straight from an old personality quiz I never deleted. Take it exactly as
        seriously as the arcade high scores below.
      </p>

      <div className="mt-12 flex justify-center">
        <svg
          viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
          className="w-full max-w-xl"
          role="img"
          aria-label="Radar chart of self-reported personality traits"
        >
          <g transform={`translate(${OFFSET}, ${OFFSET})`}>
            {[0.25, 0.5, 0.75, 1].map((fraction) => (
              <polygon
                key={fraction}
                points={gridRingPoints(traits.length, SIZE, fraction)}
                fill="none"
                stroke="var(--color-ink)"
                strokeOpacity={0.2}
                strokeWidth={1}
              />
            ))}

            {axisLines(traits.length, SIZE).map((line, i) => (
              <line
                key={i}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="var(--color-ink)"
                strokeOpacity={0.2}
                strokeWidth={1}
              />
            ))}

            <polygon
              points={polygonPoints(points)}
              fill="var(--color-accent)"
              fillOpacity={0.55}
              stroke="var(--color-ink)"
              strokeWidth={3}
            />

            {points.map((p) => (
              <circle key={p.trait} cx={p.x} cy={p.y} r={4} fill="var(--color-ink)" />
            ))}

            {points.map((p) => (
              <text
                key={p.trait}
                x={p.labelX}
                y={p.labelY}
                textAnchor={p.anchor}
                dominantBaseline="middle"
                className="brutal-tag fill-ink text-[10px] font-bold uppercase"
              >
                {p.trait} · {p.value}
              </text>
            ))}
          </g>
        </svg>
      </div>
    </section>
  );
}
