const GROUPS = [
  {
    title: 'Inteligência artificial',
    note: 'Modelos, agentes e o que vai em volta deles',
    items: ['Claude (API e Claude Code)', 'OpenAI SDK', 'MCP (Model Context Protocol)', 'Agentes com ferramentas restritas', 'Saída estruturada em JSON', 'Whisper e voz', 'PyTorch, Demucs, CREPE', 'Prompt, calibragem e avaliação'],
    hot: true,
  },
  {
    title: 'Backend',
    note: 'Onde mora a regra de negócio',
    items: ['PHP 8 e Laravel 8 a 13', 'Node.js com Fastify, NestJS e Express', 'Python com FastAPI', 'Filas com Horizon e Redis', 'WebSocket, Reverb e SSE', 'Integrações PIX, Mercado Pago e Pagar.me'],
  },
  {
    title: 'Frontend e mobile',
    note: 'Onde mora quem usa',
    items: ['React 19 e TypeScript', 'Next.js', 'React Native e Expo', 'Tailwind CSS', 'Three.js e React Three Fiber', 'Kotlin com Jetpack Compose (POS)'],
  },
  {
    title: 'Dados',
    note: 'Modelagem é parte do design',
    items: ['MariaDB e MySQL', 'PostgreSQL', 'SQLite', 'MongoDB', 'Redis', 'Drizzle, Eloquent e SQLAlchemy'],
  },
  {
    title: 'Nuvem e entrega',
    note: 'Como o código chega no ar',
    items: ['AWS ECS Fargate, ECR e RDS', 'S3 e CloudFront', 'Docker e Compose', 'GitHub Actions', 'Vercel e Oracle Cloud', 'CloudWatch e logs estruturados'],
  },
  {
    title: 'WhatsApp e mensageria',
    note: 'O canal onde o cliente já está',
    items: ['Meta Cloud API oficial', 'Evolution API e Evolution GO', 'whatsapp-web.js e Baileys', 'Webhooks e templates', 'Chatbots com IA'],
  },
]

const MARQUEE = ['Laravel', 'React', 'Claude', 'TypeScript', 'AWS', 'Expo', 'OpenAI', 'MCP', 'Node.js', 'PostgreSQL', 'Docker', 'Python', 'Next.js', 'Three.js', 'MariaDB', 'FastAPI']

export default function Stack() {
  return (
    <section id="stack" data-field="cloud" className="relative py-28 overflow-hidden">
      <div className="page">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7">
            <p className="kicker">Ferramentas</p>
            <h2 className="mt-4 h-sec text-[clamp(2.4rem,5vw,4.2rem)]">O que uso no dia a dia.</h2>
          </div>
          <p className="lg:col-span-5 text-soft">
            Escolho tecnologia pelo problema e pela equipe que vai manter depois. A maior parte do que está aqui roda hoje em algum dos projetos acima.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line rounded-3xl overflow-hidden border border-line">
          {GROUPS.map((g) => (
            <div key={g.title} className={`p-7 sm:p-8 ${g.hot ? 'bg-[#16183A]' : 'bg-deep/90'}`}>
              <h3 className={`font-display text-[1.35rem] font-semibold ${g.hot ? 'text-spark' : ''}`}>{g.title}</h3>
              <p className="mt-1 text-[14px] text-muted">{g.note}</p>
              <ul className="mt-5 space-y-2">
                {g.items.map((it) => (
                  <li key={it} className="text-soft text-[15.5px] flex gap-3">
                    <span className={`mt-[10px] w-1 h-1 rounded-full shrink-0 ${g.hot ? 'bg-spark' : 'bg-signal'}`} />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 select-none" aria-hidden>
        <div className="marquee flex w-max">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0">
              {MARQUEE.map((m) => (
                <span key={m + k} className="h-mega text-[clamp(3rem,8vw,6.5rem)] px-8 text-transparent [-webkit-text-stroke:1px_#2E3766]">{m}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
