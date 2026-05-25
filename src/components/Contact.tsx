import { useEffect, useRef, useState } from 'react'

const SCRIPT = [
  { in: 'whoami', out: 'douglas-floriano-costa · senior fullstack · pt-BR' },
  { in: 'cat availability.json', out: '{ "next_slot": "Q3 2026", "type": ["projeto pontual","retainer","squad lead"], "remote": true }' },
  { in: 'curl -X POST /contact', out: '→ douglas198.floriano@hotmail.com · response < 24h' },
  { in: 'tail location.log',     out: 'Itirapuã / SP · BR · America/Sao_Paulo (UTC-3)' },
]

function useTypewriter(lines: typeof SCRIPT, active: boolean) {
  const [shown, setShown] = useState<{ in: string; out: string }[]>([])
  const [typing, setTyping] = useState('')
  const idx = useRef(0)
  const sub = useRef(0)
  const phase = useRef<'in' | 'pause' | 'out' | 'gap'>('in')

  useEffect(() => {
    if (!active) return
    let raf: number
    const tick = () => {
      const cur = lines[idx.current]
      if (!cur) return
      if (phase.current === 'in') {
        if (sub.current < cur.in.length) {
          sub.current++
          setTyping(cur.in.slice(0, sub.current))
          raf = window.setTimeout(tick, 45 + Math.random() * 50) as unknown as number
        } else {
          phase.current = 'pause'
          raf = window.setTimeout(tick, 350) as unknown as number
        }
      } else if (phase.current === 'pause') {
        phase.current = 'out'
        raf = window.setTimeout(tick, 250) as unknown as number
      } else if (phase.current === 'out') {
        setShown((s) => [...s, cur])
        setTyping('')
        sub.current = 0
        phase.current = 'gap'
        raf = window.setTimeout(tick, 700) as unknown as number
      } else {
        idx.current++
        phase.current = 'in'
        if (idx.current < lines.length) raf = window.setTimeout(tick, 200) as unknown as number
      }
    }
    raf = window.setTimeout(tick, 400) as unknown as number
    return () => window.clearTimeout(raf)
  }, [lines, active])

  return { shown, typing, done: shown.length >= lines.length }
}

export default function Contact() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true) }, { threshold: 0.3 })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const { shown, typing, done } = useTypewriter(SCRIPT, active)

  return (
    <section id="contact" className="relative py-24 sm:py-32 border-t border-line">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8 lg:px-16">
        <div className="section-head">
          <span className="kicker">/ 06</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">contact · open session</h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-6">
            <h3 className="display text-[clamp(2.4rem,7vw,5.5rem)] text-ink">
              vamos construir<br/>algo que <em>aguenta</em>.
            </h3>
            <p className="mt-8 text-base sm:text-lg text-ink2 leading-relaxed max-w-md">
              Projeto pontual, retainer ou tech lead de squad. Sem agência, sem intermediário — você fala direto com quem vai escrever a primeira migration e o último deploy.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <a href="mailto:douglas198.floriano@hotmail.com" className="btn-primary">
                $ mail → douglas
              </a>
              <a href="https://wa.me/5516994527410" target="_blank" rel="noreferrer" className="btn-ghost">whatsapp</a>
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md">
              {[
                ['github',  'https://github.com/douglas-floriano'],
                ['linkedin','https://www.linkedin.com/in/douglas-costa-b581ab1a1/'],
                ['cv',      '/cv-douglas-floriano-costa.pdf'],
                ['email',   'mailto:douglas198.floriano@hotmail.com'],
              ].map(([k, h]) => (
                <a key={k} href={h} className="text-center py-2 border border-line rounded text-[10px] font-mono uppercase tracking-[0.22em] text-muted hover:text-accent hover:border-accent transition-colors">{k}</a>
              ))}
            </div>
          </div>

          <div ref={ref} className="lg:col-span-6">
            <div className="term shadow-2xl shadow-accent/10">
              <div className="term-header">
                <span className="term-dot bg-hot" />
                <span className="term-dot bg-warn" />
                <span className="term-dot bg-accent" />
                <span className="ml-2 text-muted text-[10px] uppercase tracking-[0.18em]">douglas@floriano.os ~ %</span>
              </div>
              <div className="term-body min-h-[280px] text-[13px] leading-loose">
                {shown.map((l, i) => (
                  <div key={i} className="mb-2">
                    <div><span className="text-accent">$</span> <span className="text-ink2">{l.in}</span></div>
                    <div className="text-muted pl-3 break-all">{l.out}</div>
                  </div>
                ))}
                {!done && (
                  <div>
                    <span className="text-accent">$</span> <span className="text-ink2">{typing}</span><span className="caret" />
                  </div>
                )}
                {done && (
                  <div>
                    <span className="text-accent">$</span> <span className="caret" />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
              session: read-only · output simulado · resposta real em &lt; 24h
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
