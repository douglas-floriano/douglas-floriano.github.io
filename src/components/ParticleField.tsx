import { useEffect, useRef } from 'react'

type Particle = {
  x: number; y: number
  vx: number; vy: number
  size: number
  phase: number
  pulse: number
  baseAlpha: number
  grabbed?: boolean
  fromPeer?: string  // peer color when arrived from another tab
}

type Peer = {
  id: string
  sx: number
  sy: number
  screenX: number; screenY: number
  w: number; h: number
  ts: number
  color: string
}

const IS_TOUCH = typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches
const IS_SMALL = typeof window !== 'undefined' && window.innerWidth < 768
const REDUCED = IS_TOUCH || IS_SMALL

const PARTICLE_COUNT = REDUCED ? 35 : 90
const LINK_DIST = REDUCED ? 0 : 110
const CURSOR_RADIUS = 200
const GRAB_RADIUS = 70
const MAGNET = 0.012
const PEER_TTL = 5000
const ACCENT = '34, 197, 94'
const MAX_SEND = 200

const PEER_COLORS = [
  '249, 115, 22',
  '56, 189, 248',
  '234, 179, 8',
  '236, 72, 153',
  '168, 85, 247',
]

function hash(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

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

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.32,
      vy: (Math.random() - 0.5) * 0.32,
      size: Math.random() * 1.8 + 0.9,
      phase: Math.random() * Math.PI * 2,
      pulse: 0.006 + Math.random() * 0.014,
      baseAlpha: 0.7 + Math.random() * 0.3,
    }))

    const mouse = { x: -9999, y: -9999, active: false, down: false, vx: 0, vy: 0, lastX: 0, lastY: 0 }

    // pending cluster-handoff from another tab
    let pendingCluster: null | { ts: number; particles: any[] } = null

    const onMove = (e: MouseEvent) => {
      const nx = e.clientX, ny = e.clientY
      if (mouse.active) {
        mouse.vx = (nx - mouse.lastX) * 0.6 + mouse.vx * 0.4
        mouse.vy = (ny - mouse.lastY) * 0.6 + mouse.vy * 0.4
      }
      mouse.lastX = nx; mouse.lastY = ny
      mouse.x = nx; mouse.y = ny; mouse.active = true

      // ingest pending cluster if active and cursor just entered
      if (pendingCluster && performance.now() - pendingCluster.ts < 700) {
        for (const sp of pendingCluster.particles) {
          // offset around cursor based on stored relative
          particles.push({
            x: mouse.x + (sp.rx ?? 0),
            y: mouse.y + (sp.ry ?? 0),
            vx: sp.vx, vy: sp.vy,
            size: sp.size,
            phase: Math.random() * Math.PI * 2,
            pulse: 0.006 + Math.random() * 0.014,
            baseAlpha: sp.baseAlpha,
            grabbed: true,
            fromPeer: sp.fromColor,
          })
        }
        while (particles.length > PARTICLE_COUNT + 80) particles.shift()
        mouse.down = true
        document.body.classList.add('pf-dragging')
        pendingCluster = null
      }
    }
    const onLeave = () => {
      // if dragging cluster + leaving viewport → handoff to peer whose viewport is adjacent
      if (mouse.down && ch && peers.size) {
        const grabbed = particles.filter(p => p.grabbed)
        if (grabbed.length) {
          const sx = (window.screenX || 0) + mouse.x
          const sy = (window.screenY || 0) + mouse.y
          let target: Peer | null = null
          let best = Infinity
          peers.forEach((peer) => {
            const cx = peer.screenX + peer.w / 2
            const cy = peer.screenY + peer.h / 2
            const d = Math.hypot(sx - cx, sy - cy)
            if (d < best) { best = d; target = peer }
          })
          if (target) {
            const peer: Peer = target
            ch.postMessage({
              t: 'cluster',
              from: myId,
              to: peer.id,
              particles: grabbed.map((p) => ({
                rx: p.x - mouse.x,
                ry: p.y - mouse.y,
                vx: p.vx, vy: p.vy,
                size: p.size,
                baseAlpha: p.baseAlpha,
                fromColor: PEER_COLORS[hash(myId) % PEER_COLORS.length],
              })),
            })
            for (const p of grabbed) { p.x = -99999 }
          }
        }
      }
      mouse.active = false
      mouse.down = false
      document.body.classList.remove('pf-dragging')
      mouse.x = -9999; mouse.y = -9999
    }

    const onDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      const tgt = e.target as HTMLElement | null
      if (tgt && tgt.closest('a, button, input, textarea, select, [role="button"], p, h1, h2, h3, h4, h5, h6, li, span, em, strong, code, pre, label, img')) return
      // first pass: any particle within GRAB_RADIUS
      let any = false
      for (const p of particles) {
        const d = Math.hypot(p.x - mouse.x, p.y - mouse.y)
        if (d < GRAB_RADIUS) { p.grabbed = true; any = true }
      }
      // fallback: grab nearest 10 particles (suck them in)
      if (!any) {
        const ranked = particles
          .map((p) => ({ p, d: Math.hypot(p.x - mouse.x, p.y - mouse.y) }))
          .sort((a, b) => a.d - b.d)
          .slice(0, 10)
        for (const { p } of ranked) { p.grabbed = true; any = true }
      }
      if (!any) return
      mouse.down = true
      e.preventDefault()
      document.body.classList.add('pf-dragging')
    }

    const onUp = () => {
      if (!mouse.down) return
      mouse.down = false
      // release with momentum; if heading toward a peer edge, send
      const speed = Math.hypot(mouse.vx, mouse.vy)
      const grabbed = particles.filter(p => p.grabbed)
      // detect direction → peer
      let sendTo: Peer | null = null
      if (peers.size) {
        // if mouse has velocity, prefer aligned peer; else pick nearest peer
        const hasSpeed = speed > 1.5
        const ang = Math.atan2(mouse.vy, mouse.vx)
        const cx = mouse.x, cy = mouse.y
        let best = -Infinity
        peers.forEach((peer) => {
          const localX = peer.sx - (window.screenX || 0)
          const localY = peer.sy - (window.screenY || 0)
          const dx = localX - cx, dy = localY - cy
          const len = Math.hypot(dx, dy) || 1
          if (hasSpeed) {
            const dot = (dx / len) * Math.cos(ang) + (dy / len) * Math.sin(ang)
            if (dot > 0.2 && dot > best) { best = dot; sendTo = peer }
          } else {
            const score = -len
            if (score > best) { best = score; sendTo = peer }
          }
        })
      }

      if (sendTo && grabbed.length && ch) {
        const peer: Peer = sendTo
        // ship up to MAX_SEND particles in screen coords + velocity
        const toSend = grabbed.slice(0, MAX_SEND).map((p) => ({
          sx: p.x + (window.screenX || 0),
          sy: p.y + (window.screenY || 0),
          vx: mouse.vx * 0.25 + p.vx,
          vy: mouse.vy * 0.25 + p.vy,
          size: p.size,
          baseAlpha: p.baseAlpha,
        }))
        ch.postMessage({ t: 'send', from: myId, to: peer.id, particles: toSend })
        // remove the sent ones from our pool
        for (const p of grabbed.slice(0, MAX_SEND)) {
          p.grabbed = false
          p.x = -9999; p.y = -9999 // mark out, will respawn on wrap
        }
      }
      // release remaining grabbed with momentum
      for (const p of particles) {
        if (p.grabbed) {
          p.vx = mouse.vx * 0.18 + (Math.random() - 0.5) * 0.4
          p.vy = mouse.vy * 0.18 + (Math.random() - 0.5) * 0.4
          p.grabbed = false
        }
      }
      document.body.classList.remove('pf-dragging')
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('mouseleave', onLeave)
    window.addEventListener('resize', resize)

    // === Multi-tab mesh ===
    const myId = Math.random().toString(36).slice(2, 8)
    const peers: Map<string, Peer> = new Map()
    let ch: BroadcastChannel | null = null
    try {
      ch = new BroadcastChannel('floriano-os-mesh')
      ch.onmessage = (ev) => {
        const m = ev.data
        if (!m || m.id === myId || m.from === myId) return
        if (m.t === 'cursor') {
          peers.set(m.id, {
            id: m.id, sx: m.sx, sy: m.sy,
            screenX: m.screenX, screenY: m.screenY,
            w: m.w, h: m.h, ts: performance.now(),
            color: PEER_COLORS[hash(m.id) % PEER_COLORS.length],
          })
        } else if (m.t === 'bye') {
          peers.delete(m.id)
        } else if (m.t === 'cluster') {
          if (m.to && m.to !== myId) return
          pendingCluster = { ts: performance.now(), particles: m.particles }
        } else if (m.t === 'send') {
          // accept incoming particles → translate from screen to my viewport
          if (m.to && m.to !== myId) return
          const fromColor = PEER_COLORS[hash(m.from) % PEER_COLORS.length]
          for (const sp of (m.particles as any[]).slice(0, MAX_SEND)) {
            let x = sp.sx - (window.screenX || 0)
            let y = sp.sy - (window.screenY || 0)
            // clamp entry to viewport edge if outside
            if (x < 0) x = 6
            if (x > w) x = w - 6
            if (y < 0) y = 6
            if (y > h) y = h - 6
            particles.push({
              x, y,
              vx: sp.vx, vy: sp.vy,
              size: sp.size,
              phase: Math.random() * Math.PI * 2,
              pulse: 0.006 + Math.random() * 0.014,
              baseAlpha: sp.baseAlpha,
              fromPeer: fromColor,
            })
          }
          // cap pool size
          while (particles.length > PARTICLE_COUNT + 60) particles.shift()
        }
      }
    } catch {}

    let lastBroadcast = 0
    const broadcastCursor = (now: number) => {
      if (!ch) return
      if (now - lastBroadcast < 33) return
      lastBroadcast = now
      const sx = (window.screenX || 0) + mouse.x
      const sy = (window.screenY || 0) + mouse.y
      ch.postMessage({
        t: 'cursor', id: myId,
        sx, sy,
        screenX: window.screenX || 0,
        screenY: window.screenY || 0,
        w, h,
        active: mouse.active,
      })
    }

    const onUnload = () => { try { ch?.postMessage({ t: 'bye', id: myId }) } catch {} }
    window.addEventListener('beforeunload', onUnload)

    // mask rects: content blocks where particles/lines should NOT draw
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
      ctx.clearRect(0, 0, w, h)

      if (now - lastMaskUpdate > 250) { updateMaskRects(); lastMaskUpdate = now }

      broadcastCursor(now)
      peers.forEach((p, id) => { if (now - p.ts > PEER_TTL) peers.delete(id) })

      // resolve remote cursors in MY viewport
      const remoteCursors: { x: number; y: number; color: string; id: string; offEdge?: 'L'|'R'|'T'|'B'; rawX: number; rawY: number; dist: number }[] = []
      peers.forEach((p) => {
        const localX = p.sx - (window.screenX || 0)
        const localY = p.sy - (window.screenY || 0)
        const pad = 320
        if (!(localX > -pad && localX < w + pad && localY > -pad && localY < h + pad)) return
        let x = localX, y = localY, offEdge: 'L'|'R'|'T'|'B'|undefined
        if (localX < 0)       { x = 6;     offEdge = 'L' }
        else if (localX > w)  { x = w - 6; offEdge = 'R' }
        if (localY < 0)       { y = 6;     offEdge = 'T' }
        else if (localY > h)  { y = h - 6; offEdge = 'B' }
        const dx = localX - x, dy = localY - y
        const dist = Math.sqrt(dx * dx + dy * dy)
        remoteCursors.push({ x, y, color: p.color, id: p.id, offEdge, rawX: localX, rawY: localY, dist })
      })

      // update
      for (const p of particles) {
        p.phase += p.pulse

        if (p.grabbed && mouse.active) {
          // strong pull to cursor
          const dx = mouse.x - p.x, dy = mouse.y - p.y
          p.vx += dx * 0.06
          p.vy += dy * 0.06
          p.vx *= 0.62
          p.vy *= 0.62
          p.x += p.vx
          p.y += p.vy
          continue
        }

        if (!reduce) {
          p.x += p.vx
          p.y += p.vy
          // gentle drag
          p.vx *= 0.992
          p.vy *= 0.992

          if (mouse.active && !mouse.down) {
            const dx = mouse.x - p.x, dy = mouse.y - p.y
            const d2 = dx * dx + dy * dy
            if (d2 < CURSOR_RADIUS * CURSOR_RADIUS) {
              const d = Math.sqrt(d2) || 1
              const force = (1 - d / CURSOR_RADIUS) * MAGNET
              p.x += (dx / d) * force * 6
              p.y += (dy / d) * force * 6
            }
          }
          for (const rc of remoteCursors) {
            const dx = rc.x - p.x, dy = rc.y - p.y
            const d2 = dx * dx + dy * dy
            if (d2 < CURSOR_RADIUS * CURSOR_RADIUS) {
              const d = Math.sqrt(d2) || 1
              const force = (1 - d / CURSOR_RADIUS) * MAGNET * 0.6
              p.x += (dx / d) * force * 6
              p.y += (dy / d) * force * 6
            }
          }
        }

        // auto-handoff at viewport edge if a peer's window is adjacent in screen-space
        if ((p.x < -2 || p.x > w + 2 || p.y < -2 || p.y > h + 2) && peers.size && ch) {
          const sx = p.x + (window.screenX || 0)
          const sy = p.y + (window.screenY || 0)
          let handed = false
          peers.forEach((peer) => {
            if (handed) return
            const pad = 30
            if (sx >= peer.screenX - pad && sx <= peer.screenX + peer.w + pad &&
                sy >= peer.screenY - pad && sy <= peer.screenY + peer.h + pad) {
              ch!.postMessage({
                t: 'send', from: myId, to: peer.id,
                particles: [{
                  sx, sy, vx: p.vx, vy: p.vy,
                  size: p.size, baseAlpha: p.baseAlpha,
                }],
              })
              p.x = -99999  // mark for removal
              handed = true
            }
          })
          if (handed) continue
        }

        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        if (p.y > h + 10) p.y = -10
      }
      // sweep handed-off particles
      for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].x < -99998) particles.splice(i, 1)
      }
      // top up to keep count
      while (particles.length < PARTICLE_COUNT) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.32,
          vy: (Math.random() - 0.5) * 0.32,
          size: Math.random() * 1.8 + 0.9,
          phase: Math.random() * Math.PI * 2,
          pulse: 0.006 + Math.random() * 0.014,
          baseAlpha: 0.7 + Math.random() * 0.3,
        })
      }

      // draw particles (skip those inside content masks)
      for (const p of particles) {
        if (!p.grabbed && inMask(p.x, p.y)) continue
        const twinkle = 0.65 + Math.sin(p.phase) * 0.35
        let prox = 0
        let proxColor = p.fromPeer ?? ACCENT
        if (mouse.active) {
          const d = Math.hypot(mouse.x - p.x, mouse.y - p.y)
          if (d < CURSOR_RADIUS) prox = 1 - d / CURSOR_RADIUS
        }
        for (const rc of remoteCursors) {
          const d = Math.hypot(rc.x - p.x, rc.y - p.y)
          if (d < CURSOR_RADIUS) {
            const t = 1 - d / CURSOR_RADIUS
            if (t > prox) { prox = t; proxColor = rc.color }
          }
        }

        const grabBoost = p.grabbed ? 0.9 : 0
        const alpha = Math.min(1, p.baseAlpha * twinkle + prox * 0.9 + grabBoost)
        const r = p.size + prox * 1.2 + (p.grabbed ? 1.2 : 0)

        const color = p.grabbed ? ACCENT : (prox > 0.15 ? proxColor : (p.fromPeer ?? ACCENT))
        ctx.beginPath()
        ctx.fillStyle = `rgba(${color}, ${alpha})`
        ctx.shadowColor = `rgba(${color}, ${0.4 + prox * 0.5 + grabBoost})`
        ctx.shadowBlur = 6 + prox * 12 + (p.grabbed ? 14 : 0)
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.shadowBlur = 0

      // constellation (skip if midpoint over content)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < LINK_DIST) {
            const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
            if (inMask(mx, my) || inMask(a.x, a.y) || inMask(b.x, b.y)) continue
            const t = 1 - d / LINK_DIST
            let alpha = t * 0.06
            if (mouse.active) {
              const mx = (a.x + b.x) / 2 - mouse.x
              const my = (a.y + b.y) / 2 - mouse.y
              const md = Math.hypot(mx, my)
              if (md < CURSOR_RADIUS) alpha += (1 - md / CURSOR_RADIUS) * 0.4
            }
            for (const rc of remoteCursors) {
              const mx = (a.x + b.x) / 2 - rc.x
              const my = (a.y + b.y) / 2 - rc.y
              const md = Math.hypot(mx, my)
              if (md < CURSOR_RADIUS) alpha += (1 - md / CURSOR_RADIUS) * 0.4
            }
            ctx.strokeStyle = `rgba(${ACCENT}, ${alpha})`
            ctx.lineWidth = 0.6
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
          }
        }
      }

      // grabbed bond → strong line to cursor
      if (mouse.down && mouse.active) {
        for (const p of particles) {
          if (!p.grabbed) continue
          ctx.strokeStyle = `rgba(${ACCENT}, 0.65)`
          ctx.lineWidth = 1.2
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke()
        }
        ctx.beginPath()
        ctx.strokeStyle = `rgba(${ACCENT}, 0.35)`
        ctx.lineWidth = 1
        ctx.arc(mouse.x, mouse.y, GRAB_RADIUS, 0, Math.PI * 2)
        ctx.stroke()

      }

      // remote cursors + bridge
      for (const rc of remoteCursors) {
        for (const p of particles) {
          const d = Math.hypot(rc.x - p.x, rc.y - p.y)
          if (d < CURSOR_RADIUS) {
            const t = 1 - d / CURSOR_RADIUS
            ctx.strokeStyle = `rgba(${rc.color}, ${t * 0.55})`
            ctx.lineWidth = 0.8
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(rc.x, rc.y); ctx.stroke()
          }
        }
        ctx.beginPath()
        ctx.fillStyle = `rgba(${rc.color}, 0.95)`
        ctx.shadowColor = `rgba(${rc.color}, 0.9)`
        ctx.shadowBlur = 18
        ctx.arc(rc.x, rc.y, rc.offEdge ? 4 : 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.strokeStyle = `rgba(${rc.color}, 0.5)`
        ctx.lineWidth = 1
        ctx.arc(rc.x, rc.y, 10 + Math.sin(now * 0.005) * 2, 0, Math.PI * 2)
        ctx.stroke()
        ctx.shadowBlur = 0

      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('resize', resize)
      window.removeEventListener('beforeunload', onUnload)
      try { ch?.postMessage({ t: 'bye', id: myId }); ch?.close() } catch {}
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
