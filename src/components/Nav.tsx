import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion'
import { ChevronDown, Menu, Sparkles, X } from 'lucide-react'
import { scrollToId } from '../lib/smooth'
import Mark from './Mark'
import { openProject } from '../lib/projectBus'
import { GROUPS, PROJECTS } from '../data/projects'

const LINKS = [
  ['ia', 'IA aplicada'],
  ['projetos', 'Projetos'],
  ['processo', 'Como trabalho'],
  ['trajetoria', 'Trajetória'],
  ['contato', 'Contato'],
] as const

const [IB, PESSOAL] = GROUPS
const COLUMNS = [
  { title: 'IB System', items: IB.items },
  { title: 'Pessoais: IA e automação', items: PESSOAL.items.filter((p) => p.kind === 'ia') },
  { title: 'Pessoais: produtos e comunidade', items: PESSOAL.items.filter((p) => p.kind !== 'ia') },
]

function ProjectList({ onPick, compact }: { onPick: (slug: string) => void; compact?: boolean }) {
  return (
    <div className={compact ? 'flex flex-col gap-6' : 'grid grid-cols-3 gap-8'}>
      {COLUMNS.map((c) => (
        <div key={c.title}>
          <p className="text-[13px] text-muted mb-2">{c.title}</p>
          <ul className="flex flex-col">
            {c.items.map((p) => (
              <li key={p.slug}>
                <button
                  onClick={() => onPick(p.slug)}
                  className="group w-full text-left rounded-xl px-3 py-2 -mx-3 hover:bg-deep2 focus-visible:bg-deep2 transition-colors"
                >
                  <span className="flex items-center gap-2 font-display text-[16px] font-medium text-text group-hover:text-spark transition-colors">
                    {p.name}
                    {p.ai && <Sparkles size={13} className="text-spark/80" aria-label="usa IA" />}
                  </span>
                  {!compact && <span className="text-[13.5px] text-muted leading-snug line-clamp-1">{p.tagline}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default function Nav() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  const [mega, setMega] = useState(false)
  const [mobileProjects, setMobileProjects] = useState(false)
  const [solid, setSolid] = useState(false)
  const closeTimer = useRef<number | null>(null)
  const headerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    LINKS.forEach(([id]) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { obs.disconnect(); window.removeEventListener('scroll', onScroll) }
  }, [])

  useEffect(() => {
    if (!mega) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMega(false)
    const onDown = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setMega(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('pointerdown', onDown) }
  }, [mega])

  const go = (id: string) => { setOpen(false); setMega(false); scrollToId(id) }
  const pick = (slug: string) => { setOpen(false); setMega(false); openProject(slug) }

  const enter = () => { if (closeTimer.current) window.clearTimeout(closeTimer.current); setMega(true) }
  const leave = () => { closeTimer.current = window.setTimeout(() => setMega(false), 180) }

  return (
    <header ref={headerRef} className="fixed top-0 inset-x-0 z-50">
      <div className={`transition-colors duration-300 ${solid || mega ? 'glass border-b border-line/70' : ''}`}>
        <div className="page flex items-center justify-between h-16">
          <button onClick={() => go('inicio')} className="flex items-center gap-3 group" aria-label="Voltar ao início">
            <Mark />
            <span className="font-display font-semibold text-[17px] tracking-tight">Douglas Floriano</span>
          </button>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Seções">
            {LINKS.map(([id, label]) =>
              id === 'projetos' ? (
                <div key={id} onMouseEnter={enter} onMouseLeave={leave}>
                  <button
                    onClick={() => setMega((v) => !v)}
                    aria-expanded={mega}
                    aria-haspopup="true"
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[15px] transition-colors ${active === id || mega ? 'text-text bg-deep2' : 'text-muted hover:text-text'}`}
                  >
                    {label}
                    <ChevronDown size={15} className={`transition-transform ${mega ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              ) : (
                <button
                  key={id}
                  onClick={() => go(id)}
                  className={`px-3.5 py-2 rounded-full text-[15px] transition-colors ${active === id ? 'text-text bg-deep2' : 'text-muted hover:text-text'}`}
                >
                  {label}
                </button>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => go('contato')} className="hidden sm:inline-flex btn btn-main !py-2.5 !px-5">
              Vamos conversar
            </button>
            <button onClick={() => setOpen((v) => !v)} className="lg:hidden w-10 h-10 grid place-items-center rounded-full border border-line" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open}>
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mega && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              onMouseEnter={enter}
              onMouseLeave={leave}
              className="hidden lg:block border-t border-line/70 max-h-[calc(100vh-64px)] overflow-y-auto"
              data-lenis-prevent
            >
              <div className="page py-6">
                <ProjectList onPick={pick} />
                <div className="mt-6 pt-5 border-t border-line/70 flex items-center justify-between text-[14.5px]">
                  <span className="text-muted">{PROJECTS.length} projetos com telas reais e explicação completa</span>
                  <button onClick={() => go('projetos')} className="text-signal hover:text-spark transition-colors">Ver a seção de projetos</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className="h-px bg-gradient-to-r from-signal via-signal to-spark origin-left" style={{ scaleX: progress }} />
      </div>

      {open && (
        <div className="lg:hidden glass border-b border-line max-h-[calc(100svh-64px)] overflow-y-auto" data-lenis-prevent>
          <nav className="page py-4 flex flex-col" aria-label="Seções">
            {LINKS.map(([id, label]) =>
              id === 'projetos' ? (
                <div key={id} className="border-b border-line/60">
                  <button
                    onClick={() => setMobileProjects((v) => !v)}
                    aria-expanded={mobileProjects}
                    className="w-full flex items-center justify-between py-3 text-lg font-display"
                  >
                    {label}
                    <ChevronDown size={18} className={`transition-transform ${mobileProjects ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileProjects && (
                    <div className="pb-4 pl-3">
                      <ProjectList onPick={pick} compact />
                      <button onClick={() => go('projetos')} className="mt-4 text-signal text-[15px]">Ver a seção de projetos</button>
                    </div>
                  )}
                </div>
              ) : (
                <button key={id} onClick={() => go(id)} className="text-left py-3 text-lg font-display border-b border-line/60 last:border-0">
                  {label}
                </button>
              ),
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
