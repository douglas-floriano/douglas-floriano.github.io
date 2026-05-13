import { motion } from 'framer-motion'

const EMAIL    = 'douglas198.floriano@hotmail.com'
const WHATS    = '5516991816628'
const WHATS_LBL = '(16) 99181-6628'
const IG       = 'https://www.instagram.com/douglasflorianoc/'
const IG_LBL   = '@douglasflorianoc'

export default function Contact() {
  return (
    <section id="contato" className="relative py-20 sm:py-28 bg-paper text-ink overflow-hidden">
      {/* Decorative serif "@" backdrop */}
      <span aria-hidden className="absolute -top-10 -right-10 sm:right-0 font-serif font-extrabold text-[40vw] sm:text-[28vw] leading-none text-ink/[0.04] select-none pointer-events-none">@</span>

      <div className="mx-auto max-w-[1280px] px-6 sm:px-10 relative">
        <div className="h-line mb-10 sm:mb-14">
          <span className="kicker">
            <span className="ornament not-italic">№ 07</span> &nbsp; Contato
          </span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="display text-[clamp(3rem,11vw,9rem)] text-ink"
        >
          Tem sistema <em className="not-italic font-serif italic text-accent">pra construir</em>?
          <br />
          Vamos <span className="marker">conversar</span>.
        </motion.h2>

        <div className="mt-14 sm:mt-20 grid lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="text-ink2 text-lg sm:text-xl leading-relaxed font-light max-w-md">
              Respondo em até 24h. Se for projeto, manda parágrafo do que precisa — eu volto com escopo e proposta. WhatsApp pra papo rápido.
            </p>
          </div>

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-px bg-ink/15">
            {[
              { l: 'E-mail',     v: EMAIL,     href: `mailto:${EMAIL}` },
              { l: 'WhatsApp',   v: WHATS_LBL, href: `https://wa.me/${WHATS}?text=${encodeURIComponent('Oi Douglas, vi seu portfólio e queria conversar sobre um projeto.')}` },
              { l: 'Instagram',  v: IG_LBL,    href: IG },
              { l: 'LinkedIn',   v: 'in/douglas-costa',    href: 'https://www.linkedin.com/in/douglas-costa-b581ab1a1/' },
              { l: 'GitHub',     v: '@douglas-floriano',   href: 'https://github.com/douglas-floriano' },
              { l: 'Localização',v: 'Itirapuã / SP · BR',  href: undefined },
            ].map(c => (
              <a
                key={c.l}
                href={c.href}
                target={c.href?.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="bg-paper p-6 sm:p-7 group hover:bg-paper2/70 transition-colors break-words"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">{c.l}</span>
                <p className="mt-2 font-serif text-base sm:text-lg lg:text-xl text-ink group-hover:text-accent transition-colors break-all">
                  {c.v}
                  {c.href && <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">→</span>}
                </p>
              </a>
            ))}
          </div>
        </div>

        {/* Big CTA — split surface, two channels */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 sm:mt-20 grid sm:grid-cols-2 gap-px bg-ink/15 border border-ink/15"
        >
          <a
            href={`mailto:${EMAIL}`}
            className="group bg-paper hover:bg-ink hover:text-paper p-8 sm:p-10 flex items-center justify-between transition-colors"
          >
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted group-hover:text-paper/60">Por e-mail</span>
              <p className="mt-2 font-serif text-2xl sm:text-3xl text-ink group-hover:text-paper">Mandar mensagem</p>
              <p className="mt-1 font-mono text-[11px] text-muted group-hover:text-paper/50 break-all">{EMAIL}</p>
            </div>
            <span className="font-serif italic text-3xl sm:text-5xl text-accent group-hover:translate-x-2 transition-transform">→</span>
          </a>

          <a
            href={`https://wa.me/${WHATS}?text=${encodeURIComponent('Oi Douglas, vi seu portfólio e queria conversar sobre um projeto.')}`}
            target="_blank"
            rel="noreferrer"
            className="group bg-accent text-paper hover:bg-ink p-8 sm:p-10 flex items-center justify-between transition-colors"
          >
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/70">Pelo WhatsApp</span>
              <p className="mt-2 font-serif text-2xl sm:text-3xl text-paper">Falar agora</p>
              <p className="mt-1 font-mono text-[11px] text-paper/70">{WHATS_LBL}</p>
            </div>
            <span className="font-serif italic text-3xl sm:text-5xl text-paper group-hover:translate-x-2 transition-transform">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
