import { useId } from 'react'

// Logo DFC Tech Solutions: D com o F azul dentro e os dois cortes diagonais.
// Mesmo desenho de ~/pessoal/dfc-marca/dfc-icone-app.svg.
export default function Mark({ size = 36 }: { size?: number }) {
  const mask = useId()
  return (
    <svg width={size} height={size} viewBox="0 -6 116 116" aria-hidden className="shrink-0">
      <defs>
        <mask id={mask} maskUnits="userSpaceOnUse" x="0" y="0" width="120" height="120">
          <rect width="120" height="120" fill="#fff" />
          <path fill="#000" d="M-15 100L50 35H58L-7 100Z M19 100L59 60H67L27 100Z" />
        </mask>
      </defs>
      <rect x="1" y="-5" width="114" height="114" rx="30" fill="#161D3D" stroke="#2E3766" strokeWidth="2" />
      <path fill="#ECEAF5" fillRule="evenodd" d="M12 12H64A40 40 0 0 1 64 92H12Z M28 27H64A25 25 0 0 1 64 77H28Z" mask={`url(#${mask})`} />
      <path fill="#2E8BFF" d="M35 41H78L67 52H35Z M31 62H51L39 74H31Z" className="transition-transform duration-300 group-hover:translate-x-1" />
    </svg>
  )
}
