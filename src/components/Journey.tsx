import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const ENTRIES = [
  {
    when: '2025 até hoje',
    title: 'IA aplicada dentro dos produtos',
    org: 'IB System e projetos próprios',
    body: 'Levei agentes para o centro do trabalho: agentes especialistas no LoteIA, um servidor MCP que abre o Lotemobile para assistentes de IA, um sistema que transforma pedidos do WhatsApp em correções revisadas e uma central onde o Claude de cada dev abre pedidos para os outros.',
  },
  {
    when: '2021 até hoje',
    title: 'Desenvolvedor sênior fullstack',
    org: 'IB System',
    body: 'Sustento e evoluo os produtos da empresa: Lotemobile, IB Ticket, HRT Invest, Token, IB3 Capital e IB Core. Banco, API, frontend, apps, infraestrutura na AWS e deploy automatizado. Também cuido das integrações de pagamento e de WhatsApp.',
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
  const ref = useRef<HTMLOListElement | null>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const h = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section id="trajetoria" data-field="cloud" className="relative py-20 sm:py-24">
      <div className="page">
        <div className="max-w-3xl">
          <p className="kicker">Trajetória</p>
          <h2 className="mt-4 h-sec text-[clamp(2.4rem,5vw,4.2rem)]">Desde 2020 colocando sistemas no ar.</h2>
        </div>

        <ol ref={ref} className="relative mt-12 ml-2 sm:ml-0">
          <div className="absolute left-[7px] sm:left-[199px] top-2 bottom-2 w-px bg-line" aria-hidden>
            <motion.div style={{ height: h }} className="w-px bg-gradient-to-b from-spark to-signal" />
          </div>
          {ENTRIES.map((e, i) => (
            <motion.li
              key={e.when + e.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15% 0px' }}
              transition={{ duration: 0.6 }}
              className="relative grid sm:grid-cols-[200px_1fr] gap-2 sm:gap-12 pl-8 sm:pl-0 pb-10 last:pb-0"
            >
              <span className={`absolute left-0 sm:left-[192px] top-1.5 w-[15px] h-[15px] rounded-full border-2 ${i === 0 ? 'border-spark bg-spark/30' : 'border-signal bg-night'}`} />
              <p className="text-[15px] text-muted tnum sm:pt-0.5 sm:pr-8 sm:text-right">{e.when}</p>
              <div className="sm:pl-2">
                <h3 className="font-display text-[clamp(1.4rem,2.2vw,1.85rem)] font-semibold leading-tight">{e.title}</h3>
                <p className="mt-1 text-signal text-[15px]">{e.org}</p>
                <p className="mt-3 text-soft max-w-[62ch]">{e.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
