// Logo: "df" com o ponto laranja, o mesmo laranja de destaque do site.
export default function Mark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden className="shrink-0">
      <rect x="0.5" y="0.5" width="39" height="39" rx="11" fill="#161D3D" stroke="#2E3766" />
      <text x="7" y="28" fontFamily="'Space Grotesk', sans-serif" fontWeight="700" fontSize="21" letterSpacing="-1.6" fill="#ECEAF5">df</text>
      <circle cx="33" cy="26.5" r="2.6" fill="#FFC27A" className="transition-transform duration-300 group-hover:-translate-y-1" />
    </svg>
  )
}
