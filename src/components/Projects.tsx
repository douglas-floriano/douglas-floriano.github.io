import { motion } from 'framer-motion'
import { ExternalLink, Layers, MessageSquare, Wine } from 'lucide-react'
import { SectionHeader } from './Section'

type Project = {
  icon: typeof Layers
  tag: string
  title: string
  subtitle: string
  description: string
  highlights: string[]
  tech: string[]
  accent: string
  link?: { label: string; href: string }
}

const projects: Project[] = [
  {
    icon: Layers,
    tag: 'SaaS · Real Estate',
    title: 'Lotemobile / WalletLote',
    subtitle: 'Plataforma SaaS multi-tenant para loteadoras e incorporadoras',
    description:
      'Arquitetura completa — backend Laravel único servindo dois frontends React (área do cliente e painel administrativo). Gestão de lotes, contratos, comissões, financeiro e relatórios gerenciais.',
    highlights: [
      'Monorepo com 3 serviços (1 API + 2 SPAs)',
      'Infra AWS ECS com Prod + Dev isolados (Horizon, Scheduler, PHP-FPM, Nginx)',
      'Deploy contínuo via GitHub Actions + ECR + CloudFront',
      'CDN global para frontends (S3 + CloudFront com invalidação automática)',
    ],
    tech: ['Laravel 10', 'React', 'AWS ECS', 'RDS MariaDB', 'CloudFront', 'Horizon', 'Docker'],
    accent: 'from-brand-cyan to-brand-violet',
    link: { label: 'admin.walletlote.app.br', href: 'https://admin.walletlote.app.br' },
  },
  {
    icon: MessageSquare,
    tag: 'Microserviço · Integração',
    title: 'CRM WhatsApp',
    subtitle: 'Microserviço Node/TypeScript para integração WhatsApp Web',
    description:
      'API REST tipada em TypeScript que expõe sessões do WhatsApp Web para qualquer backend consumir — envio de mensagens, QR Code, webhooks e persistência em MongoDB. Documentado com Swagger, containerizado com Docker.',
    highlights: [
      'Express + TypeScript + MongoDB + Puppeteer',
      'Swagger UI autoexplicativo para integração por outros times',
      'Docker Compose para dev e prod, CI/CD com AppSpec',
      'Servindo múltiplos produtos internos simultaneamente',
    ],
    tech: ['Node.js', 'TypeScript', 'Express', 'MongoDB', 'whatsapp-web.js', 'Puppeteer', 'Docker', 'Swagger'],
    accent: 'from-brand-violet to-brand-pink',
  },
  {
    icon: Wine,
    tag: 'Produto · Bares & Restaurantes',
    title: 'SistemaBar',
    subtitle: 'Sistema de gestão para bares com integração WhatsApp multi-tenant',
    description:
      'Plataforma completa para operações de bar: comandas, estoque, fechamento de caixa, relatórios e canal WhatsApp por cliente. Frontend React + Vite, backend Laravel e microserviço Node para sessões isoladas por tenant.',
    highlights: [
      'Arquitetura multi-tenant com isolamento por cliente',
      'Microserviço WhatsApp próprio com QR code em tempo real',
      'Interface responsiva otimizada para operação rápida no balcão',
      'Integração com o CRM WhatsApp central para reduzir custos',
    ],
    tech: ['React', 'Vite', 'Laravel', 'Node.js', 'MySQL', 'whatsapp-web.js'],
    accent: 'from-brand-pink to-brand-lime',
  },
]

export default function Projects() {
  return (
    <section id="projetos" className="relative py-28 px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Projetos"
          title={<>Entregas em <span className="gradient-text">produção</span>.</>}
          description="Produtos reais, com usuários reais e infraestrutura de verdade. Abaixo, três deles em destaque."
        />

        <div className="space-y-8">
          {projects.map((p, idx) => {
            const Icon = p.icon
            return (
              <motion.article
                key={p.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: idx * 0.05 }}
                className="relative glass glow-border rounded-3xl p-8 sm:p-10 overflow-hidden"
              >
                <div className={`pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br ${p.accent} opacity-20 blur-3xl`} />

                <div className="relative grid lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-7">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${p.accent} text-ink-900`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-mono uppercase tracking-[0.2em] text-gray-400">{p.tag}</span>
                    </div>

                    <h3 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">{p.title}</h3>
                    <p className="text-gray-400 text-lg mb-5">{p.subtitle}</p>
                    <p className="text-gray-300 leading-relaxed mb-6">{p.description}</p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {p.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-gray-300 font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {p.link && (
                      <a
                        href={p.link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-brand-cyan hover:text-white transition"
                      >
                        {p.link.label}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>

                  <div className="lg:col-span-5">
                    <div className="rounded-2xl border border-white/10 bg-ink-800/60 p-5">
                      <p className="text-xs font-mono text-brand-cyan uppercase tracking-wider mb-3">Destaques</p>
                      <ul className="space-y-2.5">
                        {p.highlights.map((h) => (
                          <li key={h} className="flex gap-2 text-sm text-gray-300">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gradient-to-br from-brand-cyan to-brand-violet flex-shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
