import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './Navbar'
import Hero from './Hero'
import Services from './Services'
import About from './About'
import Process from './Process'
import Contact from './Contact'
import CustomCursor from './CustomCursor'

gsap.registerPlugin(ScrollTrigger)

function App() {
  useEffect(() => {
    const lenis = new Lenis()

    lenis.on('scroll', ScrollTrigger.update)

    const ticker = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)
    
    return () => {
      lenis.destroy()
      gsap.ticker.remove(ticker)
    }
  }, [])

  return (
    <>
      <CustomCursor />
      <Navbar />
      <Hero />
      <Services />
      <About />
      <Process />
      <Contact />
    </>
  )
}

export default App
