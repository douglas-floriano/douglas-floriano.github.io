import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, Environment, Float, Grid } from '@react-three/drei'
import { useRef, useMemo, useEffect, useState, useCallback } from 'react'
import type { Group, Mesh, Points, ShaderMaterial } from 'three'
import * as THREE from 'three'

type Burst = { t: number; origin: THREE.Vector3 }

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

/**
 * Canvas-texture "terminal" showing Douglas's real deploy workflow,
 * typing line by line on a loop. Re-rendered into a THREE.CanvasTexture.
 */
const DEPLOY_SCRIPT: { text: string; kind: 'prompt' | 'cmd' | 'info' | 'ok' | 'warn' | 'title' | 'blank' }[] = [
  { text: '╔═ douglas@ibsystem ─ walletLote ═════════════╗', kind: 'title' },
  { text: '', kind: 'blank' },
  { text: '$ git push origin main', kind: 'cmd' },
  { text: '→ GH Actions: deploy-prod.yml', kind: 'info' },
  { text: '→ building docker: php-fpm + nginx', kind: 'info' },
  { text: '✓ images pushed to ECR', kind: 'ok' },
  { text: '→ updating ECS task-def', kind: 'info' },
  { text: '✓ WalletLote service healthy', kind: 'ok' },
  { text: '→ yarn main · s3 sync · cf invalidate', kind: 'info' },
  { text: '✓ deployed in 2m 14s', kind: 'ok' },
  { text: '', kind: 'blank' },
  { text: '$ laravel new saas --stack=react', kind: 'cmd' },
  { text: '→ aws rds · mariadb · horizon', kind: 'info' },
  { text: '✓ online · tenants: 42 · uptime 99.98%', kind: 'ok' },
  { text: '', kind: 'blank' },
  { text: '$ _', kind: 'prompt' },
]

function useTerminalTexture() {
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
    lineIdx: 0,
    charIdx: 0,
    acc: 0,
    done: false,
    shown: [] as { text: string; kind: (typeof DEPLOY_SCRIPT)[number]['kind'] }[],
    restartAt: -1,
    blink: 0,
  })

  const colorFor = (kind: (typeof DEPLOY_SCRIPT)[number]['kind']) => {
    switch (kind) {
      case 'title': return '#60a5fa'
      case 'cmd': return '#f8fafc'
      case 'info': return '#94a3b8'
      case 'ok': return '#fbbf24'
      case 'warn': return '#fb7185'
      case 'prompt': return '#f8fafc'
      default: return '#cbd5e1'
    }
  }

  const draw = (glitch: number, elapsed: number) => {
    const ctx = canvas.getContext('2d')!
    // bg
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height)
    grad.addColorStop(0, '#060a14')
    grad.addColorStop(1, '#0b1220')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // window chrome bar
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

    // grid scanlines
    ctx.globalAlpha = 0.08
    ctx.fillStyle = '#38bdf8'
    for (let y = 56; y < canvas.height; y += 3) ctx.fillRect(0, y, canvas.width, 1)
    ctx.globalAlpha = 1

    // text
    ctx.font = '22px ui-monospace, Menlo, monospace'
    const lineH = 30
    const padX = 36
    const padY = 88
    const s = state.current

    for (let i = 0; i < s.shown.length; i++) {
      const ln = s.shown[i]
      ctx.fillStyle = colorFor(ln.kind)
      if (glitch > 0.01 && Math.random() < glitch * 0.4) {
        ctx.fillStyle = '#38bdf8'
        const jitter = (Math.random() - 0.5) * glitch * 12
        ctx.fillText(ln.text, padX + jitter, padY + i * lineH)
      } else {
        ctx.fillText(ln.text, padX, padY + i * lineH)
      }
    }

    // cursor
    if (!s.done) {
      const cur = s.shown[s.shown.length - 1]
      if (cur) {
        const blink = Math.floor(elapsed * 2) % 2 === 0 ? 1 : 0
        if (blink) {
          ctx.fillStyle = '#38bdf8'
          const w = ctx.measureText(cur.text).width
          ctx.fillRect(padX + w + 4, padY + (s.shown.length - 1) * lineH - 18, 12, 22)
        }
      }
    } else {
      const blink = Math.floor(elapsed * 2) % 2 === 0 ? 1 : 0
      if (blink) {
        ctx.fillStyle = '#38bdf8'
        const last = s.shown[s.shown.length - 1]?.text ?? '$ '
        const w = ctx.measureText(last).width
        ctx.fillRect(padX + w + 4, padY + (s.shown.length - 1) * lineH - 18, 12, 22)
      }
    }

    texture.needsUpdate = true
  }

  const step = (dt: number, glitch: number, elapsed: number) => {
    const s = state.current
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
      const speed = 0.02
      while (s.acc >= speed && !s.done) {
        s.acc -= speed
        const target = DEPLOY_SCRIPT[s.lineIdx]
        if (!target) {
          s.done = true
          s.restartAt = elapsed + 4
          break
        }
        if (target.kind === 'blank') {
          s.shown.push({ text: '', kind: 'blank' })
          s.lineIdx++
          s.charIdx = 0
          continue
        }
        const curShown = s.shown[s.shown.length - 1]
        if (!curShown || curShown !== s.shown[s.shown.length - 1] || s.charIdx === 0) {
          if (s.charIdx === 0) s.shown.push({ text: '', kind: target.kind })
        }
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
    draw(glitch, elapsed)
  }

  return { texture, step }
}

function DeployMonitor({
  glitchRef,
  onClickInside,
}: {
  glitchRef: React.MutableRefObject<number>
  onClickInside: (p: THREE.Vector3) => void
}) {
  const group = useRef<Group>(null)
  const screen = useRef<Mesh>(null)
  const { mouse } = useThree()
  const { texture, step } = useTerminalTexture()
  const elapsed = useRef(0)

  useFrame((_, d) => {
    elapsed.current += d
    glitchRef.current = Math.max(0, glitchRef.current - d * 1.6)
    step(d, glitchRef.current, elapsed.current)

    if (group.current) {
      // parallax tilt toward cursor
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mouse.x * 0.35, 0.06)
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -mouse.y * 0.25, 0.06)
      // gentle float
      group.current.position.y = Math.sin(elapsed.current * 0.8) * 0.08
    }
  })

  return (
    <group ref={group}>
      {/* bezel */}
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[3.4, 2.2, 0.12]} />
        <meshStandardMaterial color="#0b1220" metalness={0.9} roughness={0.25} />
      </mesh>
      {/* screen */}
      <mesh
        ref={screen}
        onClick={(e) => {
          e.stopPropagation()
          glitchRef.current = 1
          onClickInside(e.point.clone())
        }}
      >
        <planeGeometry args={[3.2, 2.0]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* glow halo */}
      <mesh position={[0, 0, -0.08]}>
        <planeGeometry args={[3.8, 2.6]} />
        <meshBasicMaterial color="#1e40af" transparent opacity={0.18} toneMapped={false} />
      </mesh>
      {/* stand */}
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

/** Floating service badges (ECS, S3, RDS, CloudFront, Laravel, React) orbiting the monitor */
const SERVICES = [
  { label: 'AWS', color: '#f59e0b' },
  { label: 'ECS', color: '#f59e0b' },
  { label: 'S3', color: '#fbbf24' },
  { label: 'RDS', color: '#38bdf8' },
  { label: 'Laravel', color: '#ef4444' },
  { label: 'React', color: '#38bdf8' },
  { label: 'Docker', color: '#60a5fa' },
  { label: 'Nginx', color: '#22c55e' },
]

function ServiceBadge({ label, color, position }: { label: string; color: string; position: [number, number, number] }) {
  const tex = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 256; c.height = 128
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#0b1220'
    ctx.fillRect(0, 0, 256, 128)
    ctx.strokeStyle = color
    ctx.lineWidth = 4
    ctx.strokeRect(4, 4, 248, 120)
    ctx.fillStyle = color
    ctx.font = 'bold 44px ui-monospace, Menlo, monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(label, 128, 64)
    const t = new THREE.CanvasTexture(c)
    t.minFilter = THREE.LinearFilter
    return t
  }, [label, color])

  return (
    <Float speed={1.5} rotationIntensity={0.35} floatIntensity={0.6}>
      <mesh position={position}>
        <planeGeometry args={[0.9, 0.45]} />
        <meshBasicMaterial map={tex} transparent toneMapped={false} />
      </mesh>
    </Float>
  )
}

function OrbitingServices() {
  const group = useRef<Group>(null)
  useFrame((_, d) => {
    if (group.current) group.current.rotation.y += d * 0.15
  })
  const positions = useMemo(() => {
    return SERVICES.map((_, i) => {
      const a = (i / SERVICES.length) * Math.PI * 2
      const r = 3.1
      const y = Math.sin(i * 1.7) * 0.8
      return [Math.cos(a) * r, y, Math.sin(a) * r] as [number, number, number]
    })
  }, [])
  return (
    <group ref={group}>
      {SERVICES.map((s, i) => (
        <ServiceBadge key={s.label + i} label={s.label} color={s.color} position={positions[i]} />
      ))}
    </group>
  )
}

/** Particle bursts when clicking the screen (deploy rocket effect) */
function BurstParticles({ bursts }: { bursts: React.MutableRefObject<Burst[]> }) {
  const pointsRef = useRef<Points>(null)
  const matRef = useRef<ShaderMaterial>(null)

  const MAX = 400
  const positions = useMemo(() => new Float32Array(MAX * 3), [])
  const velocities = useMemo(() => new Float32Array(MAX * 3), [])
  const life = useMemo(() => new Float32Array(MAX), [])
  const alive = useRef(new Uint8Array(MAX))

  const uniforms = useMemo(
    () => ({
      uColorA: { value: new THREE.Color('#38bdf8') },
      uColorB: { value: new THREE.Color('#f59e0b') },
    }),
    [],
  )

  const spawn = (origin: THREE.Vector3) => {
    let spawned = 0
    for (let i = 0; i < MAX && spawned < 80; i++) {
      if (!alive.current[i]) {
        alive.current[i] = 1
        positions[i * 3] = origin.x
        positions[i * 3 + 1] = origin.y
        positions[i * 3 + 2] = origin.z
        const ang = Math.random() * Math.PI * 2
        const up = Math.random() * 0.8 + 0.2
        const sp = Math.random() * 2.2 + 0.8
        velocities[i * 3] = Math.cos(ang) * sp * 0.4
        velocities[i * 3 + 1] = up * sp
        velocities[i * 3 + 2] = Math.sin(ang) * sp * 0.4
        life[i] = 1
        spawned++
      }
    }
  }

  useFrame((_, d) => {
    // ingest pending bursts
    while (bursts.current.length > 0) {
      const b = bursts.current.pop()!
      spawn(b.origin)
    }
    for (let i = 0; i < MAX; i++) {
      if (!alive.current[i]) continue
      life[i] -= d * 0.7
      if (life[i] <= 0) {
        alive.current[i] = 0
        positions[i * 3] = 9999
        continue
      }
      positions[i * 3] += velocities[i * 3] * d
      positions[i * 3 + 1] += velocities[i * 3 + 1] * d
      positions[i * 3 + 2] += velocities[i * 3 + 2] * d
      velocities[i * 3 + 1] -= d * 1.4 // gravity
    }
    const geom = pointsRef.current?.geometry
    if (geom) {
      (geom.attributes.position as THREE.BufferAttribute).needsUpdate = true
      ;(geom.attributes.aLife as THREE.BufferAttribute).needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aLife" args={[life, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          attribute float aLife;
          varying float vLife;
          void main() {
            vLife = aLife;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = (6.0 + aLife * 14.0) * (260.0 / -mv.z);
          }
        `}
        fragmentShader={`
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          varying float vLife;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            float d = length(c);
            if (d > 0.5) discard;
            float a = smoothstep(0.5, 0.0, d) * clamp(vLife, 0.0, 1.0);
            vec3 col = mix(uColorA, uColorB, 1.0 - vLife);
            gl_FragColor = vec4(col * (1.0 + vLife), a);
          }
        `}
      />
    </points>
  )
}

function MouseLight() {
  const ref = useRef<THREE.PointLight>(null)
  useFrame(({ mouse, viewport }) => {
    if (!ref.current) return
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, (mouse.x * viewport.width) / 2, 0.12)
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, (mouse.y * viewport.height) / 2, 0.12)
  })
  return <pointLight ref={ref} position={[0, 0, 3]} intensity={1.6} color="#f59e0b" distance={8} />
}

function ScrollRig({ progress, children }: { progress: number; children: React.ReactNode }) {
  const group = useRef<Group>(null)
  const { camera } = useThree()
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, progress * Math.PI * 0.35, 0.05)
      const s = 1 - progress * 0.18
      group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, s, 0.05))
    }
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 5.5 + progress * 2.2, 0.05)
  })
  return <group ref={group}>{children}</group>
}

export default function HeroScene() {
  const progress = useScrollProgress()
  const glitch = useRef(0)
  const bursts = useRef<Burst[]>([])
  const [hint, setHint] = useState(true)

  const triggerBurst = useCallback((p: THREE.Vector3) => {
    bursts.current.push({ t: 0, origin: p })
    setHint(false)
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
        <Stars radius={60} depth={70} count={1600} factor={3} saturation={0} fade speed={1} />

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
          <DeployMonitor glitchRef={glitch} onClickInside={triggerBurst} />
          <OrbitingServices />
          <BurstParticles bursts={bursts} />
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
