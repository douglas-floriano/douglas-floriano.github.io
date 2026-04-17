import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Sparkles } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './BrandIcons'
import { Suspense, lazy } from 'react'

const HeroScene = lazy(() => import('./HeroScene'))

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] flex items-center pt-28 pb-16">
      <div className="mx-auto max-w-7xl px-6 w-full grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-xs text-gray-300 mb-6"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-cyan" />
            Disponível para projetos e consultoria
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white"
          >
            Construo <span className="gradient-text">SaaS escaláveis</span><br />
            do banco ao pixel.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 text-lg text-gray-400 max-w-xl"
          >
            Sou <b className="text-white">Douglas Floriano Costa</b>, Desenvolvedor Senior FullStack.
            Projeto e entrego sistemas em produção — de arquitetura AWS a interfaces polidas em React — para loteadoras, incorporadoras, bares e operações que não podem parar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <a
              href="#projetos"
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-brand-cyan to-brand-violet text-ink-900 font-semibold hover:shadow-[0_0_40px_rgba(168,85,247,0.55)] transition-shadow"
            >
              Ver projetos
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="https://github.com/douglas-floriano"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full glass hover:bg-white/5 transition"
            >
              <GithubIcon className="h-4 w-4" /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/douglas-costa-b581ab1a1/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full glass hover:bg-white/5 transition"
            >
              <LinkedinIcon className="h-4 w-4" /> LinkedIn
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 flex items-center gap-4 text-sm text-gray-400"
          >
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Itirapuã — SP</span>
            <span className="h-1 w-1 rounded-full bg-gray-600" />
            <span>Brasil · Remoto global</span>
          </motion.div>
        </div>

        <div className="lg:col-span-6 relative h-[420px] sm:h-[520px] lg:h-[560px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute inset-0 rounded-3xl overflow-hidden"
          >
            <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-brand-violet/20 to-brand-cyan/20 animate-pulse" />}>
              <HeroScene />
            </Suspense>
          </motion.div>
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/5" />
        </div>
      </div>
    </section>
  )
}
