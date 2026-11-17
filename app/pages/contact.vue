<template>
  <section class="contact">

  <!-- Back to Home -->
  <NuxtLink to="/" class="contact__back" aria-label="Back to Home">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
    <span>Back</span>
  </NuxtLink>

  <div class="contact__grid">
      <!-- LEFT: form -->
      <form class="contact__form" @submit.prevent="onSubmit">
        <div class="field-row">
          <div class="field">
            <label for="name">Name</label>
            <input id="name" v-model="form.name" type="text" placeholder="Your name" required />
          </div>
          <div class="field">
            <label for="email">Email</label>
            <input id="email" v-model="form.email" type="email" placeholder="you@example.com" required />
          </div>
        </div>

        <div class="field">
          <label for="subject">Subject</label>
          <input id="subject" v-model="form.subject" type="text" placeholder="What is this about?" />
        </div>

        <div class="field">
          <label for="phone">Phone number</label>
          <div class="field__phone">
            <select v-model="form.countryCode" aria-label="Country code">
              <option value="+91">IN +91</option>
              <option value="+1">US +1</option>
              <option value="+44">UK +44</option>
              <option value="+971">AE +971</option>
            </select>
            <input id="phone" v-model="form.phone" type="tel" placeholder="98765 43210" />
          </div>
        </div>

        <div class="field field--grow">
          <label for="message">Message</label>
          <textarea id="message" v-model="form.message" placeholder="Leave us a message" required />
        </div>

        <div class="contact__actions">
          <label class="consent">
            <input v-model="form.agree" type="checkbox" required />
            <span>You agree to our friendly <NuxtLink to="/privacy-policy">privacy policy</NuxtLink>.</span>
          </label>

          <button class="contact__send" type="submit">
            Send Message
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </form>

      <!-- RIGHT: image + info cards -->
      <aside class="contact__side">
        <div class="contact__image">
          <img src="/images/beige2.png" alt="Aambal Resort" />
        </div>

        <div class="contact__cards">
          <div class="info-card">
            <div class="info-card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" />
              </svg>
            </div>
            <h3>Location</h3>
            <p>AAMBAL Resort, Chengamanadu<br />Nedumbassery, Ernakulam,<br />Kerala-683578</p>
          </div>

          <div class="info-card">
            <div class="info-card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
              </svg>
            </div>
            <h3>Open Hours</h3>
            <p>Monday – Sunday<br />10:00 AM – 10:00 PM</p>
          </div>

          <div class="info-card">
            <div class="info-card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
              </svg>
            </div>
            <h3>Email</h3>
            <p>
              <a href="mailto:aambalresort@gmail.com">aambalresort@gmail.com</a><br />
              <a href="mailto:contact@aambalresort.in">contact@aambalresort.in</a>
            </p>
          </div>

          <div class="info-card">
            <div class="info-card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
              </svg>
            </div>
            <h3>Call</h3>
            <p>
              <a href="tel:+919447036444">+91 9447 036 444</a><br />
              <a href="tel:+919747036444">+91 9747 036 444</a><br />
              <a href="tel:+919400814443">+91 9400 814 443</a><br />
              <a href="tel:04842925444">0484 2925 444</a>
            </p>
          </div>
        </div>
      </aside>
    </div>
  </section>
  <Footer v-if="route.path !== '/contact'" />
</template>

<script setup>
const route = useRoute()
const form = reactive({
  name: '',
  email: '',
  subject: '',
  countryCode: '+91',
  phone: '',
  message: '',
  agree: false,
})

function onSubmit() {
  // step 4: decide where this actually goes
  console.log('form data:', { ...form })
}
</script>

<style scoped>
/* ---------- tokens copied from the booking page ---------- */
.contact {
  --page-bg: #faf4ea;
  --card-bg: #ffffff;
  --card-border: #e7ded0;
  --soft-bg: #faf6ef;
  --chip-bg: #f1e7d4;
  --field-bg: #faf8f5;
  --field-border: #cebfab;
  --divider: #ede4d5;
  --ink: #24201c;
  --ink-soft: #4b4136;
  --ink-muted: #5c5246;
  --green: #183c28;
  --green-hover: #122f1f;
  --accent: #c26928;

  box-sizing: border-box;
  min-height: 100svh;
  display: grid;
  padding: 130px 24px 80px;          /* top clears the navbar, same 130px as booking */
  background: var(--page-bg);
  color: var(--ink);
font-family: 'Cormorant Garamond', serif;
}

.contact button,
.contact input,
.contact select,
.contact textarea {
  font-family: inherit;
}

.contact :is(button, a, select, textarea, .consent input):focus-visible {
  outline: 2px solid var(--green);
  outline-offset: 2px;
}

/* ---------- layout: two cards side by side ---------- */
.contact__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: stretch;              /* both columns share one height */
  box-sizing: border-box;
  width: 100%;
  max-width: 1280px;                 /* same as .booking-container */
  margin: 0 auto;
}

/* ---------- form card (same recipe as .room-booking-card) ---------- */
.contact__form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 32px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
}

.field--grow {
  flex: 1;                           /* message box takes the leftover height */
  min-height: 0;
}

.field label {
  margin-bottom: 5px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ink-soft);
}

/* inputs: same as .form-group inputs in the checkout modal */
.field input,
.field select,
.field textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 14px;
  font-size: 14px;
  color: var(--ink);
  background: var(--field-bg);
  border: 1px solid var(--field-border);
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.field input::placeholder,
.field textarea::placeholder {
  color: #9a8e7e;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  background: #ffffff;
  border-color: var(--green);
}

.field textarea {
  flex: 1;
  min-height: 7rem;
  resize: none;
}

/* phone: the wrapper draws the box, select + input sit inside it borderless */
.field__phone {
  display: flex;
  align-items: center;
  background: var(--field-bg);
  border: 1px solid var(--field-border);
  border-radius: 8px;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.field__phone:focus-within {
  background: #ffffff;
  border-color: var(--green);
}

.field__phone input,
.field__phone select {
  background: transparent;
  border: 0;
  border-radius: 0;
}

.field__phone select {
  width: auto;
  appearance: none;
  cursor: pointer;
  padding-right: 12px;
  border-right: 1px solid var(--divider);
}

.field__phone input {
  flex: 1;
  min-width: 0;
}

/* ---------- consent + button ---------- */
.contact__actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 6px;
}

.consent {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--ink-soft);
  cursor: pointer;
}

/* same look as .custom-checkbox on the booking page */
.consent input {
  appearance: none;
  flex: none;
  width: 18px;
  height: 18px;
  margin: 0;
  display: grid;
  place-items: center;
  border: 2px solid #a89c89;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
}

.consent input:checked {
  background: var(--green);
  border-color: var(--green);
}

.consent input:checked::after {
  content: '✓';
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  line-height: 1;
}

.consent a {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.contact {
  position: relative;
}

/* Back to Home */
.contact__back {
  position: absolute;
  top: 115px;
  left: clamp(24px, 5vw, 75px);
  z-index: 60;

  display: inline-flex;
  align-items: center;
  gap: 10px;

  color: var(--green);
  text-decoration: none;
  font-family: 'Cormorant Garamond',serif;
  font-size: 17px;
  font-weight: 500;

  transition: transform 0.3s ease, color 0.3s ease;
}

.contact__back svg {
  width: 22px;
  height: 22px;
}

.contact__back:hover {
  transform: translateX(-5px);
  color: var(--accent);
}

/* same as .confirm-booking-btn */
.contact__send {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 14px;
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  background: var(--green);
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.contact__send:hover {
  background: var(--green-hover);
}

.contact__send svg {
  transition: transform 0.3s ease;
}

.contact__send:hover svg {
  transform: translateX(4px);
}

/* ---------- right column ---------- */
.contact__side {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.contact__image {
  position: relative;
  flex: 1;                           /* image takes whatever height the cards leave */
  min-height: 14rem;
  overflow: hidden;
  background: #181512;               /* same dark backing as .room-image-slider */
  border: 1px solid var(--card-border);
  border-radius: 12px;
}

.contact__image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.contact__cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* info cards: white card, same border + radius as the room cards */
.info-card {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  align-content: start;
  column-gap: 12px;
  row-gap: 10px;
  padding: 16px 18px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
}

/* icon tile uses the same beige as .meta-badge, icon in the booking green */
.info-card__icon {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  color: var(--green);
  background: var(--chip-bg);
  border-radius: 8px;
}

.info-card__icon svg {
  width: 18px;
  height: 18px;
}

.info-card h3 {
  margin: 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px;
  font-weight: 600;
  color: #1c1713;
}

.info-card p {
  grid-column: 1 / -1;
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--ink-muted);
  overflow-wrap: anywhere;
}

.info-card a {
  color: inherit;
  text-decoration: none;
}

.info-card a:hover {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* ---------- headings that use the heading font ---------- */
@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; }
}

/* ---------- responsive ---------- */
@media (max-width: 800px) {
  .contact {
    min-height: 0;
    padding: 110px 16px 60px;
  }
  .contact__grid {
    grid-template-columns: 1fr;
  }
  .contact__form {
    padding: 22px;
  }
  .field--grow { flex: none; }
  .field textarea { flex: none; }
  .contact__image {
    flex: none;
    min-height: 0;
    aspect-ratio: 4 / 3;
  }
}

@media (max-width: 480px) {
  .field-row,
  .contact__cards {
    grid-template-columns: 1fr;
  }
}
</style>