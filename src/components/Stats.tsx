import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'

const stats = [
  { value: 10, suffix: '+', label: 'Anos de experiência' },
  { value: 3, suffix: '', label: 'SaaS em produção' },
  { value: 14, suffix: '', label: 'Stacks dominadas' },
  { value: 99.9, suffix: '%', label: 'Uptime das apps' },
]

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { duration: 2000, bounce: 0 })
  const isFloat = to % 1 !== 0
  const display = useTransform(spring, (v) => (isFloat ? v.toFixed(1) : Math.floor(v).toString()))

  useEffect(() => {
    if (inView) mv.set(to)
  }, [inView, mv, to])

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  )
}

export default function Stats() {
  return (
    <section className="relative px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative glass glow-border rounded-2xl p-6 sm:p-7 overflow-hidden"
            >
              <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-brand-violet/10 blur-3xl" />
              <div className="relative">
                <div className="font-display text-4xl sm:text-5xl font-bold gradient-text leading-none">
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-3 text-xs sm:text-sm text-gray-400 uppercase tracking-wider font-mono">
                  {s.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
