import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Html, OrbitControls, Sphere, Environment } from '@react-three/drei'
import { useMemo, useRef, useState } from 'react'
import type { Group } from 'three'

type Tech = { name: string; slug: string; color: string; url: string }

const techs: Tech[] = [
  { name: 'Laravel', slug: 'laravel', color: 'FF2D20', url: 'https://laravel.com' },
  { name: 'React', slug: 'react', color: '61DAFB', url: 'https://react.dev' },
  { name: 'Node.js', slug: 'nodedotjs', color: '5FA04E', url: 'https://nodejs.org' },
  { name: 'TypeScript', slug: 'typescript', color: '3178C6', url: 'https://www.typescriptlang.org' },
  { name: 'AWS', slug: 'amazonwebservices', color: 'FF9900', url: 'https://aws.amazon.com' },
  { name: 'Docker', slug: 'docker', color: '2496ED', url: 'https://www.docker.com' },
  { name: 'MySQL', slug: 'mysql', color: '4479A1', url: 'https://www.mysql.com' },
  { name: 'MongoDB', slug: 'mongodb', color: '47A248', url: 'https://www.mongodb.com' },
  { name: 'Redis', slug: 'redis', color: 'DC382D', url: 'https://redis.io' },
  { name: 'Tailwind', slug: 'tailwindcss', color: '06B6D4', url: 'https://tailwindcss.com' },
  { name: 'Vite', slug: 'vite', color: '646CFF', url: 'https://vitejs.dev' },
  { name: 'PHP', slug: 'php', color: '777BB4', url: 'https://www.php.net' },
  { name: 'GitHub Actions', slug: 'githubactions', color: '2088FF', url: 'https://github.com/features/actions' },
  { name: 'Nginx', slug: 'nginx', color: '009639', url: 'https://nginx.org' },
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
  const [hover, setHover] = useState(false)
  return (
    <Html center distanceFactor={6} zIndexRange={[10, 0]}>
      <a
        href={tech.url}
        target="_blank"
        rel="noreferrer"
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        className="tech-chip group"
        style={{
          transform: hover ? 'scale(1.25)' : 'scale(1)',
          boxShadow: hover ? `0 0 28px #${tech.color}aa` : `0 0 12px #${tech.color}55`,
          borderColor: `#${tech.color}`,
        }}
      >
        <img
          src={`https://cdn.simpleicons.org/${tech.slug}/${tech.color}`}
          alt={tech.name}
          draggable={false}
          width={28}
          height={28}
        />
        <span className="tech-chip-label" style={{ opacity: hover ? 1 : 0 }}>{tech.name}</span>
      </a>
    </Html>
  )
}

function TechCluster() {
  const group = useRef<Group>(null)
  const positions = useMemo(() => fibonacciSphere(techs.length, 2.4), [])

  useFrame((_, d) => {
    if (!group.current) return
    group.current.rotation.y += d * 0.2
    group.current.rotation.x += d * 0.05
  })

  return (
    <group ref={group}>
      <Sphere args={[1.15, 64, 64]}>
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
      <Sphere args={[1.6, 32, 32]}>
        <meshBasicMaterial color="#14b8a6" wireframe transparent opacity={0.08} />
      </Sphere>

      {techs.map((t, i) => (
        <Float key={t.slug} speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
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
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6.5], fov: 50 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.45} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#14b8a6" />
      <pointLight position={[-5, -3, 2]} intensity={1} color="#f59e0b" />
      <Environment preset="night" />
      <TechCluster />
      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 3} maxPolarAngle={(2 * Math.PI) / 3} />
    </Canvas>
  )
}
