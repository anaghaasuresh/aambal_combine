<template>
  <section class="why">
    <div class="why__inner">
      <p class="why__eyebrow">A stay, your way</p>
      <h2 class="why__title">Why are you here?</h2>
      <p class="why__sub">
        Come for deep rest or bring your favourite people. The house is yours
        to make a little world of.
      </p>

      <div class="why__links">
        <NuxtLink v-for="link in links" :key="link.id" :to="link.to" class="why__link">
          <span class="why__num">{{ link.num }}</span>
          <span class="why__label">{{ link.label }}</span>
          <svg class="why__arrow" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
const links = [
  { id: 'rooms', num: '01', label: 'Book a room', to: { path: '/book', query: { type: 'room' }, hash: '#booking-content' } },
  { id: 'events', num: '02', label: 'Host an event', to: { path: '/book', query: { type: 'event' }, hash: '#booking-content' } },
]
</script>

<style scoped>
/* The top and bottom padding include the overlap height of the cream
   sections above and below, so the text is not hidden under their curves. */
.why {
  --curve: clamp(60px, 9vw, 130px);

  width: 100%;
  background: var(--color-green, #1f4a38);
  position: relative;
  z-index: 1;
  padding:
    calc(clamp(5rem, 10vw, 8rem) + var(--curve))
    6vw
    calc(clamp(5rem, 10vw, 8rem) + var(--curve));
  overflow: hidden;
}

.why__inner {
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
}

.why__eyebrow {
  font-size: 0.7rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: #b9d9a6;
  margin-bottom: 1.25rem;
}

.why__title {
  font-family: var(--font-heading, Georgia, serif);
  font-weight: 600;
  font-size: clamp(2.5rem, 6vw, 5rem);
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--color-cream, #f5ede0);
}

.why__sub {
  max-width: 420px;
  margin: 1.5rem auto 0;
  font-size: 0.9rem;
  line-height: 1.7;
  color: rgba(245, 237, 224, 0.7);
}

/* LINK BOXES */
.why__links {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(1rem, 2vw, 1.5rem);
  margin-top: clamp(3rem, 6vw, 4.5rem);
}

.why__link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: clamp(1.5rem, 2.5vw, 2rem) clamp(1.25rem, 2.5vw, 2rem);
  border: 1px solid rgba(245, 237, 224, 0.2);
  border-radius: 24px;
  text-decoration: none;
  text-align: left;
  color: var(--color-cream, #f5ede0);
  transition: border-color 0.3s, background 0.3s;
}

.why__link:hover {
  border-color: var(--color-gold, #d9a85b);
  background: rgba(245, 237, 224, 0.04);
}

.why__num {
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: #b9d9a6;
  align-self: flex-start;
  margin-top: 0.3rem;
}

.why__label {
  flex: 1;
  font-family: var(--font-heading, Georgia, serif);
  font-weight: 600;
  font-size: clamp(1.1rem, 1.8vw, 1.5rem);
  letter-spacing: -0.01em;
  transition: color 0.3s;
}

.why__arrow {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.why__link:hover .why__label {
  color: var(--color-gold, #d9a85b);
}
.why__link:hover .why__arrow {
  transform: translateX(5px);
}

/* RESPONSIVE */
@media (max-width: 640px) {
  .why__links {
    grid-template-columns: 1fr;
  }
}
</style>