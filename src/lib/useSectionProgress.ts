import { useEffect, type RefObject } from 'react'
import { useMotionValue } from 'framer-motion'

// Progresso de 0 a 1 enquanto uma seção alta passa: 0 quando o topo encosta no topo da tela,
// 1 quando o fim chega no rodapé. Calculado direto pela posição, sem depender de medição em cache.
export function useSectionProgress(ref: RefObject<HTMLElement | null>) {
  const mv = useMotionValue(0)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const total = r.height - window.innerHeight
      mv.set(total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0)
    }
    const req = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', req, { passive: true })
    window.addEventListener('resize', req)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', req); window.removeEventListener('resize', req) }
  }, [ref, mv])
  return mv
}
