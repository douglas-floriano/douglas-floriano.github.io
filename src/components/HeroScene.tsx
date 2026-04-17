import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Icosahedron,
  Float,
  Stars,
  MeshDistortMaterial,
  Torus,
  Sphere,
  OrbitControls,
  Trail,
  Environment,
} from '@react-three/drei'
import { useRef, useMemo } from 'react'
import type { Mesh, Group } from 'three'
import * as THREE from 'three'

function DistortedCore({ onPointerOver, onPointerOut }: { onPointerOver: () => void; onPointerOut: () => void }) {
  const ref = useRef<Mesh>(null)
  const { mouse } = useThree()

  useFrame((_, d) => {
    if (!ref.current) return
    ref.current.rotation.x += d * 0.2
    ref.current.rotation.y += d * 0.25
    // subtle tilt toward cursor
    ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, mouse.x * 0.3, 0.05)
  })

  return (
    <Icosahedron
      ref={ref}
      args={[1.6, 5]}
      position={[0, 0, 0]}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <MeshDistortMaterial
        color="#10b981"
        emissive="#14b8a6"
        emissiveIntensity={0.45}
        roughness={0.1}
        metalness={0.85}
        distort={0.5}
        speed={2.2}
      />
    </Icosahedron>
  )
}

function OrbitingRing({ radius, speed, color, tilt }: { radius: number; speed: number; color: string; tilt: number }) {
  const ref = useRef<Mesh>(null)
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.z += d * speed
  })
  return (
    <Torus ref={ref} args={[radius, 0.015, 16, 140]} rotation={[tilt, 0, 0]}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.6} toneMapped={false} />
    </Torus>
  )
}

function Comet({ radius, speed, color, offset }: { radius: number; speed: number; color: string; offset: number }) {
  const ref = useRef<Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() * speed + offset
    ref.current.position.x = Math.cos(t) * radius
    ref.current.position.z = Math.sin(t) * radius
    ref.current.position.y = Math.sin(t * 2) * 0.4
  })
  return (
    <Trail width={2} length={6} color={color} attenuation={(w) => w * w}>
      <Sphere ref={ref} args={[0.07, 16, 16]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} toneMapped={false} />
      </Sphere>
    </Trail>
  )
}

function FloatingParticles({ count = 60 }: { count?: number }) {
  const group = useRef<Group>(null)
  const positions = useMemo(
    () =>
      new Array(count).fill(0).map(() => ({
        pos: [
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6,
        ] as [number, number, number],
        scale: Math.random() * 0.04 + 0.015,
        color: ['#14b8a6', '#10b981', '#f59e0b', '#facc15'][Math.floor(Math.random() * 4)],
      })),
    [count],
  )

  useFrame((_, d) => {
    if (group.current) group.current.rotation.y += d * 0.05
  })

  return (
    <group ref={group}>
      {positions.map((p, i) => (
        <Float key={i} speed={1.2 + Math.random()} floatIntensity={1.2}>
          <Sphere args={[p.scale, 8, 8]} position={p.pos}>
            <meshStandardMaterial color={p.color} emissive={p.color} emissiveIntensity={2} toneMapped={false} />
          </Sphere>
        </Float>
      ))}
    </group>
  )
}

function MouseLight() {
  const ref = useRef<THREE.PointLight>(null)
  useFrame(({ mouse, viewport }) => {
    if (ref.current) {
      ref.current.position.x = (mouse.x * viewport.width) / 2
      ref.current.position.y = (mouse.y * viewport.height) / 2
    }
  })
  return <pointLight ref={ref} position={[0, 0, 3]} intensity={1.4} color="#f59e0b" distance={8} />
}

export default function HeroScene() {
  const coreHover = useRef<HTMLDivElement | null>(null)

  return (
    <div className="relative w-full h-full" ref={coreHover}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5.5], fov: 52 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={[0, 0, 0]} />
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#14b8a6" />
        <pointLight position={[-5, -3, 2]} intensity={1} color="#f59e0b" />
        <pointLight position={[0, 3, -5]} intensity={0.6} color="#10b981" />
        <MouseLight />

        <Environment preset="night" />
        <Stars radius={60} depth={70} count={2500} factor={3} saturation={0} fade speed={1} />

        <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
          <DistortedCore
            onPointerOver={() => document.body.style.setProperty('cursor', 'grab')}
            onPointerOut={() => document.body.style.setProperty('cursor', 'auto')}
          />
        </Float>

        <OrbitingRing radius={2.2} speed={0.35} color="#14b8a6" tilt={1.2} />
        <OrbitingRing radius={2.6} speed={-0.28} color="#10b981" tilt={0.4} />
        <OrbitingRing radius={3.0} speed={0.22} color="#f59e0b" tilt={-0.6} />

        <Comet radius={2.4} speed={0.6} color="#14b8a6" offset={0} />
        <Comet radius={2.8} speed={-0.45} color="#f59e0b" offset={2.1} />
        <Comet radius={3.2} speed={0.35} color="#10b981" offset={4.2} />

        <FloatingParticles count={70} />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.6}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={(2 * Math.PI) / 3}
        />
      </Canvas>
      <div className="pointer-events-none absolute bottom-3 right-4 text-[10px] font-mono text-white/40 uppercase tracking-wider">
        arraste · interativo
      </div>
    </div>
  )
}
