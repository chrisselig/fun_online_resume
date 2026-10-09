import { INDUSTRIES } from "@/lib/industries";
import { annularSectorPath, sectorMidpoint } from "@/lib/arcs";

const CX = 150;
const CY = 150;
const INNER_R = 24;
const MAX_OUTER_R = 130;
const HUB_R = 130;

export function IndustriesCoxcomb() {
  const maxValue = Math.max(...INDUSTRIES.map((d) => d.value));
  const wedgeAngle = 360 / INDUSTRIES.length;

  return (
    <section className="border-b-4 border-ink bg-navy px-6 py-16 sm:px-10 sm:py-24">
      <div className="mx-auto grid max-w-4xl items-center gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="font-mono text-xs tracking-[0.3em] text-cat-auto uppercase">
            Wedge radius = number of employers / clients
          </p>
          <h2 className="mt-2 text-4xl font-black tracking-tight text-paper sm:text-5xl">
            Industries served
          </h2>
          <p className="mt-4 max-w-md text-paper/80">
            Eighteen years, twelve organizations, four industries — energy
            dominates, but the tooling transfers everywhere.
          </p>
          <ul className="mt-6 space-y-2">
            {INDUSTRIES.map((seg) => (
              <li key={seg.label} className="flex items-center gap-3">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: seg.color }}
                  aria-hidden
                />
                <span className="font-medium text-paper">{seg.label}</span>
                <span className="font-mono text-sm text-paper/50">
                  {seg.value} org{seg.value === 1 ? "" : "s"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <svg
          viewBox="0 0 300 300"
          className="mx-auto w-full max-w-[280px]"
          role="img"
          aria-label="Coxcomb chart of industries served, wedge radius proportional to number of employers and clients"
        >
          <circle cx={CX} cy={CY} r={HUB_R} fill="none" stroke="var(--color-navy-soft)" />
          {INDUSTRIES.map((seg, i) => {
            const outerR = INNER_R + (MAX_OUTER_R - INNER_R) * Math.sqrt(seg.value / maxValue);
            const arc = {
              cx: CX,
              cy: CY,
              innerR: INNER_R,
              outerR,
              startAngle: i * wedgeAngle,
              endAngle: (i + 1) * wedgeAngle,
            };
            const mid = sectorMidpoint(arc);
            return (
              <g key={seg.label}>
                <path
                  d={annularSectorPath(arc)}
                  fill={seg.color}
                  stroke="var(--color-navy)"
                  strokeWidth={2}
                >
                  <title>{`${seg.label} — ${seg.value} organization${seg.value === 1 ? "" : "s"}`}</title>
                </path>
                <text
                  x={mid.x}
                  y={mid.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-navy text-[10px] font-bold uppercase"
                >
                  {seg.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
