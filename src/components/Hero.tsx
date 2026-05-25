import { useEffect, useState } from 'react'

const ASCII = `       ░█▀▄░█▀█░█░█░█▀▀░█░░░█▀█░█▀▀
       ░█░█░█░█░█░█░█░█░█░░░█▀█░▀▀█
       ░▀▀░░▀▀▀░▀▀▀░▀▀▀░▀▀▀░▀░▀░▀▀▀
                ┌──────────────┐
                │  fullstack   │
                │  senior · BR │
                └──────────────┘`

const CHARS = '!<>-_\\/[]{}—=+*^?#________'

function useScramble(target: string, start: boolean) {
  const [out, setOut] = useState('')
  useEffect(() => {
    if (!start) return
    let frame = 0
    const total = target.length
    let raf: number
    const tick = () => {
      let s = ''
      for (let i = 0; i < total; i++) {
        const reveal = frame / 2.2 > i
        s += reveal ? target[i] : CHARS[Math.floor(Math.random() * CHARS.length)]
      }
      setOut(s)
      frame++
      if (frame / 2.2 < total + 2) raf = requestAnimationFrame(tick)
      else setOut(target)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, start])
  return out
}

export default function Hero() {
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 250)
    const t2 = setTimeout(() => setPhase(2), 900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const name = useScramble('DOUGLAS FLORIANO', phase >= 1)
  const role = useScramble('senior fullstack · arquiteto de sistemas em produção', phase >= 2)

  return (
    <section id="hero" className="relative pt-28 sm:pt-32 pb-24 sm:pb-32 bg-grid">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8 lg:px-16">

        {/* meta line */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-10 font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted">
          <span className="glow-pill"><span className="live-dot" /> aceitando projetos · q3·2026</span>
          <span className="hidden sm:inline">vol.07 · portfólio · 2026</span>
          <span className="hidden md:inline">Itirapuã / SP · BR</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-end">
          {/* Left: name + headline */}
          <div className="lg:col-span-8">
            <p className="kicker mb-4">$ whoami</p>
            <h1 className="display text-[clamp(2.6rem,9.5vw,8rem)] text-ink">
              <span className="block">{name}</span>
              <span className="block mt-2 text-ink2 font-display font-light text-[0.42em] tracking-[-0.01em] leading-[1.2]">
                {role}
              </span>
            </h1>
            <div className="mt-4 h-px w-24 bg-accent" />

            <div className="mt-12 grid sm:grid-cols-12 gap-6 max-w-3xl">
              <p className="sm:col-span-7 text-base sm:text-lg text-ink2 leading-relaxed">
                Quase uma década construindo plataformas que <em className="font-serif text-accent italic">rodam em produção</em> — não protótipo, não tutorial, não toy project. Banco de dados ao pixel, AWS ao client-side.
              </p>
              <p className="sm:col-span-5 text-sm text-muted leading-relaxed sm:pl-6 sm:border-l sm:border-line">
                Loteadoras, fintechs, eventos, academias. Laravel · React · React Native · AWS ECS. Sistemas usados todo dia, sem desculpa.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a href="#work" className="btn-primary">
                <span>./trabalho_selecionado</span>
                <span aria-hidden>→</span>
              </a>
              <a href="mailto:douglas198.floriano@hotmail.com" className="btn-ghost">
                <span>cat email.txt</span>
              </a>
              <a href="/cv-douglas-floriano-costa.pdf" download className="btn-ghost">
                <span>./cv.pdf</span>
              </a>
            </div>
          </div>

          {/* Right: ascii + identity card */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <pre className="ascii hidden md:block">{ASCII}</pre>

            <div className="term">
              <div className="term-header">
                <span className="term-dot bg-hot" />
                <span className="term-dot bg-warn" />
                <span className="term-dot bg-accent" />
                <span className="ml-2 text-muted text-[10px] uppercase tracking-[0.18em]">~/identity.json</span>
              </div>
              <div className="term-body text-[12px] leading-relaxed">
                <div><span className="text-muted">"role":</span> <span className="text-accent">"senior fullstack"</span>,</div>
                <div><span className="text-muted">"years":</span> <span className="text-info">9.4</span>,</div>
                <div><span className="text-muted">"stack":</span> <span className="text-accent">["laravel", "react", "aws"]</span>,</div>
                <div><span className="text-muted">"shipped":</span> <span className="text-info">"10+ saas"</span>,</div>
                <div><span className="text-muted">"timezone":</span> <span className="text-accent">"America/Sao_Paulo"</span>,</div>
                <div><span className="text-muted">"available":</span> <span className="text-accent">true</span></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                ['gh',  'github.com/douglas-floriano',          'https://github.com/douglas-floriano'],
                ['in',  'linkedin.com/in/douglas-costa',        'https://www.linkedin.com/in/douglas-costa-b581ab1a1/'],
                ['cv',  'cv-douglas-floriano-costa.pdf',        '/cv-douglas-floriano-costa.pdf'],
              ].map(([k, _, href]) => (
                <a key={k} href={href} target={k === 'cv' ? undefined : '_blank'} rel="noreferrer" className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted hover:text-accent text-center py-2 border border-line rounded hover:border-accent transition-colors">
                  {k}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 border-y border-line py-8">
          {[
            ['9.4', 'anos em produção'],
            ['10+', 'plataformas shipped'],
            ['4',   'sistemas IB System'],
            ['99.97%','uptime médio'],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="metric-big text-ink tabular">{n}</div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted mt-2">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
