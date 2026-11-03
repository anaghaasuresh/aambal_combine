<template>
  <footer ref="footerEl" class="footer">
    <!-- Scaling Inner Wrapper (Synchronized Zoom Reveal) -->
    <div ref="footerInner" class="footer__inner">
      <!-- Centre Content matching the user design -->
      <div class="footer__center">
        <!-- Center Logo -->
        <div data-text="ctn" class="center-lotus-wrap">
          <img src="/logo.png" alt="Aambal Resort" class="center-lotus" />
        </div>

        <!-- Phone Number with 3D Character Flip (Editorial Italic Serif) -->
        <div class="phone-wrap">
          <a class="phone" data-text="h" :href="'tel:' + phoneRaw" aria-label="Call Reservations">
            {{ phoneFormatted }}
          </a>
        </div>

        <!-- Subtitle & Location -->
        

        <div class="address" data-text="p">
          <p class="address-line">AAMBAL RESORT &amp; EVENTS</p>
          <p class="address-line">KERALA, INDIA</p>
        </div>
      </div>

      <!-- Bottom Bar matching the user design -->
      <div class="footer__bottom">
        <!-- Thin horizontal gold divider line -->
        <div data-text="ctn" class="bottom-divider"></div>

        <div class="bottom-content">
          <!-- Bottom Left: Copyright & Legal Links -->
          <div class="bottom-left" data-text="p">
            <p class="legal-copy">&copy; 2026 AAMBAL RESORT</p>
            <div class="legal-links">
              <NuxtLink to="/privacy-policy" class="legal-link">PRIVACY POLICY</NuxtLink>
              <span class="dot">&bull;</span>
              <NuxtLink to="/terms" class="legal-link">TERMS OF USE</NuxtLink>
            </div>
          </div>

          <!-- Bottom Right: Logo | KERALA, INDIA -->
          <div class="bottom-right" data-text="p">
            <img src="/logo.png" alt="Aambal Resort" class="mini-lotus" />
            <span class="sep">|</span>
            <span class="loc-text">KERALA, INDIA</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)
}

const phoneFormatted = '+91 (484) 000-0000'
const phoneRaw = '+914840000000'

const footerEl = ref(null)
const footerInner = ref(null)

let ctx = null
const splitInstances = []

// Typography SplitText Animation Helpers
function animateTextH(elements, mode, delay = 0.1) {
  const arr = gsap.utils.toArray(elements)
  if (!arr.length) return
  arr.forEach((el, idx) => {
    if (!el.textContent?.trim()) return
    if (!el._splitH) {
      el._splitH = new SplitText(el, {
        type: 'words,chars',
        tag: 'span',
        wordsClass: 'split-word',
        charsClass: 'split-char',
        smartWrap: true,
      })
      splitInstances.push(el._splitH)
    }
    const staggerOffset = idx * 0.1
    switch (mode) {
      case 'reveal':
        gsap.fromTo(
          el._splitH.chars,
          { opacity: 0, yPercent: 60, rotateY: 90 },
          {
            opacity: 1,
            yPercent: 0,
            rotateY: 0,
            duration: 1.15,
            delay: delay + staggerOffset,
            stagger: 0.035,
            ease: 'Out',
            overwrite: true,
            force3D: true,
          }
        )
        break
      case 'hide':
        gsap.to(el._splitH.chars, {
          opacity: 0,
          yPercent: -50,
          rotateY: -90,
          duration: 0.45,
          delay: 0,
          stagger: 0.02,
          ease: 'In',
          overwrite: true,
          force3D: true,
        })
        break
      case 'initial':
        gsap.set(el._splitH.chars, { opacity: 0, yPercent: 60, rotateY: 90 })
        break
    }
  })
}

function animateTextP(elements, mode, delay = 0.1) {
  const arr = gsap.utils.toArray(elements)
  if (!arr.length) return
  arr.forEach((el, idx) => {
    if (!el.textContent?.trim()) return
    if (!el._splitP) {
      el._splitP = new SplitText(el, {
        type: 'lines,words',
        tag: 'span',
        linesClass: 'split-line',
        wordsClass: 'split-word',
        mask: 'lines',
      })
      splitInstances.push(el._splitP)
    }
    const staggerOffset = idx * 0.08
    switch (mode) {
      case 'reveal':
        gsap.fromTo(
          el._splitP.lines,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.0,
            delay: delay + staggerOffset,
            stagger: 0.08,
            ease: 'Out',
            overwrite: true,
          }
        )
        break
      case 'hide':
        gsap.to(el._splitP.lines, {
          yPercent: -110,
          opacity: 0,
          duration: 0.45,
          delay: 0,
          stagger: 0.04,
          ease: 'In',
          overwrite: true,
        })
        break
      case 'initial':
        gsap.set(el._splitP.lines, { yPercent: 110, opacity: 0 })
        break
    }
  })
}

function animateCtn(elements, mode, delay = 0.1) {
  const arr = gsap.utils.toArray(elements)
  if (!arr.length) return
  switch (mode) {
    case 'reveal':
      gsap.fromTo(
        arr,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          delay: delay,
          stagger: 0.08,
          ease: 'Out',
          overwrite: true,
        }
      )
      break
    case 'hide':
      gsap.to(arr, {
        opacity: 0,
        y: 0,
        duration: 0.4,
        delay: 0,
        stagger: 0.03,
        ease: 'In',
        overwrite: true,
      })
      break
    case 'initial':
      gsap.set(arr, { opacity: 0, y: 25 })
      break
  }
}

// Controlled via default.vue unified timeline
function setAnimationProgress(p) {
  if (footerInner.value) {
    const scaleVal = 0.8 + 0.2 * p
    gsap.set(footerInner.value, {
      scale: scaleVal,
      opacity: Math.min(1, p * 1.5),
      force3D: true,
    })
  }
}

function revealText() {
  const root = footerEl.value
  if (!root) return
  const headings = root.querySelectorAll('[data-text="h"]')
  const paragraphs = root.querySelectorAll('[data-text="p"]')
  const containers = root.querySelectorAll('[data-text="ctn"]')
  animateTextH(headings, 'reveal', 0.1)
  animateTextP(paragraphs, 'reveal', 0.1)
  animateCtn(containers, 'reveal', 0.1)
}

function hideText() {
  const root = footerEl.value
  if (!root) return
  const headings = root.querySelectorAll('[data-text="h"]')
  const paragraphs = root.querySelectorAll('[data-text="p"]')
  const containers = root.querySelectorAll('[data-text="ctn"]')
  animateTextH(headings, 'hide', 0)
  animateTextP(paragraphs, 'hide', 0)
  animateCtn(containers, 'hide', 0)
}

defineExpose({
  setAnimationProgress,
  revealText,
  hideText,
})

onMounted(async () => {
  await nextTick()
  if (typeof window === 'undefined') return

  try {
    CustomEase.create('Out', '0.25, 1, 0.5, 1')
    CustomEase.create('InOut', '0.75, 0, 0.25, 1')
    CustomEase.create('In', '0.5, 0, 0.75, 0')
  } catch (e) {
    
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  ctx = gsap.context(() => {
    const root = footerEl.value
    const inner = footerInner.value
    if (!root || !inner) return

    const headings = root.querySelectorAll('[data-text="h"]')
    const paragraphs = root.querySelectorAll('[data-text="p"]')
    const containers = root.querySelectorAll('[data-text="ctn"]')

    if (reduceMotion) {
      gsap.set(inner, { opacity: 1, scale: 1 })
      return
    }

    
    animateTextH(headings, 'initial')
    animateTextP(paragraphs, 'initial')
    animateCtn(containers, 'initial')
    gsap.set(inner, { scale: 0.8, opacity: 0 })
  }, footerEl.value)
})

onBeforeUnmount(() => {
  splitInstances.forEach((s) => s?.revert?.())
  splitInstances.length = 0
  if (ctx) ctx.revert()
})
</script>

<style scoped>
.footer {
  --green: #0d2c19;
  --green-deep: #071a0f;
  --gold: #c9a45c;
  --cream: #efe6d2;
  --heading: 'Cormorant Garamond', 'Playfair Display', serif;
  --sans: 'Nunito Sans', 'Helvetica Neue', Arial, sans-serif;

  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  color: var(--cream);
  background: radial-gradient(ellipse at 50% 50%, #0d2c19 0%, var(--green) 55%, var(--green-deep) 100%);
  font-family: var(--sans);
  text-transform: uppercase;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Scaling Inner Wrapper */
.footer__inner {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transform-origin: center bottom;
  will-change: transform, opacity;
}


.footer__center {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: clamp(130px, 22vh, 210px);
  text-align: center;
}

.center-lotus-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  color: var(--gold);
}

.center-lotus {
  height: 58px;
  width: auto;
  object-fit: contain;
  display: block;
}

.phone-wrap {
  perspective: 1200px;
}

/* The Signature Editorial Luxury Serif Phone Number */
.phone {
  display: inline-block;
  margin-top: 10px;
  font-family: var(--heading);
  font-style: italic;
  font-weight: 400;
  font-size: clamp(3.4rem, 7.8vw, 7.6rem);
  line-height: 1.05;
  letter-spacing: 0.02em;
  color: var(--cream);
  text-decoration: none;
  white-space: nowrap;
  text-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
  transition: color 0.3s;
  transform-style: preserve-3d;
}

.phone:hover {
  color: #fff8e4;
}

.phone-label {
  margin: 22px 0 0;
  font-size: clamp(0.72rem, 1.05vw, 0.92rem);
  letter-spacing: 0.45em;
  color: var(--gold);
  overflow: hidden;
}

.address {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-style: normal;
  overflow: hidden;
}

.address-line {
  margin: 0;
  font-size: clamp(0.64rem, 0.85vw, 0.78rem);
  letter-spacing: 0.34em;
  color: var(--gold);
}

.footer__bottom {
  width: 100%;
  padding: 0 4.5% 32px;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
}

.bottom-divider {
  width: 100%;
  height: 1px;
  background: rgba(201, 164, 92, 0.35);
  margin-bottom: 22px;
}

.bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  font-size: clamp(0.6rem, 0.8vw, 0.7rem);
  letter-spacing: 0.26em;
  color: var(--gold);
}

.bottom-left {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.legal-copy {
  margin: 0;
}

.legal-links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legal-link {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s;
}

.legal-link:hover {
  color: var(--cream);
}

.dot {
  opacity: 0.6;
}

.bottom-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mini-lotus {
  height: 20px;
  width: auto;
  object-fit: contain;
  display: block;
}

.sep {
  opacity: 0.45;
  margin: 0 2px;
}

.loc-text {
  color: var(--gold);
}

:deep(.split-line),
:deep(.split-word),
:deep(.split-char) {
  display: inline-block;
  will-change: transform;
}

:deep(.split-line) {
  display: block;
}

:deep(.split-line-mask) {
  display: block;
  overflow: hidden;
  line-height: inherit;
}


@media (max-width: 991px) {
  .footer__center {
    padding-top: 130px;
  }
  .phone {
    font-size: clamp(2.2rem, 8.5vw, 4.2rem);
    letter-spacing: 0.01em;
  }
  .phone-label {
    letter-spacing: 0.35em;
  }
  .bottom-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
  }
  .legal-links {
    justify-content: center;
  }
}
</style>

