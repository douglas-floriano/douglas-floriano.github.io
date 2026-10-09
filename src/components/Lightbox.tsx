import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { Shot } from '../data/projects'

type Props = { shots: Shot[]; index: number | null; onChange: (i: number | null) => void; title: string }

export default function Lightbox({ shots, index, onChange, title }: Props) {
  const open = index !== null
  const closeRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!open) return
    const prevFocus = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChange(null)
      if (e.key === 'ArrowRight') onChange(((index ?? 0) + 1) % shots.length)
      if (e.key === 'ArrowLeft') onChange(((index ?? 0) - 1 + shots.length) % shots.length)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
      prevFocus?.focus?.()
    }
  }, [open, index, shots.length, onChange])

  if (!open) return null
  const shot = shots[index]

  return createPortal(
    <div
      className="fixed inset-0 z-[80] bg-bg flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={`Telas de ${title}`}
      onClick={() => onChange(null)}
    >
      <div className="flex items-center justify-between px-4 h-16 shrink-0">
        <p className="text-soft text-[15px] truncate pr-4">
          {title}
          <span className="text-muted tnum ml-3">{index + 1} de {shots.length}</span>
        </p>
        <button ref={closeRef} className="w-11 h-11 grid place-items-center rounded-md border border-line hover:border-amber" aria-label="Fechar" onClick={() => onChange(null)}>
          <X size={18} />
        </button>
      </div>
      <div className="relative flex-1 min-h-0 flex items-center justify-center px-3 sm:px-20" onClick={(e) => e.stopPropagation()}>
        <img
          key={shot.src}
          src={shot.src}
          alt={shot.caption}
          className={`max-h-full object-contain rounded-lg border border-line ${shot.mobile ? 'max-w-[380px]' : 'max-w-full'}`}
        />
        {shots.length > 1 && (
          <>
            <button aria-label="Tela anterior" onClick={() => onChange((index - 1 + shots.length) % shots.length)} className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 w-11 h-11 grid place-items-center rounded-md bg-surface border border-line hover:border-amber">
              <ChevronLeft size={20} />
            </button>
            <button aria-label="Próxima tela" onClick={() => onChange((index + 1) % shots.length)} className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 w-11 h-11 grid place-items-center rounded-md bg-surface border border-line hover:border-amber">
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
      <p className="shrink-0 text-center text-soft px-6 py-5 max-w-3xl mx-auto" onClick={(e) => e.stopPropagation()}>{shot.caption}</p>
    </div>,
    document.body,
  )
}
