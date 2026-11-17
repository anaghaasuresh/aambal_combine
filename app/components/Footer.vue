<template>
  <footer ref="footerEl" class="footer">
    <div ref="footerInner" class="footer__inner">
      <!-- Centre content -->
      <div class="footer__center">
        <div class="address">
          <h2 class="address-title" data-anim="line">AAMBAL RESORT &amp; EVENTS</h2>
        </div>

        <!-- Contact icons: each one is a real link -->
        <nav class="contact-row" data-anim="ctn" aria-label="Contact Aambal Resort">
          <template v-for="(item, i) in contacts" :key="item.key">
            <span v-if="i > 0" class="contact-divider" aria-hidden="true"></span>

            <a
              class="contact-link"
              :href="item.href"
              :aria-label="item.label"
              :title="item.label"
              :target="item.external ? '_blank' : undefined"
              :rel="item.external ? 'noopener noreferrer' : undefined"
              @click="onLinkClick($event, item)"
            >
              <!-- Location -->
              <svg v-if="item.key === 'location'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 21.5s-7-6.1-7-11.6a7 7 0 0 1 14 0c0 5.5-7 11.6-7 11.6z" />
                <circle cx="12" cy="9.8" r="2.6" fill="currentColor" />
              </svg>

              <!-- Phone -->
              <svg v-else-if="item.key === 'phone'" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6.6 3h3l1.6 4.4-2.1 1.5a11.2 11.2 0 0 0 5 5l1.5-2.1L20 13.4v3.2a2.4 2.4 0 0 1-2.6 2.4C10 18.5 5.500 14 5 6.600A2.4 2.4 0 0 1 6.600 3z" />
              </svg>

              <!-- WhatsApp -->
              <svg v-else-if="item.key === 'whatsapp'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M3.200 20.800l1.500-4.900A8.600 8.600 0 1 1 8 19.300l-4.800 1.500z" />
                <path d="M9.300 7.900c-.4.400-.7 1-.5 1.900.4 1.700 2.300 4 4.700 4.800.9.300 1.600 0 2-.5l.4-.8-2-1-.9.800a4.600 4.600 0 0 1-2.300-2.300l.8-.9-.9-2.100-1.300.1z" fill="currentColor" stroke="none" />
              </svg>

              <!-- Instagram -->
              <svg v-else-if="item.key === 'instagram'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3.500" y="3.500" width="17" height="17" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.200" cy="6.800" r="1" fill="currentColor" stroke="none" />
              </svg>

              <!-- Email -->
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="1.500" />
                <path d="M3.500 6.500l8.500 7 8.500-7" />
              </svg>
            </a>
          </template>
        </nav>

        <!-- KERALA, INDIA flanked by lines -->
        <div class="region" data-anim="ctn">
          <span class="region-line" aria-hidden="true"></span>
          <span class="region-text">KERALA, INDIA</span>
          <span class="region-line" aria-hidden="true"></span>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="footer__bottom">
        <div data-anim="ctn" class="bottom-divider"></div>

        <div class="bottom-content">
          <div class="bottom-left" data-anim="line">
            <p class="legal-copy">&copy; 2026 AAMBAL RESORT</p>
            <div class="legal-links">
              <a href="#privacy" class="legal-link">PRIVACY POLICY</a>
              <span class="dot">&bull;</span>
              <a href="#terms" class="legal-link">TERMS OF USE</a>
            </div>
          </div>

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
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}


const PHONE = '919447036444'
const WHATSAPP = '919447036444'
const EMAIL = 'aambalresort@gmail.com'
const INSTAGRAM = 'YOUR_HANDLE'

const contacts = [
  {
    key: 'location',
    label: 'Find Aambal Resort on Google Maps',
    href: 'https://www.google.com/maps/search/?api=1&query=Aambal+Resort+and+Events+Chengamanad+Kerala',
    external: true,
  },
  {
    key: 'phone',
    label: 'Call us',
    href: `tel:+${PHONE}`,
  },
  {
    key: 'whatsapp',
    label: 'Chat with us on WhatsApp',
    href: `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hello Aambal Resort, I would like to enquire about a stay.')}`,
    external: true,
  },
  {
    key: 'instagram',
    label: 'Follow us on Instagram',
    href: `https://www.instagram.com/${INSTAGRAM}/`,
    external: true,
  },
  {
    key: 'email',
    label: 'Email us',
    href: `mailto:${EMAIL}`,
  },
]

const footerEl = ref(null)
const footerInner = ref(null)

// mailto: does nothing on desktops with no mail app set up, so on desktop
// the email icon opens Gmail's compose window instead. Phones keep mailto:.
function onLinkClick(e, item) {
  if (item.key !== 'email') return
  if (window.matchMedia('(pointer: coarse)').matches) return
  e.preventDefault()
  window.open(
    `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`,
    '_blank',
    'noopener,noreferrer'
  )
}

function onImgError(e) {
  e.target.style.display = 'none'
}

let ctx = null

// 100% scroll-scrubbed animation, works both down and up
function setAnimationProgress(p) {
  const root = footerEl.value
  const inner = footerInner.value
  if (!root || !inner) return

  const clampedP = Math.min(1, Math.max(0, p))



  gsap.set(inner, {
    scale: 0.8 + 0.2 * clampedP,
    opacity: Math.min(1, clampedP * 2),
    force3D: true,
  })

  // 2. Upward line reveals (title, legal, location)
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
  --gold: #e0bc78;
  --cream: #efe6d2;
  --heading: 'Cormorant Garamond', Georgia, serif;
  --sans: var(--font-body);

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
  padding: clamp(150px, 30vh, 300px) 3vw 0;
  text-align: center;
}


.address {
  width: 100%;
  overflow: hidden;
}

.address-title {
  margin: 0;
  font-family: var(--heading);
  font-weight: 400;
  font-size: clamp(1.6rem, 4.6vw, 5rem);
  line-height: 1.2;
  letter-spacing: 0.34em;
  padding-left: 0.34em; /* balances the trailing letter-spacing so the text is truly centred */
  color: var(--gold);
  will-change: transform, opacity;
}


.contact-row {
  margin-top: clamp(2.5rem, 6vh, 4.5rem);
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem clamp(0.8rem, 3vw, 3.2rem);
  color: var(--gold);
  text-decoration: none;
  transition: color 0.25s ease, transform 0.25s ease;
}

.contact-link svg {
  width: clamp(20px, 1.9vw, 32px);
  height: clamp(20px, 1.9vw, 32px);
  display: block;
}

.contact-link:hover {
  color: #fff3d4;
  transform: translateY(-3px);
}

.contact-link:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 4px;
  border-radius: 6px;
}

.contact-divider {
  width: 1px;
  height: clamp(20px, 1.9vw, 30px);
  background: var(--gold);
  opacity: 0.9;
}

/* ---------- Region row ---------- */
.region {
  margin-top: clamp(1.2rem, 3vh, 2rem);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(1rem, 2.2vw, 2.2rem);
  color: var(--gold);
}

.region-line {
  display: block;
  width: clamp(40px, 14.5vw, 250px);
  height: 1px;
  background: var(--gold);
  opacity: 0.85;
}

.region-text {
  font-family: var(--heading);
  font-size: clamp(0.95rem, 1.5vw, 1.6rem);
  letter-spacing: 0.34em;
  padding-left: 0.34em;
  white-space: nowrap;
}

/* ---------- Bottom bar ---------- */
.footer__bottom {
  width: 100%;
  padding: 0 3% 32px;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
}

.bottom-divider {
  width: 100%;
  height: 1px;
  background: rgba(224, 188, 120, 0.35);
  margin-bottom: 22px;
}

.bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  font-size: clamp(0.6rem, 0.8vw, 0.75rem);
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

/* ---------- Responsive ---------- */
@media (max-width: 991px) {
  .footer__center {
    padding-top: 130px;
  }
  .address-title {
    letter-spacing: 0.2em;
    padding-left: 0.2em;
    font-size: clamp(1.4rem, 6vw, 3rem);
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

@media (max-width: 520px) {
  .contact-link {
    padding: 0.5rem 0.7rem;
  }
  .region-text {
    letter-spacing: 0.2em;
  }
}

@media (prefers-reduced-motion: reduce) {
  .contact-link {
    transition: none;
  }
  .contact-link:hover {
    transform: none;
  }
}
</style>




