/**
 * The "Human at the center" orbital diagram from the design: Human in the middle,
 * with Technology, Creativity, Enterprise, and Capital orbiting. Pure SVG so it
 * stays crisp and theme-driven.
 */
export function OrbitDiagram({ className }: { className?: string }) {
  const cx = 260;
  const cy = 165;
  const gold = "var(--color-gold)";
  const faint = "color-mix(in srgb, var(--color-gold) 35%, transparent)";

  const nodes = [
    { label: "Technology", x: cx, y: 40, glyph: "monitor" },
    { label: "Creativity", x: 70, y: cy, glyph: "spark" },
    { label: "Enterprise", x: 450, y: cy, glyph: "chart" },
    { label: "Capital", x: cx, y: 290, glyph: "coins" },
  ] as const;

  return (
    <svg viewBox="0 0 520 330" className={className} fill="none" role="img" aria-label="Human at the center, with technology, creativity, enterprise, and capital in orbit">
      {/* orbits */}
      <ellipse cx={cx} cy={cy} rx="180" ry="120" stroke={faint} strokeWidth="1" />
      <ellipse cx={cx} cy={cy} rx="128" ry="84" stroke={faint} strokeWidth="1" />
      {/* connecting spokes */}
      {nodes.map((n) => (
        <line key={`s-${n.label}`} x1={cx} y1={cy} x2={n.x} y2={n.y} stroke={faint} strokeWidth="0.75" />
      ))}

      {/* center */}
      <circle cx={cx} cy={cy} r="40" fill="color-mix(in srgb, var(--color-gold) 10%, transparent)" stroke={gold} strokeWidth="1" />
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize="17" fill="var(--color-text)" style={{ fontFamily: "var(--font-serif)" }}>
        Human
      </text>

      {/* nodes */}
      {nodes.map((n) => (
        <g key={n.label}>
          <circle cx={n.x} cy={n.y} r="20" fill="var(--color-ink)" stroke={gold} strokeWidth="1" />
          <g transform={`translate(${n.x - 8}, ${n.y - 8})`} stroke={gold} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            {glyph(n.glyph)}
          </g>
          <text
            x={n.x}
            y={n.y < cy ? n.y - 30 : n.y > cy ? n.y + 38 : n.y + 40}
            textAnchor="middle"
            fontSize="13"
            fill="var(--color-text-muted)"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function glyph(kind: "monitor" | "spark" | "chart" | "coins") {
  switch (kind) {
    case "monitor":
      return (
        <>
          <rect x="1" y="2" width="14" height="9" rx="1" />
          <path d="M6 15h4M8 11v4" />
        </>
      );
    case "spark":
      return <path d="M8 1v4M8 11v4M1 8h4M11 8h4M3.5 3.5 6 6M10 10l2.5 2.5M12.5 3.5 10 6M6 10l-2.5 2.5" />;
    case "chart":
      return <path d="M1 15V2M1 15h14M5 15v-5M9 15v-8M13 15v-3" />;
    case "coins":
      return (
        <>
          <ellipse cx="8" cy="4" rx="6" ry="2.5" />
          <path d="M2 4v5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V4" />
        </>
      );
  }
}
