<template>
  <footer ref="footerEl" class="footer">
    <!-- Scaling Inner Wrapper (Synchronized Zoom Reveal) -->
    <div ref="footerInner" class="footer__inner">
      <!-- Centre Content -->
      <div class="footer__center">
        <!-- Center Logo -->
        <div data-anim="ctn" class="center-lotus-wrap">
          <!-- SVG Fallback if logo.png is missing -->
          <svg v-if="imgFailed" viewBox="0 0 100 60" fill="currentColor" class="center-lotus-svg">
            <path d="M50 5 C55 22 75 25 88 45 C70 42 58 50 50 58 C42 50 30 42 12 45 C25 25 45 22 50 5 Z" />
            <path d="M50 18 C58 30 68 35 74 48 C62 46 56 50 50 55 C44 50 38 46 26 48 C32 35 42 30 50 18 Z" opacity="0.6"/>
          </svg>
        </div>

        <!-- Phone Number with 3D Character Flip (Editorial Italic Serif) -->
        <div class="phone-wrap">
          <a
            ref="phoneEl"
            class="phone"
            :href="'tel:' + phoneRaw"
            aria-label="Call Reservations"
          >
            <span
              v-for="(char, i) in phoneChars"
              :key="i"
              class="split-char"
              :class="{ 'space-char': char === ' ' }"
            >{{ char === ' ' ? '\u00A0' : char }}</span>
          </a>
        </div>

        <!-- Subtitle & Location -->
        <div class="address">
          <p class="address-line" data-anim="line">AAMBAL RESORT &amp; EVENTS</p>
          <p class="address-line" data-anim="line">KERALA, INDIA</p>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer__bottom">
        <!-- Thin horizontal gold divider line -->
        <div data-anim="ctn" class="bottom-divider"></div>

        <div class="bottom-content">
          <!-- Bottom Left: Copyright & Legal Links -->
          <div class="bottom-left" data-anim="line">
            <p class="legal-copy">&copy; 2026 AAMBAL RESORT</p>
            <div class="legal-links">
              <a href="#privacy" class="legal-link">PRIVACY POLICY</a>
              <span class="dot">&bull;</span>
              <a href="#terms" class="legal-link">TERMS OF USE</a>
            </div>
          </div>

          <!-- Bottom Right: Logo | KERALA, INDIA -->
          <div class="bottom-right" data-anim="line">
            <img src="/logo.png" alt="Aambal Resort" class="mini-lotus" @error="onImgError" />
            <span class="sep">|</span>
            <span class="loc-text">KERALA, INDIA</span>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const phoneFormatted = '+91 (484) 000-0000'
const phoneRaw = '+914840000000'
const phoneChars = computed(() => phoneFormatted.split(''))

const footerEl = ref(null)
const footerInner = ref(null)
const phoneEl = ref(null)
const imgFailed = ref(false)

function onImgError(e) {
  imgFailed.value = true
  e.target.style.display = 'none'
}

let ctx = null

// 100% scroll-scrubbed animation - smoothly scrubs BOTH down AND up without time-based drops
function setAnimationProgress(p) {
  const root = footerEl.value
  const inner = footerInner.value
  if (!root || !inner) return

  const clampedP = Math.min(1, Math.max(0, p))

  // 1. Zoom and opacity of the inner wrapper
  const scaleVal = 0.8 + 0.2 * clampedP
  gsap.set(inner, {
    scale: scaleVal,
    opacity: Math.min(1, clampedP * 2),
    force3D: true,
  })

  // 2. 3D Character Flip for Phone Number
  const chars = root.querySelectorAll('.split-char')
  if (chars.length) {
    const charRange = Math.min(1, Math.max(0, (clampedP - 0.12) / 0.75))
    chars.forEach((char, i) => {
      const staggerStart = (i / chars.length) * 0.35
      const indP = Math.min(1, Math.max(0, (charRange - staggerStart) / 0.65))
      gsap.set(char, {
        opacity: indP,
        yPercent: 60 * (1 - indP),
        rotateY: 90 * (1 - indP),
        force3D: true,
      })
    })
  }

  // 3. Upward Line Reveals (Address, Legal, Location)
  const lines = root.querySelectorAll('[data-anim="line"]')
  if (lines.length) {
    const lineRange = Math.min(1, Math.max(0, (clampedP - 0.18) / 0.72))
    lines.forEach((line, i) => {
      const staggerStart = (i / lines.length) * 0.25
      const indP = Math.min(1, Math.max(0, (lineRange - staggerStart) / 0.75))
      gsap.set(line, {
        opacity: indP,
        yPercent: 100 * (1 - indP),
        force3D: true,
      })
    })
  }

  // 4. Logo and divider container reveals
  const containers = root.querySelectorAll('[data-anim="ctn"]')
  if (containers.length) {
    const ctnP = Math.min(1, Math.max(0, (clampedP - 0.05) / 0.55))
    containers.forEach((ctn) => {
      gsap.set(ctn, {
        opacity: ctnP,
        y: 25 * (1 - ctnP),
        force3D: true,
      })
    })
  }
}

// Fallback no-ops so any external calls remain safe without running timers
function revealText() {
  setAnimationProgress(1)
}

function hideText() {
  setAnimationProgress(0)
}

defineExpose({
  setAnimationProgress,
  revealText,
  hideText,
})

onMounted(async () => {
  await nextTick()
  if (typeof window === 'undefined') return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  ctx = gsap.context(() => {
    const root = footerEl.value
    const inner = footerInner.value
    if (!root || !inner) return

    if (reduceMotion) {
      gsap.set(inner, { opacity: 1, scale: 1 })
      return
    }

    // Set initial resting states for curtain reveal
    setAnimationProgress(0)
  }, footerEl.value)
})

onBeforeUnmount(() => {
  if (ctx) ctx.revert()
})
</script>

<style scoped>
.footer {
  --green: #0d2c19;
  --green-deep: #071a0f;
  --gold: #c9a45c;
  --cream: #efe6d2;
  --heading: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
  --sans: 'Nunito Sans', -apple-system, BlinkMacSystemFont, sans-serif;

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

.center-lotus-svg {
  height: 58px;
  width: auto;
  color: var(--gold);
}

.phone-wrap {
  perspective: 1200px;
}

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

.split-char {
  display: inline-block;
  will-change: transform, opacity;
  transform-origin: center bottom;
}

.split-char.space-char {
  width: 0.3em;
}

.address {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden;
}

.address-line {
  margin: 0;
  font-size: clamp(0.64rem, 0.85vw, 0.78rem);
  letter-spacing: 0.34em;
  color: var(--gold);
  will-change: transform, opacity;
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
  overflow: hidden;
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

@media (max-width: 991px) {
  .footer__center {
    padding-top: 130px;
  }
  .phone {
    font-size: clamp(2.2rem, 8.5vw, 4.2rem);
    letter-spacing: 0.01em;
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
