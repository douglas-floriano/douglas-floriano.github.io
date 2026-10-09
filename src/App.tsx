import { useEffect } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Cases from './components/Cases'
import Others from './components/Others'
import HowIWork from './components/HowIWork'
import Stack from './components/Stack'
import Journey from './components/Journey'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  // links antigos no formato #projeto/slug levam para o case correspondente
  useEffect(() => {
    const m = window.location.hash.match(/^#projeto\/(.+)$/)
    if (!m) return
    const slug = decodeURIComponent(m[1]) === 'loteia' ? 'lotemobile' : decodeURIComponent(m[1])
    const el = document.getElementById(slug)
    if (el) {
      history.replaceState(null, '', `#${slug}`)
      el.scrollIntoView()
    }
  }, [])

  return (
    <>
      <a href="#projetos" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[90] focus:bg-amber focus:text-bg focus:px-3 focus:py-2 focus:rounded">
        Pular para os projetos
      </a>
      <Nav />
      <main>
        <Hero />
        <Cases />
        <Others />
        <HowIWork />
        <Stack />
        <Journey />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
