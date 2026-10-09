import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import Mark from './Mark'

const LINKS = [
  ['projetos', 'Projetos'],
  ['como-trabalho', 'Como trabalho'],
  ['ferramentas', 'Ferramentas'],
  ['trajetoria', 'Trajetória'],
  ['contato', 'Contato'],
] as const

// Seção ativa: a última cujo topo já passou de um terço da tela.
// No fim da página, a última seção fica ativa mesmo que seja curta.
function currentSection() {
  const line = window.innerHeight * 0.33
  const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
  if (atBottom) return LINKS[LINKS.length - 1][0]
  let id = ''
  for (const [sid] of LINKS) {
    const el = document.getElementById(sid)
    if (el && el.getBoundingClientRect().top <= line) id = sid
  }
  return id
}

export default function Nav() {
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      setSolid(window.scrollY > 24)
      setActive(currentSection())
    }
    const req = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', req, { passive: true })
    window.addEventListener('resize', req)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', req); window.removeEventListener('resize', req) }
  }, [])

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-colors ${solid || open ? 'bg-bg/95 border-b border-line' : ''}`}>
      <div className="page flex items-center justify-between h-16">
        <a href="#inicio" className="flex items-center gap-3" aria-label="Douglas Floriano, voltar ao início">
          <Mark />
          <span className="font-display font-semibold text-[17px]">Douglas Floriano</span>
        </a>

        <nav className="hidden md:flex items-center gap-1" aria-label="Seções">
          {LINKS.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={active === id ? 'true' : undefined}
              className={`px-3 py-2 rounded-md text-[15px] transition-colors ${active === id ? 'text-amber' : 'text-soft hover:text-ink'}`}
            >
              {label}
            </a>
          ))}
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden w-11 h-11 grid place-items-center rounded-md border border-line"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <nav className="md:hidden page pb-3 flex flex-col" aria-label="Seções">
          {LINKS.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setOpen(false)}
              className={`py-3 text-lg font-display border-t border-line ${active === id ? 'text-amber' : ''}`}
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
