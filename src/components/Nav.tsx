import { useEffect, useState } from 'react'
import Logo, { Wordmark } from './Logo'

const links = [
  { num: '01', href: '#top',        label: 'Início' },
  { num: '02', href: '#now',        label: 'Hoje' },
  { num: '03', href: '#trajetoria', label: 'Trajetória' },
  { num: '04', href: '#trabalho',   label: 'Trabalho' },
  { num: '04', href: '#projetos',   label: 'Projetos' },
  { num: '05', href: '#stack',      label: 'Stack' },
  { num: '06', href: '#processo',   label: 'Processo' },
  { num: '07', href: '#contato',    label: 'Contato' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 inset-x-0 z-40 transition-colors duration-300 ${scrolled ? 'backdrop-blur-md bg-paper/85 border-b border-rule' : 'bg-transparent'}`}>
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10 h-16 sm:h-20 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2.5 group">
          <Logo size={30} />
          <div className="leading-none flex flex-col gap-0.5">
            <Wordmark className="text-base sm:text-lg text-ink" />
            <span className="hidden sm:block font-mono text-[8.5px] uppercase tracking-[0.28em] text-muted">studio of one</span>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-7">
          {links.map(l => (
            <a key={l.href} href={l.href} className="group relative font-mono text-[11px] uppercase tracking-[0.18em] text-ink2 hover:text-ink transition-colors">
              <span className="text-muted mr-1.5 tabular">{l.num}</span>
              {l.label}
              <span className="absolute left-0 -bottom-1 h-px w-0 bg-accent transition-all group-hover:w-full" />
            </a>
          ))}
        </nav>

        <a href="mailto:douglas198.floriano@hotmail.com" className="hidden md:inline-flex btn-ink !py-2 !px-4 !text-[12px]">
          Conversar
          <span aria-hidden>→</span>
        </a>

        <button
          aria-label="Menu"
          onClick={() => setOpen(o => !o)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <span className={`w-5 h-px bg-ink transition-transform ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`w-5 h-px bg-ink transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`w-5 h-px bg-ink transition-transform ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-rule bg-paper">
          <div className="px-6 py-6 space-y-4">
            {links.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block font-serif text-2xl text-ink">
                <span className="font-mono text-[11px] text-muted mr-2 tabular">{l.num}</span>
                {l.label}
              </a>
            ))}
            <a href="mailto:douglas198.floriano@hotmail.com" className="btn-ink mt-2">Conversar →</a>
          </div>
        </div>
      )}
    </header>
  )
}
