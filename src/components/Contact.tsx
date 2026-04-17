import { motion } from 'framer-motion'
import { Mail, MapPin, Phone } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './BrandIcons'

const channels = [
  { icon: Mail, label: 'Email', value: 'douglas@ibsystem.com.br', href: 'mailto:douglas@ibsystem.com.br' },
  { icon: Phone, label: 'WhatsApp', value: '(16) 99181-6628', href: 'https://wa.me/5516991816628' },
  { icon: LinkedinIcon, label: 'LinkedIn', value: '/in/douglas-costa', href: 'https://www.linkedin.com/in/douglas-costa-b581ab1a1/' },
  { icon: GithubIcon, label: 'GitHub', value: 'douglas-floriano', href: 'https://github.com/douglas-floriano' },
]

export default function Contact() {
  return (
    <section id="contato" className="relative py-28 px-6">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="relative glass glow-border rounded-3xl p-10 sm:p-14 overflow-hidden"
        >
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-brand-cyan/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-brand-pink/20 blur-3xl" />

          <div className="relative text-center max-w-2xl mx-auto">
            <span className="inline-block text-xs font-mono uppercase tracking-[0.24em] text-brand-cyan">Contato</span>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold text-white">
              Pronto para construir <span className="gradient-text">o próximo</span>?
            </h2>
            <p className="mt-4 text-gray-400 text-lg">
              Projetos novos, consultoria de arquitetura, revisão de infra AWS ou integração de WhatsApp em escala — me chama, eu respondo rápido.
            </p>

            <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-400">
              <MapPin className="h-4 w-4" /> Itirapuã — SP · Brasil
            </div>

            <div className="mt-10 grid sm:grid-cols-2 gap-3">
              {channels.map((c) => {
                const Icon = c.icon
                return (
                  <a
                    key={c.label}
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06] hover:border-white/20 transition"
                  >
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-cyan/30 to-brand-violet/30 ring-1 ring-white/10">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-mono uppercase tracking-wider text-gray-500">{c.label}</div>
                      <div className="text-white text-sm">{c.value}</div>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
