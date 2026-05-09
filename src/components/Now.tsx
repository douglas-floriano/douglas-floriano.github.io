import { motion } from 'framer-motion'

export default function Now() {
  return (
    <section id="now" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
        <div className="h-line mb-10 sm:mb-14">
          <span className="kicker"><span className="ornament not-italic">№ 02</span> &nbsp; O que estou fazendo agora</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <h2 className="display text-[clamp(2rem,5.5vw,3.8rem)] text-ink">
              Atuando como dev sênior na <em className="italic font-serif text-accent">IB System</em>, mantendo plataformas de loteamento, ingresso, investimento e capital — enquanto desenvolvo os meus próprios produtos.
            </h2>

            <div className="mt-10 grid sm:grid-cols-2 gap-x-10 gap-y-4">
              {[
                ['Backend',   'Laravel 10 · PHP 8.2 · Horizon · Filas'],
                ['Frontend',  'React 19 · Next 15 · React Native · Vite'],
                ['Infra',     'AWS ECS · ECR · RDS · CloudFront · S3'],
                ['Pipeline',  'GitHub Actions · Docker · Trunk-based'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline gap-3 py-2 border-b border-rule">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted w-20 shrink-0">{k}</span>
                  <span className="text-ink2 text-sm">{v}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="border border-ink p-6 sm:p-8 bg-paper2/60 relative">
              <span className="absolute -top-3 left-6 bg-paper px-3 font-mono text-[10px] uppercase tracking-[0.22em] text-ink2">Status atual</span>

              <p className="font-serif text-2xl text-ink leading-snug mt-2">
                "Operando 4 SaaS críticos em produção e ainda construindo produto pessoal nas madrugadas."
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4 text-[12px]">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Disponibilidade</span>
                  <p className="text-ink mt-1">Freelance & consultoria</p>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Modelo</span>
                  <p className="text-ink mt-1">Remoto · Brasil & global</p>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Foco</span>
                  <p className="text-ink mt-1">SaaS B2B & fintech</p>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Stack base</span>
                  <p className="text-ink mt-1">Laravel · React · AWS</p>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  )
}
