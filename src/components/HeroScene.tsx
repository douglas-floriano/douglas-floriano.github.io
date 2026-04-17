import { Canvas, useFrame } from '@react-three/fiber'
import { Icosahedron, Float, Stars, MeshDistortMaterial, Torus, Sphere } from '@react-three/drei'
import { useRef } from 'react'
import type { Mesh } from 'three'

function DistortedCore() {
  const ref = useRef<Mesh>(null)
  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.x += d * 0.2
      ref.current.rotation.y += d * 0.25
    }
  })
  return (
    <Icosahedron ref={ref} args={[1.6, 4]} position={[0, 0, 0]}>
      <MeshDistortMaterial
        color="#a855f7"
        emissive="#22d3ee"
        emissiveIntensity={0.35}
        roughness={0.1}
        metalness={0.85}
        distort={0.45}
        speed={2}
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
    <Torus ref={ref} args={[radius, 0.015, 16, 120]} rotation={[tilt, 0, 0]}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} toneMapped={false} />
    </Torus>
  )
}

function FloatingParticle({ pos, color }: { pos: [number, number, number]; color: string }) {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[0.08, 16, 16]} position={pos}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
      </Sphere>
    </Float>
  )
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5], fov: 55 }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={[0, 0, 0]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#22d3ee" />
      <pointLight position={[-5, -3, 2]} intensity={1} color="#ec4899" />
      <pointLight position={[0, 3, -5]} intensity={0.6} color="#a855f7" />
      <Stars radius={50} depth={60} count={2000} factor={3} saturation={0} fade speed={1} />
      <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
        <DistortedCore />
      </Float>
      <OrbitingRing radius={2.2} speed={0.4} color="#22d3ee" tilt={1.2} />
      <OrbitingRing radius={2.6} speed={-0.3} color="#a855f7" tilt={0.4} />
      <OrbitingRing radius={3.0} speed={0.2} color="#ec4899" tilt={-0.6} />
      <FloatingParticle pos={[2.5, 1.2, 0]} color="#22d3ee" />
      <FloatingParticle pos={[-2.3, -1.4, 0.5]} color="#ec4899" />
      <FloatingParticle pos={[1.8, -2, -0.3]} color="#a3e635" />
      <FloatingParticle pos={[-1.9, 1.8, -0.2]} color="#a855f7" />
    </Canvas>
  )
}
