<template>
  <section ref="heroEl" class="hero">
    <div class="hero__stage">
      <div class="hero__ring hero__ring--outer"></div>
      <div class="hero__ring hero__ring--inner"></div>

      <div ref="archEl" class="hero__arch">
        <img ref="imgEl" class="hero__img" src="/images/hero.png" alt="Aambal Resort" />
        <div class="hero__shade"></div>
      </div>

      <div class="hero__content">
        <h1>AAMBAL<br />RESORT</h1>
        <p>A place to return to.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
const introDone = useState('introDone', () => false)
import { gsap } from 'gsap'

const heroEl = ref(null)
const archEl = ref(null)
const imgEl = ref(null)

let ctx

// Three clip-path states. All use the same inset() shape so GSAP can blend them.
const ARCH_HIDDEN = 'inset(100vh 34vw 0vh 34vw round 16vw 16vw 0vw 0vw)' // zero height, offscreen
const ARCH_RISEN  = 'inset(45vh 34vw 0vh 34vw round 16vw 16vw 0vw 0vw)'  // arch peeking up
const ARCH_FULL   = 'inset(0vh 0vw 0vh 0vw round 0vw 0vw 0vw 0vw)'       // whole screen

const stopScroll = (e) => e.preventDefault()
const stopKeys = (e) => {
  const keys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ']
  if (keys.includes(e.key)) e.preventDefault()
}

function lockScroll() {
  window.addEventListener('wheel', stopScroll, { passive: false })
  window.addEventListener('touchmove', stopScroll, { passive: false })
  window.addEventListener('keydown', stopKeys)
}
function unlockScroll() {
  window.removeEventListener('wheel', stopScroll)
  window.removeEventListener('touchmove', stopScroll)
  window.removeEventListener('keydown', stopKeys)
}

onMounted(() => {
  window.scrollTo(0, 0)
  lockScroll()

  ctx = gsap.context(() => {
    const tl = gsap.timeline({
  onComplete: () => {
    unlockScroll()
    introDone.value = true
  },
    })

    // Phase 1: the arch and its rings rise from the bottom
    tl.fromTo(archEl.value, { clipPath: ARCH_HIDDEN }, {
      clipPath: ARCH_RISEN, duration: 1.4, ease: 'power3.out',
    }, 0.3)
      .fromTo('.hero__ring', { yPercent: 100 }, {
        yPercent: 0, duration: 1.4, ease: 'power3.out', stagger: 0.12,
      }, 0.3)
      .fromTo(imgEl.value, { scale: 0.65 }, { scale: 0.7, duration: 1.4, ease: 'power3.out' }, 0.3)

      // Phase 2: after a short pause, the arch opens to the full image
     .fromTo(archEl.value,
  { clipPath: ARCH_RISEN },
  { clipPath: ARCH_FULL, duration: 1.6, ease: 'power3.inOut', immediateRender: false },
  '+=0.4'
)
     .to(imgEl.value, { scale: 1, duration: 1.6, ease: 'power3.inOut' }, '<')
      .to('.hero__ring', { opacity: 0, duration: 0.5 }, '<')

      // Phase 3: text fades up
      .from('.hero__content > *', { y: 40, opacity: 0, duration: 0.9, ease: 'power2.out', stagger: 0.15 }, '-=0.5')
  }, heroEl.value)
})

onBeforeUnmount(() => {
  ctx && ctx.revert()
  unlockScroll()
})
</script>

<style scoped>
.hero {
  height: 100vh;
}

.hero__stage {
  position: relative;
  height: 100vh;
  overflow: hidden;
  background: var(--color-plum);
}

.hero__arch {
  position: absolute;
  inset: 0;
  z-index: 2;
  /* first paint = hidden, so the screen starts empty */
  clip-path: inset(100vh 34vw 0vh 34vw round 16vw 16vw 0vw 0vw);
  will-change: clip-path;
}

.hero__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform-origin: 50% 100%;
}

.hero__shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.45), transparent 55%);
}

/* the thin outline arches around the main arch */
.hero__ring {
  position: absolute;
  bottom: 0;
  z-index: 1;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-bottom: none;
  border-radius: 999px 999px 0 0; /* browser clamps this to a perfect semicircle */
}
.hero__ring--inner {
  left: calc(34vw - 1.2rem);
  right: calc(34vw - 1.2rem);
  height: calc(55vh + 1.2rem);
}
.hero__ring--outer {
  left: calc(34vw - 2.6rem);
  right: calc(34vw - 2.6rem);
  height: calc(55vh + 2.6rem);
}

.hero__content {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #fff;
  pointer-events: none;
}
.hero__content h1 {
  font-family: var(--font-heading);
  font-weight: 500;
  font-size: clamp(3.5rem, 12vw, 10rem);
  line-height: 0.9;
}
.hero__content p {
  margin-top: 1.5rem;
  font-family: var(--font-heading);
  font-size: clamp(1.2rem, 2.5vw, 2rem);
}
</style>