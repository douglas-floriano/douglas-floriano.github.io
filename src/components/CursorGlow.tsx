import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return // skip on touch
    let raf = 0
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let tx = x
    let ty = y

    const onMove = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
    }

    const tick = () => {
      x += (tx - x) * 0.12
      y += (ty - y) * 0.12
      if (ref.current) ref.current.style.transform = `translate3d(${x - 200}px, ${y - 200}px, 0)`
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[55] h-[400px] w-[400px] rounded-full opacity-70 mix-blend-screen"
      style={{
        background:
          'radial-gradient(closest-side, rgba(20,184,166,0.25), rgba(16,185,129,0.12) 40%, transparent 70%)',
        filter: 'blur(18px)',
      }}
    />
  )
}
