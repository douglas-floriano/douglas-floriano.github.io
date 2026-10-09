const GROUPS = [
  ['IA', 'Claude (API e Claude Code), OpenAI SDK, MCP, agentes com ferramentas restritas, saída estruturada em JSON, Whisper, PyTorch'],
  ['Backend', 'PHP 8 e Laravel 8 a 13, Node.js com Fastify, NestJS e Express, Python com FastAPI, filas com Horizon e Redis, WebSocket, Reverb e SSE'],
  ['Frontend e mobile', 'React 19, TypeScript, Next.js, Tailwind CSS, React Native e Expo, Three.js, Kotlin com Jetpack Compose'],
  ['Dados', 'MariaDB, MySQL, PostgreSQL, SQLite, MongoDB, Redis, Drizzle, Eloquent'],
  ['Nuvem e entrega', 'AWS (ECS Fargate, ECR, RDS, S3, CloudFront, CloudWatch), Docker, GitHub Actions, Vercel, Oracle Cloud'],
  ['Pagamentos e WhatsApp', 'PIX, Mercado Pago, Pagar.me, Meta Cloud API, Evolution API e Evolution GO, whatsapp-web.js'],
]

export default function Stack() {
  return (
    <section id="ferramentas" className="scroll-mt-16 py-9 sm:py-11">
      <div className="page grid grid-cols-1 lg:grid-cols-12 gap-8">
        <h2 className="lg:col-span-3 font-display font-bold tracking-[-0.02em] text-[clamp(1.6rem,3vw,2.1rem)] leading-tight">Ferramentas</h2>
        <dl className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-x-10 border-t border-line">
          {GROUPS.map(([g, items]) => (
            <div key={g} className="py-3 border-b border-line">
              <dt className="font-medium text-ink">{g}</dt>
              <dd className="mt-0.5 text-soft text-[15.5px]">{items}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
