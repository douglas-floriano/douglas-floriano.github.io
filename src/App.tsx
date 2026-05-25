import { useEffect, useState } from 'react'
import BootSequence from './components/BootSequence'
import ParticleField from './components/ParticleField'
import StatusBar from './components/StatusBar'
import Nav from './components/Nav'
import Hero from './components/Hero'
import SystemPulse from './components/SystemPulse'
import Journey from './components/Journey'
import Work from './components/Work'
import StackOrbit from './components/StackOrbit'
import Manifesto from './components/Manifesto'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  const [booted, setBooted] = useState(false)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mx', `${e.clientX}px`)
      document.documentElement.style.setProperty('--my', `${e.clientY}px`)
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return (
    <div className="relative bg-noise scanlines min-h-screen bg-bg text-ink overflow-x-hidden">
      <div className="spotlight" aria-hidden />
      <ParticleField />
      {!booted && <BootSequence onDone={() => setBooted(true)} />}
      <div className={booted ? 'opacity-100' : 'opacity-0'} style={{ transition: 'opacity 0.6s ease' }}>
        <StatusBar />
        <Nav />
        <main className="relative">
          <Hero />
          <SystemPulse />
          <Journey />
          <Work />
          <StackOrbit />
          <Manifesto />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  )
}
