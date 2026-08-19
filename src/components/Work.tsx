import { useEffect, useRef, useState } from 'react'

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

const ibProjects: IBProject[] = [
  {
    num: '01',
    title: 'Lotemobile / WalletLote',
    role: 'Dev sênior · arquitetura monorepo + AWS ECS',
    scope: 'SaaS multi-tenant para loteadoras e incorporadoras',
    description:
      'Backend Laravel 10 único servindo dois frontends React. Gestão de lotes, contratos, comissões, financeiro e cronograma de obra. Roda em ECS com containers PHP-FPM, Nginx, Horizon e Scheduler — prod e dev isolados.',
    metrics: [
      { value: '4 containers', label: 'por task ECS' },
      { value: '2 SPAs',       label: 'mesmo backend' },
      { value: 'Auto deploy',  label: 'GH Actions → ECR' },
    ],
    tech: ['Laravel 10', 'React', 'AWS ECS', 'RDS MariaDB', 'Horizon', 'CloudFront', 'Docker', 'GH Actions'],
    domain: 'admin.walletlote.app.br',
    url: 'https://admin.walletlote.app.br',
    logo: '/projects/logos/lotemobile.png',
    logoBg: 'bg-bg3',
  },
  {
    num: '02',
    title: 'IBticket',
    role: 'Dev sênior · checkout, validação ao vivo, relatórios',
    scope: 'Plataforma de venda e gestão de ingressos online',
    description:
      'End-to-end para produtores: criação de evento, checkout com gateway PIX, ingresso digital com QR, validação em portaria em tempo real, cupons e relatórios por canal. Painel ao vivo enquanto evento acontece.',
    metrics: [
      { value: 'QR · live',   label: 'validação portaria' },
      { value: 'Multi-canal', label: 'cupom + afiliados' },
      { value: 'PIX',         label: 'gateway integrado' },
    ],
    tech: ['Laravel', 'React', 'MySQL', 'AWS S3', 'CloudFront', 'PIX', 'WebSocket'],
    domain: 'IB System · interno',
    logo: '/projects/logos/ibticket.png',
    logoBg: 'bg-white',
  },
  {
    num: '03',
    title: 'HRT Invest',
    role: 'Dev sênior · web + app nativo + motor financeiro',
    scope: 'Plataforma de investimentos com app móvel',
    description:
      'Portal Next.js + app React Native (Expo) para investidores acompanharem carteira, fazerem aportes, P2P, contratos e transações. Backend Laravel com motor de cálculo financeiro auditável.',
    metrics: [
      { value: 'Web + App',     label: 'mesma API' },
      { value: 'P2P',           label: 'empréstimos' },
      { value: 'Auditoria',     label: 'trilha completa' },
    ],
    tech: ['Laravel', 'Next.js', 'React Native', 'Expo', 'PostgreSQL', 'AWS'],
    domain: 'IB System · interno',
    logo: '/projects/logos/hrtinvest.png',
    logoBg: 'bg-bg3',
  },
  {
    num: '04',
    title: 'IB3 Capital',
    role: 'Dev sênior · gestão de capital e operações',
    scope: 'Sistema de gestão de capital e investimentos institucionais',
    description:
      'Plataforma para controle de operações, carteiras e relatórios de performance. Foco em precisão, controle transacional rigoroso, integração com terceiros via webhooks e auditoria fim a fim.',
    metrics: [
      { value: 'Precisão',     label: 'cálculo financeiro' },
      { value: 'Webhooks',     label: 'integrações externas' },
      { value: 'Auditoria',    label: 'fim a fim' },
    ],
    tech: ['Laravel', 'React', 'MySQL', 'AWS', 'Docker', 'Webhooks'],
    domain: 'IB System · interno',
    logo: '/projects/logos/ib3capital.png',
    logoBg: 'bg-bg3',
  },
]

const personalProjects: PersonalProject[] = [
  {
    num: '05',
    title: 'HASGym',
    role: 'Founder · produto, design, código, infra',
    description:
      'Sistema completo para academias gerenciarem alunos, treinos, dietas, avaliações, mensalidades — com app nativo para os 4 perfis (aluno, instrutor, dono e admin SaaS) em React Native. Tudo construído por uma pessoa só.',
    story:
      'Comecei como tentativa de organizar planilha de uma academia local — virou plataforma com motor de mensalidades, biblioteca de exercícios, prescrição de dieta com aderência por alimento e app móvel com design system próprio, dark/light e Face ID.',
    features: [
      'Multi-tenant · 1 aluno em N academias',
      'Dieta com aderência por alimento · trocas e substituições',
      'Sessão de treino guiada · timer de descanso + histórico',
      'Avaliação física · série temporal + IMC',
      'Mensalidade + bloqueio automático de inadimplência',
      'App nativo iOS/Android (Expo) · dark/light · Face ID',
      'Design system próprio · marca P&B minimal',
    ],
    tech: ['React 19', 'Vite', 'Tailwind v4', 'Laravel 11', 'TypeScript', 'MySQL', 'React Native', 'Expo'],
    status: 'beta · rumo à comercialização',
    logo: '/projects/logos/hasgym.svg',
    logoBg: 'bg-bg3',
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
    title: 'MandaPedir',
    role: 'Founder · produto SaaS multi-tenant',
    description:
      'SaaS multi-tenant para bar e restaurante. Destinos curtos — Operar, Cozinha, Cardápio e Negócio — no lugar de vinte telas. Salão, delivery, balcão e mesa por QR caem na mesma fila, e o cliente pede pelo celular sem instalar nada.',
    story:
      'A primeira versão tinha uma tela pra cada coisa e ninguém achava nada no meio do movimento. Refiz a navegação inteira em 4 destinos e trouxe o lançamento pra dentro da comanda: abro a mesa, o catálogo aparece do lado e eu lanço sem trocar de tela. A planta do salão mostra valor e tempo de cada conta, então dá pra ver quem está esquecido sem abrir nada. Multi-tenant por slug, escuro na operação e claro no que o cliente vê.',
    features: [
      'Quatro destinos · Operar, Cozinha, Cardápio e Negócio',
      'Planta do salão com valor e tempo de cada mesa',
      'Comanda com catálogo embutido · lança sem sair da tela',
      'Cozinha (KDS) por pedido, com praças e modo TV',
      'Mesa por QR com token · o cliente pede do próprio celular',
      'Áreas de entrega desenhadas no Google Maps, com preço e prazo',
      'Chat com o cliente dentro do pedido (WhatsApp via Evolution)',
      'Fechar a loja com motivo · o cliente vê o aviso no cardápio',
      'Item "acabou hoje" fica no cardápio, mas trava o pedido',
      'Relatório com vendido em aberto + fechado e venda por hora',
      'Planos por canal, com taxa por pedido opcional',
      'WhatsApp avisa o cliente sozinho a cada etapa do pedido',
      'Pesquisa de satisfação por botão · a nota fica no pedido',
      'Primeiros passos · lê o banco e diz o que falta configurar',
      'Vitrine só abre com cardápio montado · nada de loja vazia no ar',
      'Assinatura via Mercado Pago · Pix, cartão e boleto',
    ],
    tech: ['React', 'Vite', 'Laravel 12', 'MariaDB', 'Evolution API', 'Google Maps', 'Mercado Pago', 'Docker', 'Oracle Cloud'],
    status: 'em produção · demonstração no ar',
    logo: '/projects/logos/mandapedir.svg',
    logoBg: 'bg-bg3',
    groups: [
      {
        label: 'Tenant · Pizzaria Bella Massa',
        perfil: 'gerente',
        shots: [
          { src: '/projects/mandapedir-operar.png',    caption: 'Operar · salão, entregas e balcão na mesma fila, com a etapa de cada pedido' },
          { src: '/projects/mandapedir-cozinha.png',   caption: 'Cozinha · a fazer, fazendo e pronto, com praça por item e modo TV' },
          { src: '/projects/mandapedir-cardapio.png',  caption: 'Cardápio · promoção, "no cardápio" e "acabou hoje" por item' },
          { src: '/projects/mandapedir-combos.png',    caption: 'Combo · editor de um lado, o que o cliente vê do outro' },
          { src: '/projects/mandapedir-relatorio.png', caption: 'Relatório · vendido em aberto + fechado e venda por hora' },
          { src: '/projects/mandapedir-ajustes.png',   caption: 'Ajustes · áreas de entrega desenhadas no mapa, com preço e prazo' },
          { src: '/projects/mandapedir-comecar.png',   caption: 'Primeiros passos · lê o banco e diz o que falta para a loja vender' },
        ],
      },
      {
        label: 'Cliente · sem login',
        perfil: 'customer',
        shots: [
          { src: '/projects/mandapedir-cliente-mobile.png',   caption: 'Cardápio público · o cliente pede pelo link, sem instalar nada', mobile: true },
          { src: '/projects/mandapedir-cliente-cardapio.png', caption: 'Seções, fotos e preço promocional · mesmo cardápio serve a mesa por QR', mobile: true },
        ],
      },
    ],
  },
  {
    num: '07',
    title: 'Racha de Terça',
    role: 'Founder · produto, design, código, deploy',
    description:
      'App para o futebol semanal de amigos avaliarem uns aos outros. Cada jogador entra com um token, dá notas por critério, e o sistema fecha o racha sozinho toda terça — com ranking mensal, card estilo FIFA e sorteio de times equilibrados.',
    story:
      'Começou como uma planilha do grupo que ninguém conseguia manter justa. Virou web app completo: notas que dividem só por quem votou, evolução por jogador, hall da fama e até card de overall compartilhável no WhatsApp. Do zero ao ar em um dia.',
    features: [
      'Login por token · cada um vota no próprio',
      'Notas 0–10 por critério (linha e goleiro)',
      'Média divide só por quem votou',
      'Ranking mensal com pódio · reset automático',
      'Card FIFA com overall + foto de perfil',
      'Sorteio de times equilibrados (admin)',
      'Fecha sozinho terça 9h · sem cron',
    ],
    tech: ['Next.js 14', 'React 18', 'TypeScript', 'Tailwind', 'Drizzle ORM', 'Neon Postgres', 'Vercel OG', 'Vercel'],
    status: 'no ar · em produção',
    logo: '/projects/logos/racha.svg',
    logoBg: 'bg-bg3',
    groups: [
      {
        label: 'Jogador',
        perfil: 'jogador',
        shots: [
          { src: '/projects/racha-inicio.png',    caption: 'Início · status da rodada, último pódio e resumo do mês', mobile: true },
          { src: '/projects/racha-votar.png',     caption: 'Votação · sliders 0–10 por critério, autosave, sem autoavaliação', mobile: true },
          { src: '/projects/racha-aovivo.png',    caption: 'Ao vivo · média parcial em tempo real, quem já votou', mobile: true },
          { src: '/projects/racha-resultado.png', caption: 'Racha fechado · pódio, médias por critério e votos individuais', mobile: true },
          { src: '/projects/racha-ranking.png',   caption: 'Ranking do mês · pódio e tabela por rodada, zera todo mês', mobile: true },
        ],
      },
      {
        label: 'Perfil & Card',
        perfil: 'perfil',
        shots: [
          { src: '/projects/racha-card.png',     caption: 'Card estilo FIFA · overall + atributos + foto, compartilhável', mobile: true },
          { src: '/projects/racha-evolucao.png', caption: 'Evolução · gráfico de nota por racha e média por critério', mobile: true },
          { src: '/projects/racha-x1.png',       caption: 'X1 · comparador de dois jogadores por período', mobile: true },
          { src: '/projects/racha-temporada.png',caption: 'Hall da fama · recordes e prêmios de cada mês', mobile: true },
        ],
      },
      {
        label: 'Admin',
        perfil: 'admin',
        shots: [
          { src: '/projects/racha-times.png', caption: 'Sorteio de times equilibrados pelas médias · goleiro separado', mobile: true },
          { src: '/projects/racha-admin.png', caption: 'Admin · jogadores, tokens, convites e log de votos', mobile: true },
        ],
      },
    ],
  },
]

function Stat({ n, l, tone = 'text-accent' }: { n: string; l: string; tone?: string }) {
  return (
    <div className="border-l-2 border-line pl-3 py-1">
      <p className={`font-display font-bold text-2xl ${tone} leading-none tabular`}>{n}</p>
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted mt-1.5">{l}</p>
    </div>
  )
}

function IBCard({ p }: { p: IBProject }) {
  return (
    <article className="card p-6 sm:p-8 grid lg:grid-cols-12 gap-6 lg:gap-8 relative overflow-hidden">
      <span aria-hidden className="absolute top-4 right-6 font-display font-black text-[8rem] sm:text-[10rem] leading-none text-accent/[0.04] select-none pointer-events-none">{p.num}</span>

      <div className="lg:col-span-2 flex lg:flex-col items-start gap-4 relative">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent flex items-center gap-2">
          <span className="w-1 h-3 bg-accent" /> № {p.num}
        </span>
        <div className={`w-20 h-20 sm:w-24 sm:h-24 ${p.logoBg ?? 'bg-bg3'} border border-line rounded-lg flex items-center justify-center p-3 shadow-[0_0_30px_-12px_rgba(34,197,94,0.4)]`}>
          <img src={p.logo} alt={p.title} className="max-w-full max-h-full object-contain" />
        </div>
        <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted hidden lg:flex items-center gap-1.5 mt-2">
          <span className="live-dot" /> ativo
        </div>
      </div>

      <div className="lg:col-span-7 relative">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-2">{p.scope}</p>
        <h3 className="font-display font-black text-3xl sm:text-4xl text-ink leading-[0.95] tracking-tight">{p.title}</h3>
        <p className="mt-3 text-muted text-[11px] font-mono uppercase tracking-[0.14em]">{p.role}</p>
        <p className="mt-5 text-base text-ink2 leading-relaxed max-w-2xl">{p.description}</p>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {p.tech.map((t) => (
            <span key={t} className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink2 px-2.5 py-1 border border-line rounded hover:border-accent hover:text-accent hover:bg-accent/5 transition-colors">{t}</span>
          ))}
        </div>
      </div>

      <div className="lg:col-span-3 flex flex-col gap-3 relative">
        {p.metrics.map((m) => (
          <div key={m.label} className="border-l-2 border-accent pl-4 py-1 hover:bg-accent/5 transition-colors rounded-r">
            <p className="font-display font-bold text-xl text-ink leading-none tabular">{m.value}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted mt-1.5">{m.label}</p>
          </div>
        ))}
        <div className="mt-2 pt-4 border-t border-line font-mono text-[11px] text-ink2 break-all">
          <span className="text-accent">↗</span> {p.domain}
          {p.url && <a href={p.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/40 rounded text-accent uppercase tracking-[0.18em] text-[10px] hover:bg-accent hover:text-bg transition-colors">visit →</a>}
        </div>
      </div>
    </article>
  )
}

function ShotFrame({ shot, perfil, brand }: { shot: Shot; perfil: string; brand: string }) {
  if (shot.mobile) {
    return (
      <div className="flex justify-center bg-gradient-to-br from-bg2 to-bg border border-line rounded-lg p-6 sm:p-10">
        <div className="relative rounded-[2.2rem] border-[10px] border-bg3 bg-bg3 shadow-[0_40px_80px_-25px_rgba(0,0,0,0.6)]">
          <div className="absolute top-0 inset-x-0 h-5 flex justify-center z-20">
            <div className="w-20 h-4 bg-bg3 rounded-b-2xl" />
          </div>
          <div className="bg-bg rounded-[1.6rem] overflow-hidden" style={{ width: 280, height: 580 }}>
            <img src={shot.src} alt={shot.caption} className="w-full h-full object-cover object-top" />
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="relative bg-bg3 p-3 sm:p-4 shadow-[0_40px_80px_-25px_rgba(0,0,0,0.6)] overflow-hidden rounded-lg border border-line">
      <div className="flex items-center gap-2 px-2 pb-2.5">
        <span className="w-2.5 h-2.5 rounded-full bg-hot/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-warn/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-accent/70" />
        <span className="ml-3 font-mono text-[10px] text-muted truncate">{brand}.app · /{perfil}</span>
      </div>
      <div className="relative bg-bg rounded">
        <img src={shot.src} alt={shot.caption} className="w-full max-h-[640px] object-contain object-top rounded" />
      </div>
    </div>
  )
}

function PersonalCard({ p }: { p: PersonalProject }) {
  const [groupIdx, setGroupIdx] = useState(0)
  const [shotIdx, setShotIdx] = useState(0)
  const [view, setView] = useState<'galeria' | 'carrossel'>('galeria')
  const [paused, setPaused] = useState(false)
  const group = p.groups[groupIdx]
  const totalShots = p.groups.reduce((s, g) => s + g.shots.length, 0)
  const shot = group.shots[shotIdx]
  const brand = p.title.toLowerCase().replace(/[^a-z]/g, '')

  const pickGroup = (i: number) => { setGroupIdx(i); setShotIdx(0) }

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

  const tickRef = useRef<number | null>(null)
  useEffect(() => {
    if (view !== 'carrossel' || paused) {
      if (tickRef.current) window.clearTimeout(tickRef.current)
      return
    }
    tickRef.current = window.setTimeout(() => goNext(), 4500)
    return () => { if (tickRef.current) window.clearTimeout(tickRef.current) }
  }, [view, paused, flatIdx])

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
    <article className="card p-6 sm:p-10 relative overflow-hidden">
      <span aria-hidden className="absolute -top-4 right-2 font-display font-black text-[22vw] sm:text-[14vw] leading-none text-ink/[0.025] select-none pointer-events-none">{p.num}</span>

      <div className="relative grid lg:grid-cols-12 gap-6 lg:gap-10 mb-8">
        <div className="lg:col-span-2 flex lg:flex-col items-start gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-warn">№ {p.num}</span>
          <div className={`w-16 h-16 sm:w-20 sm:h-20 ${p.logoBg ?? 'bg-bg3'} border border-line rounded flex items-center justify-center p-3`}>
            <img src={p.logo} alt={p.title} className="max-w-full max-h-full object-contain" />
          </div>
        </div>

        <div className="lg:col-span-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] mb-2 inline-flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-warn animate-pulse" />
            <span className="text-warn">{p.status}</span>
          </p>
          <h3 className="font-display font-bold text-3xl sm:text-5xl text-ink leading-tight tracking-tight">{p.title}</h3>
          <p className="mt-2 text-muted text-sm font-mono">{p.role}</p>
          <p className="mt-4 text-base text-ink2 leading-relaxed max-w-2xl">{p.description}</p>
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

      {/* Toolbar */}
      <div className="relative mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
        <div className="-mx-2 sm:mx-0 overflow-x-auto pb-1 flex-1">
          <div className="flex gap-1.5 w-max sm:w-auto sm:flex-wrap px-2 sm:px-0">
            {p.groups.map((g, i) => (
              <button
                key={g.label}
                onClick={() => pickGroup(i)}
                disabled={view === 'carrossel'}
                className={`shrink-0 inline-flex items-center gap-2 px-3 py-2 border rounded text-[11px] font-mono uppercase tracking-[0.12em] transition-colors cursor-pointer ${
                  i === groupIdx
                    ? 'bg-accent text-bg border-accent'
                    : 'bg-bg2 text-ink2 border-line hover:border-accent disabled:opacity-40'
                }`}
              >
                <span className={`text-[10px] tabular ${i === groupIdx ? 'text-bg' : 'text-muted'}`}>0{i + 1}</span>
                {g.label}
                <span className={`text-[10px] tabular ${i === groupIdx ? 'text-bg/70' : 'text-muted'}`}>·{g.shots.length}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="inline-flex shrink-0 self-start sm:self-auto border border-line rounded overflow-hidden">
          {(['galeria', 'carrossel'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors cursor-pointer ${
                view === v ? 'bg-accent text-bg' : 'bg-bg2 text-ink2 hover:bg-bg3'
              }`}
            >
              {v === 'galeria' ? '⊞ galeria' : '▶ carrossel'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 lg:gap-10">
        <div className="lg:col-span-9 order-2 lg:order-1">
          {view === 'galeria' ? (
            <>
              <ShotFrame shot={shot} perfil={group.perfil} brand={brand} />
              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="font-mono text-[11px] text-ink2">{shot.caption}</p>
                <span className="font-mono text-[10px] text-muted tabular shrink-0">{String(shotIdx + 1).padStart(2, '0')} / {String(group.shots.length).padStart(2, '0')}</span>
              </div>
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-2">
                {group.shots.map((s, i) => (
                  <button
                    key={s.src}
                    onClick={() => setShotIdx(i)}
                    className={`relative overflow-hidden border rounded transition-all cursor-pointer ${shotIdx === i ? 'border-accent ring-2 ring-accent/30' : 'border-line hover:border-accent'}`}
                    aria-label={s.caption}
                  >
                    <img src={s.src} alt={s.caption} className={`w-full ${s.mobile ? 'h-24 object-cover object-top' : 'h-16 sm:h-20 object-cover object-top'}`} />
                    <span className="absolute top-1 left-1 font-mono text-[9px] bg-bg text-accent px-1 py-0.5 tabular border border-accent/40 rounded">{String(i + 1).padStart(2, '0')}</span>
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
              <div key={`${groupIdx}-${shotIdx}`} className="transition-opacity duration-300">
                <ShotFrame shot={shot} perfil={group.perfil} brand={brand} />
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">{group.label}</p>
                  <p className="font-mono text-[11px] text-ink2 mt-1">{shot.caption}</p>
                </div>
                <span className="font-mono text-[10px] text-muted tabular shrink-0">{String(flatIdx + 1).padStart(2, '0')} / {String(flat.length).padStart(2, '0')}</span>
              </div>

              <button
                onClick={goPrev}
                aria-label="anterior"
                className="absolute left-2 sm:-left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-bg2 border border-line rounded hover:bg-accent hover:text-bg hover:border-accent transition-colors flex items-center justify-center text-xl cursor-pointer"
              >
                ←
              </button>
              <button
                onClick={goNext}
                aria-label="próximo"
                className="absolute right-2 sm:-right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-bg2 border border-line rounded hover:bg-accent hover:text-bg hover:border-accent transition-colors flex items-center justify-center text-xl cursor-pointer"
              >
                →
              </button>

              <div className="mt-5 flex items-center justify-center gap-1.5">
                {flat.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => { setGroupIdx(f.gi); setShotIdx(f.si) }}
                    aria-label={`ir para ${f.caption}`}
                    className={`h-1 transition-all cursor-pointer ${i === flatIdx ? 'w-8 bg-accent' : 'w-3 bg-line hover:bg-muted'}`}
                  />
                ))}
              </div>

              <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-muted">
                {paused ? 'pausado · saia do mouse para continuar' : 'auto · pause ao passar mouse · ← →'}
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-3 order-1 lg:order-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent flex items-center gap-2">
            <span className="w-1 h-3 bg-current" /> recursos
          </span>
          <ul className="mt-4 space-y-3">
            {p.features.map((f) => (
              <li key={f} className="flex gap-3 text-sm text-ink2">
                <span className="font-mono text-accent text-[12px] mt-0.5">→</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-6 border-t border-line">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-info flex items-center gap-2">
              <span className="w-1 h-3 bg-current" /> stack
            </span>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.tech.map((t) => (
                <span key={t} className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink2 px-2 py-1 border border-line rounded hover:border-accent hover:text-accent transition-colors">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function Work() {
  return (
    <section id="work" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8 lg:px-16">
        <div className="section-head">
          <span className="kicker">/ 03</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">work · plataformas que rodam em produção</h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 mb-14">
          <div className="lg:col-span-7">
            <h3 className="display text-[clamp(2rem,5vw,3.8rem)] text-ink">
              não slides.<br/>não readme. <em>produção.</em>
            </h3>
          </div>
          <p className="lg:col-span-5 text-base sm:text-lg text-ink2 leading-relaxed lg:pt-3">
            Cada peça abaixo serve usuário pagante real. Quatro construídas como dev sênior na <strong className="text-ink">IB System</strong> — duas que toquei do zero e mantenho como produto pessoal. Métrica que me importa: o sistema tá no ar, ainda hoje.
          </p>
        </div>

        {/* IB System */}
        <div className="mb-24">
          <div className="card p-6 sm:p-8 mb-8 relative overflow-hidden">
            <span aria-hidden className="absolute -top-6 -right-4 font-display font-black text-[12rem] leading-none text-accent/[0.05] select-none pointer-events-none">IB</span>
            <div className="grid sm:grid-cols-12 gap-6 items-center relative">
              <div className="sm:col-span-7">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent mb-2 flex items-center gap-2">
                  <span className="live-dot" /> empresa · 2022 → now
                </p>
                <h3 className="font-display font-black text-3xl sm:text-4xl text-ink tracking-tight">IB System</h3>
                <p className="mt-3 text-ink2 text-sm leading-relaxed max-w-lg">
                  Atuo como sênior fullstack. Backend, frontend, infra e deploy — toco o sistema inteiro. 4 SaaS rodando em produção 24/7.
                </p>
              </div>
              <div className="sm:col-span-5 grid grid-cols-3 gap-3">
                <Stat n={String(ibProjects.length)} l="sistemas" />
                <Stat n="3+" l="anos atuando" />
                <Stat n="24/7" l="uptime" />
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {ibProjects.map((p) => <IBCard key={p.title} p={p} />)}
          </div>
        </div>

        {/* Personal */}
        <div id="projetos" className="scroll-mt-24">
          <div className="card p-6 sm:p-8 mb-8 relative overflow-hidden border-warn/30">
            <span aria-hidden className="absolute -top-6 -right-4 font-display font-black text-[12rem] leading-none text-warn/[0.05] select-none pointer-events-none">·</span>
            <div className="grid sm:grid-cols-12 gap-6 items-center relative">
              <div className="sm:col-span-7">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-warn mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-warn animate-pulse" /> studio of one · solo
                </p>
                <h3 className="font-display font-black text-3xl sm:text-4xl text-ink tracking-tight">produtos pessoais</h3>
                <p className="mt-3 text-ink2 text-sm leading-relaxed max-w-lg">
                  Construídos do zero — sozinho. Discovery, design, código, deploy, suporte. Telas abaixo são reais — sistemas em operação.
                </p>
              </div>
              <div className="sm:col-span-5 grid grid-cols-3 gap-3">
                <Stat n={String(personalProjects.length)} l="produtos" tone="text-warn" />
                <Stat n="solo" l="dev/design/ops" tone="text-warn" />
                <Stat n="∞" l="madrugadas" tone="text-warn" />
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            {personalProjects.map((p) => <PersonalCard key={p.title} p={p} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
