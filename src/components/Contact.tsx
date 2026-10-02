import { useState } from 'react'
import { Check, Copy, Download, MessageCircle, Mail } from 'lucide-react'

const Github = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>
)
const Linkedin = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>
)

const EMAIL = 'douglas198.floriano@hotmail.com'

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  return (
    <section id="contato" data-field="torus" className="relative min-h-[100svh] flex items-center py-28">
      <div className="page">
        <div className="max-w-4xl mx-auto text-center">
          <p className="kicker">Contato</p>
          <h2 className="mt-5 h-mega text-[clamp(3rem,9vw,7.5rem)]">Tem um sistema para criar ou para ficar mais inteligente?</h2>
          <p className="mt-8 text-soft text-lg max-w-[52ch] mx-auto">
            Atendo projetos sob medida, consultoria em IA aplicada e posições de liderança técnica.
            Você fala direto comigo e recebe resposta em até um dia útil.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href={`mailto:${EMAIL}`} className="btn btn-main"><Mail size={17} /> Enviar e-mail</a>
            <a href="https://wa.me/5516991816628" target="_blank" rel="noreferrer" className="btn btn-line"><MessageCircle size={17} /> Chamar no WhatsApp</a>
          </div>

          <button onClick={copy} className="mt-8 inline-flex items-center gap-2 text-[15px] text-muted hover:text-text transition-colors">
            {copied ? <Check size={15} className="text-mint" /> : <Copy size={15} />}
            {copied ? 'E-mail copiado' : EMAIL}
          </button>

          <div className="mt-14 flex flex-wrap justify-center gap-x-8 gap-y-3 text-[15px]">
            <a href="https://github.com/douglas-floriano" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-soft hover:text-signal"><Github size={17} /> GitHub</a>
            <a href="https://www.linkedin.com/in/douglas-costa-b581ab1a1/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-soft hover:text-signal"><Linkedin size={17} /> LinkedIn</a>
            <a href="/cv-douglas-floriano-costa.pdf" download className="inline-flex items-center gap-2 text-soft hover:text-signal"><Download size={17} /> Currículo em PDF</a>
          </div>
        </div>
      </div>
    </section>
  )
}
