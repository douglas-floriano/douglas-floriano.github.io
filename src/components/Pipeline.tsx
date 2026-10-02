import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { MessageCircle, Filter, Database, Cpu, UserCheck, Rocket } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Step = { icon: LucideIcon; name: string; title: string; body: string; detail: string[] }

const STEPS: Step[] = [
  {
    icon: MessageCircle,
    name: 'Mensagem',
    title: 'O cliente escreve no WhatsApp, do jeito dele',
    body: 'Áudio, print, texto pela metade. A mensagem entra no sistema como conteúdo não confiável: fica delimitada e nunca é tratada como instrução para o agente.',
    detail: ['Evolution GO conectado ao WhatsApp', 'lista de contatos autorizados', 'anexos e prints junto do pedido'],
  },
  {
    icon: Filter,
    name: 'Triagem',
    title: 'Um modelo rápido entende o que foi pedido',
    body: 'Classifica o sistema, o tipo de pedido e o cliente envolvido. Regras escritas em código corrigem o modelo nos casos que eu já sei que ele erra, como confundir número de ambiente com número de parcela.',
    detail: ['modelo leve, resposta em segundos', 'correção, melhoria ou dúvida', 'regras determinísticas por cima do modelo'],
  },
  {
    icon: Database,
    name: 'Contexto',
    title: 'O agente recebe o mapa do sistema antes de mexer',
    body: 'Esquema do banco gerado direto do código, logs da nuvem filtrados pelo cliente certo e consultas apenas de leitura. Se a consulta cita uma coluna que não existe, ela é recusada com sugestão.',
    detail: ['esquema atualizado a cada mudança', 'logs do CloudWatch por ambiente', 'SQL somente leitura e validado'],
  },
  {
    icon: Cpu,
    name: 'Execução',
    title: 'Trabalho em uma cópia isolada do repositório',
    body: 'Um modelo mais forte trabalha numa worktree própria, com lista fechada de ferramentas. Ele altera o código e roda os testes, mas não tem permissão para commit, push ou envio de mensagem.',
    detail: ['branch dedicada por tarefa', 'ferramentas liberadas uma a uma', 'teste automático do próprio sandbox'],
  },
  {
    icon: UserCheck,
    name: 'Revisão',
    title: 'Eu reviso diff, testes e a resposta sugerida',
    body: 'Um painel mostra o que mudou, o resultado dos testes e o rascunho da mensagem para o cliente. Nada sai sem o meu clique. Também dá para mandar a tarefa para outra pessoa do time pelo IB Dispatch.',
    detail: ['diff e log completo da execução', 'resposta editável antes do envio', 'ponte com o painel da equipe'],
  },
  {
    icon: Rocket,
    name: 'Entrega',
    title: 'Sobe para produção e o cliente é avisado no fim',
    body: 'A branch vira pull request. Correção pode ser mesclada com um clique em ambiente com deploy automático; funcionalidade nova nunca. O cliente só recebe o aviso depois que o deploy termina com sucesso.',
    detail: ['PR automático', 'merge só de correção', 'aviso condicionado ao deploy'],
  },
]

export default function Pipeline() {
  const ref = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [active, setActive] = useState(0)
  const fill = useTransform(scrollYProgress, [0.02, 0.95], [0, 1])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.min(STEPS.length - 1, Math.max(0, Math.floor(v * STEPS.length * 1.02)))
    setActive(i)
  })

  const step = STEPS[active]

  return (
    <section ref={ref} data-field="helix" className="relative" style={{ height: `${STEPS.length * 70 + 40}vh` }} aria-label="Fluxo de um pedido">
      <div className="sticky top-0 min-h-[100svh] flex items-center pt-20 pb-10">
        <div className="page w-full">
          <div className="max-w-3xl">
            <p className="kicker">Um caso por dentro</p>
            <h2 className="mt-4 h-sec text-[clamp(2.1rem,4.4vw,3.8rem)]">
              Como um pedido no WhatsApp vira código em produção.
            </h2>
          </div>

          <div className="mt-8 lg:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
            <ol className="lg:col-span-5 relative flex justify-between lg:block">
              <div className="hidden lg:block absolute left-[23px] top-6 bottom-6 w-px bg-line" aria-hidden>
                <motion.div style={{ scaleY: fill }} className="absolute inset-0 bg-gradient-to-b from-signal to-spark origin-top" />
              </div>
              {STEPS.map((s, i) => {
                const Icon = s.icon
                const on = i <= active
                const cur = i === active
                return (
                  <li key={s.name} className="relative flex items-center gap-5 lg:py-2.5">
                    <span className={`relative z-10 grid place-items-center w-12 h-12 rounded-full border transition-colors duration-300 ${cur ? 'bg-spark text-night border-spark' : on ? 'bg-deep2 text-signal border-signal/60' : 'bg-night text-muted border-line'}`}>
                      <Icon size={19} />
                    </span>
                    <span className={`hidden lg:inline font-display text-[clamp(1.1rem,1.6vw,1.35rem)] transition-colors duration-300 ${cur ? 'text-text' : on ? 'text-soft' : 'text-muted'}`}>
                      {s.name}
                    </span>
                  </li>
                )
              })}
            </ol>

            <div className="lg:col-span-7 relative min-h-[330px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="glass rounded-3xl border border-line/80 p-7 sm:p-10"
                >
                  <p className="text-[14px] text-spark tnum">Etapa {active + 1} de {STEPS.length}</p>
                  <h3 className="mt-3 h-sec text-[clamp(1.5rem,2.6vw,2.3rem)]">{step.title}</h3>
                  <p className="mt-4 text-soft text-[16px] sm:text-[17px]">{step.body}</p>
                  <ul className="mt-7 grid sm:grid-cols-3 gap-3">
                    {step.detail.map((d) => (
                      <li key={d} className="rounded-xl border border-line bg-night/40 px-4 py-3 text-[14px] text-soft">{d}</li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
