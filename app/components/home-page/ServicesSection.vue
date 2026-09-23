<script setup lang="ts">
import { ref } from "vue";
import type { ServiceCategory } from "~/types/services";
import { serviceCategories, stockImage } from "~/data/services";
import { formatCurrency } from "~/utils/format";

const activeCategory = ref<ServiceCategory | null>(null);
const detailsOpen = ref(false);

function openDetails(category: ServiceCategory): void {
  activeCategory.value = category;
  detailsOpen.value = true;
}
</script>

<template>
  <section id="services" class="services" aria-labelledby="services-title">
    <header class="services__header">
      <h2 id="services-title" class="section-title">Nuestros servicios</h2>
      <p class="section-subtitle">Tratamientos pensados para que salgas más ligera de lo que llegaste</p>
    </header>

    <ul class="categories-grid" role="list">
      <li v-for="category in serviceCategories" :key="category.id">
        <article class="category-card" :aria-labelledby="`${category.id}-title`">
          <img
            :id="`${category.id}-image`"
            :src="stockImage(category.photoId, 1200)"
            :alt="category.imageAlt"
            class="category-card__image"
            loading="lazy"
            decoding="async"
          />
          <!-- Absolutely positioned as one wrapper: scrim + copy travel together. -->
          <div class="category-card__body">
            <h3 :id="`${category.id}-title`" class="category-card__title">{{ category.title }}</h3>
            <p class="category-card__blurb">{{ category.blurb }}</p>
            <button type="button" class="category-card__details" @click="openDetails(category)">
              Ver tratamientos
            </button>
          </div>
        </article>
      </li>
    </ul>

    <ModalDialog
      :open="detailsOpen"
      labelledby="service-details-title"
      dismissible
      @close="detailsOpen = false"
    >
      <h2 id="service-details-title" class="modal-title">{{ activeCategory?.title }}</h2>
      <ul class="service-list" role="list">
        <li v-for="service in activeCategory?.services" :key="service.name" class="service-list__item">
          <span class="service-list__name">{{ service.name }}</span>
          <span class="service-list__meta">
            <span>{{ service.durationMinutes }} min</span>
            <span class="service-list__price">{{ formatCurrency(service.price) }}</span>
          </span>
        </li>
      </ul>
    </ModalDialog>
  </section>
</template>

<style scoped>
.services {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  padding-top: var(--space-lg);
}

.services__header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 40rem;
  margin-inline: auto;
  padding-inline: var(--space-md);
  text-align: center;
}

.categories-grid {
  list-style: none;
  margin: 0 auto;
  padding: 0;
  width: min(92vw, 90rem);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
}

@media (min-width: 40rem) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.category-card {
  position: relative;
  height: clamp(22rem, 52vw, 34rem);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 6px 24px var(--color-shadow);
}

.category-card__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.9) saturate(0.88) contrast(1.05);
  transition: transform 0.6s ease;
}

.category-card:hover .category-card__image {
  transform: scale(1.04);
}

.category-card__body {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
  padding: var(--space-md);
  text-align: center;
  color: var(--color-on-dark);
  background: linear-gradient(to top, var(--color-scrim) 8%, var(--color-scrim-soft) 38%, var(--color-scrim-none) 62%);
}

.category-card__title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.5rem, 3vw, 2.3rem);
  letter-spacing: 0.03em;
}

.category-card__blurb {
  margin: 0;
  max-width: 34ch;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(1.05rem, 1.8vw, 1.4rem);
  color: var(--color-on-dark-muted);
}

.category-card__details {
  margin-top: 0.75rem;
  padding: clamp(0.5rem, 1.5vw, 0.65rem) clamp(1.25rem, 3vw, 1.75rem);
  background-color: transparent;
  color: var(--color-on-dark);
  font-size: clamp(0.85rem, 2vw, 1rem);
  font-weight: 500;
  letter-spacing: 0.04em;
  border: 1px solid var(--color-on-dark);
  border-radius: 999px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.category-card__details:hover {
  background-color: var(--color-on-dark);
  color: var(--color-ink);
}

.category-card__details:focus-visible {
  outline: 3px solid var(--color-focus-on-dark);
  outline-offset: 3px;
}

/* ── Details modal ── */
.service-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.service-list__item {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.25rem 1rem;
  padding: 0.75rem 1rem;
  border-left: 3px solid var(--color-primary);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  background-color: var(--color-background);
}

.service-list__name {
  font-family: var(--font-serif);
  font-size: clamp(1.05rem, 2.3vw, 1.25rem);
  font-weight: 600;
}

.service-list__meta {
  display: flex;
  gap: 0.75rem;
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  color: var(--color-ink-muted);
}

.service-list__price {
  font-weight: 600;
  color: var(--color-primary);
}

@media (prefers-reduced-motion: reduce) {
  .category-card__image {
    transition: none;
  }
}
</style>
