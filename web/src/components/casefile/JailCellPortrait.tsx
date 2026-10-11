/**
 * A silhouette standing behind jail bars, in place of an actual photo —
 * purely decorative, hand-rolled SVG, no image asset.
 */
export function JailCellPortrait() {
  return (
    <div className="w-36 shrink-0 border-2 border-[#8a7752] bg-[#c9c2b2]">
      <svg viewBox="0 0 160 200" className="block w-full" role="img" aria-label="Redacted — not an actual photograph">
        <rect x={0} y={0} width={160} height={200} fill="#c9c2b2" />

        {[40, 70, 100, 130, 160].map((y) => (
          <line key={y} x1={0} y1={y} x2={160} y2={y} stroke="#8a8270" strokeWidth={1} />
        ))}
        {[40, 70, 100, 130, 160].map((y) => (
          <line key={`tick-${y}`} x1={0} y1={y} x2={10} y2={y} stroke="#3a362c" strokeWidth={2} />
        ))}

        <circle cx={80} cy={75} r={26} fill="#2b2117" />
        <path d="M 38 180 Q 38 115 80 115 Q 122 115 122 180 Z" fill="#2b2117" />

        {[18, 46, 74, 102, 130, 158].map((x) => (
          <rect key={x} x={x} y={0} width={7} height={200} fill="#3a362c" />
        ))}
        <rect x={0} y={18} width={160} height={6} fill="#3a362c" />
        <rect x={0} y={176} width={160} height={6} fill="#3a362c" />
      </svg>
      <p className="border-t-2 border-[#8a7752] bg-[#2b2117] py-1 text-center font-mono text-[11px] font-bold tracking-widest text-[#c0352b] uppercase">
        Redacted
      </p>
    </div>
  );
}
