import { useCallback, useEffect, useState } from 'react'
import { onOpenProject, setProjectHash, slugFromHash } from '../lib/projectBus'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { GROUPS, PROJECTS } from '../data/projects'
import type { Project } from '../data/types'
import { scrollToId } from '../lib/smooth'
import ProjectSheet from './ProjectSheet'

function IndexCard({ p, onOpen }: { p: Project; onOpen: () => void }) {
  const cover = p.shots.find((s) => !s.mobile) ?? p.shots[0]
  return (
    <button
      onClick={onOpen}
      className="group text-left rounded-3xl border border-line bg-deep/70 hover:border-signal/60 transition-colors overflow-hidden flex flex-col"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-night border-b border-line">
        {cover ? (
          <img src={cover.src} alt="" loading="lazy" className={`w-full h-full transition-transform duration-700 group-hover:scale-[1.04] ${cover.mobile ? 'object-contain py-4' : 'object-cover object-top'}`} />
        ) : p.logo ? (
          <div className="w-full h-full grid place-items-center"><img src={p.logo} alt="" className={`max-w-[45%] max-h-[45%] object-contain ${p.logoLight ? 'bg-white rounded-xl p-4' : 'opacity-90'}`} /></div>
        ) : null}
        {p.ai && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full glass border border-spark/40 px-3 py-1 text-[12.5px] text-spark">
            <Sparkles size={13} /> usa IA
          </span>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-3 text-[13.5px] text-muted">
          <span>{p.period}</span>
          <span className="truncate">{p.status}</span>
        </div>
        <h4 className="mt-3 font-display text-[1.45rem] font-semibold leading-tight">{p.name}</h4>
        <p className="mt-2 text-soft text-[15.5px] leading-relaxed">{p.tagline}</p>
        <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-[14.5px] text-signal group-hover:text-spark transition-colors">
          Ver detalhes <ArrowUpRight size={15} />
        </span>
      </div>
    </button>
  )
}

export default function Projects() {
  const [open, setOpen] = useState<Project | null>(() => {
    const slug = slugFromHash()
    return slug ? PROJECTS.find((p) => p.slug === slug) ?? null : null
  })
  const close = useCallback(() => { setOpen(null); setProjectHash(null) }, [])
  const show = useCallback((p: Project) => { setOpen(p); setProjectHash(p.slug) }, [])

  useEffect(() => {
    const byslug = (slug: string | null) => {
      const p = slug ? PROJECTS.find((x) => x.slug === slug) : null
      if (p) show(p)
    }
    const offBus = onOpenProject(byslug)
    const onHash = () => byslug(slugFromHash())
    window.addEventListener('hashchange', onHash)
    return () => { offBus(); window.removeEventListener('hashchange', onHash) }
  }, [show])

  return (
    <section id="projetos" data-field="grid" className="relative py-20 sm:py-24">
      <div className="page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7">
            <p className="kicker">Projetos</p>
            <h2 className="mt-4 h-sec text-[clamp(2.4rem,5vw,4.4rem)]">Todos os projetos.</h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-soft">
              Separados entre o que construo como desenvolvedor sênior da IB System e o que crio por
              conta própria. Clique em qualquer um para ver o problema, o que eu fiz, onde entra a IA e
              as telas reais.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {GROUPS.map((g) => (
                <button key={g.id} onClick={() => scrollToId(`projetos-${g.id}`)} className="btn btn-line !py-2.5 !px-5">
                  {g.title} <span className="tnum text-muted">{g.items.length}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {GROUPS.map((g) => {
          const featured = g.items.filter((p) => p.featured)
          const withAI = g.items.filter((p) => p.ai).length
          return (
            <div key={g.id} id={`projetos-${g.id}`} className="mt-16 scroll-mt-20">
              <div className="rounded-3xl border border-line bg-deep/60 p-7 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                <div className="lg:col-span-7">
                  <h3 className="h-sec text-[clamp(2.2rem,4.6vw,3.8rem)]">{g.title}</h3>
                  <p className="mt-3 text-soft max-w-[56ch]">{g.intro}</p>
                </div>
                <dl className="lg:col-span-5 grid grid-cols-3 gap-4">
                  <div className="border-l border-signal/40 pl-4">
                    <dd className="font-display text-[1.9rem] font-semibold leading-none tnum">{g.items.length}</dd>
                    <dt className="mt-1.5 text-[13.5px] text-muted">projetos</dt>
                  </div>
                  <div className="border-l border-signal/40 pl-4">
                    <dd className="font-display text-[1.9rem] font-semibold leading-none tnum">{featured.length}</dd>
                    <dt className="mt-1.5 text-[13.5px] text-muted">em destaque</dt>
                  </div>
                  <div className="border-l border-spark/50 pl-4">
                    <dd className="font-display text-[1.9rem] font-semibold leading-none tnum text-spark">{withAI}</dd>
                    <dt className="mt-1.5 text-[13.5px] text-muted">com IA</dt>
                  </div>
                </dl>
              </div>

              <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {g.items.map((p) => <IndexCard key={p.slug} p={p} onOpen={() => show(p)} />)}
              </div>
            </div>
          )
        })}
      </div>
      <ProjectSheet project={open} onClose={close} />
    </section>
  )
}
