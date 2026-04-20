import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, Environment, Line } from '@react-three/drei'
import { useRef, useMemo, useEffect, useState, useCallback } from 'react'
import type { Group, Points, ShaderMaterial } from 'three'
import * as THREE from 'three'

type Shockwave = { t: number; origin: THREE.Vector3 }

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
 * Particle sphere that:
 * - bulges toward the cursor
 * - ripples outward from click origin (shockwave)
 * - gently breathes over time
 */
function InteractiveParticleSphere({
  shockwaves,
  pressed,
}: {
  shockwaves: React.MutableRefObject<Shockwave[]>
  pressed: React.MutableRefObject<boolean>
}) {
  const pointsRef = useRef<Points>(null)
  const matRef = useRef<ShaderMaterial>(null)
  const { mouse, viewport, camera } = useThree()

  const COUNT = 4000
  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const seeds = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      // Fibonacci sphere for even distribution
      const k = i + 0.5
      const phi = Math.acos(1 - (2 * k) / COUNT)
      const theta = Math.PI * (1 + Math.sqrt(5)) * k
      const r = 1.6
      positions[i * 3] = Math.cos(theta) * Math.sin(phi) * r
      positions[i * 3 + 1] = Math.sin(theta) * Math.sin(phi) * r
      positions[i * 3 + 2] = Math.cos(phi) * r
      seeds[i] = Math.random()
    }
    return { positions, seeds }
  }, [])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector3() },
      uPressed: { value: 0 },
      uShockT: { value: -1 },
      uShockOrigin: { value: new THREE.Vector3() },
      uShockT2: { value: -1 },
      uShockOrigin2: { value: new THREE.Vector3() },
      uColorA: { value: new THREE.Color('#38bdf8') },
      uColorB: { value: new THREE.Color('#f59e0b') },
      uColorC: { value: new THREE.Color('#1e40af') },
    }),
    [],
  )

  useFrame((state, d) => {
    if (!matRef.current) return
    uniforms.uTime.value += d

    // cursor projected onto a plane in front of the scene
    const mx = (mouse.x * viewport.width) / 2
    const my = (mouse.y * viewport.height) / 2
    uniforms.uMouse.value.set(mx, my, 0)

    // smooth press state
    const target = pressed.current ? 1 : 0
    uniforms.uPressed.value = THREE.MathUtils.lerp(uniforms.uPressed.value, target, 0.12)

    // shockwaves — we support up to 2 concurrent
    const active = shockwaves.current
    for (const s of active) s.t += d
    // drop old
    shockwaves.current = active.filter((s) => s.t < 2.5)

    const s1 = shockwaves.current[shockwaves.current.length - 1]
    const s2 = shockwaves.current[shockwaves.current.length - 2]
    uniforms.uShockT.value = s1 ? s1.t : -1
    if (s1) uniforms.uShockOrigin.value.copy(s1.origin)
    uniforms.uShockT2.value = s2 ? s2.t : -1
    if (s2) uniforms.uShockOrigin2.value.copy(s2.origin)

    // idle camera breath
    if (pointsRef.current) {
      pointsRef.current.rotation.y += d * 0.06
    }
    void state
    void camera
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={/* glsl */ `
          uniform float uTime;
          uniform vec3 uMouse;
          uniform float uPressed;
          uniform float uShockT;
          uniform vec3 uShockOrigin;
          uniform float uShockT2;
          uniform vec3 uShockOrigin2;
          attribute float aSeed;
          varying float vGlow;
          varying float vSeed;

          float ripple(vec3 worldPos, vec3 origin, float t) {
            if (t < 0.0) return 0.0;
            float dist = distance(worldPos, origin);
            float wave = sin(dist * 5.0 - t * 8.0);
            float envelope = exp(-t * 1.8) * exp(-pow(dist - t * 1.8, 2.0) * 3.0);
            return wave * envelope;
          }

          void main() {
            vec3 pos = position;
            vec3 dir = normalize(pos);

            // breathing
            float breath = sin(uTime * 1.2 + aSeed * 6.28) * 0.04;
            pos += dir * breath;

            // cursor attraction: bulge outward toward mouse
            vec3 toMouse = uMouse - pos;
            float md = length(toMouse);
            float pull = smoothstep(2.2, 0.0, md) * 0.45;
            pos += normalize(toMouse + 0.0001) * pull;

            // pressed: contract inward (charge up)
            pos -= dir * uPressed * 0.35;

            // shockwaves push particles along radial direction
            vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
            float r1 = ripple(worldPos, uShockOrigin, uShockT);
            float r2 = ripple(worldPos, uShockOrigin2, uShockT2);
            pos += dir * (r1 + r2) * 0.6;

            vec4 mv = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mv;

            float size = 2.6 + aSeed * 2.5 + abs(r1 + r2) * 14.0 + pull * 6.0 + uPressed * 4.0;
            gl_PointSize = size * (260.0 / -mv.z);

            vGlow = clamp(abs(r1 + r2) * 1.8 + pull * 1.2 + uPressed * 0.8, 0.0, 1.6);
            vSeed = aSeed;
          }
        `}
        fragmentShader={/* glsl */ `
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform vec3 uColorC;
          varying float vGlow;
          varying float vSeed;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            float d = length(c);
            if (d > 0.5) discard;
            float alpha = smoothstep(0.5, 0.0, d);
            vec3 base = mix(uColorC, uColorA, vSeed);
            vec3 col = mix(base, uColorB, clamp(vGlow, 0.0, 1.0));
            col *= 1.0 + vGlow * 1.5;
            gl_FragColor = vec4(col, alpha);
          }
        `}
      />
    </points>
  )
}

/** Tech nodes (like a dev network) with edges that gently wobble */
function NeuralNet() {
  const group = useRef<Group>(null)
  const { mouse } = useThree()

  const nodes = useMemo(() => {
    const arr: THREE.Vector3[] = []
    const N = 14
    for (let i = 0; i < N; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / N)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const r = 2.6
      arr.push(
        new THREE.Vector3(
          Math.cos(theta) * Math.sin(phi) * r,
          Math.sin(theta) * Math.sin(phi) * r,
          Math.cos(phi) * r,
        ),
      )
    }
    return arr
  }, [])

  const edges = useMemo(() => {
    const list: [THREE.Vector3, THREE.Vector3][] = []
    for (let i = 0; i < nodes.length; i++) {
      let best = -1
      let bestD = Infinity
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue
        const d = nodes[i].distanceTo(nodes[j])
        if (d < bestD) {
          bestD = d
          best = j
        }
      }
      if (best >= 0) list.push([nodes[i], nodes[best]])
      // a second connection for density
      let second = -1
      let secondD = Infinity
      for (let j = 0; j < nodes.length; j++) {
        if (i === j || j === best) continue
        const d = nodes[i].distanceTo(nodes[j])
        if (d < secondD) {
          secondD = d
          second = j
        }
      }
      if (second >= 0) list.push([nodes[i], nodes[second]])
    }
    return list
  }, [nodes])

  useFrame((_, d) => {
    if (!group.current) return
    group.current.rotation.y += d * 0.08
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, mouse.y * 0.35, 0.04)
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -mouse.x * 0.2, 0.04)
  })

  return (
    <group ref={group}>
      {edges.map((e, i) => (
        <Line
          key={i}
          points={[e[0], e[1]]}
          color="#38bdf8"
          transparent
          opacity={0.18}
          lineWidth={1}
        />
      ))}
      {nodes.map((n, i) => (
        <mesh key={i} position={n}>
          <octahedronGeometry args={[0.07, 0]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? '#f59e0b' : '#38bdf8'}
            emissive={i % 3 === 0 ? '#f59e0b' : '#38bdf8'}
            emissiveIntensity={2.4}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

function MouseLight() {
  const ref = useRef<THREE.PointLight>(null)
  useFrame(({ mouse, viewport }) => {
    if (!ref.current) return
    ref.current.position.x = THREE.MathUtils.lerp(
      ref.current.position.x,
      (mouse.x * viewport.width) / 2,
      0.12,
    )
    ref.current.position.y = THREE.MathUtils.lerp(
      ref.current.position.y,
      (mouse.y * viewport.height) / 2,
      0.12,
    )
  })
  return <pointLight ref={ref} position={[0, 0, 3]} intensity={2} color="#f59e0b" distance={7} />
}

function ScrollRig({ progress, children }: { progress: number; children: React.ReactNode }) {
  const group = useRef<Group>(null)
  const { camera } = useThree()
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        progress * Math.PI * 0.4,
        0.06,
      )
      const s = 1 - progress * 0.2
      group.current.scale.setScalar(THREE.MathUtils.lerp(group.current.scale.x, s, 0.06))
    }
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 5.5 + progress * 2.5, 0.06)
  })
  return <group ref={group}>{children}</group>
}

export default function HeroScene() {
  const progress = useScrollProgress()
  const shockwaves = useRef<Shockwave[]>([])
  const pressed = useRef(false)
  const [hint, setHint] = useState(true)

  const addShockwave = useCallback((ndcX: number, ndcY: number) => {
    // approximate 3D origin on near plane — enough for the ripple feel
    const origin = new THREE.Vector3(ndcX * 2.5, ndcY * 2.5, 0)
    shockwaves.current.push({ t: 0, origin })
    if (shockwaves.current.length > 2) shockwaves.current.shift()
  }, [])

  return (
    <div className="relative w-full h-full">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5.5], fov: 52 }}
        gl={{ antialias: true, alpha: true }}
        onPointerDown={(e) => {
          pressed.current = true
          setHint(false)
          const rect = (e.target as HTMLElement).getBoundingClientRect()
          const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
          const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
          addShockwave(x, y)
        }}
        onPointerUp={() => {
          pressed.current = false
        }}
        onPointerLeave={() => {
          pressed.current = false
        }}
      >
        <color attach="background" args={[0, 0, 0]} />
        <ambientLight intensity={0.35} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#38bdf8" />
        <pointLight position={[-5, -3, 2]} intensity={1} color="#1e40af" />
        <MouseLight />

        <Environment preset="night" />
        <Stars radius={60} depth={70} count={2000} factor={3} saturation={0} fade speed={1} />

        <ScrollRig progress={progress}>
          <InteractiveParticleSphere shockwaves={shockwaves} pressed={pressed} />
          <NeuralNet />
        </ScrollRig>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.4}
          rotateSpeed={0.8}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={(2 * Math.PI) / 3}
        />
      </Canvas>
      <div className="pointer-events-none absolute bottom-3 right-4 text-[10px] font-mono text-white/40 uppercase tracking-wider">
        {hint ? 'mova · clique · arraste' : 'interativo'}
      </div>
    </div>
  )
}
