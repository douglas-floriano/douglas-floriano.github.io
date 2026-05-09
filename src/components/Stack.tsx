import { motion } from 'framer-motion'

type Group = { title: string; description: string; items: { name: string; note?: string; primary?: boolean }[] }

const groups: Group[] = [
  {
    title: 'Linguagens',
    description: 'O que escrevo todo dia',
    items: [
      { name: 'PHP 8.2',     note: '8 anos · Laravel' },
      { name: 'TypeScript',  note: '6 anos · React/Node', primary: true },
      { name: 'JavaScript',  note: 'desde sempre' },
      { name: 'SQL',         note: 'MariaDB · MySQL · Postgres' },
      { name: 'Bash',        note: 'CI · scripts de infra' },
    ],
  },
  {
    title: 'Backend & API',
    description: 'Onde mora a regra',
    items: [
      { name: 'Laravel 10', note: 'Eloquent · Horizon · queues', primary: true },
      { name: 'Node.js',    note: 'Express · TSX' },
      { name: 'REST',       note: 'design + versionamento' },
      { name: 'JWT · OAuth',note: 'auth multi-perfil' },
      { name: 'WebSocket',  note: 'live · check-in · notif.' },
    ],
  },
  {
    title: 'Frontend & Mobile',
    description: 'Onde mora o usuário',
    items: [
      { name: 'React 19',     note: 'Vite · CRA · Next', primary: true },
      { name: 'React Native', note: 'Expo · iOS · Android' },
      { name: 'Tailwind CSS', note: 'v3 e v4' },
      { name: 'PrimeReact',   note: 'sistemas internos densos' },
      { name: 'Framer Motion',note: 'micro-interação polida' },
    ],
  },
  {
    title: 'Infra & Cloud',
    description: 'Onde o sistema vive',
    items: [
      { name: 'AWS ECS · ECR', note: 'containers em produção', primary: true },
      { name: 'RDS',           note: 'MariaDB · MySQL · Aurora' },
      { name: 'CloudFront · S3', note: 'CDN + assets' },
      { name: 'Docker',        note: 'compose · multi-stage' },
      { name: 'Linux',         note: 'admin · shell · cron' },
    ],
  },
  {
    title: 'DevOps & Pipeline',
    description: 'Como o código chega na prod',
    items: [
      { name: 'GitHub Actions', note: 'deploy automatizado', primary: true },
      { name: 'Trunk-based',    note: 'main → ECS · push' },
      { name: 'GitLab CI',      note: 'pipelines complexos' },
      { name: 'CodePipeline',   note: 'AWS-native legacy' },
      { name: 'Webhook deploys',note: 'fluxos custom' },
    ],
  },
  {
    title: 'Banco & dados',
    description: 'Modelagem é design',
    items: [
      { name: 'MariaDB',  note: 'principal · IB System' },
      { name: 'MySQL',    note: 'legacy + novos' },
      { name: 'PostgreSQL', note: 'projetos pessoais' },
      { name: 'SQLite',   note: 'embutido · prototipagem' },
      { name: 'Redis',    note: 'cache · queues · Horizon' },
    ],
  },
]

export default function Stack() {
  return (
    <section id="stack" className="relative py-20 sm:py-28 bg-paper2/40">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
        <div className="h-line mb-10 sm:mb-14">
          <span className="kicker"><span className="ornament not-italic">№ 04</span> &nbsp; Stack</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 mb-12 sm:mb-16">
          <div className="lg:col-span-7">
            <h2 className="display text-[clamp(2.4rem,6vw,4.5rem)] text-ink">
              Ferramental de um <span className="marker">sênior</span>.
            </h2>
          </div>
          <p className="lg:col-span-5 text-base sm:text-lg text-ink2 leading-relaxed font-light lg:pt-3">
            Não a lista de "tecnologias que ouvi falar". É a stack que toco diariamente — em produção, com responsabilidade real. Anos calejando cada peça, sabendo onde cada uma quebra e o que fazer no plantão.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/15">
          {groups.map((g, idx) => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="bg-paper p-6 sm:p-8 hover:bg-paper2/70 transition-colors group"
            >
              <div className="flex items-baseline justify-between mb-1">
                <h3 className="font-serif font-bold text-xl text-ink">{g.title}</h3>
                <span className="font-mono text-[10px] text-muted tabular">.0{idx + 1}</span>
              </div>
              <p className="font-serif italic text-sm text-muted mb-5">{g.description}</p>

              <ul className="space-y-2.5">
                {g.items.map(i => (
                  <li key={i.name} className="flex items-baseline gap-3 text-sm">
                    <span className={`w-1 h-1 rounded-full mt-2 shrink-0 ${i.primary ? 'bg-accent' : 'bg-ink/40'}`} />
                    <div className="flex-1 min-w-0">
                      <span className={`${i.primary ? 'font-medium text-ink' : 'text-ink2'}`}>{i.name}</span>
                      {i.note && <span className="ml-2 text-muted text-[12px] font-light">{i.note}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Marquee — also-fluent strip */}
        <div className="mt-14 overflow-hidden border-y border-ink/15 py-5 bg-paper">
          <div className="flex gap-12 marquee whitespace-nowrap will-change-transform">
            {[...Array(2)].map((_, k) => (
              <div key={k} className="flex gap-12 shrink-0">
                {['Stripe', 'Mercado Pago', 'PIX', 'Twilio', 'WhatsApp Cloud', 'SendGrid', 'Resend', 'Inter', 'Asaas', 'Bling', 'GoogleAuth', 'Firebase', 'OneSignal', 'Sentry', 'CloudWatch', 'Cloudflare'].map(b => (
                  <span key={b + k} className="font-serif italic text-2xl sm:text-3xl text-ink/60">{b}</span>
                ))}
              </div>
            ))}
          </div>
          <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted">+ integrações que já encanei em produção</p>
        </div>
      </div>
    </section>
  )
}
