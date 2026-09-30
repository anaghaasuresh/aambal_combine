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

      <!-- dome overlay: rises over the still-pinned image, same timeline, guaranteed sync -->
      <div ref="domeEl" class="hero__dome">
        <div class="hero__dome-inner">
          <div class="about__center">
            <h2 class="about__title">About <em>Aambal Resort &amp; Events</em></h2>
            <div class="about__divider"></div>
            <p class="about__lead">A peaceful riverside retreat where nature, comfort, and celebrations come together.</p>
            <p class="about__body">Nestled along the river and surrounded by lush greenery, Aambal Resort offers a tranquil escape from everyday life. With cozy cottages and thoughtfully designed event spaces, it is a place to relax, reconnect, and create memorable moments.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
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
        end: '+=220%',
        pin: true,
        pinSpacing: true,
        scrub: true,
        animation: gsap.timeline()
          // phase A (0 – 0.9): pan reveals the full photo
          .to(imgEl.value, { y: -panDistance, ease: 'none', duration: 0.9 }, 0)
          .to('.hero__shade', { opacity: 0.75, ease: 'none', duration: 0.9 }, 0)
          .to('.hero__content', { yPercent: -150, ease: 'none', duration: 0.6 }, 0)
          // phase B (0.9 – 1.3): nothing happens — sticky hold, photo fully visible
          // phase C (1.3 – 2.3): dome rises over the still-static photo
          .fromTo(domeEl.value,
            { clipPath: DOME_HIDDEN },
            { clipPath: DOME_FULL, ease: 'none', duration: 1, immediateRender: false },
            1.3
          ),
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
.hero__content p { margin-top: 1.5rem; font-family: var(--font-heading); font-size: clamp(1.2rem, 2.5vw, 2rem); }

/* the dome overlay — same pinned box, so it can never desync from the photo above */
.hero__dome {
  position: absolute; inset: 0; z-index: 4;
  background: var(--color-white);
  clip-path: inset(100vh 0vw 0vh 0vw round 50vw 50vw 0vw 0vw / 10vw 10vw 0vw 0vw);
  will-change: clip-path;
  overflow-y: auto;
}
.hero__dome-inner { padding: 8rem clamp(1.5rem, 6vw, 6rem) 5rem; }

.about__title {
  text-align: center;
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--color-green);
  margin-bottom: 1.25rem;
}
.about__title em { font-style: normal; color: var(--color-gold); }

.about__divider {
  width: 50px;
  height: 1px;
  background: var(--color-gold);
  margin: 0 auto 1.75rem;
}

.about__lead {
  font-family: var(--font-heading);
  font-size: clamp(1.3rem, 2.2vw, 1.7rem);
  line-height: 1.4;
  color: var(--color-green);
  margin-bottom: 1.5rem;
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
}

.about__body {
  font-family: var(--font-body);
  font-size: clamp(0.95rem, 1.1vw, 1.05rem);
  line-height: 1.85;
  color: var(--color-green);
  max-width: 480px;
  margin: 0 auto;
}



</style>