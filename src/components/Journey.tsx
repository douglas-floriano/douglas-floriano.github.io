import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { scrollToId } from '../lib/smooth'

/*
  Trajetória como um crachá que evolui.

  Em vez de uma linha do tempo solta, a seção tem um único objeto que desce
  junto com a leitura: o crachá do Douglas, fixo ao lado. A cada trecho que
  passa, ele troca o ano e o cargo e ganha o que foi aprendido ali; nada some,
  o repertório só acumula. No fim, sobra um espaço em branco no crachá: o
  próximo projeto.

  O trecho ativo é o que cruza a linha de leitura (55% da tela). Tudo que
  aparece no crachá sai do próprio texto de cada trecho.
*/

type Entry = { year: number; when: string; title: string; org: string; body: string; adds: string[] }

// Em ordem de leitura: do começo até hoje.
const ENTRIES: Entry[] = [
  {
    year: 2017,
    when: '2017 a 2019',
    title: 'Formação em desenvolvimento de sistemas',
    org: 'Curso técnico',
    body: 'Lógica, banco de dados, redes e orientação a objetos. Onde a curiosidade virou profissão.',
    adds: ['Lógica', 'Banco de dados', 'Redes', 'Orientação a objetos'],
  },
  {
    year: 2018,
    when: '2018 a 2020',
    title: 'Primeiros sistemas em produção',
    org: 'Início de carreira',
    body: 'PHP, jQuery e SQL no dia a dia. Aprendi cedo que o código só conta quando alguém usa na manhã seguinte.',
    adds: ['PHP', 'jQuery', 'SQL'],
  },
  {
    year: 2020,
    when: '2020 a 2022',
    title: 'Desenvolvedor fullstack',
    org: 'Projetos sob medida',
    body: 'Plataformas para academias, eventos e comércio. Foi quando saí do "funciona na minha máquina" e passei a cuidar de servidor, banco em nuvem e cliente ligando no sábado.',
    adds: ['Servidor', 'Banco em nuvem', 'Cliente ligando no sábado'],
  },
  {
    year: 2022,
    when: '2022 até hoje',
    title: 'Desenvolvedor sênior fullstack',
    org: 'IB System',
    body: 'Sustento e evoluo os produtos da empresa: Lotemobile, IB Ticket, HRT Invest, Token, IB3 Capital e IB Core. Banco, API, frontend, apps, infraestrutura na AWS e deploy automatizado. Também cuido das integrações de pagamento e de WhatsApp.',
    adds: ['AWS', 'Deploy automatizado', 'Apps', 'Pagamentos', 'WhatsApp'],
  },
  {
    year: 2025,
    when: '2025 até hoje',
    title: 'IA aplicada dentro dos produtos',
    org: 'IB System e projetos próprios',
    body: 'Levei agentes para o centro do trabalho: agentes especialistas no LoteIA, um servidor MCP que abre o Lotemobile para assistentes de IA, um sistema que transforma pedidos do WhatsApp em correções revisadas e uma central onde o Claude de cada dev abre pedidos para os outros.',
    adds: ['Agentes de IA', 'MCP', 'Claude'],
  },
]

const NOW = new Date().getFullYear()
const NEXT = ENTRIES.length // índice do "próximo capítulo"

function Digits({ value }: { value: number }) {
  return (
    <span className="inline-flex" aria-hidden>
      {String(value).split('').map((d, i) => (
        <span key={i} className="relative inline-block w-[0.62em] h-[1em] overflow-hidden">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={d}
              className="absolute inset-0 text-center"
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {d}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  )
}

function Badge({ active }: { active: number }) {
  const done = Math.min(active, ENTRIES.length - 1)
  const current = ENTRIES[done]
  const next = active === NEXT
  const year = next ? NOW : current.year

  return (
    <div className="relative glass rounded-[28px] border border-line/80 shadow-[0_40px_90px_-40px_rgba(0,0,0,.9)] px-5 pt-8 pb-5 sm:px-7 sm:pt-9 sm:pb-6">
      {/* furo da cordinha: é o detalhe que faz o cartão ler como crachá */}
      <span className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-2 rounded-full bg-night border border-line" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="grid place-items-center w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-2xl bg-gradient-to-br from-spark to-[#F08A4B] font-display font-bold text-night text-[17px]">
            DF
          </span>
          <div className="min-w-0">
            <p className="font-display font-semibold text-[17px] sm:text-[18px] leading-tight">Douglas Floriano</p>
            <p className="text-[13px] text-muted">Crachá de desenvolvedor</p>
          </div>
        </div>
        <p className="font-mono text-[clamp(1.5rem,2.6vw,2.1rem)] leading-none text-spark tnum">
          <Digits value={year} />
        </p>
      </div>

      <div className="mt-4 sm:mt-6 min-h-[58px] sm:min-h-[76px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={next ? 'next' : current.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <p className="hidden sm:block text-[12px] uppercase tracking-[0.14em] text-muted">Cargo</p>
            <p className="sm:mt-1 font-display text-[1.1rem] sm:text-[1.25rem] font-semibold leading-snug">
              {next ? 'Disponível para o próximo projeto' : current.title}
            </p>
            <p className="text-[14px] text-signal">{next ? 'Aberto a projetos e parcerias' : current.org}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-line/70">
        <p className="text-[12px] uppercase tracking-[0.14em] text-muted">
          Repertório <span className="tnum normal-case tracking-normal">· {ENTRIES.slice(0, done + 1).reduce((n, e) => n + e.adds.length, 0)} itens</span>
        </p>
        <LayoutGroup>
          <motion.ul layout className="mt-3 flex flex-wrap gap-2">
            {ENTRIES.slice(0, done + 1).map((e, i) =>
              e.adds.map((a) => {
                const fresh = i === done && !next
                // no celular o crachá fica preso no topo: mostra só os dois últimos trechos
                const older = i < done - 1
                return (
                  <motion.li
                    key={a}
                    layout
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                    className={`chip transition-colors duration-500 ${fresh ? 'border-spark/60 bg-spark/10 text-spark' : ''} ${older ? 'hidden lg:inline-flex' : ''}`}
                  >
                    {a}
                  </motion.li>
                )
              }),
            )}
            {next && (
              <motion.li
                layout
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                className="chip border-dashed border-spark/70 text-spark"
              >
                + o seu projeto
              </motion.li>
            )}
          </motion.ul>
        </LayoutGroup>
      </div>

      <ol className="mt-5 sm:mt-6 flex gap-1.5" aria-hidden>
        {[...ENTRIES, null].map((_, i) => (
          <li key={i} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= active ? 'bg-spark' : 'bg-line'}`} />
        ))}
      </ol>
    </div>
  )
}

export default function Journey() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step)) }),
      { rootMargin: '-55% 0px -45% 0px' },
    )
    root.querySelectorAll('[data-step]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const step = (i: number) =>
    `min-h-[60svh] lg:min-h-[78svh] flex flex-col justify-center py-10 transition-opacity duration-500 ${active === i ? 'opacity-100' : 'opacity-40'}`

  return (
    <section id="trajetoria" data-field="cloud" className="relative py-20 sm:py-24">
      <div className="page">
        <div className="max-w-3xl">
          <p className="kicker">Trajetória</p>
          <h2 className="mt-4 h-sec text-[clamp(2.4rem,5vw,4.2rem)]">Oito anos colocando sistemas no ar.</h2>
          <p className="mt-4 text-soft max-w-[52ch]">
            Desça a página e acompanhe o crachá: a cada trecho ele troca de cargo e guarda o que foi aprendido ali.
          </p>
        </div>

        <div ref={ref} className="mt-6 lg:mt-0 block lg:grid lg:grid-cols-12 gap-x-14">
          {/* o crachá: no celular fica preso no topo, no desktop ao lado do texto */}
          <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1 self-start sticky top-[68px] lg:top-0 z-10 lg:h-[100svh] flex lg:items-center -mx-5 px-5 pt-2 pb-6 lg:m-0 lg:p-0 bg-gradient-to-b from-night from-85% to-transparent lg:bg-none">
            <div className="w-full">
              <Badge active={active} />
            </div>
          </div>

          <ol className="lg:col-span-6 lg:row-start-1">
            {ENTRIES.map((e, i) => (
              <li key={e.title} data-step={i} className={step(i)}>
                <p className="text-[15px] text-muted tnum">{e.when}</p>
                <h3 className="mt-2 font-display text-[clamp(1.6rem,2.8vw,2.3rem)] font-semibold leading-tight">{e.title}</h3>
                <p className="mt-1 text-signal text-[15px]">{e.org}</p>
                <p className="mt-4 text-soft max-w-[54ch]">{e.body}</p>
              </li>
            ))}
            <li data-step={NEXT} className={step(NEXT)}>
              <p className="text-[15px] text-spark tnum">{NOW}, próximo capítulo</p>
              <h3 className="mt-2 font-display text-[clamp(1.6rem,2.8vw,2.3rem)] font-semibold leading-tight">O espaço em branco do crachá.</h3>
              <p className="mt-4 text-soft max-w-[54ch]">
                Se você tem um produto para tirar do papel, ou uma operação que pede IA de verdade,
                ele é o próximo item do repertório.
              </p>
              <div>
                <button onClick={() => scrollToId('contato')} className="btn btn-main mt-7">
                  Vamos conversar <ArrowRight size={16} />
                </button>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  )
}
