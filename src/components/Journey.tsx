type Entry = {
  range: string
  kind: 'work' | 'edu' | 'product'
  role: string
  org: string
  description: string
  stack?: string[]
}

const ENTRIES: Entry[] = [
  {
    range: '2022 → now',
    kind: 'work',
    role: 'Desenvolvedor Sênior Fullstack',
    org: 'IB System',
    description:
      'Mantenho 4 SaaS em produção (loteamento, ingresso, investimento, capital). Backend Laravel + filas Horizon, frontend React/React Native, infra AWS ECS/RDS/CloudFront. Da modelagem do banco ao deploy.',
    stack: ['Laravel 10', 'React 19', 'AWS ECS', 'MariaDB', 'GH Actions'],
  },
  {
    range: '2020 — 2022',
    kind: 'work',
    role: 'Desenvolvedor Fullstack',
    org: 'Projetos clientes · freelance',
    description:
      'Plataformas sob medida pra academias, eventos e e-commerces. Primeiros contatos com infra real — sair do "roda no meu PC" e botar coisa em pé na nuvem.',
    stack: ['PHP 8', 'Laravel', 'React', 'MySQL', 'Docker'],
  },
  {
    range: '2018 — 2020',
    kind: 'work',
    role: 'Desenvolvedor Júnior',
    org: 'Primeiras experiências em produção',
    description:
      'Começo de carreira escrevendo PHP, jQuery e SQL no dia-a-dia. Aprendi que código que ninguém usa não conta — só vale o que entra em produção e o cliente abre amanhã de manhã.',
    stack: ['PHP', 'jQuery', 'MySQL', 'Bootstrap'],
  },
  {
    range: '2017 — 2019',
    kind: 'edu',
    role: 'Formação em Desenvolvimento de Sistemas',
    org: 'Curso técnico · base sólida',
    description:
      'Fundamentos de lógica, banco de dados, redes e POO. Onde a curiosidade virou ofício.',
  },
  {
    range: 'desde sempre',
    kind: 'product',
    role: 'Produtos pessoais',
    org: 'Madrugadas e fins de semana',
    description:
      'Duas iniciativas próprias rodando em paralelo com o trabalho — porque construir produto é diferente de manter projeto, e ambos ensinam.',
    stack: ['Next.js', 'Expo', 'Postgres', 'Stripe'],
  },
]

const KIND_LABEL: Record<Entry['kind'], string> = {
  work:    'trabalho',
  edu:     'formação',
  product: 'produto',
}

const KIND_TONE: Record<Entry['kind'], string> = {
  work:    'text-accent border-accent/50',
  edu:     'text-info border-info/50',
  product: 'text-warn border-warn/50',
}

export default function Journey() {
  return (
    <section id="journey" className="relative py-24 sm:py-32 border-t border-line">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8 lg:px-16">
        <div className="section-head">
          <span className="kicker">/ 02</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">journey · git log --reverse</h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 mb-14">
          <div className="lg:col-span-7">
            <h3 className="display text-[clamp(2rem,5vw,3.8rem)] text-ink">
              minha <em>trajetória</em> até aqui.
            </h3>
          </div>
          <p className="lg:col-span-5 text-base sm:text-lg text-ink2 leading-relaxed lg:pt-3">
            Não foi atalho. Foi PHP no terminal de madrugada, banco modelado no caderno, deploy FTP, primeiro <em className="font-serif italic text-accent">git push</em> que assustou. Cada degrau virou cicatriz útil — e a stack de hoje carrega tudo isso.
          </p>
        </div>

        <ol className="relative border-l border-line ml-3 sm:ml-6">
          {ENTRIES.map((e, i) => (
            <li key={e.range + e.role} className="relative pl-8 sm:pl-12 pb-12 sm:pb-14 last:pb-0">
              <span className="absolute -left-[7px] top-2 w-3 h-3 rounded-full bg-bg border-2 border-accent flex items-center justify-center">
                {i === 0 && <span className="block w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />}
              </span>

              <div className="grid sm:grid-cols-12 gap-4 sm:gap-8">
                <div className="sm:col-span-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink2 block">{e.range}</span>
                  <span className={`mt-2 inline-block font-mono text-[10px] uppercase tracking-[0.2em] border px-2 py-0.5 rounded ${KIND_TONE[e.kind]}`}>
                    {KIND_LABEL[e.kind]}
                  </span>
                </div>

                <div className="sm:col-span-9">
                  <h4 className="font-display font-bold text-xl sm:text-2xl text-ink leading-tight">{e.role}</h4>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted mt-1">{e.org}</p>
                  <p className="mt-3 text-ink2 text-[15px] leading-relaxed">{e.description}</p>
                  {e.stack && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {e.stack.map((s) => (
                        <span key={s} className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink2 border border-line px-2 py-1 rounded hover:border-accent hover:text-accent transition-colors">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
