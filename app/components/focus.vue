<template>
  <section ref="sectionRef" class="focus-section">
    <!-- Outer clipping wrapper -->
    <div ref="clipWrapperRef" class="focus-clip-wrapper">
      <!-- Layer 0: Tropical palms background -->
      <div ref="bgRef" class="focus-layer focus-layer--bg">
        <img
          src="/focus-tropical-bg2.png"
          alt="Tropical palms background"
          class="focus-img focus-img--bg"
          draggable="false"
        />
      </div>

      <!-- Layer 1: Architectural Geometric Vector Arches -->
      <div ref="linesRef" class="focus-layer focus-layer--lines" aria-hidden="true">
        <svg
          class="focus-svg-lines"
          viewBox="0 0 1440 1104"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMax meet"
        >
          <path
            d="M980 1104V669.124C980 642.484 978.266 552.72 907.75 495.387C850.399 448.758 779.433 434 702.559 434C625.685 434 554.719 448.758 497.369 495.387C426.852 552.72 425.118 642.484 425.118 669.124V1104"
            stroke="url(#focusLineGrad1)"
            stroke-opacity="0.22"
            stroke-width="1.2"
            vector-effect="non-scaling-stroke"
          />
          <path
            d="M720 0V508.006C720 548.453 717.366 684.744 610.234 771.795C523.105 842.592 415.291 865 298.5 865C181.709 865 73.8953 842.592 -13.2344 771.795C-120.366 684.744 -123 548.453 -123 508.006V0"
            stroke="url(#focusLineGrad2)"
            stroke-opacity="0.25"
            stroke-width="1.2"
            vector-effect="non-scaling-stroke"
          />
          <defs>
            <linearGradient id="focusLineGrad1" x1="369" y1="631" x2="825.168" y2="1151.17" gradientUnits="userSpaceOnUse">
              <stop offset="0" stop-color="#ffffff" />
              <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
            </linearGradient>
            <linearGradient id="focusLineGrad2" x1="578.544" y1="780.928" x2="262.168" y2="320.698" gradientUnits="userSpaceOnUse">
              <stop offset="0" stop-color="#ffffff" />
              <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <!-- Layer 2: Editorial Headline Typography (sandwiched behind the woman) -->
      <div ref="textRef" class="focus-layer focus-layer--text">
        <div class="focus-text-container">
          <h2 class="focus-title">
            <span class="focus-title__lead">Discover a living<br />experience</span>
          </h2>
        </div>
      </div>

      <!-- Layer 3: Foreground woman cutout (occludes text, letting it rise from behind her) -->
      <div ref="womanRef" class="focus-layer focus-layer--woman" aria-hidden="true">
        <img
          src="/focus-tropical-cutout2.png"
          alt="Woman practicing yoga pose cutout"
          class="focus-img focus-img--woman"
          draggable="false"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)
const clipWrapperRef = ref(null)
const bgRef = ref(null)
const womanRef = ref(null)
const textRef = ref(null)
const linesRef = ref(null)

let ctx = null

/* ───────────── pop-up reveal data (measured from the recording) ─────────────
   [panelTop / viewportHeight, content offset / viewportHeight] */
const KEYS = [
  [1.00, 0.209], [0.70, 0.207], [0.61, 0.198], [0.50, 0.185],
  [0.44, 0.176], [0.38, 0.168], [0.34, 0.164], [0.30, 0.161],
  [0.24, 0.152], [0.20, 0.146], [0.06, 0.087], [0.00, 0],
]

const sampleOffset = (t) => {
  if (t >= KEYS[0][0]) return KEYS[0][1]
  for (let i = 0; i < KEYS.length - 1; i++) {
    const [t1, v1] = KEYS[i]
    const [t2, v2] = KEYS[i + 1]
    if (t <= t1 && t >= t2) return v2 + (v1 - v2) * ((t - t2) / (t1 - t2))
  }
  return 0
}

onMounted(() => {
  ctx = gsap.context(() => {

    const landscapeTargets = [bgRef.value, womanRef.value]

    gsap.fromTo(
      landscapeTargets,
      { yPercent: -3 },
      {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      }
    )


    gsap.fromTo(
      textRef.value,
      { yPercent: 24, opacity: 0.8 },
      {
        yPercent: -26,
        opacity: 1,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      }
    )


    gsap.fromTo(
      linesRef.value,
      { yPercent: -2, opacity: 0.3 },
      {
        yPercent: 4,
        opacity: 0.7,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
        },
      }
    )

    /* ───────────── pop-up reveal (slides over the pinned section above) ───────────── */
    const secEl = sectionRef.value
    const wrapEl = clipWrapperRef.value

    const applyPopup = () => {
      const vh = window.innerHeight
      const top = Math.max(secEl.getBoundingClientRect().top, 0)

      // content lags below the panel edge, then settles to 0
      gsap.set(wrapEl, { y: sampleOffset(top / vh) * vh })

      // corner radius holds, then shrinks to 0 over the last ~9% of viewport travel
      const maxR = window.innerWidth < 768 ? 28 : 45
      const r = maxR * Math.min(top / (vh * 0.088), 1)
      secEl.style.borderRadius = `${r}px ${r}px 0 0`
    }

    ScrollTrigger.create({
      trigger: secEl,
      start: 'top bottom',
      end: 'top top',
      onUpdate: applyPopup,
      onRefresh: applyPopup,
      onToggle: applyPopup,
    })

    applyPopup()
  }, sectionRef)
})

onBeforeUnmount(() => {
  if (ctx) ctx.revert()
})
</script>

<style scoped>
.focus-section {
  position: relative;
  z-index: 1;                          /* sits above the pinned map behind it */
  width: 100%;
  aspect-ratio: 1672 / 941;
  margin-top: 0;
  margin-bottom: 0;

  height: auto;
  min-height: 0;
  background-color: #FAF4EA;
  border-radius: 45px 45px 0 0;        /* JS animates this down to 0 */
  box-shadow: 0 -30px 60px rgba(0, 0, 0, 0.18);
  overflow: hidden;
}

/* taller than the section by the max lag, so no cream band shows above the image */
.focus-clip-wrapper {
  position: absolute;
  top: -21vh;
  left: 0;
  width: 100%;
  height: calc(100% + 21vh);
  min-height: 0;
  overflow: hidden;
  will-change: transform;
}

.focus-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* the two images have different aspect ratios, so each is sized on its own */
.focus-img--bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.focus-img--woman {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center bottom;      /* keeps her feet and the floor at the bottom */
  display: block;
}

.focus-layer--text {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 24px;
}

.focus-text-container {
  max-width: 1400px;
  margin: 0 auto;
}

.focus-eyebrow {
  font-family: var(--font-body, 'Nunito Sans', sans-serif);
  font-size: clamp(12px, 1.2vw, 15px);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #d6995c;
  margin-bottom: clamp(26px, 2.5vw, 38px);
  opacity: 0.95;
  font-weight: 600;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.85);
}

.focus-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(56px, 9.5vw, 150px);
  line-height: 1.15;
  letter-spacing: -0.01em;
  font-weight: 400;
  color: #ffffff;
  margin: 0;
  text-shadow: 0 4px 36px rgba(0, 0, 0, 0.85), 0 2px 12px rgba(0, 0, 0, 0.7);
}

.focus-title__lead {
  display: block;
  font-family: 'Playfair Display', serif;
  color: #f7ede2;
}

.focus-title__accent {
  display: block;
  font-family: 'Playfair Display', serif;
  font-style: italic;
  color: #d6995c;
  font-weight: 400;
  margin-top: 0.25em;
}


.focus-layer--woman {
  z-index: 3;
  overflow: hidden;
  will-change: transform;
}

@media (max-width: 768px) {
  .focus-title {
    font-size: clamp(30px, 7.5vw, 44px);
    line-height: 1.2;
  }

  .focus-eyebrow {
    font-size: 12px;
    letter-spacing: 0.25em;
  }
}
</style>