<template>
  <section ref="sectionEl" class="intro">
    <p ref="lineEl" class="intro__line">A place to live —</p>
    <h2 ref="headingEl" class="intro__heading">to return to, year after year.</h2>
  </section>
</template>

<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const sectionEl = ref(null)
const lineEl = ref(null)
const headingEl = ref(null)
let ctx

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from([lineEl.value, headingEl.value], {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: sectionEl.value,
        start: 'top 75%', // fires when the section's top reaches 75% down the viewport
      },
    })
  }, sectionEl.value)
})

onBeforeUnmount(() => ctx && ctx.revert())
</script>

<style scoped>
.intro {
  position: relative;
  z-index: 4; /* sits above the pinned hero underneath it */
  min-height: 100vh;
  background: var(--color-cream);
  border-radius: 2rem 2rem 0 0; /* soft edge as it slides up over the hero */
  padding: 8rem clamp(1.5rem, 6vw, 6rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
}
.intro__line {
  font-family: var(--font-heading);
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  color: var(--color-green);
  opacity: 0.7;
}
.intro__heading {
  font-family: var(--font-heading);
  font-size: clamp(2.5rem, 6vw, 5rem);
  line-height: 1.1;
  color: var(--color-green);
  max-width: 20ch;
}
</style>