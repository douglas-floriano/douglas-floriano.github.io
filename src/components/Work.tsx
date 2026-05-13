import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

/* ---------- Types ---------- */

type IBProject = {
  num: string
  title: string
  role: string
  scope: string
  description: string
  metrics: { value: string; label: string }[]
  tech: string[]
  domain: string
  url?: string
  logo: string
  logoBg?: string
}

type Shot = { src: string; caption: string; mobile?: boolean }
type ShotGroup = { label: string; perfil: string; shots: Shot[] }

type PersonalProject = {
  num: string
  title: string
  role: string
  description: string
  story: string
  features: string[]
  tech: string[]
  status: string
  groups: ShotGroup[]
  logo: string
  logoBg?: string
}

/* ---------- Data ---------- */

const ibProjects: IBProject[] = [
  {
    num: '01',
    title: 'Lotemobile / WalletLote',
    role: 'Dev sênior · arquitetura monorepo + AWS ECS',
    scope: 'SaaS multi-tenant para loteadoras e incorporadoras',
    description:
      'Backend Laravel 10 único servindo dois frontends React (área do cliente e painel admin SaaS). Gestão de lotes, contratos, comissões, financeiro e cronograma de obra. Roda em ECS com containers PHP-FPM, Nginx, Horizon e Scheduler — prod e dev isolados.',
    metrics: [
      { value: '4 containers', label: 'por task ECS' },
      { value: '2 SPAs',       label: 'mesmo backend' },
      { value: 'Auto deploy',  label: 'GH Actions → ECR' },
    ],
    tech: ['Laravel 10', 'React', 'AWS ECS', 'RDS MariaDB', 'Horizon', 'CloudFront', 'Docker', 'GH Actions'],
    domain: 'admin.walletlote.app.br',
    url: 'https://admin.walletlote.app.br',
    logo: '/projects/logos/lotemobile.png',
    logoBg: 'bg-ink',
  },
  {
    num: '02',
    title: 'IBticket',
    role: 'Dev sênior · checkout, validação ao vivo, relatórios',
    scope: 'Plataforma de venda e gestão de ingressos online',
    description:
      'End-to-end para produtores: criação de evento, checkout otimizado com gateway PIX, ingresso digital com QR, validação em portaria em tempo real, cupons e relatórios por canal de venda. Painel ao vivo enquanto o evento acontece.',
    metrics: [
      { value: 'QR · live',   label: 'validação em portaria' },
      { value: 'Multi-canal', label: 'cupom + afiliados' },
      { value: 'PIX',         label: 'gateway integrado' },
    ],
    tech: ['Laravel', 'React', 'MySQL', 'AWS S3', 'CloudFront', 'PIX', 'WebSocket'],
    domain: 'IB System · interno',
    logo: '/projects/logos/ibticket.png',
  },
  {
    num: '03',
    title: 'HRT Invest',
    role: 'Dev sênior · web + app nativo + motor financeiro',
    scope: 'Plataforma de investimentos com app móvel',
    description:
      'Portal Next.js + app React Native (Expo) para investidores acompanharem carteira, fazerem aportes, P2P, contratos e transações. Backend Laravel com motor de cálculo financeiro auditável, controle transacional e trilha de auditoria.',
    metrics: [
      { value: 'Web + App',     label: 'mesma API' },
      { value: 'P2P',           label: 'empréstimos' },
      { value: 'Auditoria',     label: 'trilha completa' },
    ],
    tech: ['Laravel', 'Next.js', 'React Native', 'Expo', 'PostgreSQL', 'AWS'],
    domain: 'IB System · interno',
    logo: '/projects/logos/hrtinvest.png',
    logoBg: 'bg-ink',
  },
  {
    num: '04',
    title: 'IB3 Capital',
    role: 'Dev sênior · gestão de capital e operações',
    scope: 'Sistema de gestão de capital e investimentos institucionais',
    description:
      'Plataforma para controle de operações, carteiras e relatórios de performance. Foco em precisão, controle transacional rigoroso, integração com terceiros via webhooks e auditoria — área onde erro custa caro.',
    metrics: [
      { value: 'Precisão',     label: 'cálculo financeiro' },
      { value: 'Webhooks',     label: 'integrações externas' },
      { value: 'Auditoria',    label: 'fim a fim' },
    ],
    tech: ['Laravel', 'React', 'MySQL', 'AWS', 'Docker', 'Webhooks'],
    domain: 'IB System · interno',
    logo: '/projects/logos/ib3capital.png',
    logoBg: 'bg-ink',
  },
]

const personalProjects: PersonalProject[] = [
  {
    num: '05',
    title: 'HASGym',
    role: 'Founder · produto, design, código, infra',
    description:
      'Sistema completo para academias gerenciarem alunos, treinos, dietas, avaliações, mensalidades — com app do aluno em React Native. Tudo construído por uma pessoa só. Multi-academia para o mesmo aluno.',
    story:
      'Comecei como tentativa de organizar planilha de uma academia local — virou plataforma com landing pública, motor de mensalidades, biblioteca de exercícios, prescrição de dieta e app móvel. Seed automático, demo público, deploy num único comando.',
    features: [
      'Multi-tenant: 1 aluno em N academias',
      'Prescrição de treino + dieta com macros',
      'Avaliação física com evolução em série temporal',
      'Mensalidade automática + inadimplência',
      'App nativo iOS/Android (Expo)',
      'Demo público com seed automático',
    ],
    tech: ['React 19', 'Vite', 'TailwindCSS v4', 'Laravel', 'TypeScript', 'MySQL', 'React Native', 'Expo'],
    status: 'Em desenvolvimento · alpha',
    logo: '/projects/logos/hasgym.svg',
    logoBg: 'bg-ink',
    groups: [
      {
        label: 'Painel Dono',
        perfil: 'gym_owner',
        shots: [
          { src: '/projects/hasgym-owner-dashboard.png',   caption: 'Dashboard do dono · alunos ativos, mensalidades, ocupação ao vivo' },
          { src: '/projects/hasgym-owner-students.png',    caption: 'Gestão de alunos · cadastro, plano, mensalidade, status' },
          { src: '/projects/hasgym-owner-financial.png',   caption: 'Financeiro · mensalidades, inadimplência, histórico' },
          { src: '/projects/hasgym-owner-reports.png',     caption: 'Relatórios da operação · evolução por aluno e turma' },
          { src: '/projects/hasgym-owner-instructors.png', caption: 'Equipe de instrutores · vínculo + permissões' },
        ],
      },
      {
        label: 'Painel Instrutor',
        perfil: 'instructor',
        shots: [
          { src: '/projects/hasgym-instr-dashboard.png',   caption: 'Dashboard do instrutor · próximas avaliações, alunos ativos' },
          { src: '/projects/hasgym-instr-students.png',    caption: 'Meus alunos · prescrição de treino e dieta' },
          { src: '/projects/hasgym-instr-exercises.png',   caption: 'Biblioteca de exercícios · vídeos, grupo muscular, equipamento' },
          { src: '/projects/hasgym-instr-diets.png',       caption: 'Dietas · macros, refeições, acompanhamento' },
          { src: '/projects/hasgym-instr-evaluations.png', caption: 'Avaliação física · evolução em série temporal' },
        ],
      },
      {
        label: 'Admin SaaS',
        perfil: 'admin_master',
        shots: [
          { src: '/projects/hasgym-admin-dashboard.png',   caption: 'Painel da plataforma · academias, MRR, plano' },
          { src: '/projects/hasgym-admin-orgs.png',        caption: 'Tenants · cada academia é uma organization' },
          { src: '/projects/hasgym-admin-plans.png',       caption: 'Planos comerciais · limites por tenant' },
        ],
      },
      {
        label: 'App do aluno',
        perfil: 'student',
        shots: [
          { src: '/projects/hasgym-student-mobile-home.png',      caption: 'Home do aluno · mensalidade, treinos da semana', mobile: true },
          { src: '/projects/hasgym-student-mobile-workouts.png',  caption: 'Treino do dia · exercícios + execução guiada', mobile: true },
          { src: '/projects/hasgym-student-mobile-evolution.png', caption: 'Evolução · gráfico de cargas e medidas', mobile: true },
          { src: '/projects/hasgym-student-mobile-history.png',   caption: 'Histórico · sessões e tempo registrado', mobile: true },
          { src: '/projects/hasgym-student-mobile-financial.png', caption: 'Financeiro · status da mensalidade', mobile: true },
        ],
      },
    ],
  },
  {
    num: '06',
    title: 'Comanda.Sys',
    role: 'Founder · produto SaaS multi-tenant',
    description:
      'Sistema para bares, restaurantes e lanchonetes operarem comanda, caixa, cozinha, delivery e cardápio digital — com canal WhatsApp e cardápio público por slug do estabelecimento.',
    story:
      'Construído reaproveitando infra de mensageria. Multi-tenant real — cada cliente acessa pela URL `app/:slug`. Tem painel SaaS pra eu administrar tenants, planos, suporte e segurança. Da contratação ao primeiro pedido em poucos minutos.',
    features: [
      'Multi-tenant por slug · isolamento por cliente',
      'Comanda, caixa e fechamento em tempo real',
      'Delivery com cardápio público',
      'Cozinha com painel de pedidos',
      'Integração WhatsApp para reservas',
      'Painel SaaS · admins, planos, 2FA',
    ],
    tech: ['React', 'Vite', 'PrimeReact', 'Laravel', 'Node.js', 'MySQL', 'WhatsApp API'],
    status: 'Em desenvolvimento · multi-tenant',
    logo: '/projects/logos/comandasys.png',
    logoBg: 'bg-ink',
    groups: [
      {
        label: 'Tenant · Pizzaria Bella Massa',
        perfil: 'gerente',
        shots: [
          { src: '/projects/comandasys-pizzaria-comandas.png',  caption: 'Comandas em tempo real · mesas, balcão, retirada e delivery' },
          { src: '/projects/comandasys-pizzaria-cozinha.png',   caption: 'Painel da cozinha · pedidos por status' },
          { src: '/projects/comandasys-pizzaria-cardapio.png',  caption: 'Cardápio · produtos, categorias, preços' },
          { src: '/projects/comandasys-pizzaria-combos.png',    caption: 'Combos · pacotes promocionais' },
          { src: '/projects/comandasys-pizzaria-dashboard.png', caption: 'Dashboard do estabelecimento · vendas e ticket médio' },
          { src: '/projects/comandasys-pizzaria-config.png',    caption: 'Configurações · taxa, cover, integrações' },
        ],
      },
      {
        label: 'Cliente · pedido público',
        perfil: 'customer',
        shots: [
          { src: '/projects/comandasys-customer-mobile-pedido.png', caption: 'Cardápio público mobile · cliente faz pedido por slug', mobile: true },
        ],
      },
    ],
  },
]

/* ---------- IB Card ---------- */

function IBCard({ p, idx }: { p: IBProject; idx: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: idx * 0.05 }}
      className="group relative grid lg:grid-cols-12 gap-6 lg:gap-10 py-10 sm:py-14 border-t border-ink/15 first:border-t-0"
    >
      {/* Mobile: logo + title inline */}
      <div className="lg:hidden flex items-center gap-3">
        <div className={`w-12 h-12 shrink-0 ${p.logoBg ?? 'bg-paper2'} border border-ink/20 flex items-center justify-center p-2`}>
          <img src={p.logo} alt={p.title} className="max-w-full max-h-full object-contain" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="ornament not-italic block leading-none mb-0.5">№ {p.num}</span>
          <h3 className="display text-[clamp(1.5rem,6.5vw,2.2rem)] text-ink leading-tight break-words">{p.title}</h3>
        </div>
      </div>

      <div className="hidden lg:flex lg:col-span-2 items-start lg:flex-col gap-4">
        <span className="ornament not-italic">№ {p.num}</span>
        <div className={`w-16 h-16 sm:w-20 sm:h-20 ${p.logoBg ?? 'bg-paper2'} border border-ink/20 flex items-center justify-center p-3`}>
          <img src={p.logo} alt={p.title} className="max-w-full max-h-full object-contain" />
        </div>
      </div>

      <div className="lg:col-span-7">
        <p className="kicker mb-3">{p.scope}</p>
        <h3 className="hidden lg:block display text-[clamp(2rem,4.5vw,3.2rem)] text-ink">{p.title}</h3>
        <p className="mt-2 text-muted text-sm font-mono">{p.role}</p>
        <p className="mt-5 text-base sm:text-lg text-ink2 leading-relaxed font-light max-w-2xl">{p.description}</p>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {p.tech.map(t => (
            <span key={t} className="font-mono text-[10px] uppercase tracking-wider text-ink2 px-2.5 py-1 border border-rule rounded-full">{t}</span>
          ))}
        </div>
      </div>

      <div className="lg:col-span-3 flex flex-col gap-4">
        {p.metrics.map(m => (
          <div key={m.label} className="border-l-2 border-accent pl-4">
            <p className="font-serif text-2xl sm:text-3xl text-ink leading-none">{m.value}</p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted mt-1.5">{m.label}</p>
          </div>
        ))}
        <div className="mt-2 pt-4 border-t border-rule font-mono text-[11px] text-ink2 break-all">
          ↗ {p.domain}
          {p.url && <a href={p.url} target="_blank" rel="noreferrer" className="block mt-2 text-accent text-[11px] uppercase tracking-wider">Visitar →</a>}
        </div>
      </div>
    </motion.article>
  )
}

/* ---------- Personal Card ---------- */

function ShotFrame({ shot, perfil, brand }: { shot: Shot; perfil: string; brand: string }) {
  if (shot.mobile) {
    return (
      <div className="flex justify-center bg-gradient-to-br from-paper2 to-paper border border-rule p-6 sm:p-10">
        <div className="relative rounded-[2.2rem] border-[10px] border-ink bg-ink shadow-[0_40px_80px_-25px_rgba(15,14,12,0.55)]">
          <div className="absolute top-0 inset-x-0 h-5 flex justify-center z-20">
            <div className="w-20 h-4 bg-ink rounded-b-2xl" />
          </div>
          <div className="bg-paper rounded-[1.6rem] overflow-hidden" style={{ width: 280, height: 580 }}>
            <img src={shot.src} alt={shot.caption} className="w-full h-full object-cover object-top" />
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="relative bg-ink p-3 sm:p-4 shadow-[0_40px_80px_-25px_rgba(15,14,12,0.55)] overflow-hidden">
      <div className="flex items-center gap-2 px-2 pb-2.5">
        <span className="w-2.5 h-2.5 rounded-full bg-paper/30" />
        <span className="w-2.5 h-2.5 rounded-full bg-paper/30" />
        <span className="w-2.5 h-2.5 rounded-full bg-paper/30" />
        <span className="ml-3 font-mono text-[10px] text-paper/50 truncate">{brand}.app · /{perfil}</span>
      </div>
      <div className="relative bg-paper">
        <img
          src={shot.src}
          alt={shot.caption}
          className="w-full max-h-[640px] object-contain object-top bg-paper work-img"
        />
      </div>
    </div>
  )
}

function PersonalCard({ p, idx }: { p: PersonalProject; idx: number }) {
  const [groupIdx, setGroupIdx] = useState(0)
  const [shotIdx, setShotIdx] = useState(0)
  const [view, setView] = useState<'galeria' | 'carrossel'>('galeria')
  const [paused, setPaused] = useState(false)
  const group = p.groups[groupIdx]
  const totalShots = p.groups.reduce((s, g) => s + g.shots.length, 0)
  const shot = group.shots[shotIdx]
  const brand = p.title.toLowerCase().replace(/[^a-z]/g, '')

  const pickGroup = (i: number) => { setGroupIdx(i); setShotIdx(0) }

  // Flat list for carousel mode
  const flat = p.groups.flatMap((g, gi) => g.shots.map((s, si) => ({ ...s, gi, si, perfil: g.perfil, group: g.label })))
  const flatIdx = flat.findIndex(f => f.gi === groupIdx && f.si === shotIdx)
  const goNext = () => {
    const next = (flatIdx + 1) % flat.length
    setGroupIdx(flat[next].gi); setShotIdx(flat[next].si)
  }
  const goPrev = () => {
    const prev = (flatIdx - 1 + flat.length) % flat.length
    setGroupIdx(flat[prev].gi); setShotIdx(flat[prev].si)
  }

  // Autoplay carousel
  const tickRef = useRef<number | null>(null)
  useEffect(() => {
    if (view !== 'carrossel' || paused) {
      if (tickRef.current) window.clearTimeout(tickRef.current)
      return
    }
    tickRef.current = window.setTimeout(() => goNext(), 4500)
    return () => { if (tickRef.current) window.clearTimeout(tickRef.current) }
  }, [view, paused, flatIdx])

  // Keyboard arrows when carousel
  useEffect(() => {
    if (view !== 'carrossel') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [view, flatIdx])

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: idx * 0.05 }}
      className="relative py-12 sm:py-20 border-t border-ink/15 first:border-t-0"
    >
      {/* Decorative ornament — giant numeral background */}
      <span aria-hidden className="absolute top-8 right-0 sm:right-4 font-serif font-extrabold text-[20vw] sm:text-[14vw] leading-none text-ink/[0.04] select-none pointer-events-none">{p.num}</span>

      {/* Header */}
      <div className="relative grid lg:grid-cols-12 gap-6 lg:gap-10 mb-8 sm:mb-12">
        {/* Mobile-only: logo + name in line */}
        <div className="lg:hidden flex items-center gap-4">
          <div className={`w-14 h-14 shrink-0 ${p.logoBg ?? 'bg-paper2'} border border-ink/20 flex items-center justify-center p-2.5`}>
            <img src={p.logo} alt={p.title} className="max-w-full max-h-full object-contain" />
          </div>
          <div className="min-w-0">
            <span className="ornament not-italic block leading-none mb-1">№ {p.num}</span>
            <h3 className="display text-[clamp(2.4rem,9vw,3.4rem)] text-ink leading-none">{p.title}</h3>
          </div>
        </div>

        {/* Desktop: logo column */}
        <div className="hidden lg:flex lg:col-span-2 items-start lg:flex-col gap-4">
          <span className="ornament not-italic">№ {p.num}</span>
          <div className={`w-20 h-20 sm:w-24 sm:h-24 ${p.logoBg ?? 'bg-paper2'} border border-ink/20 flex items-center justify-center p-4`}>
            <img src={p.logo} alt={p.title} className="max-w-full max-h-full object-contain" />
          </div>
        </div>

        <div className="lg:col-span-7">
          <p className="kicker mb-3 inline-flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-warn animate-pulse" />
            {p.status}
          </p>
          {/* Desktop-only title */}
          <h3 className="hidden lg:block display text-[clamp(2.8rem,7vw,5.5rem)] text-ink">{p.title}</h3>
          <p className="mt-3 text-muted text-sm font-mono">{p.role}</p>
          <p className="mt-5 text-base sm:text-lg text-ink2 leading-relaxed font-light max-w-2xl">{p.description}</p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            {p.groups.length} perfis · {totalShots} telas reais capturadas
          </p>
        </div>
        <div className="lg:col-span-3">
          <div className="border-l-2 border-accent pl-4">
            <p className="font-serif italic text-base sm:text-lg text-ink2 leading-relaxed">"{p.story}"</p>
          </div>
        </div>
      </div>

      {/* Toolbar — perfil tabs + view mode */}
      <div className="relative mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
        <div className="-mx-4 sm:mx-0 overflow-x-auto pb-1 flex-1">
          <div className="flex gap-1.5 w-max sm:w-auto sm:flex-wrap px-4 sm:px-0">
            {p.groups.map((g, i) => (
              <button
                key={g.label}
                onClick={() => pickGroup(i)}
                disabled={view === 'carrossel'}
                className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2 border text-[11px] sm:text-[12px] font-mono uppercase tracking-[0.12em] transition-colors ${
                  i === groupIdx
                    ? 'bg-ink text-paper border-ink'
                    : 'bg-paper text-ink2 border-rule hover:border-ink disabled:opacity-40 disabled:hover:border-rule'
                }`}
              >
                <span className={`text-[10px] tabular ${i === groupIdx ? 'text-accent' : 'text-muted'}`}>0{i + 1}</span>
                {g.label}
                <span className={`text-[10px] tabular ${i === groupIdx ? 'text-paper/60' : 'text-muted'}`}>·{g.shots.length}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="inline-flex shrink-0 self-start sm:self-auto border border-rule overflow-hidden">
          {(['galeria', 'carrossel'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${
                view === v ? 'bg-ink text-paper' : 'bg-paper text-ink2 hover:bg-paper2'
              }`}
            >
              {v === 'galeria' ? '⊞ Galeria' : '▶ Carrossel'}
            </button>
          ))}
        </div>
      </div>

      {/* Showcase */}
      <div className="grid lg:grid-cols-12 gap-6 lg:gap-10">
        <div className="lg:col-span-9 order-2 lg:order-1">
          {view === 'galeria' ? (
            <>
              <ShotFrame shot={shot} perfil={group.perfil} brand={brand} />
              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="font-serif italic text-sm sm:text-base text-ink2">{shot.caption}</p>
                <span className="font-mono text-[10px] text-muted tabular shrink-0">{String(shotIdx + 1).padStart(2, '0')} / {String(group.shots.length).padStart(2, '0')}</span>
              </div>
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-2">
                {group.shots.map((s, i) => (
                  <button
                    key={s.src}
                    onClick={() => setShotIdx(i)}
                    className={`relative overflow-hidden border transition-all ${shotIdx === i ? 'border-accent ring-2 ring-accent/30' : 'border-rule hover:border-ink'}`}
                    aria-label={s.caption}
                  >
                    <img src={s.src} alt={s.caption} className={`w-full ${s.mobile ? 'h-24 object-cover object-top' : 'h-16 sm:h-20 object-cover object-top'}`} />
                    <span className="absolute top-1 left-1 font-mono text-[9px] bg-ink text-paper px-1 py-0.5 tabular">{String(i + 1).padStart(2, '0')}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div
              className="relative"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onTouchStart={() => setPaused(true)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${groupIdx}-${shotIdx}`}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4 }}
                >
                  <ShotFrame shot={shot} perfil={group.perfil} brand={brand} />
                </motion.div>
              </AnimatePresence>

              {/* Caption + counter */}
              <div className="mt-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">{group.label}</p>
                  <p className="font-serif italic text-sm sm:text-base text-ink2 mt-1">{shot.caption}</p>
                </div>
                <span className="font-mono text-[10px] text-muted tabular shrink-0">{String(flatIdx + 1).padStart(2, '0')} / {String(flat.length).padStart(2, '0')}</span>
              </div>

              {/* Arrows */}
              <button
                onClick={goPrev}
                aria-label="Anterior"
                className="absolute left-2 sm:-left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-paper border border-ink shadow-md hover:bg-ink hover:text-paper transition-colors flex items-center justify-center font-serif text-xl"
              >
                ←
              </button>
              <button
                onClick={goNext}
                aria-label="Próximo"
                className="absolute right-2 sm:-right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-paper border border-ink shadow-md hover:bg-ink hover:text-paper transition-colors flex items-center justify-center font-serif text-xl"
              >
                →
              </button>

              {/* Progress dots */}
              <div className="mt-5 flex items-center justify-center gap-1.5">
                {flat.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => { setGroupIdx(f.gi); setShotIdx(f.si) }}
                    aria-label={`Ir para ${f.caption}`}
                    className={`h-1 transition-all ${i === flatIdx ? 'w-8 bg-accent' : 'w-3 bg-ink/25 hover:bg-ink/50'}`}
                  />
                ))}
              </div>

              <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                {paused ? 'Pausado · passe o mouse fora para continuar' : 'Auto · pause ao passar o mouse · use ← →'}
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-3 order-1 lg:order-2">
          <span className="kicker">Recursos</span>
          <ul className="mt-4 space-y-3">
            {p.features.map(f => (
              <li key={f} className="flex gap-3 text-sm text-ink2">
                <span className="font-mono text-accent text-[12px] mt-1">→</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-6 border-t border-rule">
            <span className="kicker">Stack</span>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.tech.map(t => (
                <span key={t} className="font-mono text-[10px] uppercase tracking-wider text-ink2 px-2.5 py-1 border border-rule rounded-full">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}

/* ---------- Main ---------- */

export default function Work() {
  return (
    <section id="trabalho" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
        <div className="h-line mb-10 sm:mb-14">
          <span className="kicker"><span className="ornament not-italic">№ 04</span> &nbsp; Trabalho selecionado</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 mb-12 sm:mb-16">
          <div className="lg:col-span-7">
            <h2 className="display text-[clamp(2.4rem,6vw,4.5rem)] text-ink">
              Plataformas que <span className="marker">rodam em produção</span> — não slides, não readme.
            </h2>
          </div>
          <p className="lg:col-span-5 text-base sm:text-lg text-ink2 leading-relaxed font-light lg:pt-3">
            Cada peça abaixo serve usuário pagante real. Quatro construídas como dev sênior na <strong className="font-medium">IB System</strong> — duas que toquei do zero e mantenho como produto pessoal. Métrica que me importa: o sistema tá no ar, ainda hoje.
          </p>
        </div>

        {/* IB System */}
        <div className="mb-20 sm:mb-28">
          <div className="flex items-baseline gap-4 mb-6">
            <h3 className="font-serif text-2xl sm:text-3xl text-ink">IB System</h3>
            <div className="flex-1 rule" />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{ibProjects.length} sistemas</span>
          </div>
          <p className="text-muted text-sm sm:text-base font-light max-w-xl mb-8">
            Empresa onde atuo como sênior fullstack. Backend, frontend, infra e deploy — toco o sistema inteiro.
          </p>

          <div>
            {ibProjects.map((p, i) => <IBCard key={p.title} p={p} idx={i} />)}
          </div>
        </div>

        {/* Personal */}
        <div id="projetos" className="scroll-mt-24">
          <div className="flex items-baseline gap-4 mb-6">
            <h3 className="font-serif text-2xl sm:text-3xl text-ink">Produtos pessoais</h3>
            <div className="flex-1 rule" />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{personalProjects.length} produtos</span>
          </div>
          <p className="text-muted text-sm sm:text-base font-light max-w-xl mb-8">
            Construídos do zero — sozinho. Discovery, design, código, deploy, suporte. As imagens abaixo são telas reais dos sistemas em operação.
          </p>

          <div>
            {personalProjects.map((p, i) => <PersonalCard key={p.title} p={p} idx={i} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
