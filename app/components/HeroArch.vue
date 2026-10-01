<template>
  <section ref="heroEl" class="hero">
    <div class="hero__stage">
      <div class="hero__ring hero__ring--outer"></div>
      <div class="hero__ring hero__ring--inner"></div>

      <div ref="archEl" class="hero__arch">
        <img ref="imgEl" class="hero__img" src="/images/hero1.png" alt="Aambal Resort" />
        <div class="hero__shade"></div>
      </div>

      <div class="hero__content">
        <h1>AAMBAL<br />RESORT</h1>
        <p>where peace finds you</p>
      </div>

      <!-- dome overlay: rises over the still-pinned image, same timeline, guaranteed sync -->
  <div ref="domeEl" class="hero__dome">
  <div class="hero__dome-inner">
    <div class="about__center">
      <p class="about__statement">
  <span v-for="(word, i) in statementWords" :key="i" class="about__word">{{ word }}&nbsp;</span>
</p>
    </div>
  </div>
</div>
      </div>
  </section>
</template>

<script setup>
const statementWords = 'A serene riverside retreat embraced by lush greenery, Aambal Resort blends peaceful stays, elegant event spaces, and the beauty of nature to create a place where you can relax, reconnect, and celebrate lifes special moments.'.split(' ')
const { $lenis } = useNuxtApp()
const introDone = useState('introDone', () => false)
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const heroEl = ref(null)
const archEl = ref(null)
const imgEl = ref(null)
const domeEl = ref(null)

let panDistance = 0
function measurePan() {
  if (!imgEl.value || !heroEl.value) return
  const frameHeight = heroEl.value.getBoundingClientRect().height
  const imgHeight = imgEl.value.getBoundingClientRect().height
  panDistance = Math.max(0, imgHeight - frameHeight)
}

let ctx
let wordsRevealed = false

function revealWords() {
  if (wordsRevealed) return

  wordsRevealed = true

  gsap.to('.about__word', {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'power3.out',
    stagger: 0.05,
  })
}

const ARCH_HIDDEN = 'inset(100vh 34vw 0vh 34vw round 16vw 16vw 0vw 0vw)'
const ARCH_RISEN  = 'inset(45vh 34vw 0vh 34vw round 16vw 16vw 0vw 0vw)'
const ARCH_FULL   = 'inset(0vh 0vw 0vh 0vw round 0vw 0vw 0vw 0vw)'
const DOME_HIDDEN = 'inset(100vh 25vw 0vh 25vw round 50vw 50vw 0vw 0vw / 5vw 5vw 0vw 0vw)'
const DOME_FULL   = 'inset(0vh 0vw 0vh 0vw round 0vw 0vw 0vw 0vw)'

const stopScroll = (e) => e.preventDefault()
const stopKeys = (e) => {
  const keys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ']
  if (keys.includes(e.key)) e.preventDefault()
}
function lockScroll() {
  $lenis?.stop()
  window.addEventListener('wheel', stopScroll, { passive: false })
  window.addEventListener('touchmove', stopScroll, { passive: false })
  window.addEventListener('keydown', stopKeys)
}
function unlockScroll() {
  $lenis?.start()
  window.removeEventListener('wheel', stopScroll)
  window.removeEventListener('touchmove', stopScroll)
  window.removeEventListener('keydown', stopKeys)
}

onMounted(() => {
  window.scrollTo(0, 0)
  lockScroll()

  const startAnimations = () => {
    measurePan()

    ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          unlockScroll()
          introDone.value = true
        },
      })

      tl.fromTo(archEl.value, { clipPath: ARCH_HIDDEN }, {
        clipPath: ARCH_RISEN, duration: 1.4, ease: 'power3.out',
      }, 0.3)
        .fromTo('.hero__ring', { yPercent: 100 }, {
          yPercent: 0, duration: 1.4, ease: 'power3.out', stagger: 0.12,
        }, 0.3)
        .fromTo(imgEl.value, { scale: 0.65 }, { scale: 0.7, duration: 1.4, ease: 'power3.out' }, 0.3)
        .fromTo(archEl.value, { clipPath: ARCH_RISEN }, {
          clipPath: ARCH_FULL, duration: 1.6, ease: 'power3.inOut', immediateRender: false,
        }, '+=0.4')
        .to(imgEl.value, { scale: 1, duration: 1.6, ease: 'power3.inOut' }, '<')
        .to('.hero__ring', { opacity: 0, duration: 0.5 }, '<')
        .from('.hero__content > *', { y: 40, opacity: 0, duration: 0.9, ease: 'power2.out', stagger: 0.15 }, '-=0.5')

      // ONE ScrollTrigger drives every phase below, in strict order — nothing to fall out of sync
      ScrollTrigger.create({
  trigger: heroEl.value,
  start: 'top top',
  end: '+=280%', // slightly shorter than before, since there's only one reveal phase now
  pin: true,
  pinSpacing: true,
  scrub: true,
  animation: gsap.timeline()
    .to(imgEl.value, { y: -panDistance, ease: 'none', duration: 0.9 }, 0)
    .to('.hero__shade', { opacity: 0.75, ease: 'none', duration: 0.9 }, 0)
    .to('.hero__content', { yPercent: -150, ease: 'none', duration: 0.6 }, 0)
    .fromTo(domeEl.value,
      { clipPath: DOME_HIDDEN },
      { clipPath: DOME_FULL, ease: 'none', duration: 0.1, immediateRender: false },
      1.3
    )
    // the whole statement fades and scales in together, once the dome is fully open
.call(revealWords, [], 1.55),
})
    }, heroEl.value)
  }

  if (imgEl.value.complete) {
    startAnimations()
  } else {
    imgEl.value.addEventListener('load', startAnimations, { once: true })
  }
})

onBeforeUnmount(() => {
  ctx && ctx.revert()
  unlockScroll()
})
</script>

<style scoped>
.hero { width: 100%; height: 100vh; }
.hero__stage { position: relative; width: 100%; height: 100vh; overflow: hidden; background: var(--color-green); }

.hero__arch {
  position: absolute; inset: 0; z-index: 2;
  clip-path: inset(100vh 34vw 0vh 34vw round 16vw 16vw 0vw 0vw);
  will-change: clip-path;
}
.hero__img {
  position: absolute; top: 0; left: 0; width: 100%; height: auto; display: block;
  transform-origin: 50% 0%;
}
.hero__shade { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.45), transparent 55%); }

.hero__ring {
  position: absolute; bottom: 0; z-index: 1;
  border: 1px solid rgba(255,255,255,0.18); border-bottom: none;
  border-radius: 999px 999px 0 0;
}
.hero__ring--inner { left: calc(34vw - 1.2rem); right: calc(34vw - 1.2rem); height: calc(55vh + 1.2rem); }
.hero__ring--outer { left: calc(34vw - 2.6rem); right: calc(34vw - 2.6rem); height: calc(55vh + 2.6rem); }

.hero__content {
  position: absolute; inset: 0; z-index: 3;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; color: #fff; pointer-events: none;
}
.hero__content h1 { font-family: var(--font-heading); font-weight: 500; font-size: clamp(3.5rem, 12vw, 10rem); line-height: 0.9; }
.hero__content p {
  margin-top: 2.5rem;
  font-family: var(--font-script);
  font-size: clamp(2rem, 4vw, 2.7rem);
  font-weight: 400;
  line-height: 1;
  color: #fff;
}

/* the dome overlay — same pinned box, so it can never desync from the photo above */
.hero__dome {
  position: absolute;
  inset: 0;
  z-index: 4;
  background: var(--color-cream);
  clip-path: inset(100vh 0vw 0vh 0vw round 50vw 50vw 0vw 0vw / 10vw 10vw 0vw 0vw);
  will-change: clip-path;
  overflow: hidden;
}
.hero__dome-inner { padding: 12rem clamp(1.5rem, 6vw, 6rem) 5rem; }

.about__center {
  width: 100%;
  max-width: none;
  margin: 0 auto;
  padding: 0 4vw;
  text-align: center;
}

.about__statement {
  width: 100%;
  max-width: 1500px;
  margin: 0 auto;

  font-family: var(--font-heading);
  font-size: clamp(3rem, 5vw, 5.3rem);
  line-height: 1.37;
  letter-spacing: -0.02em;

  color: var(--color-gold);
}

.about__word {
  display: inline-block;
  opacity: 0;
  transform: translateY(15px);
}

</style>