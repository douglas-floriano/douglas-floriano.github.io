import { motion } from 'framer-motion'
import { Code2, Rocket, ShieldCheck, Zap } from 'lucide-react'
import { SectionHeader } from './Section'

const pillars = [
  { icon: Code2, title: 'FullStack de verdade', desc: 'Do schema SQL ao micro-interaction no frontend. Laravel, React, Node/TS, tudo tipado e testado.' },
  { icon: Rocket, title: 'Foco em produção', desc: 'Sistemas rodando 24/7 para clientes reais. Deploys automatizados, observabilidade, rollback seguro.' },
  { icon: ShieldCheck, title: 'Arquitetura robusta', desc: 'Multi-tenant, filas (Horizon), cache, permissões, integração de pagamento — sem atalhos.' },
  { icon: Zap, title: 'Velocidade com qualidade', desc: 'Entrega rápida sem comprometer manutenibilidade. Código que o próximo dev vai entender.' },
]

export default function About() {
  return (
    <section id="sobre" className="relative py-28 px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Sobre"
          title={<>Engenharia de software <span className="gradient-text">end-to-end</span>.</>}
          description="Mais de uma década entregando produtos web. Fundo de IBSystem, onde lidero arquitetura, DevOps na AWS e a construção de SaaS completos — da modelagem do domínio até o painel que o cliente usa todo dia."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((p, i) => {
            const Icon = p.icon
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group glass glow-border rounded-2xl p-6 hover:-translate-y-1 transition-transform"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-violet/30 to-brand-cyan/20 ring-1 ring-white/10 mb-4">
                  <Icon className="h-5 w-5 text-brand-cyan" />
                </div>
                <h3 className="font-display text-lg text-white mb-1.5">{p.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
