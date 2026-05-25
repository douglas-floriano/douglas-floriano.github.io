import { useEffect, useMemo, useState } from 'react'

function useFakeMetric(seed: number, base: number, jitter: number, period = 1800) {
  const [v, setV] = useState(base)
  useEffect(() => {
    const id = setInterval(() => {
      setV(base + (Math.random() - 0.5) * jitter * 2)
    }, period + seed * 137)
    return () => clearInterval(id)
  }, [seed, base, jitter, period])
  return v
}

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const pts = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - ((d - min) / range) * 100}`).join(' ')
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-16">
      <polyline fill="none" stroke="currentColor" strokeWidth="1.5" points={pts} className="text-accent" />
      <polyline fill="url(#g)" stroke="none" points={`0,100 ${pts} 100,100`} />
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22C55E" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function SystemPulse() {
  const rps = useFakeMetric(1, 1247, 80, 1400)
  const p95 = useFakeMetric(2, 124, 18, 2000)
  const errs = useFakeMetric(3, 0.04, 0.03, 2500)
  const queues = useFakeMetric(4, 38, 14, 1800)

  const spark = useMemo(() => Array.from({ length: 24 }, () => 40 + Math.random() * 60), [Math.floor(rps)])

  return (
    <section id="pulse" className="relative py-24 sm:py-32 border-y border-line bg-bg2">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8 lg:px-16">
        <div className="section-head">
          <span className="kicker">/ 01</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">pulse · sistemas em produção agora</h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-4">
          {/* Big live chart card */}
          <div className="lg:col-span-7 card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">requests / min · 24h</div>
              <span className="glow-pill"><span className="live-dot" /> live</span>
            </div>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="metric-big text-accent tabular">{Math.round(rps).toLocaleString('pt-BR')}</span>
              <span className="font-mono text-xs text-muted">req/min</span>
            </div>
            <Sparkline data={spark} />
            <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-line">
              <Mini label="p95 latency" value={`${p95.toFixed(0)}ms`} good={p95 < 150} />
              <Mini label="error rate"  value={`${errs.toFixed(2)}%`} good={errs < 0.1} />
              <Mini label="queue depth" value={`${Math.round(queues)}`} good={queues < 80} />
            </div>
          </div>

          {/* Side: regions + deploys */}
          <div className="lg:col-span-5 grid gap-4">
            <div className="card p-6">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted mb-4">regions · ecs · cloudfront</div>
              <div className="space-y-3">
                {[
                  ['us-east-1', 'walletlote-backend',    'healthy'],
                  ['us-east-1', 'walletlote-backend-dev','healthy'],
                  ['edge·12',  'cloudfront · admin.walletlote', 'cached'],
                  ['edge·12',  'cloudfront · admin.ibsystem',   'cached'],
                ].map(([r, svc, st]) => (
                  <div key={svc} className="flex items-center justify-between text-[12px] font-mono">
                    <div className="flex items-center gap-3 truncate">
                      <span className="live-dot shrink-0" />
                      <span className="text-ink2 truncate">{svc}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted shrink-0">
                      <span>{r}</span>
                      <span className="text-accent uppercase tracking-[0.18em] text-[10px]">{st}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">deploys · últimos 30d</div>
                <span className="metric-big text-ink tabular text-3xl">47</span>
              </div>
              <div className="grid gap-[3px]" style={{ gridTemplateColumns: 'repeat(30, minmax(0, 1fr))' }}>
                {Array.from({ length: 30 }).map((_, i) => {
                  const v = Math.random()
                  const cls = v > 0.85 ? 'bg-accent' : v > 0.5 ? 'bg-accent2/70' : v > 0.2 ? 'bg-line' : 'bg-bg3'
                  return <div key={i} className={`h-6 rounded-sm ${cls}`} title={`day -${30 - i}`} />
                })}
              </div>
              <div className="flex items-center justify-between mt-3 text-[10px] font-mono uppercase tracking-[0.22em] text-muted">
                <span>30d atrás</span><span>hoje</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Mini({ label, value, good }: { label: string; value: string; good: boolean }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">{label}</div>
      <div className={`font-display font-bold text-xl tabular mt-1 ${good ? 'text-accent' : 'text-hot'}`}>{value}</div>
    </div>
  )
}
