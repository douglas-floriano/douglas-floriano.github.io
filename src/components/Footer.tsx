export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-8 px-6">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-brand-cyan via-brand-violet to-brand-pink text-ink-900 text-[10px] font-bold">DF</span>
          © {new Date().getFullYear()} Douglas Floriano Costa
        </div>
        <div className="font-mono text-xs">
          Feito com <span className="text-brand-cyan">React</span> · <span className="text-brand-violet">Three.js</span> · <span className="text-brand-pink">Framer Motion</span>
        </div>
      </div>
    </footer>
  )
}
