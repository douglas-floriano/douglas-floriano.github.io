import { useEffect, useState } from 'react'

const ITEMS = [
  ['hero',     '00'],
  ['pulse',    '01'],
  ['journey',  '02'],
  ['work',     '03'],
  ['stack',    '04'],
  ['manifesto','05'],
  ['contact',  '06'],
] as const

export default function Nav() {
  const [active, setActive] = useState('hero')

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    ITEMS.forEach(([id]) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <nav className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3">
        {ITEMS.map(([id, num]) => (
          <a key={id} href={`#${id}`} className="group flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em]">
            <span className={`h-px transition-all ${active === id ? 'w-10 bg-accent' : 'w-5 bg-line group-hover:bg-muted group-hover:w-8'}`} />
            <span className={active === id ? 'text-accent' : 'text-muted group-hover:text-ink2'}>{num} · {id}</span>
          </a>
        ))}
      </nav>

      <a href="#hero" className="fixed top-12 left-4 sm:left-6 z-40 font-mono text-xs tracking-[0.22em] uppercase text-ink hover:text-accent transition-colors">
        floriano<span className="text-accent">.</span>os
      </a>

      <a href="#contact" className="fixed top-11 right-4 sm:right-6 z-40 font-mono text-[10px] uppercase tracking-[0.22em] text-bg bg-accent px-3 py-1.5 rounded hover:bg-ink hover:text-accent transition-colors">
        $ contact →
      </a>
    </>
  )
}
