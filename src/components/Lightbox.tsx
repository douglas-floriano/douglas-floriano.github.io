import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { Shot } from '../data/types'

type Props = { shots: Shot[]; index: number | null; onChange: (i: number | null) => void; title: string }

export default function Lightbox({ shots, index, onChange, title }: Props) {
  const open = index !== null

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChange(null)
      if (e.key === 'ArrowRight') onChange(((index ?? 0) + 1) % shots.length)
      if (e.key === 'ArrowLeft') onChange(((index ?? 0) - 1 + shots.length) % shots.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, index, shots.length, onChange])

  const shot = open ? shots[index!] : null

  return createPortal(
    <AnimatePresence>
      {shot && (
        <motion.div
          className="fixed inset-0 z-[80] bg-night/95 backdrop-blur-md flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={`Telas de ${title}`}
          onClick={() => onChange(null)}
        >
          <div className="flex items-center justify-between px-5 h-16 shrink-0">
            <p className="text-soft text-[15px] truncate pr-4">{title}<span className="text-muted tnum ml-3">{index! + 1} de {shots.length}</span></p>
            <button className="w-10 h-10 grid place-items-center rounded-full border border-line hover:border-signal" aria-label="Fechar" onClick={() => onChange(null)}>
              <X size={18} />
            </button>
          </div>
          <div className="relative flex-1 min-h-0 flex items-center justify-center px-4 sm:px-20" onClick={(e) => e.stopPropagation()}>
            <motion.img
              key={shot.src}
              src={shot.src}
              alt={shot.caption}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className={`max-h-full object-contain rounded-xl border border-line ${shot.mobile ? 'max-w-[380px]' : 'max-w-full'}`}
            />
            {shots.length > 1 && (
              <>
                <button aria-label="Tela anterior" onClick={() => onChange((index! - 1 + shots.length) % shots.length)} className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 grid place-items-center rounded-full glass border border-line hover:border-signal">
                  <ChevronLeft size={20} />
                </button>
                <button aria-label="Próxima tela" onClick={() => onChange((index! + 1) % shots.length)} className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 grid place-items-center rounded-full glass border border-line hover:border-signal">
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
          <p className="shrink-0 text-center text-soft px-6 py-5 max-w-3xl mx-auto" onClick={(e) => e.stopPropagation()}>{shot.caption}</p>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
