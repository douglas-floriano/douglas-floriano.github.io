export default function Footer() {
  return (
    <footer className="relative border-t border-line bg-bg2">
      <div className="overflow-hidden border-b border-line py-6">
        <div className="marquee flex whitespace-nowrap font-display font-black text-5xl sm:text-7xl tracking-tighter text-ink/[0.04]">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex items-center gap-12 px-6">
              <span>FLORIANO.OS</span>
              <span className="text-accent">●</span>
              <span>SHIPPED IN PROD</span>
              <span className="text-accent">●</span>
              <span>LARAVEL · REACT · AWS</span>
              <span className="text-accent">●</span>
              <span>ITIRAPUÃ / SP</span>
              <span className="text-accent">●</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1320px] px-4 sm:px-8 lg:px-16 py-12 grid sm:grid-cols-3 gap-8">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">© 2026 · floriano.os v4.7</div>
          <div className="mt-2 text-sm text-ink2">Douglas Floriano Costa<br/>senior fullstack · studio of one</div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted mb-2">links</div>
          <ul className="space-y-1 text-sm text-ink2">
            <li><a className="hover:text-accent" href="https://github.com/douglas-floriano">github</a></li>
            <li><a className="hover:text-accent" href="https://www.linkedin.com/in/douglas-costa-b581ab1a1/">linkedin</a></li>
            <li><a className="hover:text-accent" href="/cv-douglas-floriano-costa.pdf">cv (pdf)</a></li>
          </ul>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted mb-2">colofão</div>
          <p className="text-sm text-ink2 leading-relaxed">
            Construído em React 19 + Vite + Tailwind. Tipografia Archivo, Space Grotesk, Fraunces e JetBrains Mono. Sem agência, sem template.
          </p>
        </div>
      </div>

      <div className="border-t border-line px-4 sm:px-8 lg:px-16 py-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
        <span>build · {new Date().toISOString().slice(0,10)}</span>
        <span className="flex items-center gap-2"><span className="live-dot" /> all systems operational</span>
      </div>
    </footer>
  )
}
