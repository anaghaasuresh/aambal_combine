<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from 'vue'

const title = "Experience the Serenity of Aambal"

const images = [
  { src: '/image1.webp', alt: 'Resort view' },
  { src: '/image2.webp', alt: 'Hotel room' },
  { src: '/image3.webp', alt: 'Swimming pool 1' },
  { src: '/image4.webp', alt: 'Swimming pool 2' },
]

const DUR = 1100   
const DELAY = 5500   
const STAGGER = 0 
const END = DUR * 1.2 + STAGGER * 2 + 80  

const total = images.length
const index = ref(0)
const galleryEl = ref(null)

const wrap = (n) => (n + total) % total
const targetFor = (name, i) => (name === 'left' ? wrap(i - 1) : name === 'right' ? wrap(i + 1) : i)


let uid = 0
const makeLayer = (i, open) => ({ id: ++uid, i, open })

const slots = reactive([
  { name: 'left',   delay: 0,           layers: [makeLayer(wrap(-1), true)] },
  { name: 'center', delay: STAGGER,     layers: [makeLayer(0, true)] },
  { name: 'right',  delay: STAGGER * 2, layers: [makeLayer(1, true)] },
])

let busy = false
let timer = null
let reduceMotion = false

const loaded = {}

function ensureLoaded(src) {
  if (!loaded[src]) {
    loaded[src] = new Promise((resolve) => {
      const img = new Image()
      img.onload = () => (img.decode ? img.decode().then(resolve, resolve) : resolve())
      img.onerror = resolve
      img.src = src
    })
  }
  return loaded[src]
}

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => resolve()))

async function go(step) {
  if (busy) return
  busy = true
  index.value = wrap(index.value + step)

  if (reduceMotion) {
    slots.forEach((s) => (s.layers = [makeLayer(targetFor(s.name, index.value), true)]))
    busy = false
  return
  }

  
  slots.forEach((s) => s.layers.push(makeLayer(targetFor(s.name, index.value), false)))
  await nextTick()

  
  await Promise.all(slots.map((s) => ensureLoaded(images[s.layers[s.layers.length - 1].i].src)))

  if (galleryEl.value) void galleryEl.value.offsetWidth
  await nextFrame()
  slots.forEach((s) => (s.layers[s.layers.length - 1].open = true))

  setTimeout(() => {
    slots.forEach((s) => s.layers.splice(0, s.layers.length - 1))
    busy = false
  }, END)
}

function prev() { go(-1); restartAutoplay() }
function next() { go(1); restartAutoplay() }

function stopAutoplay() {
  clearInterval(timer)
  timer = null
}

function restartAutoplay() {
  stopAutoplay()
  if (reduceMotion) return
  timer = setInterval(() => go(1), DELAY)
}

onMounted(() => {
  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  images.forEach((image) => ensureLoaded(image.src))
  restartAutoplay()
})

onBeforeUnmount(stopAutoplay)
</script>

<template>
  <section class="showcase" @mouseenter="stopAutoplay" @mouseleave="restartAutoplay">
    <h2 class="showcase__title">{{ title }}</h2>

    <div ref="galleryEl" class="gallery" aria-roledescription="carousel" aria-label="Photo gallery">
      <div
        v-for="slot in slots"
        :key="slot.name"
        class="slot"
        :class="['slot--' + slot.name, { 'is-clickable': slot.name !== 'center' }]"
        :aria-hidden="slot.name === 'center' ? null : 'true'"
        @click="slot.name === 'left' ? prev() : slot.name === 'right' ? next() : null"
      >
        <div
          v-for="layer in slot.layers"
          :key="layer.id"
          class="layer"
          :class="{ 'is-open': layer.open }"
          :style="{ '--delay': slot.delay + 'ms' }"
        >
          <img
            :src="images[layer.i].src"
            :alt="slot.name === 'center' ? images[layer.i].alt : ''"
            draggable="false"
          >
        </div>
      </div>
    </div>

    <div class="controls">
      <button class="controls__btn" type="button" aria-label="Previous photo" @click="prev">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4 7 12l8 8" /></svg>
      </button>

      <div class="controls__count" aria-live="polite">{{ index + 1 }} / {{ total }}</div>

      <button class="controls__btn" type="button" aria-label="Next photo" @click="next">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 4 8 8-8 8" /></svg>
      </button>
    </div>
  </section>
</template>

<style scoped>
.showcase {
background-color: #faf4ea;
  --ink: #0d0d0d;
  --pill: #efeeeb;

  --cw: 47.6;
  --sw: 23.8;
  --gap: 2.4;
  --center-ratio: 1.5;
  --side-ratio: 1.017;
  --stage-ratio: 3.15;
  --side-top: 4;

  --dur: 1.1s;
  --ease: cubic-bezier(0.77, 0, 0.175, 1);
  padding: clamp(140px, 20vh, 240px) 0 clamp(200px, 20vh, 240px);
  overflow: hidden;
  background: #FAF4EA;
  color: var(--ink);
}

@media (max-width: 700px) {
  .showcase {
    --cw: 76;
    --sw: 10.5;
    --gap: 1.5;
    --side-ratio: 0.7;
    --stage-ratio: 1.97;
    --side-top: 6;
  }
}

.showcase__title {
  max-width: 14em;
  margin: 0 auto clamp(48px, 7vw, 96px);
  padding: 0 20px;
  text-align: center;
  font-family: 'Playfair Display', serif;
  font-weight: 400;
  font-size: clamp(25px, 5vw, 50px);
  line-height: 1.15;
  letter-spacing: -0.01em;
  color: #12382A;
}

.gallery {
  position: relative;
  width: 100%;
  aspect-ratio: var(--stage-ratio);
  container-type: inline-size;
}

.slot {
  position: absolute;
  top: 0;
  overflow: hidden;
  background: whitesmoke;
}

.slot--left,
.slot--right {
  top: calc(var(--side-top) * 1cqw);
  width: calc(var(--sw) * 1cqw);
  height: calc(var(--sw) / var(--side-ratio) * 1cqw);
}

.slot--left  { left: 0; }

.slot--right { left: calc((100 - var(--sw)) * 1cqw); }

.slot--center {
  left: calc((var(--sw) + var(--gap)) * 1cqw);
  width: calc(var(--cw) * 1cqw);
  height: calc(var(--cw) / var(--center-ratio) * 1cqw);
  z-index: 2;
}

.slot.is-clickable { cursor: pointer; }


.layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  clip-path: inset(0 100% 0 0);
  transition: clip-path var(--dur) var(--ease) var(--delay, 0ms);
}

.layer.is-open {
  clip-path: inset(0 0 0 0);
}

.layer img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
  transform: scale(1.25);
  transition: transform calc(var(--dur) * 1.2) var(--ease) var(--delay, 0ms);
}

.layer.is-open img {
  transform: scale(1);}
.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 48px;
}

.controls__btn,
.controls__count {
  display: grid;
  place-items: center;
  height: 60px;
  border: 0;
  border-radius: 999px;
  background: var(--pill);
  color: var(--ink);
}

.controls__btn {
  width: 60px;
  padding: 0;
  cursor: pointer;
  transition: background 0.2s;
}

.controls__btn:hover { background: #e3e1dc; }

.controls__btn svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.controls__btn:focus-visible { outline: 3px solid #2a5bd7; outline-offset: 3px; }

.controls__count {
  min-width: 108px;
  padding: 0 24px;
  font-size: 20px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
}

@media (max-width: 700px) {
  .controls__btn,
  .controls__count { height: 48px; }
  .controls__btn { width: 48px; }
  .controls__count { min-width: 88px; font-size: 16px; }
}

@media (prefers-reduced-motion: reduce) {
  .layer,
  .layer img { transition: none; }
}
</style>