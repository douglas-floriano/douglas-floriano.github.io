import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const links = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#stack', label: 'Stack' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#infra', label: 'Infra' },
  { href: '#contato', label: 'Contato' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[min(960px,calc(100vw-1rem))]"
      >
        <div className="glass glow-border rounded-full pl-3 pr-2 sm:pl-5 sm:pr-3 py-2 sm:py-2.5 flex items-center gap-2 sm:gap-4">
          <a href="#top" className="flex items-center gap-2 font-display font-bold shrink-0 mr-auto md:mr-0">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-cyan via-brand-violet to-brand-pink text-ink-900 text-sm shrink-0">DF</span>
            <span className="hidden sm:inline text-white text-sm">Douglas Floriano</span>
          </a>

          <ul className="hidden md:flex flex-1 items-center justify-center gap-0.5">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="px-2.5 lg:px-3 py-1.5 text-sm text-gray-300 hover:text-white rounded-full hover:bg-white/5 transition whitespace-nowrap"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contato"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-cyan to-brand-violet text-ink-900 text-sm font-semibold shrink-0 hover:shadow-[0_0_24px_rgba(56,189,248,0.5)] transition-shadow whitespace-nowrap"
          >
            Conversar
          </a>

          <button
            aria-label="Abrir menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition shrink-0"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-1/2 z-40 -translate-x-1/2 w-[min(420px,calc(100vw-1rem))] md:hidden"
          >
            <div className="glass glow-border rounded-2xl p-4">
              <ul className="flex flex-col gap-1">
                {links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-3 text-sm text-gray-200 hover:text-white hover:bg-white/5 rounded-xl transition"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
                <li className="pt-2">
                  <a
                    href="#contato"
                    onClick={() => setOpen(false)}
                    className="block text-center px-4 py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-violet text-ink-900 font-semibold"
                  >
                    Vamos conversar
                  </a>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
