const PRINCIPLES = [
  {
    n: '001',
    title: 'Produção > Protótipo',
    body: 'Tutorial não conta. Toy project não conta. O que conta é o sistema que tem usuário pagante usando às 23h47 num sábado e não pode cair.',
  },
  {
    n: '010',
    title: 'Banco ao pixel',
    body: 'Saber só backend é caolho. Saber só frontend é miopia. A entrega real exige migration, query, índice, cache, animação, hover, foco e a11y — tudo na mesma cabeça.',
  },
  {
    n: '011',
    title: 'Observabilidade primeiro',
    body: 'Antes de escalar, instrumentar. CloudWatch, Horizon, logs estruturados. Sistema sem métrica é sistema com fé. Fé não escala.',
  },
  {
    n: '100',
    title: 'Boring > Clever',
    body: 'Laravel + MariaDB + ECS resolve 95% dos problemas. Reservar a complexidade para quando ela é o produto, não quando ela é o ego.',
  },
  {
    n: '101',
    title: 'Deploy é cultura',
    body: 'Se o deploy dá medo, ele acontece pouco. Se acontece pouco, o blast radius cresce. Pipeline previsível > heroísmo de madrugada.',
  },
  {
    n: '110',
    title: 'Cliente é o juiz',
    body: 'Especificação não roda em produção. Conversa de Slack não roda em produção. Quem decide se o sistema é bom é quem usa todo dia, sem desculpa.',
  },
]

export default function Manifesto() {
  return (
    <section id="manifesto" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8 lg:px-16">
        <div className="section-head">
          <span className="kicker">/ 05</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">manifesto · /etc/principles</h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-px bg-line border border-line rounded-2xl overflow-hidden">
          {PRINCIPLES.map((p) => (
            <div key={p.n} className="group bg-bg p-8 hover:bg-bg2 transition-colors relative">
              <div className="absolute top-0 left-0 w-12 h-px bg-accent transition-all group-hover:w-full duration-500" />
              <div className="flex items-baseline justify-between mb-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">0b{p.n}</span>
                <span className="font-mono text-[10px] text-accent opacity-0 group-hover:opacity-100 transition-opacity">→ exec</span>
              </div>
              <h3 className="font-display font-bold text-2xl tracking-tight text-ink mb-3">{p.title}</h3>
              <p className="text-sm text-ink2 leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
