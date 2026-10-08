export interface PackedCircle {
  x: number;
  y: number;
  r: number;
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/**
 * Deterministic circle-packing layout: seed circles on a phyllotaxis spiral,
 * then relax overlaps + a gentle center-pull over a fixed iteration count.
 * No randomness, so server and client renders match exactly.
 */
export function packCircles(
  values: number[],
  {
    padding = 2,
    minRadius = 14,
    maxRadius = 60,
    iterations = 300,
  }: {
    padding?: number;
    minRadius?: number;
    maxRadius?: number;
    iterations?: number;
  } = {},
): PackedCircle[] {
  if (values.length === 0) return [];

  const maxValue = Math.max(...values);
  const circles: PackedCircle[] = values.map((v, i) => {
    const r = minRadius + (maxRadius - minRadius) * Math.sqrt(v / maxValue);
    const angle = i * GOLDEN_ANGLE;
    const spiralR = 6 * Math.sqrt(i);
    return { x: spiralR * Math.cos(angle), y: spiralR * Math.sin(angle), r };
  });

  for (let iter = 0; iter < iterations; iter++) {
    for (const c of circles) {
      c.x *= 0.995;
      c.y *= 0.995;
    }
    for (let i = 0; i < circles.length; i++) {
      for (let j = i + 1; j < circles.length; j++) {
        const a = circles[i];
        const b = circles[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 0.0001;
        const minDist = a.r + b.r + padding;
        if (dist < minDist) {
          const overlap = (minDist - dist) / 2;
          const ux = dx / dist;
          const uy = dy / dist;
          a.x -= ux * overlap;
          a.y -= uy * overlap;
          b.x += ux * overlap;
          b.y += uy * overlap;
        }
      }
    }
  }

  return circles;
}

export interface Bounds {
  minX: number;
  minY: number;
  width: number;
  height: number;
}

/** Bounding box of the packed circles, with a margin equal to the largest radius. */
export function packedBounds(circles: PackedCircle[]): Bounds {
  if (circles.length === 0) return { minX: 0, minY: 0, width: 0, height: 0 };
  const maxR = Math.max(...circles.map((c) => c.r));
  const margin = maxR * 0.5;
  const minX = Math.min(...circles.map((c) => c.x - c.r)) - margin;
  const maxX = Math.max(...circles.map((c) => c.x + c.r)) + margin;
  const minY = Math.min(...circles.map((c) => c.y - c.r)) - margin;
  const maxY = Math.max(...circles.map((c) => c.y + c.r)) + margin;
  return { minX, minY, width: maxX - minX, height: maxY - minY };
}
