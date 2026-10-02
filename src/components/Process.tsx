import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const STEPS = [
  {
    title: 'Entender a operação antes do código',
    body: 'Converso com quem usa o sistema e, quando dá, acompanho o uso real: a portaria do evento, o caixa do restaurante, o financeiro da loteadora. O requisito certo costuma estar no detalhe que ninguém escreveu.',
  },
  {
    title: 'Desenhar os dados e os limites',
    body: 'Modelo o banco, separo o que é de cada cliente, defino o que roda em fila e o que precisa ser na hora. Quando há IA, é aqui que decido o que ela pode ler, o que pode fazer e onde ela para.',
  },
  {
    title: 'Construir com IA no ciclo, não no comando',
    body: 'Uso agentes para acelerar leitura de código, testes e tarefas repetitivas. Cada mudança passa por mim, com diff revisado e teste rodando. A velocidade aumenta sem perder o controle do que vai para o ar.',
  },
  {
    title: 'Medir antes de chamar de pronto',
    body: 'Testes automatizados, logs estruturados e métricas de uso. Em sistema com IA, meço também a taxa de acerto e o custo por tarefa. Se não sei medir, ainda não terminei.',
  },
  {
    title: 'Colocar no ar e continuar por perto',
    body: 'Deploy automatizado em contêineres na AWS, com rollback simples. Depois do lançamento acompanho os primeiros dias de uso, porque é ali que aparecem as melhores melhorias.',
  },
]

function Step({ s, i, total }: { s: (typeof STEPS)[number]; i: number; total: number }) {
  const ref = useRef<HTMLLIElement | null>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'start 35%'] })
  const opacity = useTransform(scrollYProgress, [0, 1], [0.25, 1])
  const x = useTransform(scrollYProgress, [0, 1], [24, 0])
  const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  return (
    <motion.li ref={ref} style={{ opacity, x }} className="relative py-9">
      <div className="absolute top-0 inset-x-0 h-px bg-line">
        <motion.div style={{ width }} className="h-px bg-signal" />
      </div>
      <div className="grid sm:grid-cols-[88px_1fr] gap-3 sm:gap-6">
        <span className="font-display text-[2.6rem] leading-none font-semibold text-signal tnum">{i + 1}<span className="text-muted text-lg">/{total}</span></span>
        <div>
          <h3 className="font-display text-[clamp(1.4rem,2.2vw,1.9rem)] font-semibold leading-tight">{s.title}</h3>
          <p className="mt-3 text-soft max-w-[60ch]">{s.body}</p>
        </div>
      </div>
    </motion.li>
  )
}

export default function Process() {
  return (
    <section id="processo" data-field="cloud" className="relative py-28">
      <div className="page grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="kicker">Como trabalho</p>
            <h2 className="mt-4 h-sec text-[clamp(2.4rem,4.6vw,3.9rem)]">Do primeiro papo ao sistema rodando.</h2>
            <p className="mt-6 text-soft max-w-[40ch]">
              Cinco etapas que repito em todo projeto, do SaaS usado por várias empresas ao app que fiz para o futebol de terça.
            </p>
          </div>
        </div>
        <ol className="lg:col-span-8">
          {STEPS.map((s, i) => <Step key={s.title} s={s} i={i} total={STEPS.length} />)}
        </ol>
      </div>
    </section>
  )
}
