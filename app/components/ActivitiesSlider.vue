<template>
  <section class="activities">
    <div class="activities__card">
      <!-- MEDIA -->
      <div class="activities__media">
        <div
          v-for="(s, i) in slides"
          :key="s.id"
          :ref="(el) => (wraps[i] = el)"
          class="activities__wrap"
        >
          <img
            :ref="(el) => (imgs[i] = el)"
            :src="s.image"
            :alt="s.bold"
            class="activities__img"
            :class="{ 'is-missing': missing[i] }"
            @error="missing[i] = true"
          />
          <span class="activities__caption">A quiet house in the country</span>
        </div>
      </div>

      <!-- PANEL -->
      <div class="activities__panel">
        <div class="activities__nav">
          <button class="activities__btn" aria-label="Previous activity" @click="prev">&#8592;</button>
          <button class="activities__btn" aria-label="Next activity" @click="next">&#8594;</button>
        </div>

        <div class="activities__text">
          <p ref="countEl" class="activities__count">
            {{ pad(index + 1) }} &nbsp;—&nbsp; {{ pad(slides.length) }}
          </p>
          <h2 class="activities__title">
            <span ref="italicEl" class="activities__italic">{{ current.italic }}</span>
            <span ref="boldEl" class="activities__bold">{{ current.bold }}</span>
          </h2>
          <p ref="descEl" class="activities__desc">{{ current.desc }}</p>
        </div>

        <div class="activities__track">
          <span ref="barEl" class="activities__bar" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'

// Images from assets/images/ (imported so Nuxt bundles and optimises them)
import grillingImg from '~/assets/images/grilling.jpeg'
import fishingImg from '~/assets/images/fishing.jpeg'
import weddingImg from '~/assets/images/wedding.jpeg'
import bdayImg from '~/assets/images/bday.jpeg'
import oldpeopleImg from '~/assets/images/oldpeople.jpeg'
import petsImg from '~/assets/images/pets.jpeg'
import badmintonImg from '~/assets/images/baddminton.jpeg'
import poolImg from '~/assets/images/pool.jpeg'

// Seconds each card stays on screen before auto-advancing
const DURATION = 5

const slides = [
  { id: 'grilling',  italic: 'Sizzling &',      bold: 'Grilling',           desc: 'Fire up the grill under open skies, with fresh flavours served beside the river.', image: grillingImg },
  { id: 'fishing',   italic: 'Quiet Waters &',  bold: 'Fishing',            desc: 'Cast a line at dawn and let the calm of the riverside set the pace of your day.', image: fishingImg },
  { id: 'wedding',   italic: 'Vows Under',      bold: 'Wedding Ceremonies', desc: 'Exchange vows in lush greenery, with elegant event spaces made for your special day.', image: weddingImg },
  { id: 'birthday',  italic: 'Candlelight &',   bold: 'Celebrations',       desc: 'Mark every birthday with music, laughter and a table set just for the occasion.', image: bdayImg },
  { id: 'elders',    italic: 'Time Well Spent', bold: 'With Our Elders',    desc: 'Stories, games and gentle laughter, creating memories for every generation.', image: oldpeopleImg },
  { id: 'pets',      italic: 'Happy Tails &',   bold: 'Pets',               desc: 'Bring your four-legged family along to romp across the open green spaces.', image: petsImg },
  { id: 'badminton', italic: 'Quick Rallies',   bold: 'Badminton',          desc: 'Serve, smash and share a laugh on our court surrounded by the greenery.', image: badmintonImg },
  { id: 'pool',      italic: 'Cool Off in',     bold: 'The Pool',           desc: 'Slip into the water and unwind, with the sound of the river as your soundtrack.', image: poolImg },
]

const index = ref(0)
const current = computed(() => slides[index.value])
const pad = (n) => String(n).padStart(2, '0')

// Tracks images that failed to load so the card background shows instead of a broken icon
const missing = ref({})

const wraps = []
const imgs = []
const countEl = ref(null)
const italicEl = ref(null)
const boldEl = ref(null)
const descEl = ref(null)
const barEl = ref(null)

let autoTween = null
let busy = false

/* ---------- AUTOPLAY (progress bar drives the timing) ---------- */
function startAuto() {
  autoTween?.kill()
  gsap.set(barEl.value, { scaleX: 0 })
  autoTween = gsap.to(barEl.value, {
    scaleX: 1,
    duration: DURATION,
    ease: 'none',
    onComplete: next,
  })
}

/* ---------- NAVIGATION ---------- */
function next() {
  goTo((index.value + 1) % slides.length, 1)
}
function prev() {
  goTo((index.value - 1 + slides.length) % slides.length, -1)
}
function goTo(i, dir = 1) {
  if (i === index.value || busy) return
  const from = index.value
  index.value = i
  startAuto()
  animate(from, i, dir)
}

/* ---------- TRANSITION ---------- */
function animate(from, to, dir) {
  busy = true
  const outEl = wraps[from]
  const inEl = wraps[to]
  const inImg = imgs[to]

  const hidden = dir > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)'
  const shown = 'inset(0% 0% 0% 0%)'

  // Stack order: outgoing sits underneath, incoming wipes over it
  wraps.forEach((w, k) => gsap.set(w, { zIndex: k === to ? 2 : k === from ? 1 : 0 }))
  gsap.set(inEl, { clipPath: hidden })

  const tl = gsap.timeline({
    onComplete: () => {
      gsap.set(outEl, { zIndex: 0 })
      busy = false
    },
  })

  tl.to(inEl, { clipPath: shown, duration: 1.1, ease: 'power3.inOut' }, 0)
  tl.fromTo(inImg, { scale: 1.15 }, { scale: 1, duration: 1.6, ease: 'power3.out' }, 0)

  // Text rises in after the DOM has updated
  nextTick(() => {
    gsap.fromTo(
      [countEl.value, italicEl.value, boldEl.value, descEl.value],
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out', delay: 0.5 }
    )
  })
}

/* ---------- LIFECYCLE ---------- */
onMounted(() => {
  wraps.forEach((w, k) => gsap.set(w, { zIndex: k === 0 ? 2 : 0 }))
  gsap.fromTo(imgs[0], { scale: 1.15 }, { scale: 1, duration: 1.6, ease: 'power3.out' })
  gsap.fromTo(
    [countEl.value, italicEl.value, boldEl.value, descEl.value],
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out', delay: 0.4 }
  )
  startAuto()
})

onBeforeUnmount(() => {
  autoTween?.kill()
})
</script>

<style scoped>
.activities {
  --card-bg: #ece4d4;
  --ink-dark: #12382a;
  --ink-muted: #5a6b5f;
  --curve: clamp(60px, 9vw, 130px);

  width: 100%;
  padding: 12vh 4vw clamp(9rem, 14vw, 13rem);
  background: var(--color-cream, #f7f2e9);

  position: relative;
  z-index: 2;
  margin-bottom: calc(-1 * var(--curve));
  border-radius: 0 0 var(--curve) var(--curve);

  display: flex;
  align-items: center;
  justify-content: center;
}

.activities__card {
  position: relative;
  width: 100%;
  max-width: 1280px;
  height: min(84vh, 720px);
  min-height: 620px;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  background: var(--card-bg);
  border: 1px solid rgba(18, 56, 42, 0.08);
  border-radius: 36px;
  overflow: hidden;
  box-shadow: 0 30px 60px -30px rgba(18, 56, 42, 0.25);
}

/* MEDIA */
.activities__media {
  position: relative;
  overflow: hidden;
  background: var(--card-bg);
}
.activities__wrap {
  position: absolute;
  inset: 0;
  clip-path: inset(0% 0% 0% 0%);
  will-change: clip-path;
  background: var(--card-bg);
}
.activities__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform-origin: center;
}
.activities__img.is-missing {
  display: none;
}

/* SECONDARY: caption */
.activities__caption {
  position: absolute;
  left: 24px;
  bottom: 22px;
  font-family: var(--font-body);        /* Proza Libre */
  font-size: 0.72rem;                   /* CAPTION SIZE */
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #fff;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.4);
}

/* PANEL */
.activities__panel {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2.5rem clamp(2rem, 4vw, 3.5rem);
  color: var(--ink-dark);
}

.activities__nav {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

/* SECONDARY: arrow buttons */
.activities__btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(18, 56, 42, 0.25);
  background: transparent;
  color: var(--ink-dark);
  font-family: var(--font-body);        /* Proza Libre */
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
  transition: background 0.3s, border-color 0.3s;
}
.activities__btn:hover {
  background: rgba(18, 56, 42, 0.08);
  border-color: var(--ink-dark);
}

.activities__text {
  margin-top: auto;
  margin-bottom: auto;
}

/* SECONDARY: counter */
.activities__count {
  font-family: var(--font-body);        /* Proza Libre */
  font-size: 0.75rem;                   /* COUNTER SIZE */
  letter-spacing: 0.25em;
  color: var(--ink-muted);
  margin-bottom: 1.5rem;
}

.activities__title {
  display: flex;
  flex-direction: column;
  line-height: 1;
  margin-bottom: 1.5rem;
}

/* PRIMARY: titles */
.activities__italic {
  font-family: var(--font-heading);     /* Cormorant Garamond */
  font-style: italic;
  font-weight: 500;
  font-size: clamp(3rem, 5.2vw, 4.8rem); /* TITLE SIZE */
  letter-spacing: -0.02em;
  color: var(--ink-dark);
}
.activities__bold {
  font-family: var(--font-heading);     /* Cormorant Garamond */
  font-weight: 600;
  font-size: clamp(3rem, 5.2vw, 4.8rem); /* TITLE SIZE */
  letter-spacing: -0.02em;
  color: var(--ink-dark);
}

/* SECONDARY: description */
.activities__desc {
  max-width: 380px;
  font-family: var(--font-body);        /* Proza Libre */
  font-size: 0.95rem;                   /* DESCRIPTION SIZE */
  line-height: 1.7;
  color: var(--ink-muted);
}

/* PROGRESS BAR */
.activities__track {
  height: 2px;
  width: 100%;
  background: rgba(18, 56, 42, 0.15);
  overflow: hidden;
}
.activities__bar {
  display: block;
  height: 100%;
  width: 100%;
  background: var(--ink-dark);
  transform-origin: left center;
  transform: scaleX(0);
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .activities__card {
    grid-template-columns: 1fr;
    grid-template-rows: 50vh auto;
    height: auto;
    min-height: 0;
  }
  .activities__panel {
    padding: 2rem 1.5rem 2.25rem;
  }
}
</style>