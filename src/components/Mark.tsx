// Símbolo do site: rede em triângulo com núcleo, o mesmo desenho do fundo neural.
export default function Mark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden className="shrink-0">
      <defs>
        <linearGradient id="mark-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFC27A" />
          <stop offset="1" stopColor="#F08A4B" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#mark-bg)" />
      <g className="transition-transform duration-500 ease-out group-hover:rotate-[120deg]" style={{ transformOrigin: '20px 21.67px' }}>
      <g stroke="#0A0F1E" strokeWidth="2" strokeLinecap="round">
        <line x1="20" y1="9" x2="20" y2="21.67" />
        <line x1="10" y1="28" x2="20" y2="21.67" />
        <line x1="30" y1="28" x2="20" y2="21.67" />
        <g opacity="0.55">
          <line x1="20" y1="9" x2="10" y2="28" />
          <line x1="20" y1="9" x2="30" y2="28" />
          <line x1="10" y1="28" x2="30" y2="28" />
        </g>
      </g>
      <g fill="#0A0F1E">
        <circle cx="20" cy="9" r="3.2" />
        <circle cx="10" cy="28" r="3.2" />
        <circle cx="30" cy="28" r="3.2" />
      </g>
      <circle cx="20" cy="21.67" r="4.6" fill="#ECEAF5" />
      </g>
    </svg>
  )
}
