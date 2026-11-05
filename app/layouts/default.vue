<template>
  <div class="layout-root">
    <!-- 1. Pinned Background Footer at z-index 1 -->
    <!-- opacity/visibility are driven by GSAP (scrubbed with progress), NOT by Vue bindings -->
    <div
      class="footer-wrapper"
      ref="footerWrapperRef"
      :style="{ pointerEvents: footerActive ? 'auto' : 'none' }"
    >
      <Footer ref="footerCompRef" />
    </div>

    <!-- 2. Main Page Content at z-index 2 -->
    <div
      class="main-content"
      ref="mainContentRef"
      :style="{ paddingBottom: paddingHeight + 'px' }"
    >
      <AppNavbar />
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useNuxtApp } from '#app'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
  // Mobile URL-bar show/hide fires resize; don't let it rebuild triggers mid-scroll
  ScrollTrigger.config({ ignoreMobileResize: true })
}

// Grab Nuxt context at setup time (calling useNuxtApp after an `await` can lose context)
const { $lenis } = useNuxtApp()

const footerWrapperRef = ref(null)
const footerCompRef = ref(null)
const mainContentRef = ref(null)

const paddingHeight = ref(0)
const transitionDistance = ref(0)
const footerActive = ref(false)

// Fraction of the scroll range over which the green footer panel fades in/out
const PANEL_FADE_RANGE = 0.25

let ctx = null
let resizeTimer = null

async function updateSizes() {
  if (typeof window === 'undefined') return
  const vh = window.innerHeight
  // Distance needed to bring the bottom of the review section above the footer
  const travelDist = vh * 0.78
  // Buffer so the review section stays fully in view at rest first
  const bufferDist = vh * 0.45

  transitionDistance.value = travelDist
  paddingHeight.value = travelDist + bufferDist

  await nextTick()
  ScrollTrigger.refresh()
  if ($lenis) $lenis.resize()
}

function onResize() {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(updateSizes, 150)
}

onMounted(async () => {
  await nextTick()
  if (typeof window === 'undefined') return

  await updateSizes()
  window.addEventListener('resize', onResize)

  ctx = gsap.context(() => {
    const main = mainContentRef.value
    const wrapper = footerWrapperRef.value
    if (!main || !wrapper) return

    // Hidden at rest; fully controlled by scroll progress from here on
    gsap.set(wrapper, { opacity: 0, visibility: 'hidden' })

    // Review section (.gs) at the bottom of the page
    const reviewEl = main.querySelector('.gs')

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: main,
        start: () => `bottom-=${transitionDistance.value} bottom`,
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress

          // Smooth fade in BOTH directions (no on/off snap)
          gsap.set(wrapper, {
            opacity: Math.min(1, p / PANEL_FADE_RANGE),
            visibility: p > 0 ? 'visible' : 'hidden',
          })

          footerActive.value = p > 0.35
          footerCompRef.value?.setAnimationProgress?.(p)
        },
        onLeaveBack: () => {
          gsap.set(wrapper, { opacity: 0, visibility: 'hidden' })
          footerActive.value = false
          footerCompRef.value?.setAnimationProgress?.(0)
        },
      },
    })

    // Clip ONLY the review section into a floating rounded card as it rises over the footer
    if (reviewEl) {
      tl.fromTo(
        reviewEl,
        {
          clipPath: 'inset(0% 0% 0% 0% round 0 0 0 0)',
          filter: 'drop-shadow(0 0px 0px rgba(0, 0, 0, 0))',
        },
        {
          clipPath: () =>
            window.innerWidth >= 992
              ? 'inset(0% 21% 0% 21% round 0 0 24px 24px)'
              : 'inset(0% 4% 0% 4% round 0 0 16px 16px)',
          filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.45))',
          ease: 'none',
          duration: 1,
        }
      )
    }
  })
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', onResize)
  }
  clearTimeout(resizeTimer)
  if (ctx) ctx.revert()
})
</script>

<style scoped>
.layout-root {
  position: relative;
  background-color: #FAF4EA;
  min-height: 100vh;
}

.main-content {
  position: relative;
  z-index: 2;
  pointer-events: none; /* Let pointer events pass through bottom padding to footer */
}

/* Re-enable pointer events on all child elements of main-content */
.main-content :deep(*) {
  pointer-events: auto;
}

:deep(.gs) {
  will-change: clip-path, filter;
}

.footer-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: radial-gradient(ellipse at 50% 55%, #0d2c19 0%, #0a2314 55%, #071a0f 100%);
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  will-change: opacity, transform;

  /* Initial state; GSAP takes over once the trigger is created */
  opacity: 0;
  visibility: hidden;
}
</style>