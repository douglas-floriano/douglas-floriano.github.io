import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import type { Group, Mesh, PointLight } from 'three'

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
      {/* desk top */}
      <mesh position={[0, DESK_Y, 0]}>
        <boxGeometry args={[6, 0.1, 2.2]} />
        <meshStandardMaterial color="#1f2937" metalness={0.35} roughness={0.65} />
      </mesh>
      {/* edge trim */}
      <mesh position={[0, DESK_Y + 0.051, 1.09]}>
        <boxGeometry args={[6, 0.02, 0.02]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      {/* legs */}
      {([[-2.9, 1.0], [2.9, 1.0], [-2.9, -1.0], [2.9, -1.0]] as const).map(([x, z], i) => (
        <mesh key={i} position={[x, -2.55, z]}>
          <boxGeometry args={[0.1, 1.5, 0.1]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
      {/* room floor far below */}
      <mesh position={[0, -3.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#05080f" metalness={0.2} roughness={0.9} />
      </mesh>
    </group>
  )
}

function Chair({ spinRef }: { spinRef: React.MutableRefObject<number> }) {
  const group = useRef<Group>(null)
  const { hovered, handlers } = useHover()
  const em = hovered ? 0.5 : 0

  useFrame((_, d) => {
    if (!group.current) return
    if (spinRef.current > 0) {
      group.current.rotation.y += d * 10
      spinRef.current -= d
    }
  })

  return (
    <group
      ref={group}
      position={[-1.7, -1.45, 1.55]}
      rotation={[0, 0.35, 0]}
      onClick={(e) => {
        e.stopPropagation()
        spinRef.current = 0.8
      }}
      {...handlers}
    >
      {/* seat */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.75, 0.1, 0.75]} />
        <meshStandardMaterial color="#0b1220" emissive="#38bdf8" emissiveIntensity={em * 0.5} metalness={0.4} roughness={0.5} />
      </mesh>
      {/* backrest */}
      <mesh position={[0, 0.55, -0.33]}>
        <boxGeometry args={[0.75, 1.0, 0.08]} />
        <meshStandardMaterial color="#0b1220" emissive="#38bdf8" emissiveIntensity={em * 0.5} metalness={0.4} roughness={0.5} />
      </mesh>
      {/* accent stripe on backrest */}
      <mesh position={[0, 0.55, -0.285]}>
        <boxGeometry args={[0.1, 0.9, 0.01]} />
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      {/* stem */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.7, 12]} />
        <meshStandardMaterial color="#475569" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* 5-leg star base */}
      {Array.from({ length: 5 }).map((_, i) => {
        const a = (i / 5) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 0.28, -0.78, Math.sin(a) * 0.28]} rotation={[0, -a, 0]}>
            <boxGeometry args={[0.45, 0.05, 0.08]} />
            <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
          </mesh>
        )
      })}
    </group>
  )
}

function Keyboard({ onType }: { onType: () => void }) {
  const group = useRef<Group>(null)
  const { hovered, handlers } = useHover()
  const hitRef = useRef(0)

  useFrame((_, d) => {
    hitRef.current = Math.max(0, hitRef.current - d * 4)
    if (group.current) {
      group.current.scale.y = 1 + hitRef.current * 0.3
    }
  })

  const em = hovered ? 1.2 : 0.4

  return (
    <group
      ref={group}
      position={[0.1, DESK_TOP + 0.03, 0.55]}
      rotation={[0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation()
        hitRef.current = 1
        onType()
      }}
      {...handlers}
    >
      {/* body */}
      <mesh>
        <boxGeometry args={[1.5, 0.06, 0.45]} />
        <meshStandardMaterial color="#0b1220" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* keys grid (RGB backlight) */}
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 14 }).map((_, col) => (
          <mesh
            key={`${row}-${col}`}
            position={[-0.66 + col * 0.1, 0.035, -0.16 + row * 0.1]}
          >
            <boxGeometry args={[0.085, 0.02, 0.085]} />
            <meshStandardMaterial
              color="#111827"
              emissive={row % 2 === 0 ? '#38bdf8' : '#f59e0b'}
              emissiveIntensity={em * (0.2 + ((row + col) % 3) * 0.15)}
              toneMapped={false}
            />
          </mesh>
        )),
      )}
    </group>
  )
}

function Mouse() {
  const group = useRef<Group>(null)
  const { hovered, handlers } = useHover()
  const clickRef = useRef(0)

  useFrame((_, d) => {
    clickRef.current = Math.max(0, clickRef.current - d * 3)
    if (group.current) {
      group.current.position.y = DESK_TOP + 0.04 - clickRef.current * 0.02
    }
  })

  const em = hovered ? 1 : 0.2

  return (
    <group
      ref={group}
      position={[1.15, DESK_TOP + 0.04, 0.55]}
      onClick={(e) => {
        e.stopPropagation()
        clickRef.current = 1
      }}
      {...handlers}
    >
      <mesh>
        <boxGeometry args={[0.18, 0.05, 0.3]} />
        <meshStandardMaterial color="#0b1220" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* scroll wheel glow */}
      <mesh position={[0, 0.03, 0.02]}>
        <boxGeometry args={[0.03, 0.01, 0.06]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={em * 2} toneMapped={false} />
      </mesh>
    </group>
  )
}

type Steam = { t: number; x: number; z: number; off: number }

function Mug({ steamRef }: { steamRef: React.MutableRefObject<Steam[]> }) {
  const { hovered, handlers } = useHover()
  const em = hovered ? 0.6 : 0
  const pos: [number, number, number] = [-2.2, DESK_TOP + 0.15, 0.2]

  return (
    <group
      position={pos}
      onClick={(e) => {
        e.stopPropagation()
        for (let i = 0; i < 4; i++) {
          steamRef.current.push({
            t: 0,
            x: pos[0] + (Math.random() - 0.5) * 0.08,
            z: pos[2] + (Math.random() - 0.5) * 0.08,
            off: Math.random() * Math.PI * 2,
          })
        }
      }}
      {...handlers}
    >
      {/* mug body */}
      <mesh>
        <cylinderGeometry args={[0.13, 0.11, 0.3, 20]} />
        <meshStandardMaterial color="#e2e8f0" emissive="#38bdf8" emissiveIntensity={em * 0.3} metalness={0.1} roughness={0.8} />
      </mesh>
      {/* handle */}
      <mesh position={[0.16, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.08, 0.02, 10, 20]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.1} roughness={0.8} />
      </mesh>
      {/* coffee surface */}
      <mesh position={[0, 0.145, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.01, 20]} />
        <meshStandardMaterial color="#3b2412" emissive="#7c3a12" emissiveIntensity={0.3} roughness={0.2} />
      </mesh>
      {/* logo line */}
      <mesh position={[0, 0, 0.13]}>
        <planeGeometry args={[0.18, 0.06]} />
        <meshBasicMaterial color="#38bdf8" toneMapped={false} transparent opacity={0.8} />
      </mesh>
    </group>
  )
}

function SteamParticles({ steamRef }: { steamRef: React.MutableRefObject<Steam[]> }) {
  const MAX = 40
  const refs = useRef<Mesh[]>([])

  useFrame((_, d) => {
    for (const s of steamRef.current) s.t += d
    steamRef.current = steamRef.current.filter((s) => s.t < 2)
    for (let i = 0; i < MAX; i++) {
      const m = refs.current[i]
      if (!m) continue
      const s = steamRef.current[i]
      if (!s) { m.visible = false; continue }
      m.visible = true
      const life = s.t / 2
      m.position.set(
        s.x + Math.sin(s.t * 2 + s.off) * 0.06,
        DESK_TOP + 0.32 + s.t * 0.45,
        s.z + Math.cos(s.t * 2 + s.off) * 0.06,
      )
      const scale = 0.05 + s.t * 0.15
      m.scale.set(scale, scale, scale)
      ;(m.material as THREE.MeshBasicMaterial).opacity = (1 - life) * 0.5
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
  const { hovered, handlers } = useHover()
  const em = hovered ? 0.5 : 0

  useFrame((_, d) => {
    if (!light.current) return
    light.current.intensity = THREE.MathUtils.lerp(light.current.intensity, on ? 3.5 : 0, 0.1)
    void d
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
      {/* base */}
      <mesh>
        <cylinderGeometry args={[0.18, 0.2, 0.04, 20]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* arm */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.7, 10]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* shade */}
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
        {/* bulb */}
        <mesh position={[0, -0.1, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color={on ? '#fde68a' : '#334155'} toneMapped={false} />
        </mesh>
      </group>
      <pointLight ref={light} position={[0.3, 0.6, 0]} intensity={0} color="#fbbf24" distance={4} decay={1.5} />
    </group>
  )
}

function Plant({ swayRef }: { swayRef: React.MutableRefObject<number> }) {
  const group = useRef<Group>(null)
  const { hovered, handlers } = useHover()
  const em = hovered ? 0.8 : 0.15

  useFrame((state, d) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    const base = Math.sin(t * 1.2) * 0.03
    const shake = swayRef.current > 0 ? Math.sin(t * 18) * swayRef.current * 0.2 : 0
    group.current.rotation.z = base + shake
    if (swayRef.current > 0) swayRef.current -= d * 1.5
  })

  return (
    <group
      position={[2.5, DESK_TOP, -0.6]}
      onClick={(e) => {
        e.stopPropagation()
        swayRef.current = 1
      }}
      {...handlers}
    >
      {/* pot */}
      <mesh>
        <cylinderGeometry args={[0.18, 0.14, 0.28, 16]} />
        <meshStandardMaterial color="#78350f" metalness={0.1} roughness={0.9} />
      </mesh>
      {/* foliage */}
      <group ref={group} position={[0, 0.2, 0]}>
        {[
          [0, 0.15, 0, 0.22],
          [0.12, 0.1, 0.05, 0.14],
          [-0.1, 0.08, 0.08, 0.14],
          [0.05, 0.28, -0.05, 0.16],
          [-0.08, 0.22, -0.08, 0.13],
        ].map((p, i) => (
          <mesh key={i} position={[p[0], p[1], p[2]]}>
            <icosahedronGeometry args={[p[3], 0]} />
            <meshStandardMaterial
              color="#15803d"
              emissive="#22c55e"
              emissiveIntensity={em}
              roughness={0.7}
              flatShading
            />
          </mesh>
        ))}
      </group>
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
  const [showTitle, setShowTitle] = useState(false)

  return (
    <group
      position={[-1.7, DESK_TOP, 0.3]}
      onClick={(e) => {
        e.stopPropagation()
        setShowTitle((v) => !v)
      }}
      {...handlers}
    >
      {books.map((b, i) => (
        <mesh key={i} position={[0, 0.05 + i * 0.05, 0]} rotation={[0, i * 0.02, 0]}>
          <boxGeometry args={[0.5, 0.05, 0.35]} />
          <meshStandardMaterial
            color={b.color}
            emissive={b.color}
            emissiveIntensity={em * 0.6}
            metalness={0.2}
            roughness={0.6}
          />
        </mesh>
      ))}
      {(hovered || showTitle) && (
        <Text
          position={[0, 0.35, 0]}
          fontSize={0.08}
          color="#e2e8f0"
          anchorX="center"
          anchorY="middle"
          outlineColor="#0b1220"
          outlineWidth={0.005}
        >
          {books.map((b) => b.title).join(' · ')}
        </Text>
      )}
    </group>
  )
}

function Laptop() {
  const { hovered, handlers } = useHover()
  const [open, setOpen] = useState(true)
  const lid = useRef<Group>(null)

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
      {/* base */}
      <mesh>
        <boxGeometry args={[0.9, 0.04, 0.6]} />
        <meshStandardMaterial color="#0b1220" emissive="#38bdf8" emissiveIntensity={em * 0.3} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* keyboard area */}
      <mesh position={[0, 0.022, 0.05]}>
        <boxGeometry args={[0.8, 0.005, 0.4]} />
        <meshStandardMaterial color="#111827" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* lid hinge pivot at back edge */}
      <group position={[0, 0.02, -0.3]}>
        <group ref={lid}>
          <mesh position={[0, 0.28, 0]}>
            <boxGeometry args={[0.9, 0.56, 0.03]} />
            <meshStandardMaterial color="#0b1220" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* screen */}
          <mesh position={[0, 0.28, 0.016]}>
            <planeGeometry args={[0.82, 0.5]} />
            <meshBasicMaterial color="#0f172a" toneMapped={false} />
          </mesh>
          <mesh position={[0, 0.28, 0.017]}>
            <planeGeometry args={[0.78, 0.46]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={open ? 0.35 : 0.05} toneMapped={false} />
          </mesh>
          {/* apple-ish accent glow */}
          <mesh position={[0, 0.28, -0.016]}>
            <circleGeometry args={[0.04, 16]} />
            <meshBasicMaterial color="#38bdf8" toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

export default function DeskSetup({ onKeyboardClick }: { onKeyboardClick: () => void }) {
  const spinChair = useRef(0)
  const steam = useRef<Steam[]>([])
  const plantSway = useRef(0)
  const [lampOn, setLampOn] = useState(true)

  return (
    <group>
      <Desk />
      <Chair spinRef={spinChair} />
      <Keyboard onType={onKeyboardClick} />
      <Mouse />
      <Mug steamRef={steam} />
      <SteamParticles steamRef={steam} />
      <Lamp on={lampOn} setOn={setLampOn} />
      <Plant swayRef={plantSway} />
      <Books />
      <Laptop />
      {/* memoized marker to silence unused-vars if any in future; harmless */}
      {useMemo(() => null, [])}
    </group>
  )
}
