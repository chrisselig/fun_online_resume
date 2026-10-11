"use client";

import { useState } from "react";
import type { PersonalityTrait } from "@/lib/resume";
import { axisLines, computeRadarPoints, gridRingPoints, polygonPoints } from "@/lib/personalityRadar";

const SIZE = 260;
const LABEL_OFFSET = 42;
const PADDING = SIZE / 2 + LABEL_OFFSET + 100;
const VIEWBOX = PADDING * 2;
const OFFSET = PADDING - SIZE / 2;

/** Breaks a label onto two lines (near its midpoint) once it gets too long to fit on one. */
function splitLabel(label: string, maxLen = 10): string[] {
  if (label.length <= maxLen) return [label];
  const words = label.split(" ");
  if (words.length < 2) return [label];

  let bestIdx = 1;
  let bestDiff = Infinity;
  let acc = words[0];
  for (let i = 1; i < words.length; i++) {
    const diff = Math.abs(acc.length - (label.length - acc.length));
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i;
    }
    acc += ` ${words[i]}`;
  }
  return [words.slice(0, bestIdx).join(" "), words.slice(bestIdx).join(" ")];
}

export function PersonalityRadar({ traits }: { traits: PersonalityTrait[] }) {
  const [selected, setSelected] = useState(0);
  const points = computeRadarPoints(traits, SIZE, LABEL_OFFSET);
  const active = traits[selected];

  return (
    <div className="border-4 border-line bg-paper p-4">
      <p className="brutal-tag text-xs font-bold uppercase">Personality.dat</p>

      <svg
        viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
        className="mt-2 w-full"
        role="img"
        aria-label="Interactive radar chart of self-reported personality traits — click a point for details"
      >
        <g transform={`translate(${OFFSET}, ${OFFSET})`}>
          {[0.33, 0.66, 1].map((fraction) => (
            <polygon
              key={fraction}
              points={gridRingPoints(traits.length, SIZE, fraction)}
              fill="none"
              stroke="var(--color-ink)"
              strokeOpacity={0.15}
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
              strokeOpacity={0.15}
              strokeWidth={1}
            />
          ))}

          <polygon
            points={polygonPoints(points)}
            fill="var(--color-accent)"
            fillOpacity={0.55}
            stroke="var(--color-ink)"
            strokeWidth={2}
          />

          {points.map((p, i) => {
            const lines = splitLabel(p.trait);
            return (
              <text
                key={`label-${p.trait}`}
                x={p.labelX}
                y={p.labelY}
                textAnchor={p.anchor}
                dominantBaseline="central"
                className={`brutal-tag pointer-events-none select-none text-[9px] font-bold uppercase ${
                  i === selected ? "fill-ink" : "fill-ink/55"
                }`}
              >
                {lines.map((line, li) => (
                  <tspan
                    key={li}
                    x={p.labelX}
                    dy={li === 0 ? (lines.length > 1 ? "-0.5em" : "0") : "1.1em"}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            );
          })}

          {points.map((p, i) => (
            <g
              key={p.trait}
              role="button"
              tabIndex={0}
              aria-label={`${p.trait}, ${p.value} out of 100`}
              aria-pressed={i === selected}
              className="cursor-pointer outline-none"
              onClick={() => setSelected(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(i);
                }
              }}
            >
              <circle cx={p.x} cy={p.y} r={16} fill="transparent" />
              <circle
                cx={p.x}
                cy={p.y}
                r={i === selected ? 7 : 4}
                fill={i === selected ? "var(--color-accent)" : "var(--color-ink)"}
                stroke="var(--color-ink)"
                strokeWidth={i === selected ? 2 : 0}
              />
            </g>
          ))}
        </g>
      </svg>

      <div className="mt-3 min-h-20 border-t-4 border-line pt-3">
        <p className="brutal-tag text-xs font-bold uppercase">
          {active.trait} · {active.value}
        </p>
        <p className="mt-1 font-serif text-sm">
          {active.link ?? "Self-assessed. No case study for this one — yet."}
        </p>
      </div>

      <p className="brutal-tag text-ink/50 mt-2 text-[10px] uppercase">
        Click a point for the receipts
      </p>
    </div>
  );
}
