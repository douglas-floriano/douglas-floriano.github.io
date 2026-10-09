export default function Mark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden className="shrink-0">
      <rect x="0.5" y="0.5" width="39" height="39" rx="9" fill="#1a1916" stroke="#3a362f" />
      <text x="6.5" y="28" fontFamily="'Bricolage Grotesque', sans-serif" fontWeight="700" fontSize="21" letterSpacing="-1.4" fill="#eeeae2">df</text>
      <circle cx="33" cy="26.5" r="2.6" fill="#e9a23b" />
    </svg>
  )
}
