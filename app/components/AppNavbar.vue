<template>
  <header
    class="nav"
    :class="{ 'nav--visible': isVisible, 'nav--solid': isSolid }"
  >

    <!-- MENU -->
    <div class="menu-wrapper">

      <button
        class="nav__menu"
        type="button"
        aria-label="Open menu"
        :aria-expanded="menuOpen"
        @click="menuOpen = !menuOpen"
      >
        <span class="nav__lines">
          <span></span>
          <span></span>
        </span>
        <span>Menu</span>
      </button>

      <!-- SMALL MENU DROPDOWN -->
      <Transition name="menu-dropdown">
        <div v-if="menuOpen" class="menu-dropdown">

          <NuxtLink to="/#hero" @click="closeMenu">Home</NuxtLink>
          <NuxtLink to="/#about" @click="closeMenu">About</NuxtLink>
          <NuxtLink to="/#specials" @click="closeMenu">Specials</NuxtLink>
          <NuxtLink to="/#events" @click="closeMenu">Events</NuxtLink>
          <NuxtLink to="/#gallery" @click="closeMenu">Gallery</NuxtLink>

        </div>
      </Transition>

    </div>


    <!-- CENTER LOGO -->
    <NuxtLink to="/" class="nav__logo">
      <img src="/images/logo_aambal.png" alt="Aambal Resort" />
    </NuxtLink>


    <!-- RIGHT SIDE -->
    <div class="nav__actions">
      <a href="#" class="nav__link">Contact</a>
      <NuxtLink to="/book" class="nav__cta">Book a stay</NuxtLink>
    </div>

  </header>
</template>


<script setup>
// Route of your booking page
const BOOKING_PATH = '/book'

const route = useRoute()
const introDone = useState('introDone', () => false)

const menuOpen = ref(false)

// The intro animation only runs on the home page, so on every other page
// the navbar must be visible straight away.
const isVisible = computed(() => introDone.value || route.path !== '/')

// The booking page has a light background, so the navbar switches to dark text on cream.
const isSolid = computed(() => route.path.startsWith(BOOKING_PATH))

function closeMenu() {
  menuOpen.value = false
}

// Close the dropdown whenever the route changes
watch(() => route.fullPath, closeMenu)
</script>


<style scoped>

.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;

  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;

  padding: 1.5rem clamp(1.25rem, 3vw, 3rem);

  color: #fff;

  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.35),
    transparent
  );

  font-size: 0.85rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;

  opacity: 0;
  transform: translateY(-16px);
  pointer-events: none;

  transition:
    opacity 0.8s ease,
    transform 0.8s ease,
    background 0.3s ease,
    color 0.3s ease;
}


.nav--visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}


/* Light-page variant (booking page) */
.nav--solid {
  color: #183c28;
  background: #faf4ea;
  border-bottom: 1px solid #e5dccb;
}


.nav a,
.nav button {
  color: inherit;
  text-decoration: none;
  font: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
}


/* =========================
   MENU
========================= */

.menu-wrapper {
  position: relative;
  justify-self: start;
}


.nav__menu {
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


/* =========================
   DROPDOWN MENU
========================= */

.menu-dropdown {
  position: absolute;

  top: calc(100% + 1.2rem);
  left: 0;

  width: 190px;

  padding: 0.6rem 0;

  background: rgba(46, 137, 183, 0.94);

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;

  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);

  display: flex;
  flex-direction: column;

  z-index: 100;
}


.menu-dropdown a {
  display: block;

  padding: 0.75rem 1.2rem;

  color: #fff;

  font-size: 0.8rem;
  letter-spacing: 0.15em;

  transition:
    background 0.25s ease,
    padding-left 0.25s ease,
    color 0.25s ease;
}


.menu-dropdown a:hover {
  background: rgba(255, 255, 255, 0.12);

  padding-left: 1.5rem;

  color: #f7dd9a;
}


/* Dropdown animation */

.menu-dropdown-enter-active,
.menu-dropdown-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}


.menu-dropdown-enter-from,
.menu-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}


/* =========================
   CENTER LOGO
========================= */

.nav__logo {
  display: flex;
  align-items: center;
  justify-content: center;
}


.nav__logo img {
  width: 90px;
  height: auto;

  display: block;
  object-fit: contain;
}


/* =========================
   RIGHT SIDE
========================= */

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
  border-radius: 999px;

  white-space: nowrap;

  transition:
    background 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease;
}


.nav__cta:hover {
  background: #fff;
  color: var(--color-plum);
}


.nav--solid .nav__cta {
  border-color: rgba(24, 60, 40, 0.45);
}


.nav--solid .nav__cta:hover {
  background: #183c28;
  border-color: #183c28;
  color: #fff;
}


/* =========================
   FOCUS
========================= */

.nav a:focus-visible,
.nav button:focus-visible {
  outline: 1px solid currentColor;
  outline-offset: 6px;
}


/* =========================
   MOBILE
========================= */

@media (max-width: 640px) {

  .nav__link {
    display: none;
  }

  .nav__logo img {
    width: 75px;
  }

  .menu-dropdown {
    width: 165px;
  }

}

</style>