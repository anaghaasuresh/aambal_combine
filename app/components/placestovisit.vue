<script setup lang="ts">
import { TITLE_PATH } from "~/utils/placesTitlePath";
import cochinAirport from "~/assets/images/airport.png";
import metroAluva from "~/assets/images/metro.jpg";
import railwayAluva from "~/assets/images/aluvarail.jpg";
import mattancherry from "~/assets/images/palace.avif";
import keralaMuseum from "~/assets/images/museum.avif";
import hillPalace from "~/assets/images/hillpalace.avif";
import indoPortuguese from "~/assets/images/indomuseum.avif";
import athirappilly from "~/assets/images/waterfall.avif";

const { $lenis } = useNuxtApp();

type Stop = {
  num: string;
  distance: string;
  title: string;
  alt: string;
  description: string;
  image: string;
};

const stops: Stop[] = [
  { num: "01", distance: "6.7 KM", title: "Cochin International Airport", alt: "Cochin International Airport Architectural Hangar", description: "The world's first fully solar-powered airport, marrying traditional Kerala architectural roofs with sweeping glass atrium terminals.", image: cochinAirport },
  { num: "02", distance: "8.4 KM", title: "Railway Station Aluva", alt: "Aluva Railway Platform in Sunrise Light", description: "Historic rail stop overlooking the Periyar River banks, kissed by golden morning light and passenger trains heading across South India.", image: railwayAluva },
  { num: "03", distance: "9.0 KM", title: "Kerala Museum", alt: "Traditional Kerala Museum with Bougainvillea Courtyard", description: "Surrounded by vibrant bougainvillea, this serene cultural enclave showcases centuries of Kerala fine arts, statues, and historical tableaux.", image: keralaMuseum },
  { num: "04", distance: "13.0 KM", title: "Indo-Portuguese Museum", alt: "Colonial Azulejo Tile Architectural Facade", description: "A testament to Fort Kochi's rich colonial heritage, featuring ornamental blue azulejo tiles, carved teak altars, and vestments.", image: indoPortuguese },
  { num: "05", distance: "7.0 KM", title: "Metro Aluva", alt: "Modern Rapid Transit Train in Canopy Station", description: "Sleek rapid transit station connecting travelers smoothly to Cochin city center, Marine Drive, and Kochi water metro ferries.", image: metroAluva },
  { num: "06", distance: "30.0 KM", title: "Hill Palace Museum", alt: "Hill Palace Sprawling Estate under Ancient Shade Trees", description: "The largest archaeological palace complex in Kerala, nestled under centuries-old banyan canopies with royal carriage collections and golden thrones.", image: hillPalace },
  { num: "07", distance: "37.0 KM", title: "Mattancherry Palace", alt: "Mattancherry Palace Historic Colonial Courtyard with Palms", description: "Also known as the Dutch Palace, celebrated for its legendary mythological murals executed in warm earth tempera hues and wood ceilings.", image: mattancherry },
  { num: "08", distance: "44.0 KM", title: "Alappuzha & Waterfalls", alt: "Lush Tropical Waterfall Plunging into Rocky River", description: "Lush tropical cascades gushing over dark granite cliffs and tranquil emerald backwaters sheltered by coconut palms.", image: athirappilly },
];

/* ---------- title "pen" geometry (viewBox 780 x 120) ---------- */
const TITLE = {
  W: 780,
  H: 120,
  entry: "M35.9 59.4 C76.9 59.4 86.9 37.4 122.9 44.4",
  exit: "M666.2 61.3 C706.2 57.3 731.2 59.3 758.2 77.3",
  revealX: 36.9,
  revealY: 6,
  revealW: 718.4,
  revealH: 108,
  tipX: 41.9,
  tipY: 61.4,
  tipTravel: 710.4,
  entryEnd: 0.12,
  exitStart: 0.856,
  exitGain: 6.95,
};
const TITLE_SCROLL_RANGE = 240;

const rootRef = ref<HTMLElement>();
const listRef = ref<HTMLElement>();
const journeyPath = ref<SVGPathElement>();

const titleProgress = ref(0);
const reduceMotion = ref(false);

const revealWidth = computed(() => TITLE.revealW * titleProgress.value);
const entryOffset = computed(() => 1 - Math.min(1, titleProgress.value / TITLE.entryEnd));
const exitOffset = computed(
  () => 1 - Math.min(1, Math.max(0, (titleProgress.value - TITLE.exitStart) * TITLE.exitGain)),
);
const tipCx = computed(() => TITLE.tipX + TITLE.tipTravel * titleProgress.value);
const tipOpacity = computed(() => 1 - titleProgress.value);

/* ---------- trail: measured from the real card positions ---------- */
const trail = reactive({ w: 0, h: 0, d: "" });
const pathLength = ref(0);
const trailProgress = ref(0);
const plane = reactive({ x: 0, y: 0, angle: 0 });

const drawOffset = computed(() => pathLength.value * (1 - trailProgress.value));
const planeOpacity = computed(() => Math.min(1, Math.max(0, (trailProgress.value - 0.9) / 0.1)));

type Box = { x: number; y: number; w: number; h: number; left: boolean };

async function buildTrail() {
  const list = listRef.value;
  if (!list) return;
  const W = list.offsetWidth;
  const H = list.offsetHeight;

  const boxes: Box[] = Array.from(list.querySelectorAll<HTMLElement>(".stop")).map((stop) => {
    const card = stop.querySelector<HTMLElement>(".stop__card")!;
    const x = stop.offsetLeft + card.offsetLeft;
    const y = stop.offsetTop + card.offsetTop;
    return { x, y, w: card.offsetWidth, h: card.offsetHeight, left: x + card.offsetWidth / 2 < W / 2 };
  });
  if (!boxes.length || !W) return;

  const k = Math.min(W * 0.2, 200); // how far each curve swings into the empty half
  const f = (v: number) => Math.round(v * 10) / 10;
  const inner = (b: Box) => ({ x: b.left ? b.x + b.w : b.x, y: b.y + b.h / 2 });
  const bottom = (b: Box) => ({ x: b.x + b.w / 2, y: b.y + b.h });
  const reach = (b: Box) => (b.left ? k : -k);

  const first = boxes[0]!;
  const fin = inner(first);
  const sx = fin.x + reach(first);
  let d = `M ${f(sx)} 0 C ${f(sx)} ${f(fin.y * 0.55)}, ${f(sx)} ${f(fin.y)}, ${f(fin.x)} ${f(fin.y)}`;

  boxes.forEach((b, i) => {
    const bt = bottom(b);
    d += ` L ${f(bt.x)} ${f(bt.y)}`; // runs behind the card
    const next = boxes[i + 1];
    if (next) {
      const nin = inner(next);
      const dy = nin.y - bt.y;
      d += ` C ${f(bt.x)} ${f(bt.y + dy * 0.55)}, ${f(nin.x + reach(next))} ${f(nin.y)}, ${f(nin.x)} ${f(nin.y)}`;
    }
  });

  const last = boxes[boxes.length - 1]!;
  const lb = bottom(last);
  const endX = W * 0.9;
  const endY = Math.min(H - 24, lb.y + 70);
  d += ` C ${f(lb.x)} ${f(lb.y + 40)}, ${f(W * 0.62)} ${f(endY + 18)}, ${f(endX)} ${f(endY)}`;

  trail.w = W;
  trail.h = H;
  trail.d = d;

  await nextTick();
  measurePath();
}

function measurePath() {
  const p = journeyPath.value;
  if (!p) return;
  const len = p.getTotalLength();
  pathLength.value = len;
  const end = p.getPointAtLength(len);
  const prev = p.getPointAtLength(Math.max(0, len - 4));
  plane.x = end.x;
  plane.y = end.y;
  plane.angle = (Math.atan2(end.y - prev.y, end.x - prev.x) * 180) / Math.PI;
}

/* ---------- popup ---------- */
const modalOpen = ref(false);
const activeStop = ref<Stop | null>(null);

function openModal(stop: Stop) {
  activeStop.value = stop;
  modalOpen.value = true;
  document.body.classList.add("overflow-hidden");
  $lenis?.stop();
}
function closeModal() {
  modalOpen.value = false;
  document.body.classList.remove("overflow-hidden");
  $lenis?.start();
}

/* ---------- scroll ---------- */
function updateTitle() {
  const el = rootRef.value;
  if (!el) return;
  if (reduceMotion.value) {
    titleProgress.value = 1;
    return;
  }
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const docTop = rect.top + window.scrollY;
  const trigger = docTop < vh * 0.4 ? 0 : vh * 0.6;
  titleProgress.value = Math.min(1, Math.max(0, (trigger - rect.top) / TITLE_SCROLL_RANGE));
}

function updateTrail() {
  const el = listRef.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  // 0 when the list top is 62% down the screen, 1 when its bottom reaches that line
  trailProgress.value = Math.min(1, Math.max(0, (vh * 0.62 - rect.top) / Math.max(rect.height, 1)));
}

let ticking = false;
function handleScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateTitle();
    updateTrail();
    ticking = false;
  });
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === "Escape" && modalOpen.value) closeModal();
}

let observer: IntersectionObserver | null = null;
let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  reduceMotion.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  buildTrail();
  updateTitle();
  updateTrail();

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleScroll);
  window.addEventListener("keydown", onKeydown);

  // rebuild the trail whenever the card layout changes size (resize, fonts, images)
  resizeObserver = new ResizeObserver(() => buildTrail());
  if (listRef.value) resizeObserver.observe(listRef.value);

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
  );
  document.querySelectorAll(".reveal-item").forEach((el) => observer!.observe(el));
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleScroll);
  window.removeEventListener("keydown", onKeydown);
  observer?.disconnect();
  resizeObserver?.disconnect();
  // in case the modal was open when the page changed, restore page scrolling
  document.body.classList.remove("overflow-hidden");
});
</script>

<template>
  <div ref="rootRef" class="places-explore" id="places">
    <section class="hero">
      <h1 class="visually-hidden">Places to Explore</h1>

      <div class="heading">
        <svg class="title-script" :viewBox="`0 0 ${TITLE.W} ${TITLE.H}`" aria-hidden="true" focusable="false">
          <defs>
            <mask id="places-title-reveal" maskUnits="userSpaceOnUse" x="0" y="0" :width="TITLE.W" :height="TITLE.H">
              <rect x="0" y="0" :width="TITLE.W" :height="TITLE.H" fill="black" />
              <rect :x="TITLE.revealX" :y="TITLE.revealY" :width="revealWidth" :height="TITLE.revealH" rx="10" fill="white" />
            </mask>
          </defs>

          <path class="title-guide" :d="TITLE_PATH" />

          <g mask="url(#places-title-reveal)">
            <path class="title-line" pathLength="1" :d="TITLE.entry" :stroke-dashoffset="entryOffset" />
            <path class="title-ink" :d="TITLE_PATH" />
            <path class="title-line" pathLength="1" :d="TITLE.exit" :stroke-dashoffset="exitOffset" />
          </g>

          <circle class="writing-tip" :cx="tipCx" :cy="TITLE.tipY" r="3.2" :opacity="tipOpacity" />
        </svg>

        <p class="hero__quote">"Riverside Bliss, Unforgettable Memories"</p>
      </div>
    </section>

    <main class="journey">
      <div ref="listRef" class="journey__list">
        <div aria-hidden="true" class="journey__trail">
          <svg v-if="trail.w" class="journey__trail-svg" fill="none" :viewBox="`0 0 ${trail.w} ${trail.h}`">
            <defs>
              <linearGradient id="trailGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop class="trail-stop trail-stop--a" offset="0%" stop-opacity="0.5" />
                <stop class="trail-stop trail-stop--b" offset="50%" stop-opacity="0.9" />
                <stop class="trail-stop trail-stop--c" offset="100%" stop-opacity="0.9" />
              </linearGradient>
            </defs>
            <path class="trail-base" :d="trail.d" stroke-dasharray="5 7" stroke-linecap="round" stroke-width="1.6" />
            <path
              ref="journeyPath"
              class="trail-draw"
              :d="trail.d"
              stroke="url(#trailGradient)"
              stroke-linecap="round"
              stroke-width="2.2"
              :style="{ strokeDasharray: `${pathLength} ${pathLength}`, strokeDashoffset: drawOffset }"
            />
            <g :transform="`translate(${plane.x} ${plane.y}) rotate(${plane.angle + 90}) translate(-12 -12)`" :opacity="planeOpacity">
              <path
                class="trail-plane"
                d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"
              />
            </g>
          </svg>
        </div>

        <article
          v-for="(stop, i) in stops"
          :key="stop.num"
          class="stop reveal-item"
          :class="i % 2 === 0 ? 'stop--right' : 'stop--left'"
        >
          <div class="stop__image-col">
            <div class="stop__card">
              <img :alt="stop.alt" :src="stop.image" loading="lazy" />
            </div>
          </div>

          <div class="stop__meta">
            <span class="stop__num">{{ stop.num }}</span>
            <span class="stop__distance">{{ stop.distance }}</span>
            <h2 class="stop__title">{{ stop.title }}</h2>
            <button :aria-label="`Explore ${stop.title}`" class="stop__btn" type="button" @click="openModal(stop)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" />
              </svg>
            </button>
          </div>
        </article>
      </div>
    </main>

    <!-- teleported to <body> so it sits above every section, not just this one -->
    <Teleport to="body">
      <div class="modal" :class="{ 'modal--open': modalOpen }" role="dialog" aria-modal="true" aria-labelledby="modalTitle" @click.self="closeModal">
        <div class="modal__card" :class="{ 'modal__card--open': modalOpen }">
          <button aria-label="Close dialog" class="modal__close" type="button" @click="closeModal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
          </button>
          <span class="modal__distance">{{ activeStop?.distance }}</span>
          <h3 id="modalTitle" class="modal__title">{{ activeStop?.title }}</h3>
          <p class="modal__desc">{{ activeStop?.description }}</p>
          <div class="modal__footer">
            <span class="modal__footer-label">Riverside Exploration Guide</span>
            <button class="modal__btn" type="button" @click="closeModal">Got It</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* ---------- theme: the hero's variables ---------- */
.places-explore {
  --bg: var(--color-cream, #f4efe6);
  --ink: var(--color-green, #24382c);
  --gold: var(--color-gold, #d4900f);
  --gold-deep: color-mix(in srgb, var(--gold) 78%, #000);
  --ink-soft: color-mix(in srgb, var(--ink) 80%, transparent);
  --ink-faint: color-mix(in srgb, var(--ink) 62%, transparent);
  --ink-pale: color-mix(in srgb, var(--ink) 42%, transparent);
  --line: color-mix(in srgb, var(--gold) 30%, transparent);
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  --font-num: "Crimson Text", Georgia, serif;

  position: relative;
  isolation: isolate; /* keeps this section's z-index layers inside it */
  overflow-x: hidden;
  color: var(--ink-soft);
  background: var(--bg);
  background-image: radial-gradient(color-mix(in srgb, var(--gold) 12%, transparent) 1px, transparent 0);
  background-size: 28px 28px;
  font-family: inherit;
  -webkit-font-smoothing: antialiased;
}
.places-explore *, .places-explore *::before, .places-explore *::after { box-sizing: border-box; }

/* soft cream fade at the top, so the dot pattern doesn't start with a hard edge */
.places-explore::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 260px;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(to bottom, var(--bg) 0%, transparent 100%);
}

.visually-hidden { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }

/* ---------- hero: the written title ---------- */
.hero { max-width: 80rem; margin: 0 auto; padding: 3.5rem 1.5rem 1.5rem; text-align: center; }
.heading { width: min(960px, 92vw); margin: 0 auto; }
.title-script { display: block; width: 100%; height: auto; overflow: visible; }

.title-guide { fill: none; stroke: color-mix(in srgb, var(--gold) 25%, transparent); stroke-width: 1; stroke-dasharray: 1 7; stroke-linecap: round; }
.title-ink { fill: var(--gold); stroke: var(--gold); stroke-width: 0.45; }
.title-line { fill: none; stroke: var(--gold); stroke-width: 1.5; stroke-linecap: round; stroke-dasharray: 1; }
.writing-tip { fill: var(--gold); filter: drop-shadow(0 0 3px color-mix(in srgb, var(--gold) 55%, transparent)); }

.hero__quote {
  margin: -0.25rem 0 0;
  font-family: var(--font-heading, Georgia, serif);
  font-style: italic;
  font-size: clamp(1.125rem, 2.2vw, 1.5rem);
  letter-spacing: 0.02em;
  color: var(--ink-faint);
}

/* ---------- journey: compact zigzag ---------- */
.journey { max-width: 70rem; margin: 0 auto; padding: 1rem 1.5rem 3rem; }
.journey__list { position: relative; display: flex; flex-direction: column; gap: 1.5rem; padding-bottom: 6rem; }
.journey__trail { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
.journey__trail-svg { width: 100%; height: 100%; overflow: visible; }

/* trail colours follow the theme */
.trail-base { stroke: var(--line); }
.trail-stop--a { stop-color: var(--gold); }
.trail-stop--b { stop-color: var(--gold); }
.trail-stop--c { stop-color: var(--gold-deep); }
.trail-plane { fill: var(--gold-deep); }

/* hidden cards ignore clicks until they animate in */
.stop {
  position: relative; z-index: 1; display: flex; align-items: center; gap: 1.25rem; width: 58%;
  opacity: 0; transform: translateY(38px); pointer-events: none;
  transition: opacity 0.85s var(--ease), transform 0.85s var(--ease);
}
.stop.is-visible { opacity: 1; transform: translateY(0); pointer-events: auto; }
.stop--right { align-self: flex-end; flex-direction: row; }
.stop--left { align-self: flex-start; flex-direction: row-reverse; }

.stop__image-col { flex: 0 0 64%; }
.stop__card {
  --tilt: 1.6deg;
  position: relative; overflow: hidden; width: 100%; aspect-ratio: 16 / 9;
  background: var(--bg); border: 5px solid var(--bg); border-radius: 6px;
  box-shadow: 0 18px 30px -10px color-mix(in srgb, var(--ink) 28%, transparent), 0 4px 10px color-mix(in srgb, var(--ink) 12%, transparent);
  transform: rotate(var(--tilt));
  transition: transform 0.6s var(--ease), box-shadow 0.6s var(--ease);
}
.stop--left .stop__card { --tilt: -1.6deg; }
.stop__card:hover {
  transform: rotate(0deg) translateY(-6px) scale(1.02);
  box-shadow: 0 26px 40px -12px color-mix(in srgb, var(--gold) 35%, transparent), 0 6px 14px color-mix(in srgb, var(--ink) 14%, transparent);
}
.stop__card img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 700ms var(--ease); }
.stop__card:hover img { transform: scale(1.05); }

.stop__meta { flex: 1 1 0; min-width: 0; text-align: left; }
.stop__num {
  display: block;
  margin-bottom: 0.3rem;
  font-family: var(--font-num);
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  font-variant-numeric: tabular-nums;
  color: var(--gold-deep);
}

.stop__distance {
  display: block;
  margin-bottom: 0.35rem;
  font-family: var(--font-num);
  font-size: clamp(1rem, 2vw, 2rem);
  font-weight: 400;
  letter-spacing: -0.01em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  color: var(--gold);
}

.stop__title {
  margin: 0 0 0.75rem;
  font-family: var(--font-heading, Georgia, serif);
  font-weight: 500; line-height: 1.2;
  font-size: clamp(1.05rem, 1.6vw, 1.35rem);
  color: var(--ink);
}

.stop__btn {
  display: inline-flex; align-items: center; justify-content: center; width: 2.25rem; height: 2.25rem;
  border-radius: 50%; border: 1px solid var(--gold); background: none; color: var(--gold);
  cursor: pointer; transition: background 300ms, color 300ms;
}
.stop__btn:hover { background: var(--gold); color: var(--bg); }
.stop__btn:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
.stop__btn svg { width: 0.9rem; height: 0.9rem; transition: transform 300ms; }
.stop__btn:hover svg { transform: translateX(2px); }

/* ---------- modal (teleported to body, so it sits above the whole page) ---------- */
.modal {
  position: fixed; inset: 0; z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem;
  background: color-mix(in srgb, var(--ink) 55%, transparent); backdrop-filter: blur(4px);
  opacity: 0; pointer-events: none; transition: opacity 300ms;
}
.modal--open { opacity: 1; pointer-events: auto; }
.modal__card {
  position: relative; width: 100%; max-width: 28rem; padding: 1.5rem;
  background: var(--bg); border: 1px solid color-mix(in srgb, var(--gold) 40%, transparent); border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); color: var(--ink);
  transform: scale(0.95); transition: transform 300ms;
}
.modal__card--open { transform: scale(1); }
.modal__close {
  position: absolute; top: 1rem; right: 1rem; width: 2.25rem; height: 2.25rem; border-radius: 50%; border: 0;
  display: flex; align-items: center; justify-content: center; background: none; color: var(--ink-pale); cursor: pointer;
  transition: background 200ms, color 200ms;
}
.modal__close:hover { background: color-mix(in srgb, var(--gold) 14%, transparent); color: var(--ink); }
.modal__close svg { width: 1.25rem; height: 1.25rem; }
.modal__distance {
  display: inline-block; margin-bottom: 0.25rem; font-family: var(--font-num); font-size: 0.75rem; letter-spacing: 0.16em;
  text-transform: uppercase; font-weight: 600; color: var(--gold-deep);
}
.modal__title { margin: 0 0 0.75rem; font-family: var(--font-heading, Georgia, serif); font-weight: 500; font-size: 1.5rem; color: var(--ink); }
.modal__desc { margin: 0 0 1.5rem; font-size: 0.875rem; line-height: 1.625; color: var(--ink-soft); }
.modal__footer { display: flex; align-items: center; justify-content: space-between; padding-top: 1rem; border-top: 1px solid var(--line); }
.modal__footer-label { font-family: var(--font-heading, Georgia, serif); font-style: italic; font-size: 0.85rem; color: var(--ink-pale); }
.modal__btn {
  padding: 0.6rem 1.4rem; border: 1px solid var(--gold); border-radius: 999px;
  background: var(--gold); color: var(--bg);
  font-size: 0.72rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase;
  cursor: pointer; transition: background 200ms, color 200ms;
}
.modal__btn:hover { background: transparent; color: var(--gold-deep); }

/* ---------- mobile: photo on top, details underneath, still alternating sides ---------- */
@media (max-width: 767px) {
  .journey { padding-inline: 1rem; }
  .journey__list { gap: 1.5rem; padding-bottom: 5rem; }

  .stop, .stop.stop--left, .stop.stop--right { flex-direction: column; align-items: stretch; gap: 0.75rem; width: 88%; }
  .stop__image-col { flex: none; width: 100%; }

  .stop__meta {
    display: grid; grid-template-columns: 1fr auto; column-gap: 0.75rem; align-items: center;
    grid-template-areas: "num btn" "dist btn" "title btn";
  }
  .stop__num { grid-area: num; margin: 0; }
  .stop__distance { grid-area: dist; margin: 0; }
  .stop__title { grid-area: title; margin: 0.15rem 0 0; }
  .stop__btn { grid-area: btn; }
}

@media (prefers-reduced-motion: reduce) {
  .stop { opacity: 1; transform: none; transition: none; pointer-events: auto; }
}
</style>