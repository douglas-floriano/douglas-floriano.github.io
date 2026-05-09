import Logo, { Wordmark } from './Logo'

export default function Footer() {
  return (
    <footer className="bg-ink text-paper border-t border-paper/15">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-10 py-10 sm:py-14">
        <div className="grid sm:grid-cols-12 gap-8 items-end">
          <div className="sm:col-span-5 flex items-center gap-3">
            <Logo size={40} invert />
            <div>
              <Wordmark className="text-2xl text-paper" />
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-paper/50 mt-1">studio of one · est. 2018</p>
            </div>
          </div>

          <nav className="sm:col-span-4 grid grid-cols-2 gap-1 text-sm font-mono text-paper/70">
            <a href="#now" className="py-1 hover:text-accent">Hoje</a>
            <a href="#stack" className="py-1 hover:text-accent">Stack</a>
            <a href="#trabalho" className="py-1 hover:text-accent">Trabalho</a>
            <a href="#processo" className="py-1 hover:text-accent">Processo</a>
            <a href="https://github.com/douglas-floriano" className="py-1 hover:text-accent" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/douglas-costa-b581ab1a1/" className="py-1 hover:text-accent" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://www.instagram.com/douglasflorianoc/" className="py-1 hover:text-accent" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://wa.me/5516991816628" className="py-1 hover:text-accent" target="_blank" rel="noreferrer">WhatsApp</a>
          </nav>

          <p className="sm:col-span-3 sm:text-right font-mono text-[10px] uppercase tracking-[0.2em] text-paper/40">
            © {new Date().getFullYear()}<br />
            Douglas Floriano Costa<br />
            Todos os direitos
          </p>
        </div>

        <div className="mt-10 pt-6 border-t border-paper/15 flex flex-col sm:flex-row gap-3 justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-paper/40">
          <span>Itirapuã / SP · Brasil — Disponível remoto</span>
          <span>Construído à mão em React + Vite</span>
        </div>
      </div>
    </footer>
  )
}
