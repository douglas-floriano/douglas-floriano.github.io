import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section id="top" className="relative pt-32 sm:pt-44 pb-20 sm:pb-28">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
        {/* Top meta line — newspaper masthead vibe */}
        <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2 mb-10 sm:mb-14 pb-4 border-b border-ink/15">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink2">
            <span className="text-muted">Vol. 07 ·</span> Portfólio · 2026
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">Itirapuã / SP · BR</span>
          <span className="ml-auto inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink2">
            <span className="live-dot" /> Aceitando novos projetos
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-end">
          <div className="lg:col-span-9">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="kicker mb-6"
            >
              <span className="ornament not-italic">№ 01</span> &nbsp; Apresentações
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="display text-[clamp(3.2rem,11vw,8.5rem)] text-ink"
            >
              Construo <em className="not-italic font-serif italic text-accent">software</em>
              <br />
              que <span className="marker">paga conta</span>.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 sm:mt-12 grid sm:grid-cols-12 gap-6"
            >
              <p className="sm:col-span-7 text-lg sm:text-xl text-ink2 leading-relaxed font-light">
                Sou <strong className="font-medium text-ink">Douglas Floriano Costa</strong>. Desenvolvedor sênior fullstack. Há quase uma década entrego plataformas que <em className="font-serif">rodam em produção</em> — não protótipo, não tutorial, não toy project.
              </p>
              <p className="sm:col-span-5 text-base text-muted leading-relaxed font-light sm:pl-6 sm:border-l sm:border-rule">
                Banco de dados ao pixel. Arquitetura AWS, Laravel e React com a obsessão de quem dorme com pager. Loteadoras, fintechs, eventos, academias — sistemas que clientes usam todo dia, sem desculpa.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-3 flex flex-col gap-3"
          >
            <a href="#trabalho" className="btn-ink justify-center">
              Ver trabalho selecionado
              <span aria-hidden className="font-serif italic">→</span>
            </a>
            <a href="mailto:douglas198.floriano@hotmail.com" className="btn-ghost justify-center">
              douglas198.floriano@hotmail.com
            </a>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <a href="https://github.com/douglas-floriano" target="_blank" rel="noreferrer" className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted hover:text-ink py-2 border border-rule rounded-full">GitHub</a>
              <a href="https://www.linkedin.com/in/douglas-costa-b581ab1a1/" target="_blank" rel="noreferrer" className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted hover:text-ink py-2 border border-rule rounded-full">LinkedIn</a>
              <a href="#contato" className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted hover:text-ink py-2 border border-rule rounded-full">CV</a>
            </div>
          </motion.div>
        </div>

        {/* Stats strip */}
        <div className="mt-20 sm:mt-28 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-4 border-y border-ink/15 py-8 sm:py-10">
          {[
            ['8+',   'Anos em produção'],
            ['10+',  'Plataformas entregues'],
            ['4',    'Sistemas IB System'],
            ['2',    'Produtos pessoais'],
          ].map(([n, l]) => (
            <div key={l} className="flex flex-col">
              <span className="metric-big text-ink">{n}</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted mt-2">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
