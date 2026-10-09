import { useState } from 'react'
import { Check, Copy, Download, MessageCircle } from 'lucide-react'
import { CV, EMAIL, GITHUB, LINKEDIN, WHATSAPP } from '../data/contact'

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
    <section id="contato" className="scroll-mt-16 py-12 sm:py-14 bg-surface border-t border-line">
      <div className="page grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-7">
          <h2 className="font-display font-bold tracking-[-0.02em] text-[clamp(1.8rem,3.6vw,2.6rem)] leading-tight">Contato</h2>
          <p className="mt-3 text-[1.15rem] text-ink max-w-[46ch]">
            Quer conversar sobre um projeto ou trocar uma ideia? Me chama no WhatsApp.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn btn-main"><MessageCircle size={17} /> Chamar no WhatsApp</a>
            <button onClick={copy} className="btn btn-line">
              {copied ? <Check size={16} className="text-leaf" /> : <Copy size={16} />}
              {copied ? 'E-mail copiado' : EMAIL}
            </button>
          </div>
        </div>
        <ul className="lg:col-span-5 flex flex-wrap lg:justify-end gap-x-6 gap-y-2 text-[15px]">
          <li><a href={GITHUB} target="_blank" rel="noreferrer" className="link">GitHub</a></li>
          <li><a href={LINKEDIN} target="_blank" rel="noreferrer" className="link">LinkedIn</a></li>
          <li><a href={CV} download className="link inline-flex items-center gap-1.5"><Download size={15} aria-hidden /> Currículo em PDF</a></li>
        </ul>
      </div>
    </section>
  )
}
