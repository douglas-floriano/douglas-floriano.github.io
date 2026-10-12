import { useEffect, useRef } from 'react'

/*
  Campo neural fixo atrás da página inteira.
  Cada seção declara data-field="sphere|helix|grid|cloud|torus" e o campo
  se reorganiza para aquela forma enquanto a pessoa rola. A rotação também
  acompanha o scroll, então a página inteira parece um único organismo.
*/

type Vec = [number, number, number]
type ShapeName = 'sphere' | 'helix' | 'grid' | 'cloud' | 'torus'

type Layout = { shape: ShapeName; x: number; y: number; scale: number; alpha: number }

const LAYOUTS: Record<ShapeName, Omit<Layout, 'shape'>> = {
  sphere: { x: 0.72, y: 0.5, scale: 0.36, alpha: 1 },
  helix: { x: 0.8, y: 0.5, scale: 0.42, alpha: 0.75 },
  grid: { x: 0.5, y: 0.62, scale: 0.75, alpha: 0.32 },
  cloud: { x: 0.5, y: 0.5, scale: 0.7, alpha: 0.45 },
  torus: { x: 0.5, y: 0.52, scale: 0.4, alpha: 0.9 },
}

function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

function buildShape(name: ShapeName, n: number): Vec[] {
  const pts: Vec[] = []
  for (let i = 0; i < n; i++) {
    const t = i / n
    if (name === 'sphere') {
      const y = 1 - 2 * (i + 0.5) / n
      const r = Math.sqrt(1 - y * y)
      const th = Math.PI * (3 - Math.sqrt(5)) * i
      const j = 1 + (rand(i) - 0.5) * 0.08
      pts.push([Math.cos(th) * r * j, y * j, Math.sin(th) * r * j])
    } else if (name === 'helix') {
      const strand = i % 2
      const a = t * Math.PI * 7 + strand * Math.PI
      const y = (t - 0.5) * 2.6
      const r = 0.55 + rand(i) * 0.08
      pts.push([Math.cos(a) * r, y, Math.sin(a) * r])
    } else if (name === 'grid') {
      const side = Math.ceil(Math.sqrt(n))
      const gx = (i % side) / (side - 1) - 0.5
      const gz = Math.floor(i / side) / (side - 1) - 0.5
      const y = Math.sin(gx * 7) * 0.08 + Math.cos(gz * 6) * 0.08
      pts.push([gx * 2.4, y, gz * 2.4])
    } else if (name === 'cloud') {
      const u = rand(i * 3.1), v = rand(i * 7.7), w = rand(i * 1.3)
      const th = u * Math.PI * 2, ph = Math.acos(2 * v - 1)
      const r = Math.cbrt(w) * 1.3
      pts.push([r * Math.sin(ph) * Math.cos(th) * 1.4, r * Math.cos(ph) * 0.8, r * Math.sin(ph) * Math.sin(th)])
    } else {
      const ring = i % 24
      const a = (Math.floor(i / 24) / Math.ceil(n / 24)) * Math.PI * 2
      const b = (ring / 24) * Math.PI * 2
      const R = 0.85, r = 0.32
      pts.push([(R + r * Math.cos(b)) * Math.cos(a), r * Math.sin(b), (R + r * Math.cos(b)) * Math.sin(a)])
    }
  }
  return pts
}

function neighbors(pts: Vec[], k: number): number[][] {
  return pts.map((p, i) => {
    const d: [number, number][] = []
    for (let j = 0; j < pts.length; j++) {
      if (j === i) continue
      const dx = p[0] - pts[j][0], dy = p[1] - pts[j][1], dz = p[2] - pts[j][2]
      d.push([dx * dx + dy * dy + dz * dz, j])
    }
    d.sort((a, b) => a[0] - b[0])
    return d.slice(0, k).filter(([, j]) => j > i).map(([, j]) => j)
  })
}

export default function NeuralField() {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.innerWidth < 768
    const N = mobile ? 170 : 340

    const shapes = {} as Record<ShapeName, { pts: Vec[]; nb: number[][] }>
    ;(Object.keys(LAYOUTS) as ShapeName[]).forEach((s) => {
      const pts = buildShape(s, N)
      shapes[s] = { pts, nb: neighbors(pts, 3) }
    })

    const cur: Vec[] = shapes.sphere.pts.map((p) => [...p] as Vec)
    let target: ShapeName = 'sphere'
    const lay = { ...LAYOUTS.sphere }
    let w = 0, h = 0, dpr = 1
    let mx = 0, my = 0
    let raf = 0
    let sparks: { a: number; b: number; t: number; s: number }[] = []

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
    }
    resize()

    const pickSection = () => {
      const els = document.querySelectorAll<HTMLElement>('[data-field]')
      const mid = window.innerHeight * 0.5
      let best: HTMLElement | null = null
      els.forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.top <= mid && r.bottom >= mid) best = el
      })
      if (best) {
        const s = (best as HTMLElement).dataset.field as ShapeName
        if (s && s !== target && shapes[s]) {
          target = s
          sparks = []
        }
      }
    }

    const onMove = (e: PointerEvent) => {
      mx = (e.clientX / w - 0.5) * 2
      my = (e.clientY / h - 0.5) * 2
    }

    const proj = new Float32Array(N * 3)

    const frame = (time: number) => {
      const tgt = shapes[target]
      const L = LAYOUTS[target]
      const ease = reduce ? 1 : 0.035
      for (let i = 0; i < N; i++) {
        const p = cur[i], q = tgt.pts[i]
        p[0] += (q[0] - p[0]) * ease
        p[1] += (q[1] - p[1]) * ease
        p[2] += (q[2] - p[2]) * ease
      }
      const lx = mobile ? 0.5 : L.x
      lay.x += (lx - lay.x) * 0.04
      lay.y += (L.y - lay.y) * 0.04
      lay.scale += ((mobile ? L.scale * 1.15 : L.scale) - lay.scale) * 0.04
      lay.alpha += ((mobile ? L.alpha * 0.55 : L.alpha) - lay.alpha) * 0.04

      const sy = window.scrollY
      const ry = (reduce ? 0 : time * 0.00006) + sy * 0.0007 + mx * 0.25
      const rx = -0.25 + my * 0.12 + Math.sin(sy * 0.0004) * 0.2
      const cy = Math.cos(ry), syy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx)
      const S = Math.min(w, h) * lay.scale * 1.25
      const ox = w * lay.x, oy = h * lay.y

      for (let i = 0; i < N; i++) {
        const [x0, y0, z0] = cur[i]
        const x1 = x0 * cy - z0 * syy
        const z1 = x0 * syy + z0 * cy
        const y1 = y0 * cx - z1 * sx
        const z2 = y0 * sx + z1 * cx
        const f = 2.6 / (2.6 + z2)
        proj[i * 3] = ox + x1 * S * f
        proj[i * 3 + 1] = oy + y1 * S * f
        proj[i * 3 + 2] = z2
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      const A = lay.alpha

      ctx.lineWidth = 0.6
      for (let i = 0; i < N; i++) {
        const nb = tgt.nb[i]
        for (let k = 0; k < nb.length; k++) {
          const j = nb[k]
          const depth = (2 - (proj[i * 3 + 2] + proj[j * 3 + 2])) / 4
          ctx.strokeStyle = `rgba(124,156,255,${(0.05 + depth * 0.22) * A})`
          ctx.beginPath()
          ctx.moveTo(proj[i * 3], proj[i * 3 + 1])
          ctx.lineTo(proj[j * 3], proj[j * 3 + 1])
          ctx.stroke()
        }
      }

      for (let i = 0; i < N; i++) {
        const z = proj[i * 3 + 2]
        const depth = (1 - z) / 2
        const r = 0.6 + depth * 1.6
        ctx.fillStyle = `rgba(214,222,255,${(0.25 + depth * 0.6) * A})`
        ctx.beginPath()
        ctx.arc(proj[i * 3], proj[i * 3 + 1], r, 0, Math.PI * 2)
        ctx.fill()
      }

      // faíscas: sinais percorrendo as conexões
      if (!reduce) {
        if (sparks.length < (mobile ? 6 : 14) && Math.random() < 0.2) {
          const a = Math.floor(Math.random() * N)
          const nb = tgt.nb[a]
          if (nb.length) sparks.push({ a, b: nb[Math.floor(Math.random() * nb.length)], t: 0, s: 0.012 + Math.random() * 0.02 })
        }
        sparks = sparks.filter((s) => s.t <= 1)
        for (const s of sparks) {
          s.t += s.s
          const x = proj[s.a * 3] + (proj[s.b * 3] - proj[s.a * 3]) * s.t
          const y = proj[s.a * 3 + 1] + (proj[s.b * 3 + 1] - proj[s.a * 3 + 1]) * s.t
          const g = ctx.createRadialGradient(x, y, 0, x, y, 7)
          g.addColorStop(0, `rgba(255,194,122,${0.95 * A})`)
          g.addColorStop(1, 'rgba(255,194,122,0)')
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(x, y, 7, 0, Math.PI * 2)
          ctx.fill()
          if (s.t >= 1) {
            const nb = tgt.nb[s.b]
            if (nb.length && Math.random() < 0.7) { s.a = s.b; s.b = nb[Math.floor(Math.random() * nb.length)]; s.t = 0 }
          }
        }
      }

      raf = requestAnimationFrame(frame)
    }

    let visible = true
    const onVis = () => {
      visible = !document.hidden
      cancelAnimationFrame(raf)
      if (visible) raf = requestAnimationFrame(frame)
    }

    window.addEventListener('resize', resize)
    window.addEventListener('scroll', pickSection, { passive: true })
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('visibilitychange', onVis)
    pickSection()
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', pickSection)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="fixed inset-0 z-0 pointer-events-none"
    />
  )
}
