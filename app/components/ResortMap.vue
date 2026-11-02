<script setup lang="ts">
import aerialMap from "~/assets/images/resort-aerial.png";
import cloud1 from "~/assets/clouds/cloud-1.avif";
import cloud2 from "~/assets/clouds/cloud-2.avif";
import cloud3 from "~/assets/clouds/cloud-3.avif";

const props = defineProps({
  topColor: { type: String, default: "var(--color-cream)" },      // same cream as the hero dome
  gap: { type: String, default: "clamp(120px, 22vh, 300px)" },    // empty cream space after the writing
  debug: { type: Boolean, default: false },                       // click the map to log pin x/y in the console
});

const cloudImgs = [cloud1, cloud2, cloud3];

// Clouds hang from the top. edge = where the cloud's bottom edge sits (% of section height),
// w = width in vw, dur = seconds per crossing (bigger = slower),
// delay = negative, so clouds are already spread across the sky on load,
// o = opacity, flip = mirror left/right.
// Fixed values (no Math.random) so server and client render identically in Nuxt.
const CLOUDS = [
  { i: 2, w: 110, edge: 30, dur: 220, delay: -150, o: 1,    flip: true  },
  { i: 0, w: 95,  edge: 24, dur: 190, delay: -40,  o: 1,    flip: false },
  { i: 1, w: 90,  edge: 38, dur: 200, delay: -110, o: 0.95, flip: true  },
  { i: 2, w: 80,  edge: 20, dur: 170, delay: -90,  o: 1,    flip: false },
  { i: 0, w: 85,  edge: 44, dur: 230, delay: -60,  o: 0.9,  flip: true  },
  { i: 1, w: 70,  edge: 28, dur: 160, delay: -20,  o: 1,    flip: false },
  { i: 2, w: 75,  edge: 34, dur: 180, delay: -130, o: 0.95, flip: true  },
  { i: 0, w: 60,  edge: 16, dur: 150, delay: -70,  o: 1,    flip: false },
  { i: 1, w: 55,  edge: 40, dur: 140, delay: -100, o: 0.85, flip: true  },
];

type Feature = {
  id: string;
  label: string;
  category: string;
  description: string;
  image: string;
  x: number; // % across the FULL image
  y: number; // % down the FULL image
  num: string;
};

const FEATURES: Feature[] = [
  { id: "pool", label: "Infinity Pool", category: "Relax & Unwind", description: "A horizon-edge pool merging seamlessly with the backwater beyond.", image: "https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=400&h=240&fit=crop&auto=format", x: 57, y: 63, num: "01" },
  { id: "events", label: "Event Spaces", category: "Celebrate", description: "Open-air pavilions for weddings, retreats, and private gatherings.", image: "https://images.unsplash.com/photo-1650965171703-087486b3a1b0?w=400&h=240&fit=crop&auto=format", x: 47, y: 56, num: "02" },
  { id: "cottages", label: "Cottages", category: "Stay", description: "Heritage-style cottages nestled in coconut groves along the waterfront.", image: "https://images.unsplash.com/photo-1759389964108-1940ff61db0e?w=400&h=240&fit=crop&auto=format", x: 66, y: 52, num: "03" },
  { id: "entrance", label: "Entrance", category: "Arrive", description: "A grand arrival through lush tropical greenery and traditional archways.", image: "https://images.unsplash.com/photo-1657850808594-36772a22f397?w=400&h=240&fit=crop&auto=format", x: 48, y: 80, num: "04" },
  { id: "parking", label: "Parking", category: "Convenience", description: "Secure shaded parking for all resort guests and day visitors.", image: "https://images.unsplash.com/photo-1561501878-aabd62634533?w=400&h=240&fit=crop&auto=format", x: 40, y: 87, num: "05" },
  { id: "backwater", label: "Backwater", category: "Explore", description: "Glide through Kerala's serene backwaters by kayak or traditional houseboat.", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=240&fit=crop&auto=format", x: 20, y: 38, num: "06" },
];

const activePin = ref<string | null>(null);
const stageEl = ref<HTMLElement | null>(null);

function pinCardSide(f: Feature) {
  const alignLeft = f.x > 60;
  const alignTop = f.y > 65;
  if (alignLeft) return { right: "-8px" };
  if (alignTop) return { left: "50%", transform: "translateX(-50%)" };
  return { left: "-8px" };
}

// debug helper: click anywhere on the map to log the x/y to paste into FEATURES
function onStageClick(e: MouseEvent) {
  if (!props.debug || !stageEl.value) return;
  const r = stageEl.value.getBoundingClientRect();
  const x = (((e.clientX - r.left) / r.width) * 100).toFixed(1);
  const y = (((e.clientY - r.top) / r.height) * 100).toFixed(1);
  console.log(`x: ${x}, y: ${y}`);
}
</script>

<template>
  <section class="reveal-map" :style="{ '--top': topColor, '--gap': gap }">
    <div ref="stageEl" class="stage" @click="onStageClick">
      <!-- 1. full aerial photo, uncropped: the section height follows the image -->
      <img :src="aerialMap" alt="Resort aerial map" class="aerial" draggable="false" />
      <div class="shade" />

      <!-- 2. clouds hanging from the top edge, drifting slowly -->
      <div class="cloud-layer" aria-hidden="true">
        <img
          v-for="(c, n) in CLOUDS"
          :key="n"
          :src="cloudImgs[c.i]"
          alt=""
          class="cloud"
          draggable="false"
          :style="{
            '--w': c.w + 'vw',
            '--flip': c.flip ? -1 : 1,
            width: c.w + 'vw',
            top: c.edge + '%',
            opacity: c.o,
            animationDuration: c.dur + 's',
            animationDelay: c.delay + 's',
          }"
        />
      </div>

      <!-- 3. page cream dissolving into the clouds -->
      <div class="fade-top" />

      <!-- 4. pins -->
      <div class="pins">
        <div
          v-for="f in FEATURES"
          :key="f.id"
          class="pin-wrap"
          :style="{ left: f.x + '%', top: f.y + '%' }"
          @mouseenter="activePin = f.id"
          @mouseleave="activePin = null"
        >
          <button class="pin-btn" :aria-label="`View ${f.label}`" :aria-pressed="activePin === f.id">
            <span class="pin-dot" :class="{ active: activePin === f.id }">
              <svg width="14" height="17" viewBox="0 0 14 17" fill="none">
                <path d="M7 0C3.134 0 0 3.134 0 7C0 12.25 7 17 7 17C7 17 14 12.25 14 7C14 3.134 10.866 0 7 0ZM7 9.5C5.619 9.5 4.5 8.381 4.5 7C4.5 5.619 5.619 4.5 7 4.5C8.381 4.5 9.5 5.619 9.5 7C9.5 8.381 8.381 9.5 7 9.5Z" fill="currentColor" />
              </svg>
            </span>
            <span class="pin-stem" />
            <span class="pin-foot" />
          </button>

          <div v-if="activePin === f.id" class="pin-card" :style="pinCardSide(f)">
            <div class="card-image">
              <img :src="f.image" :alt="f.label" />
              <div class="card-shade" />
              <span class="card-category">{{ f.category }}</span>
            </div>
            <div class="card-body">
              <div class="card-text">
                <h3>{{ f.label }}</h3>
                <p>{{ f.description }}</p>
              </div>
              <span class="card-num">{{ f.num }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="label label--right"><p>Hover pins to explore</p></div>
      <div class="label label--left"><p>Resort Map</p></div>
    </div>
  </section>
</template>

<style scoped>
/* ---------- theme: the hero's variables ---------- */
.reveal-map {
  --bg: var(--color-cream, #f4efe6);
  --ink: var(--color-green, #24382c);
  --gold: var(--color-gold, #d4900f);
  --gold-deep: color-mix(in srgb, var(--gold) 78%, #000);
  --font-heading-stack: var(--font-heading, Georgia, serif);

  position: relative;
  z-index: 2;              /* paints above the pinned hero's bottom edge */
  margin-top: -2px;        /* hides any sub-pixel seam between hero and map */
  padding-top: var(--gap); /* extra cream space after the writing */
  background: var(--top);  /* keeps that space the same cream as the text section */
  width: 100%;
}
.reveal-map * { box-sizing: border-box; }

/* height comes from the image itself, so nothing is cropped */
.stage {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: var(--top);
}

/* ---------- photo ---------- */
.aerial {
  position: relative;
  display: block;
  width: 100%;
  height: auto;   /* natural aspect ratio, full image visible */
}

/* soft green-tinted darkening at the bottom only, so the labels stay readable */
.shade {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(to top, color-mix(in srgb, var(--ink) 55%, transparent) 0%, transparent 35%);
}

/* ---------- clouds ---------- */
.cloud-layer {
  position: absolute;
  inset: 0;
  z-index: 20;
  overflow: hidden;
  pointer-events: none;
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

/* translateY(-100%) puts the cloud's bottom edge exactly at its "top" value,
   so only the hanging underside is visible. scale(flip, -1) turns it upside down. */
@keyframes drift {
  from { transform: translate3d(-100%, -100%, 0) scale(var(--flip), -1); }
  to   { transform: translate3d(100vw, -100%, 0) scale(var(--flip), -1); }
}

/* cream from the hero dome dissolves into the clouds */
.fade-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 22%;
  z-index: 25;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    var(--top) 0%,
    color-mix(in srgb, var(--top) 75%, transparent) 30%,
    color-mix(in srgb, var(--top) 25%, transparent) 70%,
    transparent 100%
  );
}

/* ---------- pins: green dot with a gold ring, gold when active ---------- */
.pins {
  position: absolute;
  inset: 0;
  z-index: 30;
}

.pin-wrap { position: absolute; }
.pin-btn {
  position: absolute;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translate(-50%, -100%);
  background: none;
  border: 0;
  cursor: pointer;
  padding: 0;
}
.pin-dot {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  border: 0;
  box-shadow: 0 0.6rem 1.4rem color-mix(in srgb, var(--ink) 35%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bg);
  background: var(--ink);
  transition: transform 300ms, background 300ms, color 300ms;
}
.pin-dot.active {
  background: var(--gold);
  color: var(--ink);
  transform: scale(1.25);
}
.pin-btn:focus-visible { outline: 2px solid var(--gold); outline-offset: 4px; border-radius: 50%; }
.pin-stem {
  width: 1px;
  height: 1rem;
  background: var(--ink);
}
.pin-foot { width: 0.5rem; height: 0.5rem; border-radius: 50%; background: var(--gold); }

/* ---------- hover card: cream card, green text, gold accents ---------- */
.pin-card {
  position: absolute;
  z-index: 40;
  width: 18rem;
  bottom: calc(100% + 20px);
  border-radius: 1rem;
  overflow: hidden;
  background: var(--bg);
  border: 1px solid color-mix(in srgb, var(--gold) 45%, transparent);
  box-shadow: 0 1.5rem 4rem color-mix(in srgb, var(--ink) 30%, transparent);
}
.card-image { position: relative; height: 10rem; overflow: hidden; }
.card-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
.card-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, color-mix(in srgb, var(--ink) 55%, transparent), transparent 60%);
}
.card-category {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  font-size: 0.56rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  padding: 0.3rem 0.6rem;
  border-radius: 999px;
  background: var(--ink);
  color: var(--gold);
}
.card-body {
  padding: 1.1rem 1.25rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}
.card-body h3 {
  margin: 0 0 0.4rem;
  font-family: var(--font-heading-stack);
  font-weight: 500;
  font-size: 1.3rem;
  line-height: 1.1;
  color: var(--ink);
}
.card-body p {
  margin: 0;
  font-size: 0.72rem;
  line-height: 1.5;
  color: color-mix(in srgb, var(--ink) 75%, transparent);
}
.card-num {
  font-family: var(--font-heading-stack);
  font-size: 1.9rem;
  line-height: 1;
  color: var(--gold);
  opacity: 0.6;
  flex-shrink: 0;
}

/* ---------- labels: cream text over the photo ---------- */
.label { position: absolute; bottom: 2rem; z-index: 40; pointer-events: none; }
.label p {
  margin: 0;
  font-family: var(--font-heading-stack);
  font-size: 0.7rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--bg);
  text-shadow: 0 1px 8px color-mix(in srgb, var(--ink) 60%, transparent);
}
.label--right { right: 2.5rem; text-align: right; }
.label--left { left: 2.5rem; }

/* ---------- responsive / motion ---------- */
@media (max-width: 768px) {
  .cloud { width: calc(var(--w) * 1.6) !important; }
  .label { bottom: 1rem; }
}

@media (prefers-reduced-motion: reduce) {
  .cloud { animation: none; transform: translate3d(0, -100%, 0) scale(var(--flip), -1); }
}
</style>