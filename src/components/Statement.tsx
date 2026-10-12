import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion'

const TEXT =
  'Eu não trato inteligência artificial como enfeite de tela. Trato como mais um membro do time: ela lê o pedido do cliente, entende o sistema, propõe a correção, consulta o banco e explica o boleto. Eu desenho os limites, escrevo os testes e decido o que vai para produção.'

// As palavras acendem uma a uma e terminam todas brancas antes de a seção sair da tela.
const END = 0.8

function Word({ word, range, progress }: { word: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.18, 1])
  return <motion.span style={{ opacity }}>{word}</motion.span>
}

export default function Statement() {
  const ref = useRef<HTMLElement | null>(null)
  const scrollYProgress = useMotionValue(0)

  // Progresso calculado direto pela posição da seção: 0 quando ela encosta no topo, 1 quando o fim chega no rodapé.
  useEffect(() => {
    const update = () => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const total = r.height - window.innerHeight
      scrollYProgress.set(total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 1)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [scrollYProgress])
  const words = TEXT.split(' ')
  const step = END / words.length

  return (
    <section ref={ref} data-field="cloud" className="relative h-[170vh]" aria-label="Como enxergo a IA">
      <div className="sticky top-0 h-[100svh] flex items-center">
        <div className="page">
          <p className="h-sec text-[clamp(1.9rem,4.6vw,4.1rem)] max-w-[24ch] text-text">
            {words.map((w, i) => (
              <span key={i}>
                <Word word={w} progress={scrollYProgress} range={[i * step, i * step + step * 3]} />
                {i < words.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  )
}
