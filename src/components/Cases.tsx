import { useState } from 'react'
import { ChevronDown, Images } from 'lucide-react'
import { CASES, type Case, type Shot } from '../data/projects'
import Lightbox from './Lightbox'

function Phone({ s, onOpen }: { s: Shot; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className="block w-full rounded-[1.4rem] border border-line bg-surface p-1.5 hover:border-amber/60 transition-colors" aria-label={`Ampliar: ${s.caption}`}>
      <img src={s.src} alt={s.caption} loading="lazy" width={390} height={844} className="w-full rounded-[1.05rem] aspect-[390/844] object-cover object-top" />
    </button>
  )
}

function Proof({ c, onZoom }: { c: Case; onZoom: (i: number) => void }) {
  const desk = c.shots.find((s) => !s.mobile)
  const phones = c.shots.filter((s) => s.mobile)
  const main = c.shots[0].mobile ? undefined : desk
  const lead = main ?? phones[0]
  return (
    <figure>
      {main ? (
        <button type="button" onClick={() => onZoom(c.shots.indexOf(main))} className="block w-full overflow-hidden rounded-lg border border-line bg-surface hover:border-amber/60 transition-colors" aria-label={`Ampliar: ${main.caption}`}>
          <img src={main.src} alt={main.caption} loading="lazy" width={1440} height={900} className="w-full aspect-[16/10] object-cover object-top" />
        </button>
      ) : (
        <div className="grid grid-cols-2 gap-3 max-w-[260px] sm:max-w-[340px]">
          {phones.slice(0, 2).map((s, k) => (
            <div key={s.src} className={k === 1 ? 'mt-8' : ''}>
              <Phone s={s} onOpen={() => onZoom(c.shots.indexOf(s))} />
            </div>
          ))}
        </div>
      )}
      <figcaption className="mt-3 text-[14px] text-muted leading-snug">
        {lead.caption}
        {c.shotsNote && <span className="block mt-1 text-soft">{c.shotsNote}</span>}
      </figcaption>
      {c.shots.length > 1 && (
        <button type="button" onClick={() => onZoom(0)} className="mt-3 inline-flex items-center gap-2 text-[14.5px] link">
          <Images size={15} aria-hidden /> Ver as {c.shots.length} telas
        </button>
      )}
    </figure>
  )
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="label">{title}</h4>
      <div className="mt-1.5 text-[16px] leading-[1.6] text-soft">{children}</div>
    </div>
  )
}

function CaseView({ c, n }: { c: Case; n: number }) {
  const [zoom, setZoom] = useState<number | null>(null)
  // no celular as decisões técnicas começam fechadas para encurtar a página
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 768px)').matches)
  const hasShots = c.shots.length > 0

  const problem = <Block title="Problema"><p>{c.problem}</p></Block>
  const role = <Block title="O que eu fiz"><p>{c.role}</p></Block>
  const decisions = (
    <details open={wide} onToggle={(e) => setWide(e.currentTarget.open)} className="group">
      <summary className="label cursor-pointer list-none flex items-center gap-2 select-none">
        Decisões técnicas <span className="tnum">({c.decisions.length})</span>
        <ChevronDown size={14} aria-hidden className="transition-transform group-open:rotate-180 md:hidden" />
      </summary>
      <ul className="mt-2 space-y-2.5 text-[16px] leading-[1.6] text-soft">
        {c.decisions.map((d) => (
          <li key={d} className="pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[0.7em] before:w-1.5 before:h-px before:bg-amber">{d}</li>
        ))}
      </ul>
    </details>
  )
  const stack = <Block title="Stack"><p className="text-[15px]">{c.stack.join(' · ')}</p></Block>
  const results = c.results && (
    <Block title="Resultado">
      <ul className="space-y-1">{c.results.map((r) => <li key={r}>{r}</li>)}</ul>
    </Block>
  )

  return (
    <article id={c.slug} className="scroll-mt-20 py-9 sm:py-10 border-t border-line">
      <header className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 sm:gap-8">
        <div>
          <p className="label"><span className="text-amber tnum">{String(n).padStart(2, '0')}</span> · {c.org} · {c.period}</p>
          <h3 className="mt-2 font-display font-bold tracking-[-0.02em] text-[clamp(1.8rem,3.4vw,2.5rem)] leading-tight">{c.name}</h3>
        </div>
        <p className="text-[14px] text-leaf sm:text-right shrink-0">{c.status}</p>
      </header>
      <p className="mt-3 text-[1.1rem] text-ink max-w-[62ch]">{c.summary}</p>

      {hasShots ? (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-6">
          <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-9 gap-x-8 gap-y-5 content-start">
            <div className="md:col-span-4 flex flex-col gap-5">{problem}{role}{results}</div>
            <div className="md:col-span-5 flex flex-col gap-5">{decisions}{stack}</div>
          </div>
          <div className="lg:col-span-3">
            <Proof c={c} onZoom={setZoom} />
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-6">
          <div className="lg:col-span-4 flex flex-col gap-6">{problem}{role}</div>
          <div className="lg:col-span-5">{decisions}</div>
          <div className="lg:col-span-3 flex flex-col gap-6">
            {stack}
            {results}
            {c.logo && <img src={c.logo.src} alt={c.logo.alt} loading="lazy" width={360} height={120} className="w-40 rounded-md bg-white p-2" />}
          </div>
        </div>
      )}

      {hasShots && <Lightbox shots={c.shots} index={zoom} onChange={setZoom} title={c.name} />}
    </article>
  )
}

export default function Cases() {
  return (
    <section id="projetos" className="scroll-mt-16 pt-8 sm:pt-10">
      <div className="page">
        <div className="max-w-[62ch]">
          <h2 className="font-display font-bold tracking-[-0.02em] text-[clamp(2rem,4vw,3rem)] leading-tight">Projetos</h2>
          <p className="mt-3 text-soft">
            Para cada um: o problema, o que eu fiz, as decisões técnicas e o resultado. Os da IB System são produtos da empresa em que trabalho; os pessoais eu faço e mantenho sozinho.
          </p>
        </div>
        <div className="mt-6">
          {CASES.map((c, i) => <CaseView key={c.slug} c={c} n={i + 1} />)}
        </div>
      </div>
    </section>
  )
}
