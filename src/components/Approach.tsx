import { motion } from 'framer-motion'

const principles = [
  {
    n: '01',
    title: 'Código que dura mais que sprint.',
    body: 'Sistemas que mantenho hoje têm anos no ar. Faço escolhas para ainda fazer sentido no ano que vem — não para impressionar no PR review. Boring tech, bem aplicada, ganha de framework novo da semana.',
  },
  {
    n: '02',
    title: 'Banco de dados é design.',
    body: 'Modelagem ruim contamina tudo acima. Penso schema, índice e migration antes de pensar tela. A maioria dos bugs caros que vi começou num campo nullable que não deveria ser, ou num join que ninguém previu.',
  },
  {
    n: '03',
    title: 'Deploy é parte do produto.',
    body: 'Push em main vai pra prod. Imagem builda, ECS atualiza, CloudFront invalida. Pipeline automatizado é o que separa "trabalho artesanal" de produto. Se o deploy é manual, alguém vai esquecer.',
  },
  {
    n: '04',
    title: 'A operação importa mais que o feature.',
    body: 'Tela linda com bug em produção é falha. Prefiro lançar simples e estável a lançar bonito e quebrado. Cliente paga por sistema que funciona — não pela animação que vi no Dribbble.',
  },
]

export default function Approach() {
  return (
    <section id="processo" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
        <div className="h-line mb-10 sm:mb-14">
          <span className="kicker"><span className="ornament not-italic">№ 05</span> &nbsp; Processo &amp; princípios</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 mb-14 sm:mb-20">
          <div className="lg:col-span-7">
            <h2 className="display text-[clamp(2.4rem,6vw,4.5rem)] text-ink">
              Como eu <span className="marker">trabalho</span>.
            </h2>
          </div>
          <p className="lg:col-span-5 text-base sm:text-lg text-ink2 leading-relaxed font-light lg:pt-3">
            Quatro princípios que me guiam — e que impedem retrabalho caro. Servem tanto pra projeto novo quanto pra herdar legado de outro time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-ink/15">
          {principles.map((p, i) => (
            <motion.article
              key={p.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="bg-paper p-8 sm:p-12 relative"
            >
              <span className="ornament not-italic absolute top-6 right-6">№ {p.n}</span>
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-ink leading-tight mb-4 max-w-xs">
                {p.title}
              </h3>
              <p className="text-ink2 text-base leading-relaxed font-light">
                {p.body}
              </p>
            </motion.article>
          ))}
        </div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="mt-20 sm:mt-28 max-w-3xl"
        >
          <p className="font-serif italic text-3xl sm:text-4xl text-ink leading-snug">
            "Faço o que uma squad inteira faria, com a vantagem de não ter <span className="marker">reunião</span>."
          </p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">— sobre como toco produto sozinho</p>
        </motion.div>
      </div>
    </section>
  )
}
