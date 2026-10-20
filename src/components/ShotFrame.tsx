import type { Shot } from '../data/types'

type Props = { shot: Shot; label: string; onOpen?: () => void; eager?: boolean }

export default function ShotFrame({ shot, label, onOpen, eager }: Props) {
  if (shot.mobile) {
    return (
      <button type="button" onClick={onOpen} className="group block w-full text-left" aria-label={`Ampliar: ${shot.caption}`}>
        <div className="mx-auto w-full max-w-[250px] rounded-[2.2rem] border border-[#262E3C] bg-[#0E1118] p-2 shadow-[0_40px_80px_-30px_rgba(5, 7, 11,.9)] transition-transform duration-300 group-hover:-translate-y-1">
          <div className="rounded-[1.7rem] overflow-hidden aspect-[390/844] bg-night">
            <img src={shot.src} alt={shot.caption} loading={eager ? 'eager' : 'lazy'} className="w-full h-full object-cover object-top" />
          </div>
        </div>
      </button>
    )
  }
  return (
    <button type="button" onClick={onOpen} className="group block w-full text-left" aria-label={`Ampliar: ${shot.caption}`}>
      <div className="shot-frame transition-transform duration-300 group-hover:-translate-y-1">
        <div className="flex items-center gap-1.5 px-3.5 h-8 border-b border-[#262E3C] bg-[#10141C]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2A3242]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#2A3242]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#2A3242]" />
          <span className="ml-3 text-[12px] text-muted truncate">{label}</span>
        </div>
        <img src={shot.src} alt={shot.caption} loading={eager ? 'eager' : 'lazy'} className="w-full h-auto" />
      </div>
    </button>
  )
}
