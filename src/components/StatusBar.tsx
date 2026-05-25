import { useEffect, useState } from 'react'

function useClock() {
  const [t, setT] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return t
}

function fmt(t: Date) {
  return t.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'America/Sao_Paulo' })
}

export default function StatusBar() {
  const t = useClock()
  return (
    <div className="fixed top-0 inset-x-0 z-50 border-b border-line bg-bg/85 backdrop-blur">
      <div className="flex items-center justify-between px-4 sm:px-6 h-9 font-mono text-[10.5px] uppercase tracking-[0.18em]">
        <div className="flex items-center gap-4 text-muted">
          <span className="flex items-center gap-2 text-accent">
            <span className="live-dot" /> live
          </span>
          <span className="hidden sm:inline">branch: <span className="text-ink2">main</span></span>
          <span className="hidden md:inline">region: <span className="text-ink2">us-east-1</span></span>
        </div>
        <div className="flex items-center gap-4 text-muted">
          <span className="hidden sm:inline">uptime <span className="text-accent tabular">99.97%</span></span>
          <span className="tabular text-ink2">{fmt(t)}</span>
          <span className="hidden sm:inline">BRT</span>
        </div>
      </div>
    </div>
  )
}
