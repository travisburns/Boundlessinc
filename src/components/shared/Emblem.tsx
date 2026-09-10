/**
 * Boundless Enterprises mark — a piece of sacred / cosmic geometry: a ringed
 * circle enclosing an ascending triangle, a horizon chord, and an inner diamond.
 * Rendered as crisp SVG so it scales from favicon to hero.
 */
export function Emblem({
  size = 40,
  className,
  stroke = "var(--color-gold)",
}: {
  size?: number;
  className?: string;
  stroke?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden
    >
      <g stroke={stroke} strokeWidth={1} vectorEffect="non-scaling-stroke">
        <circle cx="24" cy="24" r="21" opacity="0.9" />
        <circle cx="24" cy="24" r="16.5" opacity="0.35" />
        {/* ascending triangle */}
        <path d="M24 8 L39 34 L9 34 Z" opacity="0.9" />
        {/* horizon chord */}
        <line x1="14" y1="26" x2="34" y2="26" opacity="0.7" />
        {/* inner diamond */}
        <path d="M24 20 L29 26 L24 32 L19 26 Z" opacity="0.85" />
        {/* vertical axis */}
        <line x1="24" y1="3" x2="24" y2="8" opacity="0.6" />
      </g>
      <circle cx="24" cy="26" r="1.4" fill={stroke} />
    </svg>
  );
}
