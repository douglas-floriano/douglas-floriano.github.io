import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, Environment, Grid } from '@react-three/drei'
import { useRef, useMemo, useEffect, useState, useCallback } from 'react'
import type { Group, Mesh } from 'three'
import * as THREE from 'three'

type ShockRing = { t: number }

function useScrollProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const max = window.innerHeight
      setP(Math.min(1, window.scrollY / max))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return p
}

const BASE_SCRIPT: { text: string; kind: 'prompt' | 'cmd' | 'info' | 'ok' | 'title' | 'blank' }[] = [
  { text: '╔═ douglas@ibsystem ─ walletLote ═════════════╗', kind: 'title' },
  { text: '', kind: 'blank' },
  { text: '$ git push origin main', kind: 'cmd' },
  { text: '→ GH Actions: deploy-prod.yml', kind: 'info' },
  { text: '→ building docker: php-fpm + nginx', kind: 'info' },
  { text: '✓ images pushed to ECR', kind: 'ok' },
  { text: '→ updating ECS task-def', kind: 'info' },
  { text: '✓ WalletLote service healthy', kind: 'ok' },
  { text: '→ s3 sync · cloudfront invalidate', kind: 'info' },
  { text: '✓ deployed in 2m 14s', kind: 'ok' },
  { text: '', kind: 'blank' },
  { text: '$ laravel new saas --stack=react', kind: 'cmd' },
  { text: '→ aws rds · mariadb · horizon', kind: 'info' },
  { text: '✓ online · uptime 99.98%', kind: 'ok' },
  { text: '', kind: 'blank' },
  { text: '$ _', kind: 'prompt' },
]

type Line = { text: string; kind: (typeof BASE_SCRIPT)[number]['kind'] }

function useTerminalTexture(extraLines: React.MutableRefObject<Line[]>) {
  const canvas = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 1024
    c.height = 640
    return c
  }, [])
  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas)
    t.minFilter = THREE.LinearFilter
    t.magFilter = THREE.LinearFilter
    t.anisotropy = 4
    return t
  }, [canvas])

  const state = useRef({
    script: [...BASE_SCRIPT],
    lineIdx: 0,
    charIdx: 0,
    acc: 0,
    done: false,
    shown: [] as Line[],
    restartAt: -1,
  })

  const colorFor = (kind: Line['kind']) => {
    switch (kind) {
      case 'title': return '#60a5fa'
      case 'cmd': return '#f8fafc'
      case 'info': return '#94a3b8'
      case 'ok': return '#fbbf24'
      case 'prompt': return '#f8fafc'
      default: return '#cbd5e1'
    }
  }

  const draw = (flash: number, elapsed: number) => {
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height)
    grad.addColorStop(0, '#060a14')
    grad.addColorStop(1, '#0b1220')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if (flash > 0.01) {
      ctx.fillStyle = `rgba(56, 189, 248, ${flash * 0.25})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // chrome bar
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, canvas.width, 52)
    ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(28, 26, 8, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#f59e0b'; ctx.beginPath(); ctx.arc(56, 26, 8, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(84, 26, 8, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#64748b'
    ctx.font = '18px ui-monospace, Menlo, monospace'
    ctx.textAlign = 'center'
    ctx.fillText('~/ibsystem/walletLote_backend ─ zsh', canvas.width / 2, 32)
    ctx.textAlign = 'left'

    // scanlines
    ctx.globalAlpha = 0.07
    ctx.fillStyle = '#38bdf8'
    for (let y = 56; y < canvas.height; y += 3) ctx.fillRect(0, y, canvas.width, 1)
    ctx.globalAlpha = 1

    ctx.font = '22px ui-monospace, Menlo, monospace'
    const lineH = 30
    const padX = 36
    const padY = 88
    const s = state.current

    const maxLines = 17
    const visible = s.shown.slice(-maxLines)

    for (let i = 0; i < visible.length; i++) {
      const ln = visible[i]
      ctx.fillStyle = colorFor(ln.kind)
      ctx.fillText(ln.text, padX, padY + i * lineH)
    }

    // cursor blink on last line
    const blink = Math.floor(elapsed * 2) % 2 === 0
    if (blink && visible.length > 0) {
      const last = visible[visible.length - 1]
      ctx.fillStyle = '#38bdf8'
      const w = ctx.measureText(last.text).width
      ctx.fillRect(padX + w + 4, padY + (visible.length - 1) * lineH - 18, 12, 22)
    }

    texture.needsUpdate = true
  }

  const step = (dt: number, flash: number, elapsed: number) => {
    const s = state.current
    // absorb queued extra lines (from clicks) directly into script after current prompt
    if (extraLines.current.length > 0) {
      const toAdd = extraLines.current.splice(0)
      // Remove the final '$ _' if present so new lines push above prompt, then re-append prompt
      const lastIdx = s.script.length - 1
      const hasPrompt = s.script[lastIdx]?.kind === 'prompt'
      if (hasPrompt) s.script.splice(lastIdx, 1)
      s.script.push(...toAdd)
      s.script.push({ text: '$ _', kind: 'prompt' })
      s.done = false
      s.restartAt = -1
    }

    if (s.restartAt > 0 && elapsed >= s.restartAt) {
      s.restartAt = -1
      s.done = false
      s.shown = []
      s.lineIdx = 0
      s.charIdx = 0
      s.acc = 0
    }
    if (!s.done) {
      s.acc += dt
      const speed = 0.022
      while (s.acc >= speed && !s.done) {
        s.acc -= speed
        const target = s.script[s.lineIdx]
        if (!target) {
          s.done = true
          s.restartAt = elapsed + 5
          break
        }
        if (target.kind === 'blank') {
          s.shown.push({ text: '', kind: 'blank' })
          s.lineIdx++
          s.charIdx = 0
          continue
        }
        if (s.charIdx === 0) s.shown.push({ text: '', kind: target.kind })
        s.charIdx++
        s.shown[s.shown.length - 1] = {
          text: target.text.slice(0, s.charIdx),
          kind: target.kind,
        }
        if (s.charIdx >= target.text.length) {
          s.lineIdx++
          s.charIdx = 0
        }
      }
    }
    draw(flash, elapsed)
  }

  return { texture, step }
}

/** Expanding neon rings triggered by clicks */
function Shockwaves({ rings }: { rings: React.MutableRefObject<ShockRing[]> }) {
  const group = useRef<Group>(null)
  const refs = useRef<Mesh[]>([])
  const MAX = 4

  useFrame((_, d) => {
    for (const r of rings.current) r.t += d
    rings.current = rings.current.filter((r) => r.t < 1.8)

    for (let i = 0; i < MAX; i++) {
      const m = refs.current[i]
      if (!m) continue
      const r = rings.current[i]
      if (!r) {
        m.visible = false
        continue
      }
      m.visible = true
      const s = 0.5 + r.t * 3.5
      m.scale.set(s, s, s)
      const mat = m.material as THREE.MeshBasicMaterial
      mat.opacity = Math.max(0, 1 - r.t / 1.8) * 0.8
    }
  })

  return (
    <group ref={group}>
      {Array.from({ length: MAX }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) refs.current[i] = el
          }}
          visible={false}
        >
          <ringGeometry args={[0.55, 0.6, 64]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

/** Subtle data streams flowing upward from monitor into space */
function DataStreams() {
  const group = useRef<Group>(null)
  const count = 30
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: (Math.random() - 0.5) * 3.2,
        y: Math.random() * 4 - 1,
        z: (Math.random() - 0.5) * 0.4 - 0.2,
        sp: 0.4 + Math.random() * 0.8,
        c: Math.random() > 0.5 ? '#38bdf8' : '#f59e0b',
      })),
    [],
  )

  useFrame((_, d) => {
    if (!group.current) return
    group.current.children.forEach((c, i) => {
      c.position.y += particles[i].sp * d
      if (c.position.y > 3.5) c.position.y = -1.2
    })
  })

  return (
    <group ref={group}>
      {particles.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[0.018, 8, 8]} />
          <meshBasicMaterial color={p.c} toneMapped={false} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  )
}

function DeployMonitor({
  flashRef,
  onScreenClick,
}: {
  flashRef: React.MutableRefObject<number>
  onScreenClick: () => void
}) {
  const group = useRef<Group>(null)
  const { mouse } = useThree()
  const extraLines = useRef<Line[]>([])
  const { texture, step } = useTerminalTexture(extraLines)
  const elapsed = useRef(0)

  // expose a way to push extra lines from outside via a ref-like closure
  ;(DeployMonitor as unknown as { _push?: (l: Line[]) => void })._push = (l: Line[]) => {
    extraLines.current.push(...l)
  }

  useFrame((_, d) => {
    elapsed.current += d
    flashRef.current = Math.max(0, flashRef.current - d * 1.8)
    step(d, flashRef.current, elapsed.current)

    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mouse.x * 0.3, 0.06)
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -mouse.y * 0.22, 0.06)
      group.current.position.y = Math.sin(elapsed.current * 0.8) * 0.06
    }
  })

  return (
    <group ref={group}>
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[3.4, 2.2, 0.12]} />
        <meshStandardMaterial color="#0b1220" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          flashRef.current = 1
          onScreenClick()
        }}
      >
        <planeGeometry args={[3.2, 2.0]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.08]}>
        <planeGeometry args={[3.8, 2.6]} />
        <meshBasicMaterial color="#1e40af" transparent opacity={0.18} toneMapped={false} depthWrite={false} />
      </mesh>
      <mesh position={[0, -1.4, -0.05]}>
        <boxGeometry args={[0.5, 0.5, 0.1]} />
        <meshStandardMaterial color="#0b1220" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, -1.7, -0.05]}>
        <boxGeometry args={[1.4, 0.08, 0.3]} />
        <meshStandardMaterial color="#0b1220" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  )
}

function MouseLight() {
  const ref = useRef<THREE.PointLight>(null)
  useFrame(({ mouse, viewport }) => {
    if (!ref.current) return
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, (mouse.x * viewport.width) / 2, 0.12)
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, (mouse.y * viewport.height) / 2, 0.12)
  })
  return <pointLight ref={ref} position={[0, 0, 3]} intensity={1.4} color="#f59e0b" distance={8} />
}

function ScrollRig({ progress, children }: { progress: number; children: React.ReactNode }) {
  const group = useRef<Group>(null)
  const { camera } = useThree()
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, progress * Math.PI * 0.3, 0.05)
      const s = 1 - progress * 0.15
      group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, s, 0.05))
    }
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 5.5 + progress * 2, 0.05)
  })
  return <group ref={group}>{children}</group>
}

const DEPLOY_MESSAGES: Line[][] = [
  [
    { text: '$ deploy --triggered-by=visitor', kind: 'cmd' },
    { text: '→ kicking CI pipeline...', kind: 'info' },
    { text: '✓ build ok · 2m 07s', kind: 'ok' },
  ],
  [
    { text: '$ aws ecs update-service', kind: 'cmd' },
    { text: '→ rolling out new task-def', kind: 'info' },
    { text: '✓ service stabilized', kind: 'ok' },
  ],
  [
    { text: '$ cloudfront create-invalidation /*', kind: 'cmd' },
    { text: '✓ cache purged globally', kind: 'ok' },
  ],
]

export default function HeroScene() {
  const progress = useScrollProgress()
  const flash = useRef(0)
  const rings = useRef<ShockRing[]>([])
  const [hint, setHint] = useState(true)
  const msgIdx = useRef(0)

  const handleScreenClick = useCallback(() => {
    setHint(false)
    rings.current.push({ t: 0 })
    if (rings.current.length > 4) rings.current.shift()
    const push = (DeployMonitor as unknown as { _push?: (l: Line[]) => void })._push
    if (push) {
      push([{ text: '', kind: 'blank' }, ...DEPLOY_MESSAGES[msgIdx.current % DEPLOY_MESSAGES.length]])
      msgIdx.current++
    }
  }, [])

  return (
    <div className="relative w-full h-full">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0.2, 5.5], fov: 52 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={[0, 0, 0]} />
        <fog attach="fog" args={['#03060d', 6, 14]} />
        <ambientLight intensity={0.45} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#38bdf8" />
        <pointLight position={[-5, -3, 2]} intensity={1} color="#1e40af" />
        <MouseLight />

        <Environment preset="night" />
        <Stars radius={60} depth={70} count={1500} factor={3} saturation={0} fade speed={1} />

        <Grid
          position={[0, -1.9, 0]}
          args={[20, 20]}
          cellSize={0.6}
          cellThickness={0.6}
          cellColor="#1e3a8a"
          sectionSize={3}
          sectionThickness={1.2}
          sectionColor="#38bdf8"
          fadeDistance={14}
          fadeStrength={1.5}
          infiniteGrid
        />

        <ScrollRig progress={progress}>
          <DeployMonitor flashRef={flash} onScreenClick={handleScreenClick} />
          <DataStreams />
          <Shockwaves rings={rings} />
        </ScrollRig>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.3}
          rotateSpeed={0.8}
          minPolarAngle={Math.PI / 2.6}
          maxPolarAngle={(2 * Math.PI) / 3}
        />
      </Canvas>
      <div className="pointer-events-none absolute bottom-3 right-4 text-[10px] font-mono text-white/40 uppercase tracking-wider">
        {hint ? 'clique no monitor · arraste · role' : 'deploy · arrastar · rolar'}
      </div>
    </div>
  )
}
