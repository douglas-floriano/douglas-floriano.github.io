const ITEMS = [
  {
    title: 'Antes do código',
    body: 'Converso com quem usa o sistema e, quando dá, acompanho o uso real: a portaria do evento, o caixa do restaurante, o financeiro da loteadora. Muito requisito só aparece ali.',
  },
  {
    title: 'Dados e limites',
    body: 'Modelo o banco, separo os dados de cada cliente e decido o que roda em fila. Quando o sistema tem IA, é nessa etapa que defino o que ela pode ler, o que pode fazer e o que precisa da confirmação de uma pessoa.',
  },
  {
    title: 'Como uso IA',
    body: 'Uso o Claude Code para ler código, escrever testes e adiantar tarefas repetitivas, e leio o diff de toda mudança antes de subir. Nos produtos, uso modelos da Anthropic e da OpenAI e, quando o dado não pode sair da máquina ou o custo pesa, modelos abertos rodando local.',
  },
  {
    title: 'Entrega',
    body: 'Testes automatizados, logs e deploy automático em contêineres na AWS. Nos sistemas com IA também acompanho a taxa de acerto e o custo de cada tarefa.',
  },
]

export default function HowIWork() {
  return (
    <section id="como-trabalho" className="scroll-mt-16 py-9 sm:py-11 bg-surface border-y border-line">
      <div className="page grid grid-cols-1 lg:grid-cols-12 gap-8">
        <h2 className="lg:col-span-3 font-display font-bold tracking-[-0.02em] text-[clamp(1.6rem,3vw,2.1rem)] leading-tight">Como trabalho</h2>
        <dl className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7">
          {ITEMS.map((it) => (
            <div key={it.title}>
              <dt className="font-display font-semibold text-[1.15rem] text-ink">{it.title}</dt>
              <dd className="mt-1.5 text-soft text-[16px]">{it.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
