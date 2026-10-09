import { useState } from 'react'
import { ArrowUpRight, Images } from 'lucide-react'
import { OTHERS, type Other } from '../data/projects'
import Lightbox from './Lightbox'

function Row({ o }: { o: Other }) {
  const [zoom, setZoom] = useState<number | null>(null)
  return (
    <li className="py-3.5 border-t border-line grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-1.5">
      <div className="md:col-span-3">
        <h3 className="font-display font-semibold text-[1.2rem] leading-tight">{o.name}</h3>
        <p className="text-[13.5px] text-muted">{o.org}</p>
      </div>
      <p className="md:col-span-6 text-soft text-[16px]">
        {o.line} <span className="text-muted text-[14.5px]">{o.stack}.</span>
      </p>
      <div className="md:col-span-3 flex md:justify-end gap-4 items-start text-[14.5px]">
        {o.shots && o.shots.length > 0 && (
          <button type="button" onClick={() => setZoom(0)} className="inline-flex items-center gap-1.5 link">
            <Images size={15} aria-hidden /> {o.shots.length} telas
          </button>
        )}
        {o.url && (
          <a href={o.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 link">
            Abrir <ArrowUpRight size={15} aria-hidden />
          </a>
        )}
      </div>
      {o.shots && <Lightbox shots={o.shots} index={zoom} onChange={setZoom} title={o.name} />}
    </li>
  )
}

export default function Others() {
  return (
    <section id="outros" className="py-9 sm:py-11">
      <div className="page">
        <h2 className="font-display font-bold tracking-[-0.02em] text-[clamp(1.6rem,3vw,2.1rem)]">Outros projetos</h2>
        <ul className="mt-5 border-b border-line">
          {OTHERS.map((o) => <Row key={o.slug} o={o} />)}
        </ul>
      </div>
    </section>
  )
}
