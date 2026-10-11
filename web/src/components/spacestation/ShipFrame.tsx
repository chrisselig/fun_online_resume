/**
 * A deliberately crude, kid-drawn-style spaceship hull, outline-only so the
 * cargo bay inside stays visible — like a cutaway drawing. Scales to fill
 * its wrapper via a non-uniform viewBox stretch.
 */
export function ShipFrame() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-0 h-full w-full overflow-visible"
      viewBox="0 0 1000 600"
      preserveAspectRatio="none"
    >
      {/* exhaust flames, trailing off the right */}
      <path
        d="M 995 240 L 1080 265 L 1000 285 L 1070 310 L 995 330"
        fill="#f97316"
        opacity={0.85}
      />
      <path d="M 995 260 L 1050 280 L 995 300 L 1040 315 L 995 325" fill="#facc15" />

      {/* hull body — a wobbly rounded capsule */}
      <path
        d="M 60 90
           C 40 60, 140 20, 320 15
           C 560 5, 850 25, 960 110
           C 1010 155, 1010 420, 955 470
           C 850 560, 540 585, 300 575
           C 140 568, 35 535, 55 490
           C 20 440, 15 160, 60 90 Z"
        fill="none"
        stroke="#e8f1ff"
        strokeWidth={10}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* nose-cone cockpit, poking out the left */}
      <path
        d="M 60 160 C -40 180, -60 260, -35 330 C -15 380, 40 400, 65 390"
        fill="none"
        stroke="#e8f1ff"
        strokeWidth={9}
        strokeLinecap="round"
      />
      <circle cx="-5" cy="270" r="34" fill="none" stroke="#7dd3fc" strokeWidth={7} />

      {/* top fin */}
      <path
        d="M 420 20 L 400 -70 L 480 15"
        fill="none"
        stroke="#e8f1ff"
        strokeWidth={9}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* bottom fin */}
      <path
        d="M 400 560 L 360 650 L 470 572"
        fill="none"
        stroke="#e8f1ff"
        strokeWidth={9}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* portholes */}
      {[260, 480, 700].map((cx, i) => (
        <circle
          key={cx}
          cx={cx}
          cy={70 + (i % 2) * 8}
          r={22}
          fill="none"
          stroke="#facc15"
          strokeWidth={6}
        />
      ))}

      {/* crude antenna */}
      <path d="M 700 25 L 715 -40" stroke="#e8f1ff" strokeWidth={5} strokeLinecap="round" />
      <circle cx="716" cy="-46" r="7" fill="#ef4444" />
    </svg>
  );
}
