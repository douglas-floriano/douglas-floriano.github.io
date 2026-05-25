import { useEffect, useRef } from 'react'

type Particle = {
  x: number; y: number
  vx: number; vy: number
  size: number
  phase: number
  pulse: number
  baseAlpha: number
}

const IS_TOUCH = typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches
const IS_SMALL = typeof window !== 'undefined' && window.innerWidth < 768
const REDUCED = IS_TOUCH || IS_SMALL

const PARTICLE_COUNT = REDUCED ? 35 : 90
const LINK_DIST = REDUCED ? 0 : 110
const ACCENT = '34, 197, 94'

export default function ParticleField() {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = window.innerWidth
    let h = window.innerHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.9,
      vy: (Math.random() - 0.5) * 0.9,
      size: Math.random() * 1.8 + 0.9,
      phase: Math.random() * Math.PI * 2,
      pulse: 0.006 + Math.random() * 0.014,
      baseAlpha: 0.6 + Math.random() * 0.35,
    }))

    let maskRects: { x: number; y: number; w: number; h: number }[] = []
    let lastMaskUpdate = 0
    const updateMaskRects = () => {
      const els = document.querySelectorAll<HTMLElement>('section, .card, .term, footer, header')
      const rects: { x: number; y: number; w: number; h: number }[] = []
      els.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.bottom < 0 || r.top > h || r.right < 0 || r.left > w) return
        rects.push({ x: r.left, y: r.top, w: r.width, h: r.height })
      })
      maskRects = rects
    }
    const inMask = (x: number, y: number) => {
      for (const r of maskRects) {
        if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return true
      }
      return false
    }

    let raf = 0
    const tick = () => {
      const now = performance.now()
      if (now - lastMaskUpdate > 250) { updateMaskRects(); lastMaskUpdate = now }

      ctx.clearRect(0, 0, w, h)

      for (const p of particles) {
        p.phase += p.pulse
        if (!reduce) {
          p.x += p.vx
          p.y += p.vy
        }
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        if (p.y > h + 10) p.y = -10
      }

      for (const p of particles) {
        if (inMask(p.x, p.y)) continue
        const twinkle = 0.65 + Math.sin(p.phase) * 0.35
        const alpha = Math.min(1, p.baseAlpha * twinkle)
        ctx.beginPath()
        ctx.fillStyle = `rgba(${ACCENT}, ${alpha})`
        ctx.shadowColor = `rgba(${ACCENT}, 0.5)`
        ctx.shadowBlur = 6
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0

      if (LINK_DIST > 0) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i], b = particles[j]
            const dx = a.x - b.x, dy = a.y - b.y
            const d = Math.sqrt(dx * dx + dy * dy)
            if (d < LINK_DIST) {
              const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
              if (inMask(mx, my) || inMask(a.x, a.y) || inMask(b.x, b.y)) continue
              const t = 1 - d / LINK_DIST
              ctx.strokeStyle = `rgba(${ACCENT}, ${t * 0.12})`
              ctx.lineWidth = 0.6
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
            }
          }
        }
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 2 }}
    />
  )
}
