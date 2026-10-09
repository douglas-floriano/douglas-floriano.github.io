import { ArrowDown, Download, MessageCircle } from 'lucide-react'
import { CV, WHATSAPP } from '../data/contact'

export default function Hero() {
  return (
    <section id="inicio" className="relative pt-24 pb-10 sm:pt-28 sm:pb-14 overflow-hidden">
      <div aria-hidden className="absolute -top-40 right-[-10%] w-[640px] h-[640px] rounded-full bg-[radial-gradient(circle,rgba(233,162,59,0.10),transparent_65%)] pointer-events-none" />
      <div className="page relative grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
        <div className="md:col-span-8">
          <div className="flex items-center gap-4">
            <img src="/douglas.webp" alt="Douglas Floriano" width={320} height={320} className="md:hidden w-16 h-16 rounded-lg object-cover border border-line" />
            <p className="label">Dev full-stack sênior · IB System</p>
          </div>
          <h1 className="mt-4 font-display font-bold tracking-[-0.03em] leading-[0.95] text-[clamp(3rem,8.5vw,6.4rem)]">
            Douglas Floriano
          </h1>
          <p className="mt-7 text-[clamp(1.15rem,2vw,1.4rem)] leading-snug text-ink max-w-[40ch]">
            Desenvolvo os sistemas da IB System de ponta a ponta: backend em Laravel, frontend em React e apps em Expo.
          </p>
          <p className="mt-4 text-soft max-w-[60ch]">
            São produtos de gestão de loteamentos, venda de ingressos, pagamento com maquininha em eventos e investimentos.
            Desde 2025 a IA entrou no meu dia a dia: agentes que atendem o gestor dentro do ERP, um servidor MCP para o
            cliente ligar o próprio assistente ao sistema e um serviço que transforma pedidos do WhatsApp em correções que
            eu reviso antes de subir.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#projetos" className="btn btn-main">Ver projetos <ArrowDown size={16} /></a>
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn btn-line"><MessageCircle size={16} /> WhatsApp</a>
            <a href={CV} download className="btn btn-line"><Download size={16} /> Currículo</a>
          </div>
        </div>
        <div className="hidden md:col-span-4 md:flex md:justify-end">
          <figure className="w-full max-w-[280px]">
            <img
              src="/douglas.webp"
              alt="Douglas Floriano"
              width={320}
              height={320}
              className="w-full aspect-square object-cover rounded-xl border border-line"
            />
            <figcaption className="mt-3 text-[13.5px] text-muted">Itirapuã, SP</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
