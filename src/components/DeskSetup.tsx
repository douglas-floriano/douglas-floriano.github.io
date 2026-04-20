import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Billboard } from '@react-three/drei'
import * as THREE from 'three'
import type { Group, Mesh, PointLight } from 'three'

function useCroppedFaceTexture(url: string | undefined) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  useEffect(() => {
    if (!url) return
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      try {
        // Reference photo 2268×4032: face sits roughly x=24-76%, y=26-50%
        const LEFT = 0.24
        const TOP = 0.26
        const WIDTH = 0.52
        const HEIGHT = 0.24
        const sx = img.naturalWidth * LEFT
        const sy = img.naturalHeight * TOP
        const sw = img.naturalWidth * WIDTH
        const sh = img.naturalHeight * HEIGHT
        const canvas = document.createElement('canvas')
        canvas.width = 512
        canvas.height = 512
        const ctx = canvas.getContext('2d')
        if (!ctx) { setTexture(null); return }
        ctx.fillStyle = '#b07858'
        ctx.fillRect(0, 0, 512, 512)
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, 512, 512)
        const t = new THREE.CanvasTexture(canvas)
        t.colorSpace = THREE.SRGBColorSpace
        t.minFilter = THREE.LinearFilter
        t.magFilter = THREE.LinearFilter
        t.needsUpdate = true
        setTexture(t)
      } catch (err) {
        console.error('[face-texture] draw failed', err)
        setTexture(null)
      }
    }
    img.onerror = (err) => {
      console.error('[face-texture] image load failed', url, err)
      setTexture(null)
    }
    img.src = url
  }, [url])
  return texture
}

const DESK_Y = -1.79
const DESK_TOP = DESK_Y + 0.05

function useHover() {
  const [hovered, setHovered] = useState(false)
  const handlers = {
    onPointerOver: (e: { stopPropagation: () => void }) => {
      e.stopPropagation()
      setHovered(true)
      document.body.style.cursor = 'pointer'
    },
    onPointerOut: (e: { stopPropagation: () => void }) => {
      e.stopPropagation()
      setHovered(false)
      document.body.style.cursor = 'auto'
    },
  }
  return { hovered, handlers }
}

function Desk() {
  return (
    <group>
      <mesh position={[0, DESK_Y, 0]}>
        <boxGeometry args={[6, 0.1, 2.2]} />
        <meshStandardMaterial color="#1f2937" metalness={0.35} roughness={0.65} />
      </mesh>
      <mesh position={[0, DESK_Y + 0.051, 1.09]}>
        <boxGeometry args={[6, 0.02, 0.02]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      {([[-2.9, 1.0], [2.9, 1.0], [-2.9, -1.0], [2.9, -1.0]] as const).map(([x, z], i) => (
        <mesh key={i} position={[x, -2.55, z]}>
          <boxGeometry args={[0.1, 1.5, 0.1]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, -3.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#05080f" metalness={0.2} roughness={0.9} />
      </mesh>
      {/* floor circular rug under chair */}
      <mesh position={[-1.7, -3.33, 1.55]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.3, 48]} />
        <meshStandardMaterial color="#0b1220" roughness={1} metalness={0} />
      </mesh>
    </group>
  )
}

function Character({ avatarUrl }: { avatarUrl?: string }) {
  const faceTex = useCroppedFaceTexture(avatarUrl)
  const SKIN = '#b07858'
  const SHIRT = '#1e3a8a'

  return (
    <group position={[0, 0.3, -0.15]}>
      {/* torso (navy shirt) */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.6, 0.7, 0.32]} />
        <meshStandardMaterial color={SHIRT} metalness={0.1} roughness={0.85} />
      </mesh>
      {/* chest neckline */}
      <mesh position={[0, 0.38, 0.17]}>
        <boxGeometry args={[0.3, 0.08, 0.02]} />
        <meshStandardMaterial color="#0b1220" roughness={0.8} />
      </mesh>
      {/* neck */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.09, 0.1, 0.14, 16]} />
        <meshStandardMaterial color={SKIN} roughness={0.75} />
      </mesh>

      {/* head — billboarded photo always facing camera for max fidelity */}
      <Billboard position={[0, 0.85, 0]} follow lockX={false} lockY={false} lockZ={false}>
        {/* soft glow halo behind */}
        <mesh position={[0, 0, -0.02]}>
          <circleGeometry args={[0.42, 32]} />
          <meshBasicMaterial color="#1e40af" transparent opacity={0.35} toneMapped={false} />
        </mesh>
        {/* photo face */}
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[0.7, 0.7]} />
          {faceTex ? (
            <meshBasicMaterial map={faceTex} toneMapped={false} />
          ) : (
            <meshBasicMaterial color={SKIN} />
          )}
        </mesh>
        {/* subtle cyan rim */}
        <mesh position={[0, 0, -0.01]}>
          <ringGeometry args={[0.36, 0.39, 48]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.55} toneMapped={false} />
        </mesh>
      </Billboard>

      {/* arms reaching to keyboard */}
      <mesh position={[-0.33, -0.1, 0.25]} rotation={[0.9, 0, 0.15]}>
        <boxGeometry args={[0.13, 0.5, 0.13]} />
        <meshStandardMaterial color={SHIRT} roughness={0.85} />
      </mesh>
      <mesh position={[0.33, -0.1, 0.25]} rotation={[0.9, 0, -0.15]}>
        <boxGeometry args={[0.13, 0.5, 0.13]} />
        <meshStandardMaterial color={SHIRT} roughness={0.85} />
      </mesh>
      {/* forearms (skin) */}
      <mesh position={[-0.4, -0.35, 0.5]} rotation={[1.2, 0, 0.1]}>
        <cylinderGeometry args={[0.055, 0.06, 0.25, 12]} />
        <meshStandardMaterial color={SKIN} roughness={0.75} />
      </mesh>
      <mesh position={[0.4, -0.35, 0.5]} rotation={[1.2, 0, -0.1]}>
        <cylinderGeometry args={[0.055, 0.06, 0.25, 12]} />
        <meshStandardMaterial color={SKIN} roughness={0.75} />
      </mesh>
      {/* hands */}
      <mesh position={[-0.43, -0.45, 0.62]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={SKIN} roughness={0.75} />
      </mesh>
      <mesh position={[0.43, -0.45, 0.62]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={SKIN} roughness={0.75} />
      </mesh>
    </group>
  )
}

function Chair({ spinRef, avatarUrl }: { spinRef: React.MutableRefObject<number>; avatarUrl?: string }) {
  const group = useRef<Group>(null)
  const velocity = useRef(0)
  const { hovered, handlers } = useHover()
  const em = hovered ? 0.6 : 0

  useFrame((_, d) => {
    if (!group.current) return
    if (spinRef.current > 0) {
      velocity.current = 10
      spinRef.current = 0
    }
    group.current.rotation.y += velocity.current * d
    velocity.current *= Math.pow(0.3, d) // inertia decay
    if (Math.abs(velocity.current) < 0.01) velocity.current = 0
  })

  return (
    <group
      ref={group}
      position={[-1.7, -1.45, 1.55]}
      rotation={[0, 0.35, 0]}
      onClick={(e) => {
        e.stopPropagation()
        spinRef.current = 1
      }}
      {...handlers}
    >
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.75, 0.1, 0.75]} />
        <meshStandardMaterial color="#0b1220" emissive="#38bdf8" emissiveIntensity={em * 0.5} metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.55, -0.33]}>
        <boxGeometry args={[0.75, 1.0, 0.08]} />
        <meshStandardMaterial color="#0b1220" emissive="#38bdf8" emissiveIntensity={em * 0.5} metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.55, -0.285]}>
        <boxGeometry args={[0.1, 0.9, 0.01]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      {/* arm rests */}
      <mesh position={[-0.42, 0.14, 0.05]}>
        <boxGeometry args={[0.08, 0.28, 0.5]} />
        <meshStandardMaterial color="#0b1220" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0.42, 0.14, 0.05]}>
        <boxGeometry args={[0.08, 0.28, 0.5]} />
        <meshStandardMaterial color="#0b1220" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.7, 12]} />
        <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* 5-leg base with wheels */}
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * Math.PI * 2
        return (
          <group key={i} rotation={[0, -a, 0]}>
            <mesh position={[0.28, -0.78, 0]}>
              <boxGeometry args={[0.45, 0.05, 0.08]} />
              <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[0.48, -0.82, 0]}>
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshStandardMaterial color="#1e293b" metalness={0.3} roughness={0.6} />
            </mesh>
          </group>
        )
      })}
      {/* character sitting on chair */}
      <Character avatarUrl={avatarUrl} />
    </group>
  )
}

function Keyboard({ onType, typingRef }: { onType: () => void; typingRef: React.MutableRefObject<number> }) {
  const { hovered, handlers } = useHover()

  const keys = useMemo(() => {
    const arr: { row: number; col: number; color: string }[] = []
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 14; col++) {
        arr.push({
          row,
          col,
          color: ['#38bdf8', '#f59e0b', '#22c55e', '#a78bfa'][(row + col) % 4],
        })
      }
    }
    return arr
  }, [])

  const keyRefs = useRef<Mesh[]>([])

  useFrame((state, d) => {
    typingRef.current = Math.max(0, typingRef.current - d * 0.8)
    const t = state.clock.elapsedTime
    const typing = typingRef.current
    for (let i = 0; i < keys.length; i++) {
      const m = keyRefs.current[i]
      if (!m) continue
      const k = keys[i]
      // wave that sweeps across the keyboard when typing
      const wave = Math.max(0, Math.sin(t * 18 - k.col * 0.6 - k.row * 0.3)) * typing
      const hoverBoost = hovered ? 0.4 : 0
      const base = 0.15 + ((k.row + k.col) % 3) * 0.08
      const em = base + wave * 1.8 + hoverBoost
      const mat = m.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = em
      m.position.y = 0.035 - wave * 0.02
    }
  })

  return (
    <group
      position={[0.1, DESK_TOP + 0.03, 0.55]}
      onClick={(e) => {
        e.stopPropagation()
        typingRef.current = 1
        onType()
      }}
      {...handlers}
    >
      <mesh>
        <boxGeometry args={[1.5, 0.06, 0.45]} />
        <meshStandardMaterial color="#0b1220" metalness={0.5} roughness={0.5} />
      </mesh>
      {keys.map((k, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) keyRefs.current[i] = el }}
          position={[-0.66 + k.col * 0.1, 0.035, -0.16 + k.row * 0.1]}
        >
          <boxGeometry args={[0.085, 0.02, 0.085]} />
          <meshStandardMaterial color="#111827" emissive={k.color} emissiveIntensity={0.2} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

type CursorFly = { t: number; from: THREE.Vector3; to: THREE.Vector3 }

function Mouse({ cursorFliesRef }: { cursorFliesRef: React.MutableRefObject<CursorFly[]> }) {
  const group = useRef<Group>(null)
  const { hovered, handlers } = useHover()
  const clickRef = useRef(0)
  const scrollGlow = useRef(0)

  useFrame((state, d) => {
    clickRef.current = Math.max(0, clickRef.current - d * 3)
    scrollGlow.current = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.5
    if (group.current) {
      group.current.position.y = DESK_TOP + 0.04 - clickRef.current * 0.015
    }
  })

  const em = hovered ? 1.4 : 0.4 + scrollGlow.current * 0.6

  return (
    <group
      ref={group}
      position={[1.15, DESK_TOP + 0.04, 0.55]}
      onClick={(e) => {
        e.stopPropagation()
        clickRef.current = 1
        // fly particle from mouse toward monitor
        cursorFliesRef.current.push({
          t: 0,
          from: new THREE.Vector3(1.15, DESK_TOP + 0.15, 0.55),
          to: new THREE.Vector3(0, 0, 0),
        })
      }}
      {...handlers}
    >
      <mesh>
        <boxGeometry args={[0.18, 0.05, 0.3]} />
        <meshStandardMaterial color="#0b1220" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.03, 0.02]}>
        <boxGeometry args={[0.03, 0.01, 0.06]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={em * 2} toneMapped={false} />
      </mesh>
    </group>
  )
}

function CursorFlies({ fliesRef }: { fliesRef: React.MutableRefObject<CursorFly[]> }) {
  const MAX = 8
  const refs = useRef<Mesh[]>([])
  useFrame((_, d) => {
    for (const f of fliesRef.current) f.t += d * 2
    fliesRef.current = fliesRef.current.filter((f) => f.t < 1)
    for (let i = 0; i < MAX; i++) {
      const m = refs.current[i]
      if (!m) continue
      const f = fliesRef.current[i]
      if (!f) { m.visible = false; continue }
      m.visible = true
      const t = f.t
      // arc upward
      const x = THREE.MathUtils.lerp(f.from.x, f.to.x, t)
      const y = THREE.MathUtils.lerp(f.from.y, f.to.y, t) + Math.sin(t * Math.PI) * 0.8
      const z = THREE.MathUtils.lerp(f.from.z, f.to.z, t)
      m.position.set(x, y, z)
      const scale = 0.06 + (1 - t) * 0.04
      m.scale.set(scale, scale, scale)
    }
  })
  return (
    <group>
      {Array.from({ length: MAX }).map((_, i) => (
        <mesh key={i} ref={(el) => { if (el) refs.current[i] = el }} visible={false}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.85} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

type Steam = { t: number; x: number; z: number; off: number; life: number }

function Mug({ steamRef }: { steamRef: React.MutableRefObject<Steam[]> }) {
  const { hovered, handlers } = useHover()
  const em = hovered ? 0.6 : 0
  const pos: [number, number, number] = [-2.2, DESK_TOP + 0.15, 0.2]
  const splash = useRef(0)
  const surface = useRef<Mesh>(null)
  const idleAcc = useRef(0)

  useFrame((state, d) => {
    splash.current = Math.max(0, splash.current - d * 2)
    if (surface.current) {
      surface.current.position.y = 0.145 + Math.sin(state.clock.elapsedTime * 3) * 0.005 + splash.current * 0.05
    }
    // idle steam: emit a particle every ~0.5s
    idleAcc.current += d
    if (idleAcc.current > 0.5) {
      idleAcc.current = 0
      steamRef.current.push({
        t: 0,
        x: pos[0] + (Math.random() - 0.5) * 0.08,
        z: pos[2] + (Math.random() - 0.5) * 0.08,
        off: Math.random() * Math.PI * 2,
        life: 1.8,
      })
    }
  })

  return (
    <group
      position={pos}
      onClick={(e) => {
        e.stopPropagation()
        splash.current = 1
        for (let i = 0; i < 8; i++) {
          steamRef.current.push({
            t: 0,
            x: pos[0] + (Math.random() - 0.5) * 0.12,
            z: pos[2] + (Math.random() - 0.5) * 0.12,
            off: Math.random() * Math.PI * 2,
            life: 2.4,
          })
        }
      }}
      {...handlers}
    >
      <mesh>
        <cylinderGeometry args={[0.13, 0.11, 0.3, 20]} />
        <meshStandardMaterial color="#e2e8f0" emissive="#38bdf8" emissiveIntensity={em * 0.3} metalness={0.1} roughness={0.8} />
      </mesh>
      <mesh position={[0.16, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.08, 0.02, 10, 20]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.1} roughness={0.8} />
      </mesh>
      <mesh ref={surface} position={[0, 0.145, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.01, 20]} />
        <meshStandardMaterial color="#3b2412" emissive="#7c3a12" emissiveIntensity={0.3} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.13]}>
        <planeGeometry args={[0.18, 0.06]} />
        <meshBasicMaterial color="#38bdf8" toneMapped={false} transparent opacity={0.8} />
      </mesh>
    </group>
  )
}

function SteamParticles({ steamRef }: { steamRef: React.MutableRefObject<Steam[]> }) {
  const MAX = 60
  const refs = useRef<Mesh[]>([])

  useFrame((_, d) => {
    for (const s of steamRef.current) s.t += d
    steamRef.current = steamRef.current.filter((s) => s.t < s.life)
    for (let i = 0; i < MAX; i++) {
      const m = refs.current[i]
      if (!m) continue
      const s = steamRef.current[i]
      if (!s) { m.visible = false; continue }
      m.visible = true
      const life = s.t / s.life
      m.position.set(
        s.x + Math.sin(s.t * 2 + s.off) * 0.08,
        DESK_TOP + 0.32 + s.t * 0.45,
        s.z + Math.cos(s.t * 2 + s.off) * 0.08,
      )
      const scale = 0.05 + s.t * 0.18
      m.scale.set(scale, scale, scale)
      ;(m.material as THREE.MeshBasicMaterial).opacity = (1 - life) * 0.45
    }
  })

  return (
    <group>
      {Array.from({ length: MAX }).map((_, i) => (
        <mesh key={i} ref={(el) => { if (el) refs.current[i] = el }} visible={false}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#cbd5e1" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

function Lamp({ on, setOn }: { on: boolean; setOn: (v: boolean) => void }) {
  const light = useRef<PointLight>(null)
  const bulbRef = useRef<Mesh>(null)
  const { hovered, handlers } = useHover()
  const em = hovered ? 0.5 : 0

  useFrame((state) => {
    if (!light.current) return
    const t = state.clock.elapsedTime
    // subtle flicker
    const flicker = on ? 3.4 + Math.sin(t * 23) * 0.15 + Math.sin(t * 47) * 0.1 : 0
    light.current.intensity = THREE.MathUtils.lerp(light.current.intensity, flicker, 0.15)
    if (bulbRef.current) {
      const mat = bulbRef.current.material as THREE.MeshBasicMaterial
      mat.color = new THREE.Color(on ? '#fde68a' : '#334155')
    }
  })

  return (
    <group
      position={[-2.5, DESK_TOP, -0.7]}
      onClick={(e) => {
        e.stopPropagation()
        setOn(!on)
      }}
      {...handlers}
    >
      <mesh>
        <cylinderGeometry args={[0.18, 0.2, 0.04, 20]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* switch indicator */}
      <mesh position={[0.15, 0.025, 0]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshBasicMaterial color={on ? '#22c55e' : '#7f1d1d'} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.7, 10]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
      </mesh>
      <group position={[0.15, 0.7, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <mesh>
          <coneGeometry args={[0.18, 0.25, 16, 1, true]} />
          <meshStandardMaterial
            color="#1e293b"
            emissive={on ? '#fbbf24' : '#0b1220'}
            emissiveIntensity={on ? 1.5 : em}
            metalness={0.5}
            roughness={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh ref={bulbRef} position={[0, -0.1, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color="#fde68a" toneMapped={false} />
        </mesh>
      </group>
      <pointLight ref={light} position={[0.3, 0.6, 0]} intensity={0} color="#fbbf24" distance={4} decay={1.5} />
    </group>
  )
}

type Leaf = { t: number; x: number; y: number; z: number; rot: number; rotSpeed: number; drift: number }

function Plant({ leavesRef }: { leavesRef: React.MutableRefObject<Leaf[]> }) {
  const foliage = useRef<Group>(null)
  const { hovered, handlers } = useHover()
  const em = hovered ? 0.9 : 0.18
  const shake = useRef(0)

  useFrame((state, d) => {
    if (!foliage.current) return
    const t = state.clock.elapsedTime
    const base = Math.sin(t * 1.2) * 0.03
    const tremor = shake.current > 0 ? Math.sin(t * 22) * shake.current * 0.28 : 0
    foliage.current.rotation.z = base + tremor
    foliage.current.rotation.x = Math.cos(t * 0.9) * 0.02
    shake.current = Math.max(0, shake.current - d * 2)
  })

  const LEAVES = [
    [0, 0.15, 0, 0.22],
    [0.12, 0.1, 0.05, 0.14],
    [-0.1, 0.08, 0.08, 0.14],
    [0.05, 0.28, -0.05, 0.16],
    [-0.08, 0.22, -0.08, 0.13],
    [0.14, 0.22, -0.02, 0.11],
    [-0.04, 0.35, 0.02, 0.12],
  ] as const

  return (
    <group
      position={[2.5, DESK_TOP, -0.6]}
      onClick={(e) => {
        e.stopPropagation()
        shake.current = 1
        for (let i = 0; i < 5; i++) {
          leavesRef.current.push({
            t: 0,
            x: 2.5 + (Math.random() - 0.5) * 0.25,
            y: DESK_TOP + 0.35 + Math.random() * 0.2,
            z: -0.6 + (Math.random() - 0.5) * 0.2,
            rot: Math.random() * Math.PI,
            rotSpeed: (Math.random() - 0.5) * 4,
            drift: (Math.random() - 0.5) * 0.4,
          })
        }
      }}
      {...handlers}
    >
      <mesh>
        <cylinderGeometry args={[0.18, 0.14, 0.28, 16]} />
        <meshStandardMaterial color="#78350f" metalness={0.1} roughness={0.9} />
      </mesh>
      <group ref={foliage} position={[0, 0.2, 0]}>
        {LEAVES.map((p, i) => (
          <mesh key={i} position={[p[0], p[1], p[2]]}>
            <icosahedronGeometry args={[p[3], 0]} />
            <meshStandardMaterial color="#15803d" emissive="#22c55e" emissiveIntensity={em} roughness={0.7} flatShading />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function FallingLeaves({ leavesRef }: { leavesRef: React.MutableRefObject<Leaf[]> }) {
  const MAX = 20
  const refs = useRef<Mesh[]>([])
  useFrame((_, d) => {
    for (const l of leavesRef.current) {
      l.t += d
      l.y -= d * 0.5
      l.x += Math.sin(l.t * 4) * l.drift * d
      l.rot += l.rotSpeed * d
    }
    leavesRef.current = leavesRef.current.filter((l) => l.y > -3)
    for (let i = 0; i < MAX; i++) {
      const m = refs.current[i]
      if (!m) continue
      const l = leavesRef.current[i]
      if (!l) { m.visible = false; continue }
      m.visible = true
      m.position.set(l.x, l.y, l.z)
      m.rotation.set(l.rot, l.rot * 0.5, 0)
    }
  })
  return (
    <group>
      {Array.from({ length: MAX }).map((_, i) => (
        <mesh key={i} ref={(el) => { if (el) refs.current[i] = el }} visible={false}>
          <icosahedronGeometry args={[0.06, 0]} />
          <meshStandardMaterial color="#15803d" emissive="#22c55e" emissiveIntensity={0.4} flatShading />
        </mesh>
      ))}
    </group>
  )
}

function Books() {
  const { hovered, handlers } = useHover()
  const em = hovered ? 0.8 : 0.1
  const books = [
    { color: '#1e40af', title: 'Clean Code' },
    { color: '#f59e0b', title: 'Laravel' },
    { color: '#38bdf8', title: 'React' },
    { color: '#ef4444', title: 'SRE' },
  ]
  const [liftIdx, setLiftIdx] = useState(-1)
  const liftRefs = useRef<Mesh[]>([])
  const liftProgress = useRef(0)

  useFrame((_, d) => {
    if (liftIdx >= 0) {
      liftProgress.current = Math.min(1, liftProgress.current + d * 1.2)
      const m = liftRefs.current[liftIdx]
      if (m) {
        const p = liftProgress.current
        const ease = p < 0.5 ? p * 2 : (1 - p) * 2
        m.position.y = 0.05 + liftIdx * 0.05 + ease * 0.35
        m.rotation.y = ease * Math.PI * 2
      }
      if (liftProgress.current >= 1) {
        liftProgress.current = 0
        setLiftIdx(-1)
      }
    }
  })

  return (
    <group
      position={[-1.7, DESK_TOP, 0.3]}
      onClick={(e) => {
        e.stopPropagation()
        if (liftIdx < 0) {
          liftProgress.current = 0
          setLiftIdx(Math.floor(Math.random() * books.length))
        }
      }}
      {...handlers}
    >
      {books.map((b, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) liftRefs.current[i] = el }}
          position={[0, 0.05 + i * 0.05, 0]}
          rotation={[0, i * 0.02, 0]}
        >
          <boxGeometry args={[0.5, 0.05, 0.35]} />
          <meshStandardMaterial color={b.color} emissive={b.color} emissiveIntensity={em * 0.6} metalness={0.2} roughness={0.6} />
        </mesh>
      ))}
      {(hovered || liftIdx >= 0) && (
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.08}
          color="#e2e8f0"
          anchorX="center"
          anchorY="middle"
          outlineColor="#0b1220"
          outlineWidth={0.005}
        >
          {liftIdx >= 0 ? books[liftIdx].title : books.map((b) => b.title).join(' · ')}
        </Text>
      )}
    </group>
  )
}

function LaptopScreen() {
  const canvas = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 512; c.height = 320
    return c
  }, [])
  const tex = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas)
    t.minFilter = THREE.LinearFilter
    return t
  }, [canvas])
  const colsRef = useRef<{ y: number; speed: number; chars: string[] }[]>([])
  const elapsed = useRef(0)
  const redrawAcc = useRef(0)

  useMemo(() => {
    const cols: { y: number; speed: number; chars: string[] }[] = []
    const count = 24
    const symbols = 'const=>{}()[]</>;await async fn def var let api.'
    for (let i = 0; i < count; i++) {
      cols.push({
        y: Math.random() * 320,
        speed: 60 + Math.random() * 80,
        chars: Array.from({ length: 10 }, () => symbols[Math.floor(Math.random() * symbols.length)]),
      })
    }
    colsRef.current = cols
  }, [])

  useFrame((_, d) => {
    elapsed.current += d
    redrawAcc.current += d
    if (redrawAcc.current < 1 / 20) return
    redrawAcc.current = 0
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = 'rgba(6, 10, 20, 0.25)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.font = '14px ui-monospace, Menlo, monospace'
    const cols = colsRef.current
    const colW = canvas.width / cols.length
    for (let i = 0; i < cols.length; i++) {
      const c = cols[i]
      c.y += c.speed * d * 20
      if (c.y > canvas.height + 40) c.y = -40
      for (let j = 0; j < c.chars.length; j++) {
        const yy = c.y - j * 14
        if (yy < 0 || yy > canvas.height) continue
        ctx.fillStyle = j === 0 ? '#7dd3fc' : `rgba(56, 189, 248, ${1 - j / c.chars.length})`
        ctx.fillText(c.chars[j], i * colW + 2, yy)
      }
    }
    tex.needsUpdate = true
  })
  return tex
}

function Laptop() {
  const { hovered, handlers } = useHover()
  const [open, setOpen] = useState(true)
  const lid = useRef<Group>(null)
  const screenTex = LaptopScreen()

  useFrame(() => {
    if (!lid.current) return
    const target = open ? -Math.PI * 0.55 : -0.02
    lid.current.rotation.x = THREE.MathUtils.lerp(lid.current.rotation.x, target, 0.12)
  })

  const em = hovered ? 0.6 : 0

  return (
    <group
      position={[1.9, DESK_TOP + 0.015, 0.3]}
      rotation={[0, -0.3, 0]}
      onClick={(e) => {
        e.stopPropagation()
        setOpen((v) => !v)
      }}
      {...handlers}
    >
      <mesh>
        <boxGeometry args={[0.9, 0.04, 0.6]} />
        <meshStandardMaterial color="#0b1220" emissive="#38bdf8" emissiveIntensity={em * 0.3} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.022, 0.05]}>
        <boxGeometry args={[0.8, 0.005, 0.4]} />
        <meshStandardMaterial color="#111827" metalness={0.5} roughness={0.6} />
      </mesh>
      <group position={[0, 0.02, -0.3]}>
        <group ref={lid}>
          <mesh position={[0, 0.28, 0]}>
            <boxGeometry args={[0.9, 0.56, 0.03]} />
            <meshStandardMaterial color="#0b1220" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.28, 0.017]}>
            <planeGeometry args={[0.82, 0.5]} />
            <meshBasicMaterial map={screenTex} toneMapped={false} transparent opacity={open ? 1 : 0.1} />
          </mesh>
          <mesh position={[0, 0.28, -0.016]}>
            <circleGeometry args={[0.04, 16]} />
            <meshBasicMaterial color="#38bdf8" toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

function Headphones() {
  const { hovered, handlers } = useHover()
  const group = useRef<Group>(null)
  const [bopping, setBopping] = useState(false)

  useFrame((state) => {
    if (!group.current) return
    if (bopping) {
      const t = state.clock.elapsedTime
      group.current.rotation.z = Math.sin(t * 6) * 0.08
      group.current.position.y = DESK_TOP + 0.05 + Math.abs(Math.sin(t * 6)) * 0.03
    } else {
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, 0.1)
    }
  })

  const em = hovered || bopping ? 1.4 : 0.3

  return (
    <group
      ref={group}
      position={[-1.1, DESK_TOP + 0.05, -0.7]}
      onClick={(e) => {
        e.stopPropagation()
        setBopping((v) => !v)
      }}
      {...handlers}
    >
      {/* band */}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[0.18, 0.025, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#0b1220" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* ear cups */}
      <mesh position={[-0.18, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
        <meshStandardMaterial color="#0b1220" emissive="#f59e0b" emissiveIntensity={em * 0.6} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.18, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
        <meshStandardMaterial color="#0b1220" emissive="#f59e0b" emissiveIntensity={em * 0.6} metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  )
}

function RubberDuck() {
  const group = useRef<Group>(null)
  const { hovered, handlers } = useHover()
  const squishRef = useRef(0)

  useFrame((state, d) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    group.current.position.y = DESK_TOP + 0.08 + Math.sin(t * 2) * 0.01 + squishRef.current * 0.1
    squishRef.current = Math.max(0, squishRef.current - d * 4)
    const sc = 1 - squishRef.current * 0.2
    group.current.scale.set(1, sc, 1)
  })

  const em = hovered ? 1 : 0.15

  return (
    <group
      ref={group}
      position={[0.95, DESK_TOP + 0.08, -0.5]}
      onClick={(e) => {
        e.stopPropagation()
        squishRef.current = 1
      }}
      {...handlers}
    >
      {/* body */}
      <mesh>
        <sphereGeometry args={[0.1, 20, 20]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={em * 0.6} roughness={0.6} />
      </mesh>
      {/* head */}
      <mesh position={[0.02, 0.1, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={em * 0.6} roughness={0.6} />
      </mesh>
      {/* beak */}
      <mesh position={[0.1, 0.09, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.025, 0.06, 8]} />
        <meshStandardMaterial color="#ea580c" />
      </mesh>
      {/* eyes */}
      <mesh position={[0.04, 0.12, 0.045]}>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshBasicMaterial color="#0b1220" />
      </mesh>
      <mesh position={[0.04, 0.12, -0.045]}>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshBasicMaterial color="#0b1220" />
      </mesh>
    </group>
  )
}

export default function DeskSetup({
  onKeyboardClick,
  avatarUrl,
}: {
  onKeyboardClick: () => void
  avatarUrl?: string
}) {
  const spinChair = useRef(0)
  const steam = useRef<Steam[]>([])
  const leaves = useRef<Leaf[]>([])
  const typing = useRef(0)
  const cursorFlies = useRef<CursorFly[]>([])
  const [lampOn, setLampOn] = useState(true)

  return (
    <group>
      <Desk />
      <Chair spinRef={spinChair} avatarUrl={avatarUrl} />
      <Keyboard onType={onKeyboardClick} typingRef={typing} />
      <Mouse cursorFliesRef={cursorFlies} />
      <CursorFlies fliesRef={cursorFlies} />
      <Mug steamRef={steam} />
      <SteamParticles steamRef={steam} />
      <Lamp on={lampOn} setOn={setLampOn} />
      <Plant leavesRef={leaves} />
      <FallingLeaves leavesRef={leaves} />
      <Books />
      <Laptop />
      <Headphones />
      <RubberDuck />
    </group>
  )
}
