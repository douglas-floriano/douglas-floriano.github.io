import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Html, OrbitControls, Sphere, Environment } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import type { Group } from 'three'

const techs = [
  { name: 'Laravel', color: '#ff2d20' },
  { name: 'React', color: '#14b8a6' },
  { name: 'Node.js', color: '#3c873a' },
  { name: 'TypeScript', color: '#3178c6' },
  { name: 'AWS', color: '#f59e0b' },
  { name: 'Docker', color: '#2496ed' },
  { name: 'MySQL', color: '#00758f' },
  { name: 'MongoDB', color: '#47a248' },
  { name: 'Redis', color: '#dc382d' },
  { name: 'Tailwind', color: '#38bdf8' },
  { name: 'Vite', color: '#facc15' },
  { name: 'PHP', color: '#8892be' },
]

function fibonacciSphere(samples: number, radius: number) {
  const points: [number, number, number][] = []
  const phi = Math.PI * (Math.sqrt(5) - 1)
  for (let i = 0; i < samples; i++) {
    const y = 1 - (i / (samples - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = phi * i
    const x = Math.cos(theta) * r
    const z = Math.sin(theta) * r
    points.push([x * radius, y * radius, z * radius])
  }
  return points
}

function TechCluster() {
  const group = useRef<Group>(null)
  const positions = useMemo(() => fibonacciSphere(techs.length, 2.2), [])

  useFrame((_, d) => {
    if (!group.current) return
    group.current.rotation.y += d * 0.25
    group.current.rotation.x += d * 0.08
  })

  return (
    <group ref={group}>
      <Sphere args={[1.2, 64, 64]}>
        <meshPhysicalMaterial
          color="#0a0f18"
          roughness={0.2}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive="#10b981"
          emissiveIntensity={0.15}
          transparent
          opacity={0.6}
        />
      </Sphere>

      {techs.map((t, i) => (
        <Float key={t.name} speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
          <group position={positions[i]}>
            <Sphere args={[0.12, 24, 24]}>
              <meshStandardMaterial color={t.color} emissive={t.color} emissiveIntensity={1.2} toneMapped={false} />
            </Sphere>
            <Html center distanceFactor={8} occlude>
              <div className="pointer-events-none whitespace-nowrap rounded-full bg-ink-900/90 border border-white/10 px-2 py-0.5 text-[11px] font-mono text-gray-200 backdrop-blur">
                {t.name}
              </div>
            </Html>
          </group>
        </Float>
      ))}
    </group>
  )
}

export default function TechOrb() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 50 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#14b8a6" />
      <pointLight position={[-5, -3, 2]} intensity={1} color="#f59e0b" />
      <Environment preset="night" />
      <TechCluster />
      <OrbitControls enablePan={false} enableZoom={false} autoRotate={false} />
    </Canvas>
  )
}
