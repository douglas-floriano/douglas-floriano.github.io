import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Html, OrbitControls, Sphere, Environment } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import type { Group } from 'three'

type Tech = { name: string; icon: string; url: string }

const DEVICON = (slug: string, variant = 'original') =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}/${slug}-${variant}.svg`

const techs: Tech[] = [
  { name: 'Laravel', icon: DEVICON('laravel'), url: 'https://laravel.com' },
  { name: 'React', icon: DEVICON('react'), url: 'https://react.dev' },
  { name: 'Node.js', icon: DEVICON('nodejs'), url: 'https://nodejs.org' },
  { name: 'TypeScript', icon: DEVICON('typescript'), url: 'https://www.typescriptlang.org' },
  { name: 'AWS', icon: DEVICON('amazonwebservices', 'original-wordmark'), url: 'https://aws.amazon.com' },
  { name: 'Docker', icon: DEVICON('docker'), url: 'https://www.docker.com' },
  { name: 'MySQL', icon: DEVICON('mysql'), url: 'https://www.mysql.com' },
  { name: 'MongoDB', icon: DEVICON('mongodb'), url: 'https://www.mongodb.com' },
  { name: 'Redis', icon: DEVICON('redis'), url: 'https://redis.io' },
  { name: 'Tailwind', icon: DEVICON('tailwindcss'), url: 'https://tailwindcss.com' },
  { name: 'Vite', icon: DEVICON('vitejs'), url: 'https://vitejs.dev' },
  { name: 'PHP', icon: DEVICON('php'), url: 'https://www.php.net' },
  { name: 'GitHub Actions', icon: DEVICON('githubactions'), url: 'https://github.com/features/actions' },
  { name: 'Nginx', icon: DEVICON('nginx'), url: 'https://nginx.org' },
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

function TechChip({ tech }: { tech: Tech }) {
  return (
    <Html center distanceFactor={2.6} zIndexRange={[100, 0]} style={{ pointerEvents: 'auto' }}>
      <a
        href={tech.url}
        target="_blank"
        rel="noreferrer"
        className="tech-chip"
        aria-label={tech.name}
      >
        <img
          src={tech.icon}
          alt={tech.name}
          draggable={false}
          loading="eager"
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).style.background = '#14b8a6'
            ;(e.currentTarget as HTMLImageElement).style.borderRadius = '50%'
          }}
        />
        <span className="tech-chip-label">{tech.name}</span>
      </a>
    </Html>
  )
}

function TechCluster() {
  const group = useRef<Group>(null)
  const positions = useMemo(() => fibonacciSphere(techs.length, 2.3), [])

  useFrame((_, d) => {
    if (!group.current) return
    group.current.rotation.y += d * 0.18
    group.current.rotation.x += d * 0.04
  })

  return (
    <group ref={group}>
      <Sphere args={[1.3, 64, 64]}>
        <meshPhysicalMaterial
          color="#0a0f18"
          roughness={0.2}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive="#10b981"
          emissiveIntensity={0.2}
          transparent
          opacity={0.55}
        />
      </Sphere>
      <Sphere args={[1.9, 32, 32]}>
        <meshBasicMaterial color="#14b8a6" wireframe transparent opacity={0.1} />
      </Sphere>

      {techs.map((t, i) => (
        <Float key={t.name} speed={1.2} rotationIntensity={0.2} floatIntensity={0.25}>
          <group position={positions[i]}>
            <TechChip tech={t} />
          </group>
        </Float>
      ))}
    </group>
  )
}

export default function TechOrb() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6.2], fov: 55 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1.3} color="#14b8a6" />
      <pointLight position={[-5, -3, 2]} intensity={1.1} color="#f59e0b" />
      <Environment preset="night" />
      <TechCluster />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(2 * Math.PI) / 3}
      />
    </Canvas>
  )
}
