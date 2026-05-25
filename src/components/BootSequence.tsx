import { useEffect, useState } from 'react'

const LINES = [
  '[ OK ] Initializing floriano.os v4.7.0',
  '[ OK ] Mounting /production on us-east-1',
  '[ OK ] Loading laravel.handler (PHP 8.2)',
  '[ OK ] Loading react.runtime (19.2)',
  '[ OK ] Spawning horizon, scheduler, nginx',
  '[ OK ] Connecting RDS · MariaDB 11',
  '[ OK ] Verifying TLS · CloudFront edges',
  '[ OK ] Health check passed · 8 services',
  '[ OK ] Welcome, Douglas Floriano Costa.',
]

export default function BootSequence({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0)

  useEffect(() => {
    if (n >= LINES.length) {
      const t = setTimeout(onDone, 400)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setN(n + 1), n === 0 ? 280 : 140 + Math.random() * 90)
    return () => clearTimeout(t)
  }, [n, onDone])

  return (
    <div className="fixed inset-0 z-[200] bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-2xl font-mono text-xs sm:text-sm">
        <div className="flex items-center gap-2 mb-4 text-muted">
          <span className="live-dot" />
          <span className="tracking-[0.22em] uppercase text-[10px]">floriano.os · boot</span>
        </div>
        <div className="space-y-1.5">
          {LINES.slice(0, n).map((l, i) => (
            <div key={i} className="text-ink2">
              <span className={l.includes('[ OK ]') ? 'text-accent' : 'text-warn'}>{l.split(']')[0]}]</span>
              <span>{l.split(']').slice(1).join(']')}</span>
            </div>
          ))}
          {n < LINES.length && <div className="text-accent caret" />}
        </div>
      </div>
    </div>
  )
}
