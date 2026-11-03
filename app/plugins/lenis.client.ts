import Lenis from 'lenis'

export default defineNuxtPlugin(async (nuxtApp) => {
  const lenis = new Lenis({
    autoRaf: true,
  })

  const gsap = (await import('gsap')).default
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })

  gsap.ticker.lagSmoothing(0)
  lenis.options.autoRaf = false; 

  nuxtApp.provide('lenis', lenis)
})