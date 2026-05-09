type Props = {
  size?: number
  invert?: boolean
  className?: string
}

/**
 * Brand mark — serif "df" inside a stamp/seal block with accent dot.
 * Concept: editorial press stamp · "Floriano builds software."
 */
export default function Logo({ size = 32, invert = false, className = '' }: Props) {
  const fg = invert ? '#F2EDE3' : '#0F0E0C'
  const bg = invert ? '#0F0E0C' : '#F2EDE3'
  const accent = '#E2410E'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Floriano"
    >
      {/* Stamp block */}
      <rect x="2" y="2" width="60" height="60" rx="6" fill={fg} />
      <rect x="6" y="6" width="52" height="52" rx="3" stroke={bg} strokeOpacity="0.18" />

      {/* Serif "df" — single connected glyph */}
      <text
        x="50%"
        y="56%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Fraunces, Times New Roman, serif"
        fontWeight="700"
        fontSize="34"
        letterSpacing="-2"
        fill={bg}
      >
        df
      </text>

      {/* Accent dot — bottom right corner */}
      <circle cx="50" cy="50" r="3" fill={accent} />
    </svg>
  )
}

/**
 * Inline wordmark — "floriano." in Fraunces with accent period.
 */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-serif font-bold tracking-tight ${className}`}>
      floriano<span className="text-accent">.</span>
    </span>
  )
}
