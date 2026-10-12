import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { PROJECTS } from '../data/projects'
import type { Project } from '../data/types'
import { openProject } from '../lib/projectBus'
import { scrollToY } from '../lib/smooth'
import { useSectionProgress } from '../lib/useSectionProgress'

/*
  Vitrine 3D dos projetos em destaque. As telas reais giram em profundidade
  conforme a página rola, e o texto ao lado acompanha o projeto da frente.
*/

const FEATURED = PROJECTS.filter((p) => p.featured)
const F = FEATURED.length

function Screen({ p }: { p: Project }) {
  const desk = p.shots.find((s) => !s.mobile)
  const phones = p.shots.filter((s) => s.mobile).slice(0, 2)
  if (desk) {
    return (
      <div className="shot-frame">
        <div className="flex items-center gap-1.5 px-3.5 h-8 border-b border-[#2A3360] bg-[#10162F]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2E3766]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#2E3766]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#2E3766]" />
          <span className="ml-3 text-[12px] text-muted truncate">{p.url ? p.url.replace(/^https?:\/\//, '') : p.slug}</span>
        </div>
        <img src={desk.src} alt={desk.caption} className="w-full aspect-[16/10] object-cover object-top" />
      </div>
    )
  }
  return (
    <div className="flex justify-center items-end gap-6 h-full">
      {phones.map((s, i) => (
        <div key={s.src} className={`w-[42%] max-w-[250px] rounded-[2.2rem] border border-[#2A3360] bg-[#0D1228] p-2 shadow-[0_40px_80px_-30px_rgba(3,6,20,.9)] ${i === 1 ? 'translate-y-8' : ''}`}>
          <img src={s.src} alt={s.caption} className="rounded-[1.7rem] w-full aspect-[390/844] object-cover object-top" />
        </div>
      ))}
    </div>
  )
}

function Card({ p, k, a }: { p: Project; k: number; a: MotionValue<number> }) {
  const x = useTransform(a, (v) => `${(k - v) * 62}%`)
  const z = useTransform(a, (v) => -Math.abs(k - v) * 420)
  const rotateY = useTransform(a, (v) => (v - k) * 30)
  // a tela que sai some rápido; as próximas ficam visíveis ao fundo
  const opacity = useTransform(a, (v) => Math.max(0, k < v ? 1 - (v - k) * 1.8 : 1 - (k - v) * 0.5))
  const zIndex = useTransform(a, (v) => 100 - Math.round(Math.abs(k - v) * 10))
  return (
    <motion.button
      type="button"
      onClick={() => openProject(p.slug)}
      aria-label={`Abrir ${p.name}`}
      className="absolute inset-0 m-auto w-full h-fit [transform-style:preserve-3d] cursor-pointer"
      style={{ x, z, rotateY, opacity, zIndex }}
    >
      <Screen p={p} />
    </motion.button>
  )
}

function Info({ p }: { p: Project }) {
  return (
    <motion.div
      key={p.slug}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
    >
      <p className="text-[14px] text-muted">{p.org}, {p.period}</p>
      <h3 className="mt-3 h-mega text-[clamp(2.8rem,5vw,4.6rem)]">{p.name}</h3>
      <p className="mt-4 font-display text-[1.3rem] leading-snug text-soft max-w-[34ch]">{p.tagline}</p>
      {p.ai && (
        <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-spark/40 bg-spark/[0.07] px-3.5 py-1.5 text-[13.5px] text-spark">
          <Sparkles size={14} /> usa IA
        </p>
      )}
      {p.metrics && (
        <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 max-w-md">
          {p.metrics.slice(0, 4).map((m) => (
            <div key={m.label} className="border-l border-signal/40 pl-4">
              <dd className="font-display text-[1.7rem] font-semibold leading-none tnum">{m.value}</dd>
              <dt className="mt-1.5 text-[13.5px] text-muted leading-snug">{m.label}</dt>
            </div>
          ))}
        </dl>
      )}
      <div className="mt-8 flex flex-wrap gap-3">
        <button onClick={() => openProject(p.slug)} className="btn btn-main">Ler o caso completo</button>
        {p.url && <a href={p.url} target="_blank" rel="noreferrer" className="btn btn-line">Abrir <ArrowUpRight size={16} /></a>}
      </div>
    </motion.div>
  )
}

export default function Showcase() {
  const ref = useRef<HTMLElement | null>(null)
  const p = useSectionProgress(ref)
  // cada projeto para na frente por boa parte da rolagem; a troca acontece no meio do trecho
  const raw = useTransform(p, (v) => {
    const t = Math.min(F - 1, Math.max(0, ((v - 0.03) / 0.94) * (F - 1)))
    const base = Math.floor(t)
    const f = Math.min(1, Math.max(0, (t - base - 0.32) / 0.36))
    return base + f * f * (3 - 2 * f)
  })
  const a = useSpring(raw, { stiffness: 140, damping: 26, mass: 0.6 })
  const [active, setActive] = useState(0)
  const [wide, setWide] = useState(() => window.innerWidth >= 1024)
  useMotionValueEvent(raw, 'change', (v) => setActive(Math.min(F - 1, Math.max(0, Math.round(v)))))

  // inclinação leve seguindo o mouse
  const tiltX = useSpring(0, { stiffness: 80, damping: 20 })
  const tiltY = useSpring(0, { stiffness: 80, damping: 20 })
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      tiltY.set((e.clientX / window.innerWidth - 0.5) * 10)
      tiltX.set(-(e.clientY / window.innerHeight - 0.5) * 6)
    }
    const onResize = () => setWide(window.innerWidth >= 1024)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('resize', onResize)
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('resize', onResize) }
  }, [tiltX, tiltY])

  const goTo = (k: number) => {
    const el = ref.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const total = el.offsetHeight - window.innerHeight
    scrollToY(top + total * (0.04 + (k / (F - 1)) * 0.92))
  }

  const header = (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p className="kicker">Em destaque</p>
        <h2 className="mt-2 h-sec text-[clamp(1.9rem,3.4vw,2.8rem)]">Projetos que estão no ar</h2>
      </div>
      <p className="text-soft text-[15px] max-w-[46ch]">{wide ? 'Telas reais dos sistemas. Role para girar a vitrine ou clique numa tela para ver o caso completo.' : 'Telas reais dos sistemas. Toque numa tela para ver o caso completo.'}</p>
    </div>
  )

  if (!wide) {
    return (
      <section id="destaques" data-field="torus" className="relative py-20">
        <div className="page">
          {header}
          <div className="mt-10 flex flex-col gap-14">
            {FEATURED.map((proj) => (
              <article key={proj.slug}>
                <button onClick={() => openProject(proj.slug)} className="block w-full" aria-label={`Abrir ${proj.name}`}><Screen p={proj} /></button>
                <div className="mt-6"><Info p={proj} /></div>
              </article>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} id="destaques" data-field="torus" className="relative" style={{ height: `${F * 85 + 60}vh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col pt-24 pb-8">
        <div className="page w-full">{header}</div>

        <div className="page w-full flex-1 min-h-0 grid grid-cols-12 gap-10 items-center">
          <div className="col-span-5 relative">
            <AnimatePresence mode="wait">
              <Info p={FEATURED[active]} />
            </AnimatePresence>
          </div>

          <div className="col-span-7 h-full relative [perspective:1800px] [clip-path:inset(-30%_-60%_-30%_0)]">
            <motion.div className="absolute inset-0 [transform-style:preserve-3d]" style={{ rotateX: tiltX, rotateY: tiltY }}>
              {FEATURED.map((proj, k) => <Card key={proj.slug} p={proj} k={k} a={a} />)}
            </motion.div>
          </div>
        </div>

        <div className="page w-full">
          <div className="flex items-center gap-2 flex-wrap">
            {FEATURED.map((proj, k) => (
              <button
                key={proj.slug}
                onClick={() => goTo(k)}
                className={`relative px-4 py-2 rounded-full text-[14px] border transition-colors ${k === active ? 'bg-text text-night border-text' : 'border-line text-soft hover:border-signal'}`}
              >
                <span className="tnum opacity-60 mr-2">{String(k + 1).padStart(2, '0')}</span>{proj.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
