<script setup>
import cloud1 from '~/assets/clouds/cloud-1.avif'
import cloud2 from '~/assets/clouds/cloud-2.avif'
import cloud3 from '~/assets/clouds/cloud-3.avif'

const props = defineProps({
  topColor: { type: String, default: '#f4efe6' },  // text section background
  hazeColor: { type: String, default: '#f7f8f6' }, // cloud shade that blends over the map's top edge
  overlap: { type: Number, default: 0.5 },         // how much of this section sits over the map (0 to 0.7)
  hang: { type: Boolean, default: true },          // true = clouds hang from the top (upside down)
})

const imgs = [cloud1, cloud2, cloud3]

// Fixed values (no Math.random) so server and client render identically in Nuxt.
// i = which image, w = width px, top = % from top, dur = seconds per crossing,
// delay = negative so clouds are already spread across the sky on load,
// o = opacity, flip = mirror left/right
const clouds = [
  { i: 2, w: 1200, top: -30, dur: 190, delay: -120, o: 0.95, flip: true  },
  { i: 0, w: 1000, top: -26, dur: 150, delay: -20,  o: 0.95, flip: false },
  { i: 1, w: 900,  top: -18, dur: 170, delay: -90,  o: 0.9,  flip: true  },
  { i: 2, w: 800,  top: -10, dur: 130, delay: -60,  o: 0.9,  flip: false },
  { i: 0, w: 700,  top: -2,  dur: 120, delay: -10,  o: 0.85, flip: true  },
  { i: 1, w: 600,  top: 8,   dur: 105, delay: -75,  o: 0.8,  flip: false },
  { i: 2, w: 520,  top: 18,  dur: 95,  delay: -40,  o: 0.7,  flip: true  },
  { i: 0, w: 460,  top: 28,  dur: 85,  delay: -55,  o: 0.6,  flip: false },
  { i: 1, w: 420,  top: 38,  dur: 80,  delay: -25,  o: 0.5,  flip: true  },
]
</script>

<template>
  <section
    class="sky"
    aria-hidden="true"
    :style="{
      '--top': topColor,
      '--haze': hazeColor,
      '--overlap': overlap,
      '--flipY': hang ? -1 : 1,
    }"
  >
    <img
      v-for="(c, n) in clouds"
      :key="n"
      :src="imgs[c.i]"
      alt=""
      class="cloud"
      loading="lazy"
      decoding="async"
      :style="{
        '--w': c.w + 'px',
        '--flip': c.flip ? -1 : 1,
        width: c.w + 'px',
        top: c.top + '%',
        opacity: c.o,
        animationDuration: c.dur + 's',
        animationDelay: c.delay + 's',
      }"
    />

    <!-- cream at the very top, melting into the clouds -->
    <div class="fade-top" />

    <!-- cloud-shade haze centered on the map's top edge: cream -> cloud shade -> photo -->
    <div class="haze" />
  </section>
</template>

<style scoped>
.sky {
  --h: clamp(380px, 58vh, 620px);

  position: relative;
  z-index: 10;                                          /* sits above the map */
  height: var(--h);
  margin-bottom: calc(var(--h) * var(--overlap) * -1);  /* pulls the map up underneath */
  overflow: hidden;
  pointer-events: none;                                 /* map stays hoverable and clickable */
  background: transparent;

  /* clouds stay solid over the map's top edge, then fade out lower down */
  -webkit-mask-image: linear-gradient(to bottom, #000 0%, #000 72%, transparent 100%);
  mask-image: linear-gradient(to bottom, #000 0%, #000 72%, transparent 100%);
}

.cloud {
  position: absolute;
  left: 0;
  height: auto;
  max-width: none;
  user-select: none;
  pointer-events: none;
  will-change: transform;
  animation: drift linear infinite;
}

/* starts fully off the left edge, ends fully off the right edge.
   scale(var(--flip), var(--flipY)) mirrors and turns the cloud upside down */
@keyframes drift {
  from { transform: translate3d(calc(var(--w) * -1), 0, 0) scale(var(--flip), var(--flipY)); }
  to   { transform: translate3d(100vw, 0, 0) scale(var(--flip), var(--flipY)); }
}

/* top: page cream dissolves into the clouds */
.fade-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 30%;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    var(--top) 0%,
    color-mix(in srgb, var(--top) 70%, transparent) 40%,
    transparent 100%
  );
}

/* the boundary where the map starts is at (1 - overlap) of this section's height.
   The haze peaks there and fades both up and down, so no hard line is left */
.haze {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent calc((1 - var(--overlap)) * 100% - 38%),
    color-mix(in srgb, var(--haze) 55%, transparent) calc((1 - var(--overlap)) * 100% - 12%),
    color-mix(in srgb, var(--haze) 92%, transparent) calc((1 - var(--overlap)) * 100%),
    color-mix(in srgb, var(--haze) 45%, transparent) calc((1 - var(--overlap)) * 100% + 22%),
    transparent 100%
  );
}

@media (max-width: 768px) {
  .cloud { width: calc(var(--w) * 0.55) !important; }
}

@media (prefers-reduced-motion: reduce) {
  .cloud { animation: none; left: 10%; }
}
</style>