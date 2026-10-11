export interface RadarTrait {
  trait: string;
  value: number;
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
      x: center + r * cos,
      y: center + r * Math.sin(angle),
      labelX: center + labelR * cos,
      labelY: center + labelR * Math.sin(angle),
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
    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
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
      x2: center + maxRadius * Math.cos(angle),
      y2: center + maxRadius * Math.sin(angle),
    };
  });
}
