import { motion } from 'framer-motion'

type Entry = {
  range: string
  kind: 'trabalho' | 'educação' | 'produto'
  role: string
  org: string
  description: string
  stack?: string[]
}

const ENTRIES: Entry[] = [
  {
    range: '2022 — Presente',
    kind: 'trabalho',
    role: 'Desenvolvedor Sênior Fullstack',
    org: 'IB System',
    description:
      'Mantenho 4 SaaS em produção (loteamento, ingresso, investimento, capital). Backend Laravel + filas Horizon, frontend React/React Native, infra AWS ECS/RDS/CloudFront. Da modelagem do banco ao deploy, do pager ao pixel.',
    stack: ['Laravel 10', 'React 19', 'AWS ECS', 'MariaDB', 'GitHub Actions'],
  },
  {
    range: '2020 — 2022',
    kind: 'trabalho',
    role: 'Desenvolvedor Fullstack',
    org: 'Projetos clientes · freelance',
    description:
      'Plataformas sob medida pra academias, eventos e e-commerces. Primeiros contatos com infra real — sair do "roda no meu PC" e botar coisa de pé na nuvem.',
    stack: ['PHP 8', 'Laravel', 'React', 'MySQL', 'Docker'],
  },
  {
    range: '2018 — 2020',
    kind: 'trabalho',
    role: 'Desenvolvedor Júnior',
    org: 'Primeiras experiências em produção',
    description:
      'Começo de carreira escrevendo PHP, jQuery e SQL no dia-a-dia. Aprendi que código que ninguém usa não conta — só vale o que entra em produção e o cliente abre amanhã de manhã.',
    stack: ['PHP', 'jQuery', 'MySQL', 'Bootstrap'],
  },
  {
    range: '2017 — 2019',
    kind: 'educação',
    role: 'Formação em Desenvolvimento de Sistemas',
    org: 'Curso técnico · base sólida',
    description:
      'Fundamentos de lógica, banco de dados, redes e POO. Onde a curiosidade virou ofício.',
  },
  {
    range: 'desde sempre',
    kind: 'produto',
    role: 'Produtos pessoais',
    org: 'Madrugadas e fins de semana',
    description:
      'Duas iniciativas próprias rodando em paralelo com o trabalho — porque construir produto é diferente de manter projeto, e ambos ensinam.',
    stack: ['Next.js', 'Expo', 'Postgres', 'Stripe'],
  },
]

const KIND_LABEL: Record<Entry['kind'], string> = {
  trabalho: 'Trabalho',
  educação: 'Formação',
  produto: 'Produto',
}

export default function Journey() {
  return (
    <section id="trajetoria" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
        <div className="h-line mb-10 sm:mb-14">
          <span className="kicker">
            <span className="ornament not-italic">№ 03</span> &nbsp; Sobre mim
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 mb-14 sm:mb-20">
          <div className="lg:col-span-7">
            <h2 className="display text-[clamp(2.4rem,6vw,4.5rem)] text-ink">
              Minha <span className="marker">trajetória</span> até aqui.
            </h2>
          </div>
          <p className="lg:col-span-5 text-base sm:text-lg text-ink2 leading-relaxed font-light lg:pt-3">
            Não foi atalho. Foi PHP no terminal de madrugada, banco modelado no caderno, deploy
            FTP, primeiro <em className="font-serif">git push</em> que assustou. Cada degrau virou
            cicatriz útil — e a stack de hoje carrega tudo isso.
          </p>
        </div>

        <ol className="relative border-l border-ink/15 ml-3 sm:ml-6">
          {ENTRIES.map((e, i) => (
            <motion.li
              key={e.range + e.role}
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="relative pl-8 sm:pl-12 pb-12 sm:pb-14 last:pb-0"
            >
              {/* node */}
              <span className="absolute -left-[7px] top-2 w-3 h-3 rounded-full bg-paper border-2 border-ink flex items-center justify-center">
                {i === 0 && (
                  <span className="block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </span>

              <div className="grid sm:grid-cols-12 gap-4 sm:gap-8">
                <div className="sm:col-span-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink2 block">
                    {e.range}
                  </span>
                  <span className="mt-2 inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-muted border border-rule rounded-full px-2 py-0.5">
                    {KIND_LABEL[e.kind]}
                  </span>
                </div>

                <div className="sm:col-span-9">
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-ink leading-tight">
                    {e.role}
                  </h3>
                  <p className="font-serif italic text-sm text-muted mt-1">{e.org}</p>
                  <p className="mt-3 text-ink2 text-[15px] leading-relaxed font-light">
                    {e.description}
                  </p>
                  {e.stack && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {e.stack.map(s => (
                        <span
                          key={s}
                          className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink2 border border-rule px-2 py-1 rounded-full"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
