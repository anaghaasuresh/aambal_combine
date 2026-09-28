<template>
  <header class="nav" :class="{ 'nav--visible': introDone }">
    <button class="nav__menu" type="button" aria-label="Open menu">
      <span class="nav__lines"><span></span><span></span></span>
      <span>Menu</span>
    </button>

    <a href="/" class="nav__logo">Aambal</a>

    <div class="nav__actions">
      <a href="#" class="nav__link">Contact</a>
      <a href="#" class="nav__cta">Book a stay</a>
    </div>
  </header>
</template>

<script setup>
const introDone = useState('introDone', () => false)
</script>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: grid;
  grid-template-columns: 1fr auto 1fr; /* logo stays truly centered */
  align-items: center;
  padding: 1.5rem clamp(1.25rem, 3vw, 3rem);
  color: #fff;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.35), transparent);
  font-size: 0.85rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;

  /* hidden until the intro finishes */
  opacity: 0;
  transform: translateY(-16px);
  pointer-events: none;
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.nav--visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.nav a,
.nav button {
  color: inherit;
  text-decoration: none;
  font: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
}

/* left: menu button */
.nav__menu {
  justify-self: start;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  background: none;
  border: none;
  cursor: pointer;
}
.nav__lines {
  display: grid;
  gap: 6px;
  width: 26px;
}
.nav__lines span {
  height: 1px;
  background: currentColor;
  transition: transform 0.3s ease;
}
.nav__menu:hover .nav__lines span:last-child {
  transform: scaleX(0.6);
  transform-origin: right;
}

/* center: logo */
.nav__logo {
  font-family: var(--font-heading);
  font-size: 1.6rem;
  letter-spacing: 0.3em;
  padding-left: 0.3em; /* offsets trailing letter-spacing so it centers optically */
}

/* right: links */
.nav__actions {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 2rem;
}
.nav__link {
  position: relative;
}
.nav__link::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -4px;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}
.nav__link:hover::after {
  transform: scaleX(1);
}

.nav__cta {
  padding: 0.75rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 999px; /* echoes the arch */
  transition: background 0.3s ease, color 0.3s ease;
}
.nav__cta:hover {
  background: #fff;
  color: var(--color-plum);
}

.nav a:focus-visible,
.nav button:focus-visible {
  outline: 1px solid currentColor;
  outline-offset: 6px;
}

@media (max-width: 640px) {
  .nav__link {
    display: none;
  }
  .nav__logo {
    font-size: 1.3rem;
  }
}
</style>