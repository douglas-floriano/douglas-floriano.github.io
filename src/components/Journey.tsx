const ENTRIES = [
  {
    when: '2025 até hoje',
    title: 'IA dentro dos produtos',
    org: 'IB System e projetos pessoais',
    body: 'Agentes especialistas no LoteIA, o servidor MCP do Lotemobile, o zap-tarefas e o IB Dispatch, onde o Claude de cada dev abre pedidos para os colegas.',
  },
  {
    when: '2021 até hoje',
    title: 'Desenvolvedor full-stack',
    org: 'IB System',
    body: 'Trabalho nos produtos da empresa: Lotemobile, IB Ticket, IB Pag, HRT Invest, Token e IB Core. Banco, API, frontend, apps, infraestrutura na AWS e deploy automatizado, além das integrações de pagamento e de WhatsApp.',
  },
  {
    when: '2020 a 2021',
    title: 'Estágio em desenvolvimento',
    org: 'IB System',
    body: 'Entrei na IB System como estagiário e fui contratado em 2021.',
  },
  {
    when: '2020 a 2022',
    title: 'Análise e Desenvolvimento de Sistemas',
    org: 'FATEC Franca',
    body: 'Curso superior de tecnologia, com três anos de duração.',
  },
]

export default function Journey() {
  return (
    <section id="trajetoria" className="scroll-mt-16 py-9 sm:py-11 border-t border-line">
      <div className="page grid grid-cols-1 lg:grid-cols-12 gap-8">
        <h2 className="lg:col-span-3 font-display font-bold tracking-[-0.02em] text-[clamp(1.6rem,3vw,2.1rem)] leading-tight">Trajetória</h2>
        <ol className="lg:col-span-9 flex flex-col gap-7">
          {ENTRIES.map((e) => (
            <li key={e.when + e.title} className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-x-6 gap-y-1">
              <p className="text-[15px] text-muted tnum sm:pt-0.5">{e.when}</p>
              <div>
                <h3 className="font-display font-semibold text-[1.2rem] leading-tight">
                  {e.title} <span className="text-amber font-normal text-[1rem]">· {e.org}</span>
                </h3>
                <p className="mt-1.5 text-soft text-[16px] max-w-[64ch]">{e.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
