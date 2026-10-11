// Deterministic pseudo-random star field — no Math.random() so the
// server-rendered and client-hydrated markup match exactly. Rounded to
// avoid a hydration mismatch: Math.sin can serialize with a different
// trailing digit between the server (Node) and client (browser) engine.
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 999.7) * 43758.5453;
  return Math.round((x - Math.floor(x)) * 10000) / 10000;
}

const STAR_COUNT = 90;
const PLANETS = [
  { cx: 85, cy: 12, r: 5.5, color: "#f97316", ring: false },
  { cx: 8, cy: 78, r: 8, color: "#a78bfa", ring: true },
  { cx: 93, cy: 60, r: 3.5, color: "#60a5fa", ring: false },
];

export function StarField() {
  const stars = Array.from({ length: STAR_COUNT }, (_, i) => ({
    cx: pseudoRandom(i * 2 + 1) * 100,
    cy: pseudoRandom(i * 2 + 2) * 100,
    r: pseudoRandom(i * 3 + 7) * 0.9 + 0.3,
    opacity: pseudoRandom(i * 5 + 3) * 0.6 + 0.4,
  }));

  return (
    <svg
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <rect x={0} y={0} width={100} height={100} fill="#05070d" />
      {stars.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#e8f1ff" opacity={s.opacity} />
      ))}
      {PLANETS.map((p, i) => (
        <g key={i}>
          {p.ring && (
            <ellipse
              cx={p.cx}
              cy={p.cy}
              rx={p.r * 1.8}
              ry={p.r * 0.5}
              fill="none"
              stroke={p.color}
              strokeOpacity={0.5}
              strokeWidth={0.3}
            />
          )}
          <circle cx={p.cx} cy={p.cy} r={p.r} fill={p.color} opacity={0.85} />
        </g>
      ))}
    </svg>
  );
}
