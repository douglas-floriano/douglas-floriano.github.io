import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Sparkles, X } from 'lucide-react'
import type { Project } from '../data/types'
import { KIND_LABEL } from '../data/types'
import { lockScroll } from '../lib/smooth'
import Lightbox from './Lightbox'

type Props = { project: Project | null; onClose: () => void }

export default function ProjectSheet({ project, onClose }: Props) {
  const [zoom, setZoom] = useState<{ slug: string; i: number | null }>({ slug: '', i: null })
  const shot = project && zoom.slug === project.slug ? zoom.i : null
  const setShot = useCallback((i: number | null) => setZoom({ slug: project?.slug ?? '', i }), [project])

  useEffect(() => {
    lockScroll(!!project)
    if (!project) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && shot === null) onClose() }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); lockScroll(false) }
  }, [project, onClose, shot])

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div className="fixed inset-0 z-[70]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-night/80 backdrop-blur-sm" onClick={onClose} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={project.name}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 32 }}
            className="absolute right-0 top-0 h-full w-full max-w-[980px] bg-deep border-l border-line overflow-y-auto overscroll-contain"
            data-lenis-prevent
          >
            <div className="sticky top-0 z-10 glass border-b border-line flex items-center justify-between px-6 sm:px-10 h-16">
              <div className="flex items-center gap-3 min-w-0">
                {project.logo && <img src={project.logo} alt="" className={`w-8 h-8 rounded-lg object-contain p-1 border border-line ${project.logoLight ? 'bg-white' : 'bg-night'}`} />}
                <span className="font-display font-semibold truncate">{project.name}</span>
              </div>
              <button onClick={onClose} className="w-10 h-10 grid place-items-center rounded-full border border-line hover:border-signal shrink-0" aria-label="Fechar">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 sm:px-10 py-10">
              <div className="flex flex-wrap gap-2">
                <span className="chip">{KIND_LABEL[project.kind]}</span>
                <span className="chip">{project.org}</span>
                <span className="chip">{project.period}</span>
                <span className="chip !border-mint/40 !text-mint">{project.status}</span>
              </div>
              <h2 className="mt-6 h-sec text-[clamp(2.2rem,5vw,3.6rem)]">{project.name}</h2>
              <p className="mt-3 font-display text-xl text-soft max-w-[48ch]">{project.tagline}</p>
              <p className="mt-3 text-[15px] text-muted">Meu papel: {project.role}</p>

              {project.metrics && (
                <dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-px bg-line rounded-2xl overflow-hidden border border-line">
                  {project.metrics.map((m) => (
                    <div key={m.label} className="bg-deep px-5 py-5">
                      <dt className="text-[13px] text-muted">{m.label}</dt>
                      <dd className="mt-1 font-display text-2xl font-semibold tnum">{m.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <div className="mt-10 grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-display text-lg font-semibold text-signal">O problema</h3>
                  <p className="mt-2 text-soft">{project.problem}</p>
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-signal">O que eu construí</h3>
                  <p className="mt-2 text-soft">{project.solution}</p>
                </div>
              </div>

              {project.ai && (
                <div className="mt-8 rounded-2xl border border-spark/30 bg-spark/[0.06] p-6">
                  <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-spark"><Sparkles size={18} /> Onde entra a IA</h3>
                  <p className="mt-2 text-soft">{project.ai}</p>
                </div>
              )}

              <div className="mt-10">
                <h3 className="font-display text-lg font-semibold">Destaques</h3>
                <ul className="mt-4 grid sm:grid-cols-2 gap-x-8 gap-y-3">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex gap-3 text-soft text-[15.5px]">
                      <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-signal shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <h3 className="font-display text-lg font-semibold">Tecnologias</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.stack.map((s) => <span key={s} className="chip">{s}</span>)}
                </div>
              </div>

              {project.url && (
                <a href={project.url} target="_blank" rel="noreferrer" className="mt-8 btn btn-line">
                  Abrir o sistema <ArrowUpRight size={16} />
                </a>
              )}

              {project.shots.length > 0 && (
                <div className="mt-12">
                  <h3 className="font-display text-lg font-semibold">Telas reais <span className="text-muted font-normal text-[15px] tnum">({project.shots.length})</span></h3>
                  <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {project.shots.map((s, i) => (
                      <button key={s.src} onClick={() => setShot(i)} className="group text-left" aria-label={`Ampliar: ${s.caption}`}>
                        <div className={`rounded-xl overflow-hidden border border-line bg-night ${s.mobile ? 'aspect-[390/600]' : 'aspect-[16/10]'}`}>
                          <img src={s.src} alt={s.caption} loading="lazy" className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]" />
                        </div>
                        <p className="mt-2 text-[13px] text-muted leading-snug line-clamp-2">{s.caption}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.aside>
          <Lightbox shots={project.shots} index={shot} onChange={setShot} title={project.name} />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
