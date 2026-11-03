<template>
  <section ref="root" class="gs">
    <header class="gs-head">
      <h2 class="gs-title">Real Stories,<br /><em>Lasting Memories</em></h2>
      
    </header>

    <!-- Three cards: previous, current, next -->
    <div class="gs-stage" aria-live="polite">
      <article
        v-for="c in cards"
        :key="c.guest.name"
        class="gs-card"
        :class="`gs-card--${c.slot}`"
        :aria-hidden="c.offset !== 0"
      >
        <div class="gs-stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <blockquote class="gs-quote">&ldquo;{{ c.guest.quote }}&rdquo;</blockquote>
        <p class="gs-who">
          <span class="gs-name">{{ c.guest.name }}</span>
          <span class="gs-city">{{ c.guest.city }}</span>
        </p>
      </article>
    </div>

    <!-- key changes on every selection, so the line animation replays -->
    <span :key="`stem-${current}`" class="gs-stem" aria-hidden="true"></span>

    <!-- Profiles on the wavy line; the current guest is always in the middle -->
    <div class="gs-rail">
      <svg class="gs-wave" viewBox="0 0 1000 80" preserveAspectRatio="none" aria-hidden="true">
        <path :d="waveD" />
      </svg>

      <button class="gs-arrow gs-arrow--prev" type="button" aria-label="Previous guest" @click="go(-1)">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
      </button>
      <button class="gs-arrow gs-arrow--next" type="button" aria-label="Next guest" @click="go(1)">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
      </button>

      <ul ref="listEl" class="gs-list">
        <li v-for="(p, i) in profiles" :key="p.guest.name" class="gs-item" :class="{ 'is-active': p.offset === 0 }" :style="itemStyle[i]">
          <button
            class="gs-avatar"
            type="button"
            :aria-label="`${p.guest.name}, ${p.guest.city}`"
            :aria-current="p.offset === 0"
            @click="go(p.offset)"
          >
            <span class="gs-initial" aria-hidden="true">{{ p.guest.initials }}</span>
            <img :src="p.guest.avatar" :alt="p.guest.name" loading="lazy" @error="$event.target.style.display = 'none'" />
          </button>
          <span class="gs-dot" aria-hidden="true"></span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

// ---- IMAGES: change these paths to your real files in /public ----
// Resort photos shown on the cards (cycled across all guests)
const resortImages = [
  { src: "/image1.webp", alt: "Resort view" },
  { src: "/image2.webp", alt: "Hotel room" },
  { src: "/image3.webp", alt: "Swimming pool 1" },
  { src: "/image4.webp", alt: "Swimming pool 2" },
];
// Guest face photos for the round profiles (one per guest, in order)
const faceImages = [
  "/guest1.png",
  "/guest2.png",
  "/guest3.png",
  "/guest4.png",
  "/guest5.png",
];

const reviews = [
  { name: "Ananya R", city: "Bangalore", quote: "A peaceful escape surrounded by nature. The stay was absolutely beautiful." },
  { name: "Meera S", city: "Kochi", quote: "Every detail was thoughtful. The warm hospitality made us feel at home." },
  { name: "Priya N", city: "Trivandrum", quote: "The perfect blend of nature, comfort and warm hospitality. A truly unforgettable stay!" },
  { name: "Arjun K", city: "Chennai", quote: "We woke to birdsong and had breakfast looking at the backwaters." },
  { name: "Daniel T", city: "Mumbai", quote: "Quiet, clean and beautifully designed, with no rush anywhere." },
];

const guests = reviews.map((r, i) => ({
  ...r,
  avatar: faceImages[i % faceImages.length],
  image: resortImages[i % resortImages.length].src,
  imageAlt: resortImages[i % resortImages.length].alt,
  initials: r.name.split(/[ &]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join(""),
}));

const current = ref(2); // start with the middle guest
const n = guests.length;
const at = (i) => guests[((i % n) + n) % n];

// 5 cards, one per guest: they slide between slots (the two outer slots are invisible)
const SLOTS = ["m2", "m1", "c", "p1", "p2"];
const cards = computed(() =>
  [-2, -1, 0, 1, 2].map((offset) => ({ offset, slot: SLOTS[offset + 2], guest: at(current.value + offset) }))
);

// 5 avatars: offsets -2..2 around the current guest
const profiles = computed(() =>
  [-2, -1, 0, 1, 2].map((offset) => ({ offset, guest: at(current.value + offset) }))
);

// ---- Wave: a smooth ripple runs outward from the centre, and the profiles ride it ----
const MID = 500;
const DURATION = 1800; // ms: cards (CSS), profiles and wave all use this
const restY = (x) => 40 - 9 * Math.cos((2 * Math.PI * x) / 500); // smooth, symmetric resting wave

// Smooth travelling ripple. t = time progress 0..1, p = eased progress 0..1
// - the ripple fades in and out with sin(pi*t), so nothing jumps at the start or end
// - it moves outward from the centre, mirrored on both sides
function zigAt(x, t, p) {
  const amp = 12 * Math.sin(Math.PI * t);
  return amp * Math.sin(2 * Math.PI * (Math.abs(x - MID) / 400 - p * 0.5));
}

function buildWave(t = 1, p = 1) {
  let d = "";
  for (let x = 0; x <= 1000; x += 5) {
    d += `${x === 0 ? "M" : "L"}${x} ${(restY(x) + zigAt(x, t, p)).toFixed(2)} `;
  }
  return d;
}

const waveD = ref(buildWave(1, 1));
const listEl = ref(null);
const itemStyle = ref([{}, {}, {}, {}, {}]);
const RESET = () => [{}, {}, {}, {}, {}];
let raf = null;

function animateWave(step) {
  if (typeof window === "undefined" || !step) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  cancelAnimationFrame(raf);

  // measure final slot centres so profiles can slide from their old slot
  const lis = listEl.value ? Array.from(listEl.value.children) : [];
  const W = listEl.value ? listEl.value.clientWidth : 1000;
  const centers = lis.map((li) => li.offsetLeft + li.offsetWidth / 2);
  const spacing = centers.length > 1 ? centers[1] - centers[0] : 0;

  const start = performance.now();
  const duration = DURATION;
  const tick = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const e = -(Math.cos(Math.PI * t) - 1) / 2; // gentle ease in and out
    waveD.value = buildWave(t, e);

    itemStyle.value = centers.map((c, k) => {
      const dx = step * spacing * (1 - e);              // slide from the old slot
      const dy = zigAt(((c + dx) / W) * 1000, t, e);     // ride the line's ripple
      const oldSlot = k + step;
      const opacity = oldSlot < 0 || oldSlot > 4 ? e : 1; // profile entering from outside fades in
      return { transform: `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`, opacity };
    });

    if (t < 1) raf = requestAnimationFrame(tick);
    else itemStyle.value = RESET();
  };
  raf = requestAnimationFrame(tick);
}

// ---- Autoplay: moves to the next guest by itself ----
const AUTOPLAY_MS = 5000; // pause between moves (on top of the animation time)
const root = ref(null);
let timer = null;
let paused = false;
let inView = true;
let observer = null;

function schedule() {
  clearTimeout(timer);
  if (paused || !inView) return;
  timer = setTimeout(() => go(1), AUTOPLAY_MS + DURATION);
}
function pause() { paused = true; clearTimeout(timer); }
function resume() { paused = false; schedule(); }
function onVisibility() { document.hidden ? pause() : resume(); }

onMounted(() => {
  document.addEventListener("visibilitychange", onVisibility);
  if ("IntersectionObserver" in window && root.value) {
    observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      inView ? schedule() : clearTimeout(timer);
    }, { threshold: 0.3 });
    observer.observe(root.value);
  }
  schedule();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  clearTimeout(timer);
  document.removeEventListener("visibilitychange", onVisibility);
  observer && observer.disconnect();
});

function go(step) {
  if (!step) return;
  current.value = (((current.value + step) % n) + n) % n;
  animateWave(step);
  schedule(); // any move (auto or manual) restarts the countdown
}
</script>

<style scoped>
.gs {
  --gold: #C9A45C;
  --ink: #12382A;

  position: relative;
  padding: 64px 24px 80px;
  background-color: #FAF4EA;
  color: var(--ink);
  text-align: center;
  overflow: hidden;
}

.gs-head { max-width: 640px; margin: 0 auto; }
.gs-eyebrow {
  margin: 0 0 12px;
  font-size: 12px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #687367;
}
.gs-title {
  margin: 0;
  font-family: 'Playfair Display', serif;
  font-weight: 400;
  font-size: clamp(36px, 5vw, 56px);
  line-height: 1.1;
  color: #12382A;
}
.gs-title em { color: inherit; }
.gs-rule { display: block; width: 56px; height: 1px; margin: 18px auto; background: var(--gold); }
.gs-sub {
  margin: 0 auto;
  max-width: 440px;
  font-family: var(--font-body, 'Nunito Sans', sans-serif);
  font-size: 15px;
  line-height: 1.6;
  color: #687367;
}

/* Cards: all five sit in the same spot and slide by transform only (smooth, GPU-friendly) */
.gs-stage {
  --dur: 1.8s;
  --ease: cubic-bezier(0.37, 0, 0.63, 1); /* matches the JS ease-in-out used by the wave */
  position: relative;
  max-width: 1000px;
  height: 250px;
  margin: 44px auto 0;
}

.gs-card {
  --x: 0px;
  --s: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 28px 28px 26px;
  box-sizing: border-box;
  text-align: left;
  background: #FBF8F1;
  border-radius: 12px;
  box-shadow: 0 10px 28px rgba(18, 56, 42, 0.07);
  opacity: 0;
  transform: translate(calc(-50% + var(--x)), -50%) scale(var(--s));
  transition: transform var(--dur) var(--ease), opacity var(--dur) var(--ease);
  will-change: transform, opacity;
}
.gs-card--c  { --x: 0px;    --s: 1;    opacity: 1;   z-index: 3; }
.gs-card--m1 { --x: -330px; --s: 0.96; opacity: 0.7; z-index: 2; }
.gs-card--p1 { --x: 330px;  --s: 0.96; opacity: 0.7; z-index: 2; }
.gs-card--m2 { --x: -660px; --s: 0.9;  opacity: 0;   z-index: 1; }
.gs-card--p2 { --x: 660px;  --s: 0.9;  opacity: 0;   z-index: 1; }

.gs-stars {
  margin-bottom: 14px;
  font-size: 16px;
  letter-spacing: 0.15em;
  color: var(--gold);
}

.gs-quote {
  margin: 0 0 22px;
  min-height: 72px;
  font-family: var(--font-body, 'Nunito Sans', sans-serif);
  font-style: italic;
  font-size: 15px;
  line-height: 1.6;
  color: #3f5247;
}

.gs-who {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin: auto 0 0;
}
.gs-name {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #3f5247;
}
.gs-city {
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #9aa39a;
}

/* Stem grows down from the card on every selection */
.gs-stem {
  display: block;
  width: 1px;
  height: 30px;
  margin: 0 auto;
  background: var(--gold);
  transform-origin: top;
  animation: gs-stem-grow 0.5s ease both;
}
@keyframes gs-stem-grow {
  from { transform: scaleY(0); }
  to   { transform: scaleY(1); }
}

/* Profile rail */
.gs-rail { position: relative; max-width: 1000px; margin: 0 auto; }

/* Wave: zig-zag animation is drawn in script (see animateWave) */
.gs-wave {
  position: absolute;
  left: 0;
  top: 18px;
  width: 100%;
  height: 80px;
  fill: none;
  stroke: rgba(201, 164, 92, 0.7);
  stroke-width: 1.2;
  stroke-linejoin: round;
}
.gs-wave path { vector-effect: non-scaling-stroke; }

.gs-list {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin: 0;
  padding: 0 110px;
  list-style: none;
}
.gs-item { will-change: transform; display: flex; flex-direction: column; align-items: center; gap: 12px; width: 84px; }

.gs-avatar {
  position: relative;
  display: grid;
  place-items: center;
  width: 68px;
  height: 68px;
  margin-top: 8px;
  padding: 0;
  border-radius: 50%;
  border: 2px solid rgba(201, 164, 92, 0.6);
  background: #24402f;
  color: var(--gold);
  font-size: 18px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, border-color 0.3s ease, width 0.4s ease, height 0.4s ease, margin 0.4s ease;
}
.gs-avatar img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
.gs-avatar:hover { transform: scale(1.08); border-color: var(--gold); }
.gs-avatar:focus-visible { outline: 2px solid var(--gold); outline-offset: 4px; }

.gs-item.is-active .gs-avatar {
  width: 88px;
  height: 88px;
  margin-top: -2px;
  border: 3px solid var(--gold);
}
.gs-item.is-active .gs-avatar:hover { transform: none; }

.gs-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--ink); opacity: 0.7; }
.gs-item.is-active .gs-dot { background: var(--gold); opacity: 1; }

.gs-arrow {
  position: absolute;
  top: 24px;
  z-index: 5;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border-radius: 50%;
  border: 1px solid var(--gold);
  background: #FAF4EA;
  cursor: pointer;
  transition: background 0.25s ease;
}
.gs-arrow svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: var(--gold);
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.gs-arrow:hover { background: #f1e8d6; }
.gs-arrow:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }
.gs-arrow--prev { left: 0; }
.gs-arrow--next { right: 0; }

@media (max-width: 900px) {
  .gs-card--m1, .gs-card--p1 { opacity: 0; }
}

@media (max-width: 600px) {
  .gs-card { width: min(300px, 86vw); }
  .gs-list { padding: 0 52px; }
  .gs-item { width: 52px; }
  .gs-avatar { width: 46px; height: 46px; }
  .gs-item.is-active .gs-avatar { width: 62px; height: 62px; }
  .gs-arrow { width: 40px; height: 40px; }
}

@media (prefers-reduced-motion: reduce) {
  .gs-stem { animation: none; }
  .gs-card { transition: none; }
  .gs-avatar { transition: none; }
}
</style>