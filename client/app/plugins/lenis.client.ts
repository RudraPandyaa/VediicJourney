import Lenis from 'lenis'
import gsap from 'gsap'

export default defineNuxtPlugin(() => {
  const lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1
  })

  const updateLenis = (time: number) => {
    lenis.raf(time * 1000)
  }

  gsap.ticker.add(updateLenis)
  gsap.ticker.lagSmoothing(0)

  onScopeDispose(() => {
    gsap.ticker.remove(updateLenis)
    lenis.destroy()
  })

  return {
    provide: {
      lenis
    }
  }
})