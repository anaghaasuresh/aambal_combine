<template>
  <section class="features">
    <div ref="trackEl" class="features__track">
      <div ref="row1" class="features__row">
        <div class="features__media features__media--left">
          <img src="/images/beige11.png" alt="Versatile event spaces at Aambal Resort" />
        </div>
        <span class="features__label features__label--right">
  An open green space where celebrations unfold
  <em>beneath the sky.</em>
</span>
      </div>

      <div ref="row2" class="features__row">
        <span class="features__label features__label--left">
  Charming riverside cottages designed for quiet moments and
  <em>restful stays.</em>
</span>
        <div class="features__media features__media--right">
          <img src="/images/beige2.png" alt="Scenic views at Aambal Resort" />
        </div>
      </div>

      <div ref="row3" class="features__row">
        <div class="features__media features__media--left">
          <img src="/images/beige3.png" alt="Relaxation and romance at Aambal Resort" />
        </div>
        <span class="features__label features__label--right">
  Warm, intimate spaces created for comfort, rest, and
  <em>unhurried mornings.</em>
</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const row1 = ref(null)
const row2 = ref(null)
const row3 = ref(null)
const trackEl = ref(null)
let ctx

onMounted(() => {
  ctx = gsap.context(() => {
    ;[row1, row2, row3].forEach((row) => {
      const label = row.value.querySelector('.features__label')
      const media = row.value.querySelector('.features__media')

      gsap.fromTo([label, media],
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: row.value,
            start: 'top 80%',
          },
        }
      )
    })
  }, trackEl.value)
})

onBeforeUnmount(() => {
  ctx && ctx.revert()
})
</script>

<style scoped>
.features {
  background: var(--color-cream);
  padding: 6rem clamp(1.5rem, 6vw, 6rem);
}

.features__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: clamp(2rem, 6vw, 5rem);
}

.features__media--left  { order: 1; }
.features__label--right { order: 2; text-align: left;  padding-left: 1rem; }

.features__label--left  { order: 1; text-align: right; padding-right: 1rem; }
.features__media--right { order: 2; }

.features__label {
  font-family: var(--font-features);
  font-size: clamp(2rem, 4.5vw, 3.5rem);
  line-height: 1.2;
  color: var(--color-green);
}

.features__label em {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
}

.features__media {
  aspect-ratio: 4 / 3;
  border-radius: 1rem;
  overflow: hidden;
}
.features__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.features__track {
  display: flex;
  flex-direction: column;
  gap: 6rem;
}

@media (max-width: 800px) {
  .features__row {
    grid-template-columns: 1fr;
  }

  .features__media--left,
  .features__media--right,
  .features__label--left,
  .features__label--right {
    order: initial;
    text-align: center;
    padding: 0;
  }
}
</style>