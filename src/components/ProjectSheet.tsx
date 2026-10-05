import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Maximize2, Sparkles, X } from 'lucide-react'
import type { Project, Shot } from '../data/types'
import { KIND_LABEL } from '../data/types'
import { PROJECTS } from '../data/projects'
import { lockScroll } from '../lib/smooth'
import { openProject } from '../lib/projectBus'
import Lightbox from './Lightbox'

type Props = { project: Project | null; onClose: () => void }

// Capa do caso: a tela principal em perspectiva, ou dois celulares quando o projeto é mobile.
function Cover({ p, onZoom }: { p: Project; onZoom: (i: number) => void }) {
  const desk = p.shots.find((s) => !s.mobile)
  const phones = p.shots.filter((s) => s.mobile).slice(0, 2)
  if (desk) {
    return (
      <button onClick={() => onZoom(p.shots.indexOf(desk))} className="group block w-full [perspective:1600px]" aria-label={`Ampliar: ${desk.caption}`}>
        <div className="shot-frame transition-transform duration-700 [transform:rotateY(-9deg)_rotateX(4deg)] group-hover:[transform:rotateY(0deg)_rotateX(0deg)]">
          <div className="flex items-center gap-1.5 px-3.5 h-8 border-b border-[#2A3360] bg-[#10162F]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2E3766]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#2E3766]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#2E3766]" />
            <span className="ml-3 text-[12px] text-muted truncate">{p.url ? p.url.replace(/^https?:\/\//, '') : p.slug}</span>
          </div>
          <img src={desk.src} alt={desk.caption} className="w-full aspect-[16/10] object-cover object-top" />
        </div>
      </button>
    )
  }
  if (phones.length) {
    return (
      <div className="flex justify-center items-end gap-6 [perspective:1600px]">
        {phones.map((s, i) => (
          <button key={s.src} onClick={() => onZoom(p.shots.indexOf(s))} aria-label={`Ampliar: ${s.caption}`}
            className={`w-[44%] max-w-[260px] rounded-[2.4rem] border border-[#2A3360] bg-[#0D1228] p-2 shadow-[0_50px_100px_-30px_rgba(3,6,20,.95)] transition-transform duration-700 hover:-translate-y-2 ${i === 0 ? '[transform:rotateY(12deg)]' : '[transform:rotateY(-12deg)] translate-y-10'}`}>
            <img src={s.src} alt={s.caption} className="rounded-[1.9rem] w-full aspect-[390/844] object-cover object-top" />
          </button>
        ))}
      </div>
    )
  }
  return p.logo ? (
    <div className="aspect-[16/10] rounded-3xl border border-line bg-deep grid place-items-center">
      <img src={p.logo} alt="" className={`max-w-[45%] max-h-[40%] object-contain ${p.logoLight ? 'bg-white rounded-2xl p-6' : ''}`} />
    </div>
  ) : null
}

function Thumb({ s, i, big, onZoom }: { s: Shot; i: number; big?: boolean; onZoom: (i: number) => void }) {
  return (
    <figure>
      <button onClick={() => onZoom(i)} className="group relative block w-full overflow-hidden rounded-2xl border border-line bg-night" aria-label={`Ampliar: ${s.caption}`}>
        <img src={s.src} alt={s.caption} loading="lazy" className={`w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03] ${s.mobile ? 'aspect-[390/844]' : big ? 'aspect-[16/9]' : 'aspect-[16/10]'}`} />
        <span className="absolute top-3 right-3 grid place-items-center w-9 h-9 rounded-full glass border border-line opacity-0 group-hover:opacity-100 transition-opacity"><Maximize2 size={15} /></span>
      </button>
      <figcaption className="mt-3 text-[14px] text-muted leading-snug">{s.caption}</figcaption>
    </figure>
  )
}

function Gallery({ shots, onZoom }: { shots: Shot[]; onZoom: (i: number) => void }) {
  const desk = shots.map((s, i) => ({ s, i })).filter(({ s }) => !s.mobile)
  const mob = shots.map((s, i) => ({ s, i })).filter(({ s }) => s.mobile)
  return (
    <div className="flex flex-col gap-10">
      {desk[0] && <Thumb s={desk[0].s} i={desk[0].i} big onZoom={onZoom} />}
      {desk.length > 1 && (
        <div className="grid sm:grid-cols-2 gap-8">
          {desk.slice(1).map(({ s, i }) => <Thumb key={s.src} s={s} i={i} onZoom={onZoom} />)}
        </div>
      )}
      {mob.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {mob.map(({ s, i }) => <Thumb key={s.src} s={s} i={i} onZoom={onZoom} />)}
        </div>
      )}
    </div>
  )
}

export default function ProjectSheet({ project, onClose }: Props) {
  const scroller = useRef<HTMLDivElement | null>(null)
  const [zoom, setZoom] = useState<{ slug: string; i: number | null }>({ slug: '', i: null })
  const shot = project && zoom.slug === project.slug ? zoom.i : null
  const setShot = useCallback((i: number | null) => setZoom({ slug: project?.slug ?? '', i }), [project])

  const idx = project ? PROJECTS.findIndex((p) => p.slug === project.slug) : -1
  const prev = idx >= 0 ? PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length] : null
  const next = idx >= 0 ? PROJECTS[(idx + 1) % PROJECTS.length] : null

  useEffect(() => {
    lockScroll(!!project)
    if (!project) return
    scroller.current?.scrollTo({ top: 0 })
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && shot === null) onClose() }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); lockScroll(false) }
  }, [project, onClose, shot])

  const nextCover = next ? next.shots.find((s) => !s.mobile) ?? next.shots[0] : null

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          key="case"
          role="dialog"
          aria-modal="true"
          aria-label={project.name}
          className="fixed inset-0 z-[70] bg-night"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div aria-hidden className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,rgba(124,156,255,0.16),transparent_55%)]" />
          <div ref={scroller} className="relative h-full overflow-y-auto overscroll-contain" data-lenis-prevent>
            {/* barra do caso */}
            <div className="sticky top-0 z-20 glass border-b border-line/70">
              <div className="page h-16 flex items-center justify-between gap-4">
                <button onClick={onClose} className="inline-flex items-center gap-2 text-[15px] text-soft hover:text-text">
                  <ArrowLeft size={17} /> Voltar ao portfólio
                </button>
                <span className="hidden md:block font-display font-semibold truncate">{project.name}</span>
                <div className="flex items-center gap-2">
                  {prev && <button onClick={() => openProject(prev.slug)} className="w-10 h-10 grid place-items-center rounded-full border border-line hover:border-signal" aria-label={`Projeto anterior: ${prev.name}`}><ArrowLeft size={17} /></button>}
                  {next && <button onClick={() => openProject(next.slug)} className="w-10 h-10 grid place-items-center rounded-full border border-line hover:border-signal" aria-label={`Próximo projeto: ${next.name}`}><ArrowRight size={17} /></button>}
                  <button onClick={onClose} className="w-10 h-10 grid place-items-center rounded-full bg-text text-night hover:bg-spark" aria-label="Fechar"><X size={18} /></button>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.article
                key={project.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
              >
                {/* abertura */}
                <header className="page pt-14 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-5">
                    <div className="flex flex-wrap gap-2">
                      <span className="chip">{project.org}</span>
                      <span className="chip">{KIND_LABEL[project.kind]}</span>
                      <span className="chip">{project.period}</span>
                    </div>
                    <h1 className={`mt-7 h-mega ${project.name.length > 9 ? 'text-[clamp(2.6rem,4.6vw,4.4rem)]' : 'text-[clamp(3rem,6.5vw,5.8rem)]'} [hyphens:none]`}>{project.name}</h1>
                    <p className="mt-5 font-display text-[clamp(1.25rem,1.9vw,1.6rem)] leading-snug text-soft">{project.tagline}</p>
                    <div className="mt-8 flex flex-col gap-2 text-[15px]">
                      <p className="text-muted">Meu papel <span className="block text-text text-[16px] mt-0.5">{project.role}</span></p>
                      <p className="mt-2 inline-flex items-center gap-2 text-mint"><span className="w-1.5 h-1.5 rounded-full bg-mint" />{project.status}</p>
                    </div>
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noreferrer" className="mt-8 btn btn-main">Abrir o sistema <ArrowUpRight size={16} /></a>
                    )}
                  </div>
                  <div className="lg:col-span-7">
                    <Cover p={project} onZoom={setShot} />
                  </div>
                </header>

                {/* números */}
                {project.metrics && (
                  <section className="border-y border-line bg-deep/50">
                    <dl className={`page grid grid-cols-2 ${project.metrics.length >= 4 ? 'lg:grid-cols-4' : project.metrics.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
                      {project.metrics.map((m, i) => (
                        <div key={m.label} className={`py-10 pr-6 ${i > 0 ? 'lg:pl-10 lg:border-l border-line' : ''}`}>
                          <dd className="font-display font-semibold text-[clamp(2.4rem,4vw,3.6rem)] leading-none tnum">{m.value}</dd>
                          <dt className="mt-3 text-[15px] text-muted max-w-[22ch]">{m.label}</dt>
                        </div>
                      ))}
                    </dl>
                  </section>
                )}

                {/* história */}
                <section className="page py-20 grid grid-cols-1 lg:grid-cols-2 gap-14">
                  <div>
                    <p className="text-[15px] text-spark">O problema</p>
                    <p className="mt-4 font-display text-[clamp(1.35rem,2vw,1.75rem)] leading-[1.45] text-text">{project.problem}</p>
                  </div>
                  <div>
                    <p className="text-[15px] text-signal">O que eu construí</p>
                    <p className="mt-4 text-[17.5px] leading-[1.75] text-soft">{project.solution}</p>
                  </div>
                </section>

                {project.ai && (
                  <section className="page pb-20">
                    <div className="relative overflow-hidden rounded-[2rem] border border-spark/30 bg-gradient-to-br from-spark/[0.10] via-deep to-deep p-8 sm:p-12">
                      <Sparkles aria-hidden size={160} className="absolute -right-6 -top-6 text-spark/10" />
                      <p className="inline-flex items-center gap-2 text-spark text-[15px]"><Sparkles size={17} /> Onde entra a IA</p>
                      <p className="relative mt-5 font-display text-[clamp(1.08rem,1.9vw,1.6rem)] leading-[1.55] text-text max-w-[62ch]">{project.ai}</p>
                    </div>
                  </section>
                )}

                {/* destaques */}
                <section className="page pb-20">
                  <h2 className="h-sec text-[clamp(1.9rem,3.2vw,2.8rem)]">Destaques</h2>
                  <ul className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.highlights.map((h) => (
                      <li key={h} className="rounded-2xl border border-line bg-deep/60 p-5 flex gap-3.5">
                        <span className="grid place-items-center w-7 h-7 rounded-lg bg-signal/15 text-signal shrink-0"><Check size={15} /></span>
                        <span className="text-[15.5px] text-soft leading-snug">{h}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* telas */}
                {project.shots.length > 0 && (
                  <section className="page pb-20">
                    <div className="flex items-end justify-between gap-4">
                      <h2 className="h-sec text-[clamp(1.9rem,3.2vw,2.8rem)]">Telas reais</h2>
                      <span className="text-muted text-[15px] tnum">{project.shots.length} capturas</span>
                    </div>
                    <div className="mt-8"><Gallery shots={project.shots} onZoom={setShot} /></div>
                  </section>
                )}

                {/* tecnologias */}
                <section className="page pb-20">
                  <h2 className="h-sec text-[clamp(1.9rem,3.2vw,2.8rem)]">Tecnologias</h2>
                  <div className="mt-6 flex flex-wrap gap-2.5">
                    {project.stack.map((s) => <span key={s} className="rounded-full border border-line bg-deep/60 px-4 py-2 text-[15px] text-soft">{s}</span>)}
                  </div>
                </section>

                {/* próximo */}
                {next && (
                  <section className="border-t border-line">
                    <button onClick={() => openProject(next.slug)} className="group page w-full py-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left">
                      <div className="md:col-span-6">
                        <p className="text-muted text-[15px]">Próximo projeto</p>
                        <p className="mt-3 h-mega text-[clamp(2.6rem,5.5vw,5rem)] group-hover:text-spark transition-colors">{next.name}</p>
                        <p className="mt-3 text-soft max-w-[44ch]">{next.tagline}</p>
                        <span className="mt-6 inline-flex items-center gap-2 text-signal group-hover:text-spark">Ver o caso <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></span>
                      </div>
                      <div className="md:col-span-6">
                        {nextCover ? (
                          <div className="rounded-2xl overflow-hidden border border-line bg-night">
                            <img src={nextCover.src} alt="" loading="lazy" className={`w-full aspect-[16/9] transition-transform duration-700 group-hover:scale-[1.04] ${nextCover.mobile ? 'object-contain py-4' : 'object-cover object-top'}`} />
                          </div>
                        ) : next.logo ? (
                          <div className="aspect-[16/9] rounded-2xl border border-line bg-deep grid place-items-center">
                            <img src={next.logo} alt="" className={`max-w-[40%] max-h-[40%] object-contain ${next.logoLight ? 'bg-white rounded-xl p-4' : ''}`} />
                          </div>
                        ) : null}
                      </div>
                    </button>
                  </section>
                )}
              </motion.article>
            </AnimatePresence>
          </div>
          <Lightbox shots={project.shots} index={shot} onChange={setShot} title={project.name} />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
