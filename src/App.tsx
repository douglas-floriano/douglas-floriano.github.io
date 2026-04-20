import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Stats from './components/Stats'
import Stack from './components/Stack'
import Terminal from './components/Terminal'
import Projects from './components/Projects'
import Infra from './components/Infra'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import CursorGlow from './components/CursorGlow'

export default function App() {
  return (
    <div className="relative min-h-screen bg-ink-900 text-gray-200 overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 grid-bg" />
      <div className="pointer-events-none fixed -top-48 -left-48 -z-10 h-[600px] w-[600px] rounded-full bg-brand-violet/20 blur-[140px]" />
      <div className="pointer-events-none fixed -bottom-48 -right-48 -z-10 h-[600px] w-[600px] rounded-full bg-brand-cyan/20 blur-[140px]" />
      <ScrollProgress />
      <CursorGlow />
      <Nav />
      <main className="relative">
        <Hero />
        <About />
        <Stats />
        <Stack />
        <Terminal />
        <Projects />
        <Infra />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
