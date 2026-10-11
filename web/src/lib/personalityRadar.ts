export interface RadarTrait {
  trait: string;
  value: number;
  link?: string | null;
}

export interface RadarPoint extends RadarTrait {
  x: number;
  y: number;
  labelX: number;
  labelY: number;
  anchor: "start" | "middle" | "end";
}

/** Angle (radians) for point i of n, starting straight up and going clockwise. */
function angleFor(i: number, n: number): number {
  return (Math.PI * 2 * i) / n - Math.PI / 2;
}

/**
 * Rounds to a fixed precision so SVG coordinates serialize identically on
 * the server and client — raw Math.cos/sin output can otherwise differ in
 * its last decimal digit between Node and browser JS engines, which trips
 * a React hydration mismatch.
 */
function round(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Maps traits (0-100) onto an SVG-space radar polygon of the given size. */
export function computeRadarPoints(traits: RadarTrait[], size: number, labelOffset = 28): RadarPoint[] {
  const center = size / 2;
  const maxRadius = size / 2;
  const n = traits.length;

  return traits.map((t, i) => {
    const angle = angleFor(i, n);
    const r = (Math.max(0, Math.min(100, t.value)) / 100) * maxRadius;
    const labelR = maxRadius + labelOffset;
    const cos = Math.cos(angle);

    let anchor: RadarPoint["anchor"] = "middle";
    if (cos > 0.2) anchor = "start";
    else if (cos < -0.2) anchor = "end";

    return {
      ...t,
      x: round(center + r * cos),
      y: round(center + r * Math.sin(angle)),
      labelX: round(center + labelR * cos),
      labelY: round(center + labelR * Math.sin(angle)),
      anchor,
    };
  });
}

export function polygonPoints(points: { x: number; y: number }[]): string {
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}

/** Points for a grid ring at the given fraction (0-1) of the radar's radius. */
export function gridRingPoints(n: number, size: number, ringFraction: number): string {
  const center = size / 2;
  const r = (size / 2) * ringFraction;
  return Array.from({ length: n }, (_, i) => {
    const angle = angleFor(i, n);
    return `${round(center + r * Math.cos(angle))},${round(center + r * Math.sin(angle))}`;
  }).join(" ");
}

export function axisLines(n: number, size: number): { x1: number; y1: number; x2: number; y2: number }[] {
  const center = size / 2;
  const maxRadius = size / 2;
  return Array.from({ length: n }, (_, i) => {
    const angle = angleFor(i, n);
    return {
      x1: center,
      y1: center,
      x2: round(center + maxRadius * Math.cos(angle)),
      y2: round(center + maxRadius * Math.sin(angle)),
    };
  });
}
