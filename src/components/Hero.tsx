import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, Download } from 'lucide-react'
import { scrollToId } from '../lib/smooth'

type Step = { tag: string; text: string; tone?: 'spark' | 'mint' | 'signal' }

// Um pedido do começo ao fim, no formato que o zap-tarefas registra. Exemplo montado a partir do fluxo real.
const STORY: Step[] = [
  { tag: 'WhatsApp', text: 'Cliente escreve: "as baixas de ontem não aparecem no relatório"' },
  { tag: 'Triagem', text: 'Correção no Lotemobile, cliente identificado, prioridade alta', tone: 'signal' },
  { tag: 'Contexto', text: 'Logs da AWS e esquema do banco desse cliente carregados' },
  { tag: 'Agente', text: 'Causa encontrada e corrigida numa branch isolada' },
  { tag: 'Testes', text: 'Todos os testes passando', tone: 'mint' },
  { tag: 'Revisão', text: 'Esperando a minha aprovação para subir', tone: 'spark' },
  { tag: 'Entrega', text: 'No ar e cliente avisado só depois do deploy', tone: 'mint' },
]

function AgentConsole() {
  const [reduce] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [count, setCount] = useState(() => (reduce ? STORY.length : 1))

  useEffect(() => {
    if (reduce) return
    // mostra um passo por vez; no fim, segura a história completa e recomeça
    const delay = count >= STORY.length ? 5200 : 1700
    const id = window.setTimeout(() => setCount((c) => (c >= STORY.length ? 1 : c + 1)), delay)
    return () => window.clearTimeout(id)
  }, [count, reduce])

  const tone = (t?: Step['tone']) =>
    t === 'spark' ? 'text-spark' : t === 'mint' ? 'text-mint' : t === 'signal' ? 'text-signal' : 'text-soft'

  return (
    <div className="glass rounded-2xl border border-line/80 overflow-hidden shadow-[0_30px_80px_-30px_rgba(0,0,0,.8)]">
      <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-line/70">
        <span className="text-[14px] text-text font-medium">Um pedido, do WhatsApp ao deploy</span>
        <span className="text-[13px] text-muted tnum shrink-0">passo {count} de {STORY.length}</span>
      </div>
      <ol className="px-5 py-4 flex flex-col gap-2.5 min-h-[318px]">
        {STORY.slice(0, count).map((l, i) => (
          <motion.li
            key={`${l.tag}-${i}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-[78px_1fr] gap-3 items-baseline"
          >
            <span className="font-mono text-[12px] text-muted">{l.tag}</span>
            <span className={`text-[14.5px] leading-snug ${tone(l.tone)}`}>{l.text}</span>
          </motion.li>
        ))}
      </ol>
      <p className="px-5 py-3 border-t border-line/70 text-[12.5px] text-muted">Exemplo do fluxo real do zap-tarefas, explicado mais abaixo.</p>
    </div>
  )
}

const NAME = ['Douglas', 'Floriano']

export default function Hero() {
  const ref = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, -120])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section ref={ref} id="inicio" data-field="sphere" className="relative min-h-[100svh] flex flex-col justify-center pt-28 pb-16">
      <motion.div style={{ y, opacity: fade }} className="page relative">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="inline-flex items-center rounded-full border border-line bg-deep/60 px-4 py-1.5 text-[14px] text-soft"
        >
          Aberto a novos projetos e parcerias
        </motion.p>

        <h1 className="mt-6 lg:mt-8 h-mega text-[clamp(3.6rem,min(13vw,15.5vh),11rem)]">
          {NAME.map((word, wi) => (
            <span key={word} className="block overflow-hidden pb-[0.06em]">
              <motion.span
                className={`block ${wi === 1 ? 'text-soft' : ''}`}
                initial={{ y: '105%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.25 + wi * 0.12, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-8 lg:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <motion.div
            className="lg:col-span-6 min-w-0"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7 }}
          >
            <p className="font-display text-[clamp(1.35rem,2.4vw,1.9rem)] leading-snug font-medium text-text max-w-[30ch]">
              Engenheiro de software e especialista em IA aplicada a produtos reais.
            </p>
            <p className="mt-5 text-soft max-w-[54ch]">
              Há mais de oito anos construo sistemas que pessoas usam todos os dias: loteamentos,
              ingressos, investimentos, restaurantes e academias. Hoje coloco agentes de IA dentro
              desses sistemas para atender clientes, corrigir código e tomar decisões com dados,
              sempre com uma pessoa aprovando o que importa.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => scrollToId('destaques')} className="btn btn-main">
                Ver projetos <ArrowDown size={16} />
              </button>
              <a href="/cv-douglas-floriano-costa.pdf" download className="btn btn-line">
                <Download size={16} /> Baixar currículo
              </a>
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-5 lg:col-start-8 min-w-0"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
          >
            <AgentConsole />
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        style={{ opacity: fade }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-[13px] text-muted"
      >
        Role para explorar
        <span className="w-px h-10 bg-gradient-to-b from-signal to-transparent" />
      </motion.div>
    </section>
  )
}
