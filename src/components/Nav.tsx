import { motion } from 'framer-motion'

const links = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#stack', label: 'Stack' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#infra', label: 'Infra' },
  { href: '#contato', label: 'Contato' },
]

export default function Nav() {
  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[min(960px,92vw)]"
    >
      <div className="glass glow-border rounded-full px-5 py-3 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 font-display font-bold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-cyan via-brand-violet to-brand-pink text-ink-900 text-sm">DF</span>
          <span className="hidden sm:inline text-white">Douglas Floriano</span>
        </a>
        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="px-3 py-1.5 text-sm text-gray-300 hover:text-white rounded-full hover:bg-white/5 transition"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#contato"
          className="text-sm px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-cyan to-brand-violet text-ink-900 font-semibold hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-shadow"
        >
          Vamos conversar
        </a>
      </div>
    </motion.nav>
  )
}
