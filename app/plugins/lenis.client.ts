import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger)

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  })

  // Let ScrollTrigger recalculate positions every time Lenis moves the page
  lenis.on('scroll', ScrollTrigger.update)

  // Drive Lenis from GSAP's own frame loop instead of requestAnimationFrame directly,
  // so both stay in sync on the same clock
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)

  return {
    provide: { lenis },
  }
})