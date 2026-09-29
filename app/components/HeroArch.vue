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
          <h2 class="about__title">About <em>Aambal Resort &amp; Events</em></h2>
          <div class="about__divider"></div>
          <div class="about__grid">
            <div class="about__media">
              <img src="/images/hero.png" alt="Aerial view of Aambal Resort" />
              <button class="about__play" type="button" aria-label="Play video">▶</button>
            </div>
            <div class="about__copy">
              <h3>Discover tranquility at our riverside resort with versatile event spaces &amp; charming cottages.</h3>
              <p>Nestled on the pristine banks of a picturesque river, our riverfront resort is a hidden gem offering a serene escape masterfully crafted by Nature Holidays and Events.</p>
              <p>With charming cottages, we offer an intimate and exclusive retreat for those seeking tranquility. But that's not all — our resort is not just about relaxation; it's also a place for celebrations and gatherings.</p>
              <ul>
                <li>Offers an intimate and peaceful getaway, where the soothing river melodies are your constant companion.</li>
                <li>Hosting your special event at our resort means combining natural beauty with sophistication.</li>
                <li>Experience the warmth of our charming cottages, each thoughtfully designed for comfort and style.</li>
              </ul>
            </div>
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
const DOME_HIDDEN = 'inset(100vh 0vw 0vh 0vw round 50vw 50vw 0vw 0vw / 10vw 10vw 0vw 0vw)'
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
.hero__stage { position: relative; width: 100%; height: 100vh; overflow: hidden; background: var(--color-plum); }

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
  background: var(--color-cream);
  clip-path: inset(100vh 0vw 0vh 0vw round 50vw 50vw 0vw 0vw / 10vw 10vw 0vw 0vw);
  will-change: clip-path;
  overflow-y: auto;
}
.hero__dome-inner { padding: 8rem clamp(1.5rem, 6vw, 6rem) 5rem; }

.about__title { text-align: center; font-family: var(--font-heading); font-size: clamp(2rem, 4vw, 3rem); color: var(--color-green); margin-bottom: 1.5rem; }
.about__title em { font-style: normal; color: var(--color-gold); }
.about__divider { width: 60%; max-width: 500px; margin: 0 auto 4rem; border-top: 1px dashed rgba(15,59,45,0.3); }
.about__grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(2rem, 5vw, 5rem); align-items: center; }
.about__media { position: relative; aspect-ratio: 4/3; border-radius: 1rem; overflow: hidden; }
.about__media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.about__play { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 64px; height: 64px; border-radius: 50%; border: none; background: var(--color-gold); color: #fff; font-size: 1.1rem; cursor: pointer; }
.about__copy h3 { font-family: var(--font-heading); font-size: clamp(1.4rem, 2.5vw, 2rem); color: var(--color-green); margin-bottom: 1.2rem; line-height: 1.3; }
.about__copy p { color: rgba(15,59,45,0.75); line-height: 1.7; margin-bottom: 1rem; }
.about__copy ul { list-style: none; margin-top: 1.5rem; display: grid; gap: 0.9rem; }
.about__copy li { padding-left: 1.6rem; position: relative; color: var(--color-green); }
.about__copy li::before { content: '✓'; position: absolute; left: 0; color: var(--color-gold); }

@media (max-width: 800px) { .about__grid { grid-template-columns: 1fr; } }
</style>