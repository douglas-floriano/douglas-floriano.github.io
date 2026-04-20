import { motion } from 'framer-motion'
import { Suspense, lazy } from 'react'
import { SectionHeader } from './Section'

const TechOrb = lazy(() => import('./TechOrb'))

type Tech = { name: string; color: string }

const groups: { title: string; items: Tech[] }[] = [
  {
    title: 'Backend',
    items: [
      { name: 'PHP 8.2', color: '#8892be' },
      { name: 'Laravel 10', color: '#ff2d20' },
      { name: 'Node.js', color: '#3c873a' },
      { name: 'TypeScript', color: '#3178c6' },
      { name: 'Express', color: '#6e6e6e' },
      { name: 'Horizon / Queues', color: '#ff2d20' },
      { name: 'REST APIs', color: '#22d3ee' },
    ],
  },
  {
    title: 'Frontend',
    items: [
      { name: 'React 18', color: '#61dafb' },
      { name: 'Vite', color: '#a855f7' },
      { name: 'TypeScript', color: '#3178c6' },
      { name: 'Tailwind', color: '#38bdf8' },
      { name: 'PrimeReact', color: '#1ea97c' },
      { name: 'Bootstrap', color: '#7952b3' },
      { name: 'Framer Motion', color: '#ec4899' },
      { name: 'Three.js / R3F', color: '#ffffff' },
    ],
  },
  {
    title: 'Dados',
    items: [
      { name: 'MariaDB', color: '#c0765a' },
      { name: 'MySQL', color: '#00758f' },
      { name: 'MongoDB', color: '#47a248' },
      { name: 'Redis', color: '#dc382d' },
      { name: 'Eloquent ORM', color: '#ff2d20' },
    ],
  },
  {
    title: 'Cloud & DevOps',
    items: [
      { name: 'AWS ECS', color: '#ff9900' },
      { name: 'AWS S3', color: '#ff9900' },
      { name: 'CloudFront', color: '#ff9900' },
      { name: 'RDS', color: '#ff9900' },
      { name: 'Docker', color: '#2496ed' },
      { name: 'GitHub Actions', color: '#ffffff' },
      { name: 'CI/CD', color: '#a855f7' },
      { name: 'CodePipeline', color: '#ff9900' },
    ],
  },
  {
    title: 'Integrações',
    items: [
      { name: 'WhatsApp Web', color: '#25d366' },
      { name: 'Puppeteer', color: '#40b5a4' },
      { name: 'Stripe / Pagamentos', color: '#635bff' },
      { name: 'Swagger', color: '#85ea2d' },
      { name: 'Webhooks', color: '#22d3ee' },
    ],
  },
]

export default function Stack() {
  return (
    <section id="stack" className="relative py-28 px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Stack"
          title={<>Ferramental de <span className="gradient-text">um senior</span>.</>}
          description="Combinações que já coloquei em produção — com ownership de ponta a ponta, não só prova de conceito."
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9 }}
          className="relative mb-10 h-[420px] sm:h-[480px] rounded-3xl overflow-hidden glass glow-border touch-none"
        >
          <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-brand-violet/10 to-brand-cyan/10 animate-pulse" />}>
            <TechOrb />
          </Suspense>
          <div className="pointer-events-none absolute top-4 left-5 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-cyan animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">cluster interativo · arraste</span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {groups.map((g, idx) => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="glass glow-border rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="font-mono text-xs text-brand-cyan">{String(idx + 1).padStart(2, '0')}</span>
                <h3 className="font-display text-lg text-white">{g.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {g.items.map((t) => (
                  <span
                    key={t.name}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-gray-200 hover:bg-white/[0.08] transition"
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: t.color }} />
                    {t.name}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
