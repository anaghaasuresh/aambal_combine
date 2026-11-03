<template>
  <div class="layout-root">
    <div
      class="main-content"
      ref="mainContentRef"
      :style="{ paddingBottom: paddingHeight + 'px' }"
    >
      <div class="main-content-inner" ref="innerContentRef">
        <Header />
        <slot />
      </div>
    </div>
    <div
      class="footer-wrapper"
      ref="footerWrapperRef"
      :style="{
        opacity: footerVisible ? 1 : 0,
        pointerEvents: footerActive ? 'auto' : 'none',
        visibility: footerVisible ? 'visible' : 'hidden',
        transition: 'opacity 0.25s ease'
      }"
    >
      <Footer ref="footerCompRef" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const footerWrapperRef = ref(null)
const footerCompRef = ref(null)
const mainContentRef = ref(null)
const innerContentRef = ref(null)

const paddingHeight = ref(0)
const transitionDistance = ref(0)
const footerVisible = ref(false)
const footerActive = ref(false)

let resizeObserver = null
let ctx = null

function updateSizes() {
  if (typeof window === 'undefined') return
  const vh = window.innerHeight
  // The distance needed to bring the bottom of slot to ~22vh from top:
  const travelDist = vh * 0.78
  // Dedicated buffer so the review section stays 100% full view at rest first:
  const bufferDist = vh * 0.45

  transitionDistance.value = travelDist
  paddingHeight.value = travelDist + bufferDist
  ScrollTrigger.refresh()
}

onMounted(async () => {
  await nextTick()
  if (typeof window === 'undefined') return

  updateSizes()
  window.addEventListener('resize', updateSizes)

  ctx = gsap.context(() => {
    const inner = innerContentRef.value
    const main = mainContentRef.value
    if (!inner || !main) return

    // Unified transition timeline that ONLY triggers after the review page has been fully viewed
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: main,
        start: () => `bottom-=${transitionDistance.value} bottom`,
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress
          footerVisible.value = p > 0.02
          footerActive.value = p > 0.35
          footerCompRef.value?.setAnimationProgress?.(p)
        },
        onEnter: () => {
          footerVisible.value = true
          footerCompRef.value?.revealText?.()
        },
        onLeaveBack: () => {
          footerVisible.value = false
          footerActive.value = false
          footerCompRef.value?.hideText?.()
        },
      },
    })

    // Smoothly clip the upper page into the top card frame
    tl.fromTo(
      inner,
      {
        clipPath: 'inset(0% 0% 0% 0% round 0 0 0 0)',
      },
      {
        clipPath: () =>
          window.innerWidth >= 992
            ? 'inset(0% 21% 0% 21% round 0 0 24px 24px)'
            : 'inset(0% 4% 0% 4% round 0 0 16px 16px)',
        ease: 'none',
        duration: 1,
      }
    )
  })
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateSizes)
  }
  if (resizeObserver) resizeObserver.disconnect()
  if (ctx) ctx.revert()
})
</script>

<style scoped>
.layout-root {
  position: relative;
  background: radial-gradient(ellipse at 50% 55%, #0d2c19 0%, #0a2314 55%, #071a0f 100%);
  min-height: 100vh;
}

.main-content {
  position: relative;
  z-index: 2;
  pointer-events: none; /* Let clicks pass through padding to the footer */
}

.main-content-inner {
  position: relative;
  background-color: #f5ede1;
  filter: drop-shadow(0 25px 50px rgba(0, 0, 0, 0.5));
  will-change: clip-path;
  pointer-events: auto; /* Re-enable clicks on all page sections */
}

.footer-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  will-change: opacity, transform;
}
</style>
