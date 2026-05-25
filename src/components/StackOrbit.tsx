import SkillsGlobe from './SkillsGlobe'

type Group = {
  title: string
  description: string
  tone: string
  items: { name: string; note?: string; primary?: boolean }[]
}

const GROUPS: Group[] = [
  {
    title: 'linguagens',
    description: 'o que escrevo todo dia',
    tone: 'text-accent',
    items: [
      { name: 'PHP 8.2',     note: '8 anos · Laravel' },
      { name: 'TypeScript',  note: '6 anos · React/Node', primary: true },
      { name: 'JavaScript',  note: 'desde sempre' },
      { name: 'SQL',         note: 'MariaDB · MySQL · Postgres' },
      { name: 'Bash',        note: 'CI · scripts de infra' },
    ],
  },
  {
    title: 'backend & api',
    description: 'onde mora a regra',
    tone: 'text-info',
    items: [
      { name: 'Laravel 10', note: 'Eloquent · Horizon · queues', primary: true },
      { name: 'Node.js',    note: 'Express · TSX' },
      { name: 'REST',       note: 'design + versionamento' },
      { name: 'JWT · OAuth',note: 'auth multi-perfil' },
      { name: 'WebSocket',  note: 'live · check-in · notif.' },
    ],
  },
  {
    title: 'frontend & mobile',
    description: 'onde mora o usuário',
    tone: 'text-hot',
    items: [
      { name: 'React 19',     note: 'Vite · CRA · Next', primary: true },
      { name: 'React Native', note: 'Expo · iOS · Android' },
      { name: 'Tailwind CSS', note: 'v3 e v4' },
      { name: 'PrimeReact',   note: 'sistemas internos densos' },
      { name: 'Framer Motion',note: 'micro-interação polida' },
    ],
  },
  {
    title: 'infra & cloud',
    description: 'onde o sistema vive',
    tone: 'text-warn',
    items: [
      { name: 'AWS ECS · ECR', note: 'containers em produção', primary: true },
      { name: 'RDS',           note: 'MariaDB · MySQL · Aurora' },
      { name: 'CloudFront · S3', note: 'CDN + assets' },
      { name: 'Docker',        note: 'compose · multi-stage' },
      { name: 'Linux',         note: 'admin · shell · cron' },
    ],
  },
  {
    title: 'devops & pipeline',
    description: 'como código chega na prod',
    tone: 'text-accent',
    items: [
      { name: 'GitHub Actions', note: 'deploy automatizado', primary: true },
      { name: 'Trunk-based',    note: 'main → ECS · push' },
      { name: 'GitLab CI',      note: 'pipelines complexos' },
      { name: 'CodePipeline',   note: 'AWS-native legacy' },
      { name: 'Webhook deploys',note: 'fluxos custom' },
    ],
  },
  {
    title: 'banco & dados',
    description: 'modelagem é design',
    tone: 'text-info',
    items: [
      { name: 'MariaDB',  note: 'principal · IB System', primary: true },
      { name: 'MySQL',    note: 'legacy + novos' },
      { name: 'PostgreSQL', note: 'projetos pessoais' },
      { name: 'SQLite',   note: 'embutido · prototipagem' },
      { name: 'Redis',    note: 'cache · queues · Horizon' },
    ],
  },
]

const INTEGRATIONS = ['Stripe', 'Mercado Pago', 'PIX', 'Twilio', 'WhatsApp Cloud', 'SendGrid', 'Resend', 'Inter', 'Asaas', 'Bling', 'GoogleAuth', 'Firebase', 'OneSignal', 'Sentry', 'CloudWatch', 'Cloudflare']

export default function StackOrbit() {
  return (
    <section id="stack" className="relative py-24 sm:py-32 border-y border-line bg-bg2 overflow-hidden">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8 lg:px-16">
        <div className="section-head">
          <span className="kicker">/ 04</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">stack · ferramental de um sênior</h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 mb-14">
          <div className="lg:col-span-7">
            <h3 className="display text-[clamp(2rem,5vw,3.8rem)] text-ink">
              não <em>"tecnologias que ouvi falar"</em>.<br/>stack que toco em produção.
            </h3>
          </div>
          <p className="lg:col-span-5 text-base sm:text-lg text-ink2 leading-relaxed lg:pt-3">
            Anos calejando cada peça — sabendo onde quebra e o que fazer no plantão. Anel central é o que mais escrevo; as bordas são integrações que já encarei em produção.
          </p>
        </div>

        {/* 3D Skills Globe */}
        <div className="grid lg:grid-cols-12 gap-10 items-center mb-20">
          <div className="lg:col-span-7">
            <SkillsGlobe />
          </div>

          <div className="lg:col-span-5">
            <span className="kicker">/ 04.a · download</span>
            <h3 className="display text-[clamp(1.6rem,3.5vw,2.5rem)] text-ink mt-4">
              toda <em>ferramenta</em><br/>em uma órbita só.
            </h3>
            <p className="mt-5 text-ink2 text-base leading-relaxed">
              Cada nó é uma ferramenta que já entregou código em produção. Anel interno é o que mais escrevo no dia-a-dia.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/cv-douglas-floriano-costa.pdf" download className="btn-primary">
                $ download cv.pdf
              </a>
              <a href="#contact" className="btn-ghost">$ contact</a>
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
              PDF · pt-BR · atualizado 2026
            </p>
          </div>
        </div>

        {/* Detailed groups */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line rounded-2xl overflow-hidden">
          {GROUPS.map((g, idx) => (
            <div key={g.title} className="bg-bg p-6 hover:bg-bg2 transition-colors group relative">
              <div className="absolute top-0 left-0 w-12 h-px bg-accent transition-all group-hover:w-full duration-500" />
              <div className="flex items-baseline justify-between mb-1">
                <h3 className={`font-mono text-[11px] uppercase tracking-[0.22em] ${g.tone} flex items-center gap-2`}>
                  <span className="w-1 h-3 bg-current" />
                  {g.title}
                </h3>
                <span className="font-mono text-[10px] text-muted tabular">.0{idx + 1}</span>
              </div>
              <p className="text-[12px] text-muted mb-5 italic">{g.description}</p>

              <ul className="space-y-2.5">
                {g.items.map((i) => (
                  <li key={i.name} className="flex items-baseline gap-3 text-sm">
                    <span className={`w-1 h-1 rounded-full mt-2 shrink-0 ${i.primary ? 'bg-accent' : 'bg-muted'}`} />
                    <div className="flex-1 min-w-0">
                      <span className={i.primary ? 'font-medium text-ink' : 'text-ink2'}>{i.name}</span>
                      {i.note && <span className="ml-2 text-muted text-[12px]">· {i.note}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Integrations marquee */}
        <div className="mt-14 overflow-hidden border-y border-line py-5 bg-bg">
          <div className="flex gap-12 marquee whitespace-nowrap will-change-transform">
            {[...Array(2)].map((_, k) => (
              <div key={k} className="flex gap-12 shrink-0">
                {INTEGRATIONS.map((b) => (
                  <span key={b + k} className="font-display font-bold text-2xl sm:text-3xl text-ink/40 hover:text-accent transition-colors">{b}</span>
                ))}
              </div>
            ))}
          </div>
          <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-muted">+ integrações que já encanei em produção</p>
        </div>
      </div>
    </section>
  )
}
