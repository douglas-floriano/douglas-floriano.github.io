import { motion } from 'framer-motion'
import { Building2, Dumbbell, ExternalLink, Layers, Ticket, TrendingUp, User, Wine } from 'lucide-react'
import { SectionHeader } from './Section'

type Project = {
  icon: typeof Layers
  category: 'ib-system' | 'pessoal'
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
    category: 'ib-system',
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
    icon: TrendingUp,
    category: 'ib-system',
    tag: 'Fintech · Capital',
    title: 'IB3Capital',
    subtitle: 'Plataforma financeira para gestão de capital e investimentos',
    description:
      'Sistema completo para controle de operações, carteiras e relatórios de performance. Foco em confiabilidade, auditoria e precisão numérica — áreas onde erro custa caro.',
    highlights: [
      'Cálculos financeiros precisos com controle transacional rigoroso',
      'Dashboards analíticos em tempo real para tomada de decisão',
      'Integrações com serviços externos e webhooks',
      'Controle fino de permissões e trilha de auditoria',
    ],
    tech: ['Laravel', 'React', 'MySQL', 'AWS', 'Docker'],
    accent: 'from-brand-violet to-brand-cyan',
  },
  {
    icon: Ticket,
    category: 'ib-system',
    tag: 'SaaS · Eventos',
    title: 'IBticket',
    subtitle: 'Plataforma de venda e gestão de ingressos online',
    description:
      'Solução end-to-end para organizadores de eventos — desde a criação do evento até a validação na entrada. Checkout rápido, emissão de ingressos digitais e painel em tempo real para o produtor.',
    highlights: [
      'Checkout otimizado com integração de gateway de pagamento',
      'Emissão e validação de ingressos via QR Code',
      'Painel em tempo real para o produtor do evento',
      'Relatórios de vendas, cupons e performance por canal',
    ],
    tech: ['Laravel', 'React', 'MySQL', 'AWS S3', 'CloudFront'],
    accent: 'from-brand-pink to-brand-violet',
  },
  {
    icon: Dumbbell,
    category: 'pessoal',
    tag: 'Produto · Academia',
    title: 'HASGym',
    subtitle: 'Sistema de gestão para academias e estúdios',
    description:
      'Plataforma própria voltada para academias gerenciarem alunos, planos, treinos e mensalidades. Projetado para ser simples de operar no dia a dia, mas robusto o suficiente para escalar.',
    highlights: [
      'Cadastro de alunos, planos e controle de mensalidades',
      'Gestão de treinos e acompanhamento individual',
      'Controle financeiro e relatórios operacionais',
      'Interface focada em velocidade no balcão',
    ],
    tech: ['React', 'Laravel', 'MySQL', 'REST API'],
    accent: 'from-brand-lime to-brand-cyan',
  },
  {
    icon: Wine,
    category: 'pessoal',
    tag: 'Produto · Bares',
    title: 'SistemaBar',
    subtitle: 'Sistema de gestão para bares com integração WhatsApp',
    description:
      'Plataforma completa para operações de bar: comandas, estoque, fechamento de caixa, relatórios e canal WhatsApp. Frontend React + Vite, backend Laravel, multi-tenant por cliente.',
    highlights: [
      'Arquitetura multi-tenant com isolamento por cliente',
      'Integração WhatsApp reutilizando infraestrutura IB System',
      'Interface responsiva otimizada para operação rápida no balcão',
      'Relatórios de fechamento e consumo em tempo real',
    ],
    tech: ['React', 'Vite', 'Laravel', 'Node.js', 'MySQL'],
    accent: 'from-brand-pink to-brand-lime',
  },
]

function CategoryBadge({ category }: { category: Project['category'] }) {
  const isIB = category === 'ib-system'
  const Icon = isIB ? Building2 : User
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.15em] border ${
        isIB
          ? 'bg-brand-violet/10 border-brand-violet/40 text-brand-cyan'
          : 'bg-brand-pink/10 border-brand-pink/40 text-brand-pink'
      }`}
    >
      <Icon className="h-3 w-3" />
      {isIB ? 'IB System' : 'Projeto Pessoal'}
    </span>
  )
}

export default function Projects() {
  return (
    <section id="projetos" className="relative py-28 px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Projetos"
          title={<>Entregas em <span className="gradient-text">produção</span>.</>}
          description="Três plataformas construídas na IB System e dois produtos pessoais — cada um em operação real, com usuários reais."
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
                className="relative glass glow-border rounded-3xl p-6 sm:p-10 overflow-hidden"
              >
                <div className={`pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br ${p.accent} opacity-20 blur-3xl`} />

                <div className="relative grid lg:grid-cols-12 gap-6 lg:gap-8">
                  <div className="lg:col-span-7">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${p.accent} text-ink-900`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-mono uppercase tracking-[0.2em] text-gray-400">{p.tag}</span>
                      <CategoryBadge category={p.category} />
                    </div>

                    <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">{p.title}</h3>
                    <p className="text-gray-400 text-base sm:text-lg mb-5">{p.subtitle}</p>
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
