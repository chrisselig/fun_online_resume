/** Shared polar-geometry helpers for the sunburst and nested career-arc charts. */

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

export interface AnnularSector {
  cx: number;
  cy: number;
  innerR: number;
  outerR: number;
  /** Degrees, 0 = top (12 o'clock), increasing clockwise. */
  startAngle: number;
  endAngle: number;
}

/** SVG path `d` for a donut-segment (annular sector) — the primitive behind
 * both the tools sunburst (wedges) and the career arcs (full-width bands). */
export function annularSectorPath(sector: AnnularSector): string {
  const { cx, cy, innerR, outerR, startAngle, endAngle } = sector;

  // A single SVG arc command can't sweep a full 360°: start and end points
  // coincide, so the arc degenerates to ~0° instead of a full ring. Split
  // into two halves whenever the sweep is a full (or near-full) circle.
  if (endAngle - startAngle >= 359.99) {
    const mid = startAngle + (endAngle - startAngle) / 2;
    return [
      annularSectorPath({ ...sector, endAngle: mid }),
      annularSectorPath({ ...sector, startAngle: mid }),
    ].join(" ");
  }

  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  const outerStart = polarToCartesian(cx, cy, outerR, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerR, endAngle);
  const innerEnd = polarToCartesian(cx, cy, innerR, endAngle);
  const innerStart = polarToCartesian(cx, cy, innerR, startAngle);
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

/** Midpoint of an annular sector, for label placement. */
export function sectorMidpoint(sector: AnnularSector) {
  const midAngle = (sector.startAngle + sector.endAngle) / 2;
  const midR = (sector.innerR + sector.outerR) / 2;
  return polarToCartesian(sector.cx, sector.cy, midR, midAngle);
}

export { polarToCartesian };
