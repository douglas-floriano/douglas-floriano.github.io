import { useEffect } from 'react'
import NeuralField from './components/NeuralField'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Statement from './components/Statement'
import AISection from './components/AISection'
import Pipeline from './components/Pipeline'
import Projects from './components/Projects'
import Process from './components/Process'
import Stack from './components/Stack'
import Journey from './components/Journey'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { startSmoothScroll } from './lib/smooth'

export default function App() {
  useEffect(() => {
    const lenis = startSmoothScroll()
    return () => lenis?.destroy()
  }, [])

  return (
    <>
      <NeuralField />
      <div aria-hidden className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(124,156,255,0.10),transparent_60%)]" />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Statement />
        <AISection />
        <Pipeline />
        <Projects />
        <Process />
        <Stack />
        <Journey />
        <Contact />
      </main>
      <div className="relative z-10"><Footer /></div>
    </>
  )
}
