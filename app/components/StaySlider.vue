<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Slide = {
  id: string
  title: string
  image: string
  stats: { label: string; value: string }[]
  text: string
  cta: string
  to: string
}

const props = defineProps({
  target: { type: String, default: '.reveal-map' }, // the map section this one slides over
  interval: { type: Number, default: 5000 },         // ms each slide stays on screen
})

// PLACEHOLDERS: replace images, stats, text and links with your real content.
// Use portrait photos (about 3:4).
const SLIDES: Slide[] = [
  {
    id: 'cottages',
    title: 'Cottages',
    image: 'https://images.unsplash.com/photo-1759389964108-1940ff61db0e?w=900&h=1200&fit=crop&auto=format',
    stats: [
      { label: 'Sleeps', value: '2 — 4' },
      { label: 'Setting', value: 'Riverside' },
    ],
    text: 'Heritage-style cottages nestled in coconut groves along the waterfront, made for slow mornings and quiet evenings.',
    cta: 'Explore Cottages',
    to: '/cottages',
  },
  {
    id: 'events',
    title: 'Event Space',
    image: 'https://images.unsplash.com/photo-1650965171703-087486b3a1b0?w=900&h=1200&fit=crop&auto=format',
    stats: [
      { label: 'Capacity', value: 'Up to 300' },
      { label: 'Setting', value: 'Open-air' },
    ],
    text: 'Open-air pavilions for weddings, retreats and private gatherings, framed by the river and the greenery.',
    cta: 'Explore Events',
    to: '/events',
  },
  {
    id: 'garden',
    title: 'Garden & Lawn',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=900&h=1200&fit=crop&auto=format',
    stats: [
      { label: 'Best for', value: 'Gatherings' },
      { label: 'Setting', value: 'Lawns' },
    ],
    text: 'Open green lawns and landscaped gardens for walks, celebrations and long afternoons by the water.',
    cta: 'Explore Gardens',
    to: '/gardens',
  },
]

const total = SLIDES.length
const SLANT = 14 // slant of the photo wipe edge (% of the photo width)

const shell = ref<HTMLElement | null>(null)
const root = ref<HTMLElement | null>(null)
const inner = ref<HTMLElement | null>(null)
const counterEl = ref<HTMLElement | null>(null)
const barEl = ref<HTMLElement | null>(null)

// Constant references, so Vue never re-applies them over GSAP's inline styles
const HIDDEN = { visibility: 'hidden' } as const
const BAR_START = { transform: `scaleX(${1 / total})` }

let current = 0
let busy = false
let tl: gsap.core.Timeline | null = null
let io: IntersectionObserver | null = null
let ctx: gsap.Context | null = null
let refreshTimer: ReturnType<typeof setTimeout> | null = null
let autoTimer: gsap.core.Tween | null = null

const reduce = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// ---------- DOM helpers ----------
const q = (sel: string) => Array.from(root.value!.querySelectorAll<HTMLElement>(sel))
const photo = (i: number) => root.value!.querySelector<HTMLElement>(`[data-photo="${i}"]`)!
const titleBox = (i: number) => root.value!.querySelector<HTMLElement>(`[data-title="${i}"]`)!
const letters = (i: number) => q(`[data-title="${i}"] .ch`)
const infoBoxes = (i: number) => q(`[data-info="${i}"]`)
const units = (i: number) => q(`[data-info="${i}"] .u`)

// slanted wipe edge: p goes 0 -> 1
const clip = (p: number, dir: number) => {
  if (dir > 0) {
    const e = 100 - p * (100 + SLANT) // enters from the right
    return `polygon(${e}% 0%, 100% 0%, 100% 100%, ${e + SLANT}% 100%)`
  }
  const e = p * (100 + SLANT) // enters from the left
  return `polygon(0% 0%, ${e}% 0%, ${e - SLANT}% 100%, 0% 100%)`
}

// ---------- autoplay ----------
function stopAuto() {
  autoTimer?.kill()
  autoTimer = null
}

// starts the countdown to the next slide. Called again after every move,
// so a manual click restarts the 5 seconds instead of being skipped.
function startAuto() {
  stopAuto()
  if (busy || reduce()) return
  autoTimer = gsap.delayedCall(props.interval / 1000, () => {
    autoTimer = null
    next()
  })
}

// ---------- slide transition ----------
function go(to: number, dir: number) {
  if (busy || to === current || !root.value) return
  busy = true
  stopAuto()
  const from = current

  const nextP = photo(to)
  const prevP = photo(from)
  const nextImg = nextP.querySelector('img')!
  const prevImg = prevP.querySelector('img')!

  const finish = () => {
    gsap.set(prevP, { autoAlpha: 0, zIndex: 0 })
    gsap.set(nextP, { zIndex: 1, clipPath: 'none' })
    gsap.set(prevImg, { xPercent: 0, scale: 1 })
    gsap.set(titleBox(from), { autoAlpha: 0 })
    infoBoxes(from).forEach((el) => gsap.set(el, { autoAlpha: 0 }))
    current = to
    busy = false
    startAuto() // the next countdown starts once this slide is fully in
  }

  const setCounter = () => {
    if (counterEl.value) counterEl.value.textContent = String(to + 1)
  }

  // reduced motion: swap instantly
  if (reduce()) {
    gsap.set(nextP, { autoAlpha: 1, clipPath: 'none' })
    gsap.set(titleBox(to), { autoAlpha: 1 })
    gsap.set(letters(to), { opacity: 1, yPercent: 0, skewX: 0 })
    infoBoxes(to).forEach((el) => gsap.set(el, { autoAlpha: 1 }))
    gsap.set(units(to), { yPercent: 0, opacity: 1 })
    gsap.set(barEl.value, { scaleX: (to + 1) / total })
    setCounter()
    finish()
    return
  }

  // prepare the incoming slide
  gsap.set(nextP, { autoAlpha: 1, zIndex: 2, clipPath: clip(0, dir) })
  gsap.set(prevP, { zIndex: 1 })
  gsap.set(nextImg, { scale: 1.25 })
  gsap.set(titleBox(to), { autoAlpha: 1 })
  gsap.set(letters(to), { opacity: 0, yPercent: 40, skewX: 10 })
  infoBoxes(to).forEach((el) => gsap.set(el, { autoAlpha: 1 }))
  gsap.set(units(to), { yPercent: 110, opacity: 0 })

  const wipe = { p: 0 }

  tl = gsap.timeline({ onComplete: finish })

  tl
    // 1. old title letters leave, left to right
    .to(letters(from), {
      opacity: 0, yPercent: -30, skewX: -8,
      duration: 0.45, ease: 'power2.in', stagger: 0.025,
    }, 0)
    // 2. old text slides up out of its masks
    .to(units(from), {
      yPercent: -110, opacity: 0,
      duration: 0.5, ease: 'power2.in', stagger: 0.05,
    }, 0)
    // 3. photo wipe with a slanted edge, plus a little parallax
    .to(wipe, {
      p: 1, duration: 1.2, ease: 'power3.inOut',
      onUpdate: () => { nextP.style.clipPath = clip(wipe.p, dir) },
    }, 0.15)
    .to(nextImg, { scale: 1, duration: 1.5, ease: 'power3.out' }, 0.15)
    .to(prevImg, { xPercent: -10 * dir, duration: 1.2, ease: 'power3.inOut' }, 0.15)
    // 4. new title letters rise in, left to right
    .to(letters(to), {
      opacity: 1, yPercent: 0, skewX: 0,
      duration: 0.85, ease: 'power3.out', stagger: 0.035,
    }, 0.75)
    // 5. new text slides up into its masks
    .to(units(to), {
      yPercent: 0, opacity: 1,
      duration: 0.85, ease: 'power3.out', stagger: 0.08,
    }, 0.95)
    // 6. pager
    .to(barEl.value, { scaleX: (to + 1) / total, duration: 1.2, ease: 'power3.inOut' }, 0.15)
    .call(setCounter, [], 0.6)
}

const next = () => go((current + 1) % total, 1)
const prev = () => go((current - 1 + total) % total, -1)

// a click on an arrow or a swipe counts as a manual move, so the countdown restarts from there
const manualNext = () => { next() }
const manualPrev = () => { prev() }

// swipe
let startX = 0
const onDown = (e: PointerEvent) => { startX = e.clientX }
const onUp = (e: PointerEvent) => {
  const dx = e.clientX - startX
  if (Math.abs(dx) > 50) (dx < 0 ? manualNext : manualPrev)()
}

// ---------- the "slides over the map" reveal ----------
function setupReveal() {
  if (reduce() || !shell.value || !inner.value) return

  const mapEl = document.querySelector<HTMLElement>(props.target)

  ctx = gsap.context(() => {
    // 1. keep the map pinned while this section scrolls up over it (map stays fully bright)
    if (mapEl) {
      ScrollTrigger.create({
        trigger: mapEl,
        start: 'bottom bottom',
        end: () => '+=' + window.innerHeight,
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      })
    }

    // 2. the content rises as the section comes up over the map
    gsap.fromTo(
      inner.value,
      { y: 90 },
      {
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: shell.value,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    )
  }, shell.value)

  // the map's height depends on its image, so measure again once everything has loaded
  const refresh = () => ScrollTrigger.refresh()
  if (document.readyState !== 'complete') window.addEventListener('load', refresh, { once: true })
  refreshTimer = setTimeout(refresh, 600)
}

onMounted(() => {
  if (!root.value) return

  setupReveal()

  if (reduce()) return

  // intro: first slide's title and text appear when the section scrolls into view
  gsap.set(letters(0), { opacity: 0, yPercent: 40, skewX: 10 })
  gsap.set(units(0), { yPercent: 110, opacity: 0 })

  io = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (!entry?.isIntersecting) return
      io?.disconnect()
      gsap.to(letters(0), {
        opacity: 1, yPercent: 0, skewX: 0,
        duration: 0.9, ease: 'power3.out', stagger: 0.04,
      })
      gsap.to(units(0), {
        yPercent: 0, opacity: 1,
        duration: 0.9, ease: 'power3.out', stagger: 0.08, delay: 0.25,
      })
      startAuto() // autoplay begins once the first slide has come in
    },
    { threshold: 0.3 },
  )
  io.observe(root.value)
})

onBeforeUnmount(() => {
  io?.disconnect()
  stopAuto()
  tl?.kill()
  ctx?.revert() // removes the pin and resets inline styles
  if (refreshTimer) clearTimeout(refreshTimer)
})
</script>

<template>
  <div ref="shell" class="shell">
    <section
      ref="root"
      class="stay"
      tabindex="0"
      aria-roledescription="carousel"
      @keydown.left.prevent="prev"
      @keydown.right.prevent="next"
    >
      <div ref="inner" class="inner">
        <div class="stage" @pointerdown="onDown" @pointerup="onUp">
          <!-- left: stats (all slides stacked in one grid cell) -->
          <div class="side left stack">
            <div
              v-for="(s, i) in SLIDES"
              :key="s.id"
              class="info"
              :data-info="i"
              :style="i === 0 ? undefined : HIDDEN"
            >
              <div v-for="st in s.stats" :key="st.label" class="stat">
                <div class="m"><div class="u stat-label">{{ st.label }}</div></div>
                <div class="m"><div class="u stat-value">{{ st.value }}</div></div>
              </div>
            </div>
          </div>

          <!-- center: photo + overlapping title -->
          <div class="frame-wrap">
            <div class="frame">
              <div
                v-for="(s, i) in SLIDES"
                :key="s.id"
                class="ph"
                :data-photo="i"
                :style="i === 0 ? undefined : HIDDEN"
              >
                <img :src="s.image" :alt="s.title" draggable="false" :loading="i === 0 ? 'eager' : 'lazy'" />
              </div>
            </div>

            <!-- titles live outside the frame so they can hang over its bottom edge -->
            <div class="titles" aria-hidden="true">
              <div
                v-for="(s, i) in SLIDES"
                :key="s.id"
                class="t"
                :data-title="i"
                :style="i === 0 ? undefined : HIDDEN"
              >
                <span v-for="(ch, k) in Array.from(s.title)" :key="k" class="ch">{{ ch === ' ' ? '\u00a0' : ch }}</span>
              </div>
            </div>

            <h2 class="sr-only">{{ SLIDES.map((s) => s.title).join(', ') }}</h2>
          </div>

          <!-- right: text + button -->
          <div class="side right stack">
            <div
              v-for="(s, i) in SLIDES"
              :key="s.id"
              class="info"
              :data-info="i"
              :style="i === 0 ? undefined : HIDDEN"
            >
              <div class="m"><p class="u desc">{{ s.text }}</p></div>
              <div class="m m--btn"><div class="u"><NuxtLink :to="s.to" class="cta">{{ s.cta }}</NuxtLink></div></div>
            </div>
          </div>
        </div>

        <!-- pagination -->
        <div class="pager">
          <button class="arrow" type="button" aria-label="Previous" @click="manualPrev">
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none"><path d="M7 1L2 6l5 5" stroke="currentColor" stroke-width="1.3" /></svg>
          </button>
          <span ref="counterEl" class="count">1</span>
          <div class="bar"><i ref="barEl" :style="BAR_START" /></div>
          <span class="count">{{ total }}</span>
          <button class="arrow" type="button" aria-label="Next" @click="manualNext">
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none"><path d="M1 1l5 5-5 5" stroke="currentColor" stroke-width="1.3" /></svg>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* no shadow, so nothing spills onto the section below */
.shell {
  position: relative;
  z-index: 5; /* above the map (z-index: 2) */
}

.stay {
  /* same theme variables as the hero */
  --bg: var(--color-cream, #f4efe6);
  --ink: var(--color-green, #24382c);
  --gold: var(--color-gold, #d4900f);
  --title: var(--gold);                        /* big title colour: change to var(--ink) for dark green */
  --line: color-mix(in srgb, var(--ink) 22%, transparent);
  --tsize: clamp(2.2rem, 5vw, 5.5rem);         /* title size */
  --radius: clamp(32px, 4vw, 64px);            /* curve of the top corners */
  --space-below: clamp(140px, 24vh, 260px);    /* empty space between this section and Places */

  position: relative;
  background: var(--bg);
  color: var(--ink);
  font-family: inherit;
  padding: clamp(80px, 12vh, 160px) clamp(1rem, 5vw, 5rem) var(--space-below);
  border-radius: var(--radius) var(--radius) 0 0; /* curved top edge, flat bottom */
  overflow: hidden;
  outline: none;
}

.inner { will-change: transform; }

.sr-only {
  position: absolute; width: 1px; height: 1px; overflow: hidden;
  clip: rect(0 0 0 0); white-space: nowrap;
}

/* ---------- layout ---------- */
.stage {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: clamp(1.5rem, 4vw, 4rem);
  max-width: 1500px;
  margin: 0 auto;
  touch-action: pan-y;
}

.side { min-width: 0; }
.left  { justify-self: start; padding-left: clamp(0rem, 3vw, 3rem); }
.right { justify-self: start; max-width: 24rem; }

/* every slide's text sits in the same grid cell; GSAP shows one at a time */
.stack { display: grid; }
.stack > .info { grid-area: 1 / 1; }

/* masks: text slides up from behind these */
.m { overflow: hidden; padding-bottom: 0.12em; margin-bottom: -0.12em; }
.u { will-change: transform, opacity; }

/* ---------- stats ---------- */
.stat { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 2.2rem; }
.stat-label {
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink);
  opacity: 0.65;
}
.stat-value {
  font-family: var(--font-heading, Georgia, serif);
  font-size: clamp(2rem, 3.2vw, 3rem);
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--gold);
}

/* ---------- text + button ---------- */
.desc {
  margin: 0 0 1.8rem;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--ink);
  opacity: 0.85;
}
.m--btn { padding: 2px; margin: -2px; } /* keeps the button border from being clipped */
.cta {
  display: inline-block;
  padding: 0.95rem 1.9rem;
  border: 1px solid var(--gold);
  border-radius: 999px;
  color: var(--gold);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  text-decoration: none;
  transition: background 0.35s ease, color 0.35s ease;
}
.cta:hover { background: var(--gold); color: var(--bg); }

/* ---------- photo frame ---------- */
.frame-wrap {
  position: relative;
  width: clamp(260px, 29vw, 440px);
  aspect-ratio: 3 / 4;
}

.frame {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: var(--ink);
}

.ph {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
  will-change: clip-path;
}
.ph:first-child { z-index: 1; }
.ph img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  user-select: none;
  will-change: transform;
}

/* ---------- overlapping title (hero heading font) ---------- */
.titles {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -0.1em;
  height: 0.95em;
  z-index: 3;
  font-family: var(--font-heading, Georgia, serif);
  font-size: var(--tsize);
  font-weight: 500;
  line-height: 0.9;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  color: var(--title);
  pointer-events: none;
}
.t {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  display: flex;
  white-space: nowrap;
}
.ch {
  display: inline-block;
  transform-origin: 50% 100%;
  will-change: transform, opacity;
}

/* ---------- pagination ---------- */
.pager {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.1rem;
  margin-top: clamp(3.5rem, 8vh, 6rem);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--ink);
}
.arrow {
  display: grid;
  place-items: center;
  width: 2.2rem;
  height: 2.2rem;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--ink);
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;
}
.arrow:hover { background: color-mix(in srgb, var(--gold) 16%, transparent); color: var(--gold); }
.arrow:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }

.bar { position: relative; width: clamp(110px, 14vw, 190px); height: 1px; background: var(--line); }
.bar i {
  position: absolute;
  inset: 0;
  background: var(--gold);
  transform-origin: left;
}

/* ---------- tablet / mobile ---------- */
@media (max-width: 900px) {
  .stay { --tsize: clamp(2.2rem, 10vw, 4.2rem); }
  .stage { grid-template-columns: 1fr; justify-items: center; gap: 2.2rem; }
  .frame-wrap { width: min(78vw, 380px); margin-bottom: 1.2rem; }
  .left, .right { justify-self: center; text-align: center; padding-left: 0; max-width: 28rem; }
  .left .info { display: flex; justify-content: center; gap: 2.5rem; }
  .stat { align-items: center; margin-bottom: 0; }
}
</style>