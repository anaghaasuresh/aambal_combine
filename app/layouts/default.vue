<template>
  <div class="layout-root">
    <!-- 1. Pinned Background Footer at z-index 1 -->
    <div
      class="footer-wrapper"
      ref="footerWrapperRef"
      :style="{
        opacity: footerVisible ? 1 : 0,
        pointerEvents: footerActive ? 'auto' : 'none',
        visibility: footerVisible ? 'visible' : 'hidden',
      }"
    >
      <Footer ref="footerCompRef" />
    </div>

    <!-- 2. Main Page Content at z-index 2 (No filter or clipPath here, so HeroArch pins cleanly!) -->
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
}

const footerWrapperRef = ref(null)
const footerCompRef = ref(null)
const mainContentRef = ref(null)

const paddingHeight = ref(0)
const transitionDistance = ref(0)
const footerVisible = ref(false)
const footerActive = ref(false)

let ctx = null

async function updateSizes() {
  if (typeof window === 'undefined') return
  const vh = window.innerHeight
  // The distance needed to bring the bottom of the review section above the footer:
  const travelDist = vh * 0.78
  // Dedicated buffer so the review section stays 100% full view at rest first:
  const bufferDist = vh * 0.45

  transitionDistance.value = travelDist
  paddingHeight.value = travelDist + bufferDist

  await nextTick()
  ScrollTrigger.refresh()

  const { $lenis } = useNuxtApp()
  if ($lenis) {
    $lenis.resize()
  }
}

onMounted(async () => {
  await nextTick()
  if (typeof window === 'undefined') return

  await updateSizes()
  window.addEventListener('resize', updateSizes)

  ctx = gsap.context(() => {
    const main = mainContentRef.value
    if (!main) return

    // Find the review section (.gs) at the bottom of the page
    const reviewEl = main.querySelector('.gs')

    // Unified transition timeline that activates only after scrolling past the review section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: main,
        start: () => `bottom-=${transitionDistance.value} bottom`,
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress
          footerVisible.value = p > 0.001
          footerActive.value = p > 0.35
          footerCompRef.value?.setAnimationProgress?.(p)
        },
        onEnter: () => {
          footerVisible.value = true
        },
        onLeaveBack: () => {
          footerVisible.value = false
          footerActive.value = false
          footerCompRef.value?.setAnimationProgress?.(0)
        },
      },
    })

    // Smoothly clips ONLY the review section into the floating rounded card as it rises over the footer
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
    window.removeEventListener('resize', updateSizes)
  }
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

/* Floating card shadow when review section lifts over footer */
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
}
</style>
