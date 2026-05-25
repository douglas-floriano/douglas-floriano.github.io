import { useEffect, useRef, useState, useMemo } from 'react'

type Skill = { name: string; slug: string; color?: string; src?: string }

const SKILLS: Skill[] = [
  { name: 'React',         slug: 'react',         color: '61DAFB' },
  { name: 'TypeScript',    slug: 'typescript',    color: '3178C6' },
  { name: 'JavaScript',    slug: 'javascript',    color: 'F7DF1E' },
  { name: 'PHP',           slug: 'php',           color: '777BB4' },
  { name: 'Laravel',       slug: 'laravel',       color: 'FF2D20' },
  { name: 'Node.js',       slug: 'nodedotjs',     color: '5FA04E' },
  { name: 'Next.js',       slug: 'nextdotjs',     color: 'FFFFFF' },
  { name: 'Vite',          slug: 'vite',          color: '646CFF' },
  { name: 'Tailwind CSS',  slug: 'tailwindcss',   color: '06B6D4' },
  { name: 'HTML5',         slug: 'html5',         color: 'E34F26' },
  { name: 'CSS',           slug: 'css',           color: '663399' },
  { name: 'React Native',  slug: 'react',         color: '61DAFB' },
  { name: 'MySQL',         slug: 'mysql',         color: '4479A1' },
  { name: 'MariaDB',       slug: 'mariadb',       color: '7DBBE6' },
  { name: 'PostgreSQL',    slug: 'postgresql',    color: '4169E1' },
  { name: 'Redis',         slug: 'redis',         color: 'FF4438' },
  { name: 'Docker',        slug: 'docker',        color: '2496ED' },
  { name: 'AWS',           slug: 'aws',           color: 'FF9900', src: 'https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-icon.svg' },
  { name: 'Nginx',         slug: 'nginx',         color: '009639' },
  { name: 'GitHub Actions',slug: 'githubactions', color: '2088FF' },
  { name: 'Git',           slug: 'git',           color: 'F05032' },
  { name: 'Linux',         slug: 'linux',         color: 'FFFFFF' },
  { name: 'Bash',          slug: 'gnubash',       color: 'FFFFFF' },
  { name: 'Framer Motion', slug: 'framer',        color: '22C55E' },
  { name: 'Sass',          slug: 'sass',          color: 'CC6699' },
  { name: 'Firebase',      slug: 'firebase',      color: 'DD2C00' },
  { name: 'Stripe',        slug: 'stripe',        color: '635BFF' },
  { name: 'WordPress',     slug: 'wordpress',     color: '21759B' },
]

function fibonacciSphere(n: number, r: number) {
  const pts: { x: number; y: number; z: number }[] = []
  const phi = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const radius = Math.sqrt(1 - y * y)
    const theta = phi * i
    pts.push({ x: Math.cos(theta) * radius * r, y: y * r, z: Math.sin(theta) * radius * r })
  }
  return pts
}

export default function SkillsGlobe() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const rot = useRef({ x: -0.25, y: 0.4 })
  const vel = useRef({ x: 0.0008, y: 0.0035 })
  const drag = useRef<{ active: boolean; lx: number; ly: number }>({ active: false, lx: 0, ly: 0 })
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [size, setSize] = useState(480)

  const radius = useMemo(() => size * 0.38, [size])
  const points = useMemo(() => fibonacciSphere(SKILLS.length, radius), [radius])

  useEffect(() => {
    const update = () => {
      const parent = wrapRef.current?.parentElement
      const w = parent?.clientWidth ?? 480
      const vw = window.innerWidth
      const target = Math.min(w - 8, vw - 32)
      setSize(Math.max(260, Math.min(560, target)))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    let raf = 0
    const tick = () => {
      if (!drag.current.active) {
        rot.current.x += vel.current.x
        rot.current.y += vel.current.y
      }
      const inner = wrapRef.current?.querySelector<HTMLDivElement>('.globe-inner')
      if (inner) {
        inner.style.transform = `rotateX(${rot.current.x}rad) rotateY(${rot.current.y}rad)`
      }
      const items = wrapRef.current?.querySelectorAll<HTMLDivElement>('.globe-item')
      if (items) {
        const rx = rot.current.x, ry = rot.current.y
        const cosX = Math.cos(rx), sinX = Math.sin(rx)
        const cosY = Math.cos(ry), sinY = Math.sin(ry)
        items.forEach((el, i) => {
          const p = points[i]
          const z1 = -p.x * sinY + p.z * cosY
          const z2 = p.y * sinX + z1 * cosX
          const t = (z2 / radius + 1) / 2
          el.style.opacity = String(0.35 + t * 0.65)
          el.style.zIndex = String(Math.round(t * 1000))
          el.style.transform = `translate3d(${p.x}px,${p.y}px,${p.z}px) rotateY(${-ry}rad) rotateX(${-rx}rad)`
        })
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [points, radius])

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { active: true, lx: e.clientX, ly: e.clientY }
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return
    const dx = e.clientX - drag.current.lx
    const dy = e.clientY - drag.current.ly
    rot.current.y += dx * 0.006
    rot.current.x -= dy * 0.006
    vel.current.y = dx * 0.0006
    vel.current.x = -dy * 0.0006
    drag.current.lx = e.clientX
    drag.current.ly = e.clientY
  }
  const onPointerUp = () => {
    drag.current.active = false
    if (Math.abs(vel.current.y) < 0.0008) vel.current.y = 0.0035
    if (Math.abs(vel.current.x) < 0.0004) vel.current.x = 0.0008
  }

  const label = hovered ?? selected

  return (
    <div className="relative w-full">
      <div
        ref={wrapRef}
        className="relative mx-auto select-none touch-none cursor-grab active:cursor-grabbing"
        style={{ width: size, height: size, perspective: 1400 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* Glow sphere */}
        <div
          aria-hidden
          className="absolute rounded-full pointer-events-none"
          style={{
            width: radius * 2,
            height: radius * 2,
            left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            background:
              'radial-gradient(circle at 35% 30%, rgba(34,197,94,0.18), rgba(34,197,94,0.04) 55%, rgba(7,9,14,0) 100%)',
            border: '1px solid rgba(34,197,94,0.18)',
            boxShadow:
              'inset 0 0 80px rgba(34,197,94,0.08), 0 40px 80px -30px rgba(34,197,94,0.25)',
          }}
        />
        {/* Outer aura */}
        <div
          aria-hidden
          className="absolute rounded-full pointer-events-none"
          style={{
            width: radius * 2.6,
            height: radius * 2.6,
            left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            background:
              'radial-gradient(circle at 50% 50%, rgba(34,197,94,0.10), rgba(7,9,14,0) 55%)',
          }}
        />

        <div
          className="globe-inner absolute left-1/2 top-1/2"
          style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
        >
          {/* guide rings */}
          {[{ rx: 0, ry: 0 }, { rx: 90, ry: 0 }].map((r, idx) => (
            <div
              key={idx}
              aria-hidden
              className="absolute rounded-full pointer-events-none"
              style={{
                width: radius * 2,
                height: radius * 2,
                left: -radius,
                top: -radius,
                transform: `rotateX(${r.rx}deg) rotateY(${r.ry}deg)`,
                border: '1px dashed rgba(34,197,94,0.16)',
              }}
            />
          ))}

          {SKILLS.map((s, i) => {
            const isActive = selected === s.name
            return (
              <div
                key={s.name + i}
                className="globe-item absolute"
                style={{
                  transformStyle: 'preserve-3d',
                  left: -18, top: -18,
                  transition: 'opacity 200ms linear',
                  willChange: 'transform',
                }}
              >
                <button
                  type="button"
                  onMouseEnter={() => setHovered(s.name)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={(e) => { e.stopPropagation(); setSelected(s.name) }}
                  aria-label={s.name}
                  className="relative flex items-center justify-center transition-transform hover:scale-125 cursor-pointer"
                  style={{ width: 36, height: 36, background: 'transparent', border: 'none' }}
                >
                  {isActive && (
                    <span
                      aria-hidden
                      className="absolute inset-[-8px] rounded-full pointer-events-none"
                      style={{
                        background:
                          'radial-gradient(circle, rgba(34,197,94,0.45), rgba(34,197,94,0) 70%)',
                      }}
                    />
                  )}
                  <img
                    src={s.src ?? `https://cdn.simpleicons.org/${s.slug}/${s.color ?? 'F8FAFC'}`}
                    alt=""
                    width={32}
                    height={32}
                    loading="lazy"
                    draggable={false}
                    style={{
                      pointerEvents: 'none',
                      filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.45)) drop-shadow(0 0 8px rgba(34,197,94,0.15))',
                    }}
                  />
                </button>
              </div>
            )
          })}
        </div>

        <div className="absolute inset-x-0 bottom-2 flex justify-center pointer-events-none">
          <div className={`px-4 py-1.5 bg-bg2 border border-accent/40 rounded font-mono text-[11px] uppercase tracking-[0.22em] text-accent transition-opacity ${label ? 'opacity-100' : 'opacity-0'}`}>
            {label ?? '—'}
          </div>
        </div>
      </div>

      <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
        $ drag to spin · click to pin name
      </p>
    </div>
  )
}
