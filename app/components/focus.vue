<template>
  <section ref="sectionRef" class="focus-section">
    <!-- Outer clipping wrapper -->
    <div ref="clipWrapperRef" class="focus-clip-wrapper">
      <!-- Layer 0: Full Tropical Palms & Terrace Ground -->
      <div ref="bgRef" class="focus-layer focus-layer--bg">
        <picture>
          <source srcset="/focus-tropical-bg.webp" type="image/webp" />
          <img
            src="/focus-tropical-bg.jpg"
            alt="Tropical palms background"
            class="focus-img focus-img--bg"
            draggable="false"
          />
        </picture>
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

      <!-- Layer 2: Editorial Headline Typography (Sandwiched behind the girl) -->
      <div ref="textRef" class="focus-layer focus-layer--text">
        <div class="focus-text-container">
          
          <h2 class="focus-title">
            <span class="focus-title__lead">Discover a living<br />experience</span>
          </h2>
        </div>
      </div>

      <!-- Layer 3: Foreground Woman Cutout (Occludes text, letting it rise from behind her) -->
      <div ref="womanRef" class="focus-layer focus-layer--woman" aria-hidden="true">
        <picture>
          <source srcset="/focus-tropical-cutout.webp" type="image/webp" />
          <img
            src="/focus-tropical-cutout.png"
            alt="Woman practicing yoga pose cutout"
            class="focus-img focus-img--woman"
            draggable="false"
          />
        </picture>
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
  }, sectionRef)
})

onBeforeUnmount(() => {
  if (ctx) ctx.revert()
})
</script>

<style scoped>
.focus-section {
  position: relative;
  width: 100%;
  aspect-ratio: 1672 / 941;
  margin-top: clamp(80px, 12vh, 180px);
  margin-bottom: clamp(80px, 12vh, 180px);
  
  height: auto;
  min-height: 0;
  background-color: #FAF4EA;
  overflow: hidden;
}

.focus-clip-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.focus-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.focus-img--bg,
.focus-img--woman {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;             
  object-position: center top;
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

.focus-img--woman {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center bottom;
  image-rendering: -webkit-optimize-contrast;
  display: block;
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
