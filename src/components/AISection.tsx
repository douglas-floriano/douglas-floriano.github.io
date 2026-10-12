import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Bot, Headphones, ScanText, AudioWaveform, Gauge, Plug } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Capability = {
  icon: LucideIcon
  title: string
  body: string
  flow: string[]
  where: string
}

const CAPS: Capability[] = [
  {
    icon: Bot,
    title: 'Agentes que escrevem código com limites claros',
    body: 'O agente recebe o pedido, abre uma branch isolada, lê logs e esquema do banco, altera o código e roda os testes. Ele não faz push, não faz merge e não fala com o cliente sozinho. Quem aprova sou eu.',
    flow: ['pedido', 'triagem', 'sandbox', 'testes', 'aprovação'],
    where: 'zap-tarefas e IB Dispatch',
  },
  {
    icon: Headphones,
    title: 'Atendimento por agentes especialistas, em texto e voz',
    body: 'Cada agente domina um assunto do negócio, como financeiro ou homologação bancária. O cliente conversa por chat ou por ligação, recebe boleto e PIX dentro da conversa e escuta a resposta em voz natural.',
    flow: ['cliente', 'agente certo', 'ferramentas', 'resposta'],
    where: 'LoteIA e agentes de WhatsApp do Lotemobile',
  },
  {
    icon: ScanText,
    title: 'Documentos que viram ação no sistema',
    body: 'Extrato bancário vira conciliação, foto de comprovante vira baixa de parcela, arquivo de retorno do banco vira homologação. O modelo devolve JSON validado, não texto solto, e qualquer gravação espera a confirmação de uma pessoa.',
    flow: ['anexo', 'modelo', 'JSON validado', 'confirmação'],
    where: 'LoteIA',
  },
  {
    icon: AudioWaveform,
    title: 'Modelos rodando na própria máquina',
    body: 'Nem tudo precisa de API. Separação de voz, detecção de melodia e de instrumentos rodam localmente com PyTorch, sem enviar áudio para fora e sem custo por chamada.',
    flow: ['MP3', 'Demucs', 'CREPE', 'partitura'],
    where: 'Transcritor musical',
  },
  {
    icon: Plug,
    title: 'Sistemas abertos para assistentes via MCP',
    body: 'O cliente pluga o próprio assistente de IA no ERP com login seguro e escopo por empresa. Dados pessoais são mascarados antes de chegar ao modelo. No time, o Claude de cada dev usa o mesmo protocolo para abrir pedidos para os colegas.',
    flow: ['assistente', 'OAuth 2.1', 'ferramentas', 'dados mascarados'],
    where: 'Lote Connect e IB Dispatch',
  },
  {
    icon: Gauge,
    title: 'Custo e observabilidade de IA',
    body: 'Modelo rápido para triar, modelo forte para executar, cache onde dá. Acompanho tokens por projeto, por modelo e por sessão para saber quanto cada automação custa de verdade.',
    flow: ['logs', 'tokens', 'custo', 'ajuste'],
    where: 'Painel de uso de IA',
  },
]

function Panel({ c, i }: { c: Capability; i: number }) {
  const Icon = c.icon
  return (
    <article className="glass rounded-3xl border border-line/80 p-7 sm:p-9 flex flex-col w-full lg:w-[520px] lg:h-[min(560px,calc(100vh-170px))] lg:overflow-hidden shrink-0">
      <div className="flex items-center justify-between">
        <span className="grid place-items-center w-12 h-12 rounded-2xl bg-signal/12 text-signal border border-signal/30">
          <Icon size={22} />
        </span>
        <span className="text-[14px] text-muted tnum">{i + 1} de {CAPS.length}</span>
      </div>
      <h3 className="mt-7 h-sec text-[clamp(1.6rem,2.4vw,2.1rem)]">{c.title}</h3>
      <p className="mt-4 text-soft">{c.body}</p>
      <div className="mt-auto pt-8">
        <div className="flex flex-wrap items-center gap-y-2">
          {c.flow.map((f, k) => (
            <span key={f} className="flex items-center">
              <span className={`font-mono text-[12px] px-2.5 py-1 rounded-md border ${k === c.flow.length - 1 ? 'border-spark/50 text-spark' : 'border-line text-soft'}`}>{f}</span>
              {k < c.flow.length - 1 && <span className="w-5 h-px bg-signal/50 mx-1" />}
            </span>
          ))}
        </div>
        <p className="mt-5 text-[14px] text-muted">Em produção em: <span className="text-text">{c.where}</span></p>
      </div>
    </article>
  )
}

export default function AISection() {
  const wrap = useRef<HTMLElement | null>(null)
  const track = useRef<HTMLDivElement | null>(null)
  const [dist, setDist] = useState(0)
  const [wide, setWide] = useState(true)

  useLayoutEffect(() => {
    const measure = () => {
      const isWide = window.innerWidth >= 1024
      setWide(isWide)
      if (track.current && isWide) setDist(track.current.scrollWidth - window.innerWidth + 80)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [wide])

  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -dist])
  const bar = useTransform(scrollYProgress, [0.05, 0.95], [0, 1])

  const intro = (
    <div className="w-full lg:w-[440px] shrink-0 lg:pr-6">
      <p className="kicker">IA aplicada</p>
      <h2 className="mt-4 h-sec text-[clamp(2.4rem,5vw,4.4rem)]">
        Seis formas de IA que já trabalham nos sistemas que construí.
      </h2>
      <p className="mt-6 text-soft max-w-[42ch]">
        Uso modelos da Anthropic e da OpenAI, além de modelos abertos rodando local. O que muda de um
        projeto para outro é o desenho: que ferramentas o agente pode usar, onde ele para e quem confere.
      </p>
    </div>
  )

  if (!wide) {
    return (
      <section ref={wrap} id="ia" data-field="helix" className="relative py-24">
        <div className="page flex flex-col gap-6">
          {intro}
          {CAPS.map((c, i) => <Panel key={c.title} c={c} i={i} />)}
        </div>
      </section>
    )
  }

  return (
    <section ref={wrap} id="ia" data-field="helix" className="relative" style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center pt-16">
        <motion.div ref={track} style={{ x }} className="flex items-center gap-6 pl-[max(40px,calc((100vw-1280px)/2+40px))]">
          {intro}
          {CAPS.map((c, i) => <Panel key={c.title} c={c} i={i} />)}
        </motion.div>
        <div className="page mt-8">
          <div className="h-px bg-line relative overflow-hidden rounded">
            <motion.div style={{ scaleX: bar }} className="absolute inset-0 bg-signal origin-left" />
          </div>
        </div>
      </div>
    </section>
  )
}
