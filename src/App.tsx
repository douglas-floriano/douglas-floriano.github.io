import Nav from './components/Nav'
import Hero from './components/Hero'
import Now from './components/Now'
import Work from './components/Work'
import Stack from './components/Stack'
import Approach from './components/Approach'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="relative grain min-h-screen bg-paper text-ink overflow-x-hidden">
      <Nav />
      <main>
        <Hero />
        <Now />
        <Work />
        <Stack />
        <Approach />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
