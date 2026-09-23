<script setup lang="ts">
import { BRAND, CONTACT } from "~/data/brand";

const year = new Date().getFullYear();
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <address class="site-footer__contact">
        <BrandMark tone="light" />
        <ul class="site-footer__list">
          <li>
            Tel:
            <template v-for="(phone, index) in CONTACT.phones" :key="phone.tel">
              <span v-if="index > 0"> / </span>
              <a :href="`tel:${phone.tel}`" class="site-footer__link">{{ phone.display }}</a>
            </template>
          </li>
          <li>{{ CONTACT.addressLines.join(", ") }}</li>
        </ul>
      </address>

      <section class="site-footer__hours" aria-labelledby="footer-hours-title">
        <h2 id="footer-hours-title" class="site-footer__heading">Horario</h2>
        <dl class="site-footer__schedule">
          <div v-for="entry in CONTACT.schedule" :key="entry.days" class="site-footer__schedule-row">
            <dt>{{ entry.days }}</dt>
            <dd>{{ entry.hours }}</dd>
          </div>
        </dl>
      </section>

      <p class="site-footer__copy">© {{ year }} {{ BRAND }}. Marca ficticia con fines de demostración.</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background-color: var(--color-footer);
  color: var(--color-on-dark-muted);
  padding: var(--space-lg) var(--space-md);
}

.site-footer__inner {
  max-width: 64rem;
  margin-inline: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-md);
}

.site-footer__contact {
  font-style: normal;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.site-footer__list {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: clamp(0.85rem, 1.5vw, 0.98rem);
  line-height: 1.8;
}

.site-footer__link {
  color: var(--color-on-dark-muted);
  text-underline-offset: 3px;
}

.site-footer__link:hover {
  color: var(--color-on-dark);
}

.site-footer__link:focus-visible {
  outline: 2px solid var(--color-focus-on-dark);
  outline-offset: 2px;
}

.site-footer__hours {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.site-footer__heading {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.05rem, 2vw, 1.25rem);
  color: var(--color-on-dark);
}

.site-footer__schedule {
  margin: 0;
  font-size: clamp(0.85rem, 1.5vw, 0.98rem);
}

.site-footer__schedule-row {
  display: flex;
  gap: 0.75rem;
}

.site-footer__schedule-row dd {
  margin: 0;
}

.site-footer__copy {
  flex-basis: 100%;
  margin: 0;
  padding-top: var(--space-sm);
  border-top: 1px solid var(--color-closed);
  font-size: clamp(0.75rem, 1.2vw, 0.875rem);
}
</style>
