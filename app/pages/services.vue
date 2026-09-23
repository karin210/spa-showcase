<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { serviceCategories, stockImage } from "~/data/services";
import { AMENITIES, SERVICES_BANNER_PHOTO_ID } from "~/data/serviceDetails";
import { useLocaleFormat } from "~/composables/useLocaleFormat";

const { t: trans, tm, rt } = useI18n();
const { formatCurrency } = useLocaleFormat();
const localePath = useLocalePath();

useHead(() => ({ title: trans("services.page.meta.title") }));

// "Ideal para" is a list in the catalogue, so it is read as raw messages and resolved one by one.
function idealFor(categoryId: string): string[] {
  return (tm(`services.categories.${categoryId}.idealFor`) as unknown[]).map((item) => rt(item as string));
}
</script>

<template>
  <SiteHeader />
  <main class="services-page">
    <PageBanner
      :photo-id="SERVICES_BANNER_PHOTO_ID"
      :image-alt="trans('services.page.banner.imageAlt')"
      :eyebrow="trans('services.page.banner.eyebrow')"
      :title="trans('services.page.banner.title')"
      title-id="services-page-title"
    />

    <section class="services-intro" :aria-label="trans('services.page.introLabel')">
      <p class="services-intro__text">{{ trans("services.page.intro") }}</p>
      <nav class="services-intro__nav" :aria-label="trans('services.page.categoriesNav')">
        <ul class="services-intro__nav-list" role="list">
          <li v-for="category in serviceCategories" :key="category.id">
            <a :href="`#${category.id}`" class="services-intro__nav-link">
              {{ trans(`services.categories.${category.id}.title`) }}
            </a>
          </li>
        </ul>
      </nav>
    </section>

    <section
      v-for="(category, index) in serviceCategories"
      :id="category.id"
      :key="category.id"
      :class="['category', { 'category--reversed': index % 2 === 1 }]"
      :aria-labelledby="`${category.id}-heading`"
    >
      <img
        class="category__image"
        :src="stockImage(category.photoId, 1000)"
        :alt="trans(`services.categories.${category.id}.imageAlt`)"
        loading="lazy"
        decoding="async"
      />

      <div class="category__body">
        <header class="category__header">
          <h2 :id="`${category.id}-heading`" class="section-title">
            {{ trans(`services.categories.${category.id}.title`) }}
          </h2>
          <p class="section-subtitle">{{ trans(`services.categories.${category.id}.blurb`) }}</p>
        </header>

        <p class="category__description">{{ trans(`services.categories.${category.id}.description`) }}</p>

        <section class="category__ideal" :aria-labelledby="`${category.id}-ideal`">
          <h3 :id="`${category.id}-ideal`" class="category__label">{{ trans("services.page.idealFor") }}</h3>
          <ul class="category__ideal-list" role="list">
            <li v-for="item in idealFor(category.id)" :key="item" class="category__ideal-item">
              <AppIcon name="leaf" />
              {{ item }}
            </li>
          </ul>
        </section>

        <ul class="treatments" role="list">
          <li v-for="service in category.services" :key="service.id">
            <article class="treatment">
              <header class="treatment__header">
                <h3 class="treatment__name">{{ trans(`services.items.${service.id}.name`) }}</h3>
                <p class="treatment__meta">
                  <span class="treatment__duration">
                    <AppIcon name="clock" /> {{ trans("services.minutes", { count: service.durationMinutes }) }}
                  </span>
                  <span class="treatment__price">{{ formatCurrency(service.price) }}</span>
                </p>
              </header>
              <p class="treatment__description">{{ trans(`services.items.${service.id}.description`) }}</p>
            </article>
          </li>
        </ul>
      </div>
    </section>

    <section class="amenities" aria-labelledby="amenities-title">
      <header class="amenities__header">
        <h2 id="amenities-title" class="section-title">{{ trans("services.page.amenities.title") }}</h2>
        <p class="section-subtitle">{{ trans("services.page.amenities.subtitle") }}</p>
      </header>

      <ul class="amenities__grid" role="list">
        <li v-for="amenity in AMENITIES" :key="amenity.id">
          <article class="amenity">
            <img
              class="amenity__image"
              :src="stockImage(amenity.photoId, 700)"
              :alt="trans(`services.page.amenities.items.${amenity.id}.imageAlt`)"
              loading="lazy"
              decoding="async"
            />
            <!-- Absolutely positioned as one wrapper: scrim + copy travel together. -->
            <div class="amenity__body">
              <h3 class="amenity__title">{{ trans(`services.page.amenities.items.${amenity.id}.title`) }}</h3>
              <p class="amenity__description">{{ trans(`services.page.amenities.items.${amenity.id}.description`) }}</p>
            </div>
          </article>
        </li>
      </ul>
    </section>

    <section class="services-cta" aria-labelledby="services-cta-title">
      <h2 id="services-cta-title" class="services-cta__title">{{ trans("services.page.cta.title") }}</h2>
      <p class="services-cta__text">{{ trans("services.page.cta.text") }}</p>
      <PrimaryBtn :link="localePath('booking')">{{ trans("services.page.cta.action") }}</PrimaryBtn>
    </section>
  </main>
  <SiteFooter />
</template>

<style scoped>
.services-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  padding-bottom: var(--space-lg);
}

/* ── Intro ── */
.services-intro {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  width: min(92vw, 44rem);
  margin-inline: auto;
  text-align: center;
}

.services-intro__text {
  margin: 0;
  font-family: var(--font-serif);
  font-size: clamp(1.15rem, 2.4vw, 1.4rem);
  line-height: 1.6;
}

.services-intro__nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.services-intro__nav-link {
  display: inline-flex;
  padding: 0.5rem 1.1rem;
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  font-weight: 500;
  color: var(--color-primary);
  text-decoration: none;
  background-color: var(--color-surface);
  border: 1px solid var(--color-primary);
  border-radius: 999px;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.services-intro__nav-link:hover {
  background-color: var(--color-primary);
  color: var(--color-on-dark);
}

.services-intro__nav-link:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 3px;
}

/* ── Category ── */
.category {
  width: min(92vw, 64rem);
  margin-inline: auto;
  display: grid;
  grid-template-columns: 1fr;
  align-items: start;
  gap: var(--space-md);
}

@media (min-width: 56rem) {
  .category {
    grid-template-columns: 1fr 1.4fr;
  }

  /* Alternate the image side so the page reads as a rhythm, not a list. */
  .category--reversed .category__image {
    order: 1;
  }

  .category__image {
    position: sticky;
    top: calc(var(--header-height) + var(--space-sm));
  }
}

.category__image {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  max-height: 32rem;
  object-fit: cover;
  border-radius: var(--radius-lg);
  box-shadow: 0 6px 24px var(--color-shadow);
  filter: brightness(0.92) saturate(0.88) contrast(1.05);
}

.category__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.category__header {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.category__description {
  margin: 0;
  font-size: clamp(1rem, 1.6vw, 1.1rem);
  line-height: 1.7;
  color: var(--color-ink-muted);
}

.category__ideal {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category__label {
  margin: 0;
  font-family: var(--font-body);
  font-size: clamp(0.75rem, 1.5vw, 0.88rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--color-primary);
}

.category__ideal-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category__ideal-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.85rem;
  font-size: clamp(0.85rem, 1.8vw, 0.95rem);
  color: var(--color-primary-dark);
  background-color: var(--color-primary-soft);
  border-radius: 999px;
}

.treatments {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.treatment {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.9rem 1.1rem;
  border-left: 3px solid var(--color-primary);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  background-color: var(--color-surface);
  box-shadow: 0 2px 12px var(--color-shadow);
}

.treatment__header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.25rem 1rem;
}

.treatment__name {
  margin: 0;
  font-size: clamp(1.1rem, 2.3vw, 1.3rem);
  font-weight: 700;
}

.treatment__meta {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  color: var(--color-ink-muted);
}

.treatment__duration {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.treatment__price {
  font-weight: 600;
  color: var(--color-primary);
}

.treatment__description {
  margin: 0;
  font-size: clamp(0.92rem, 1.6vw, 1rem);
  color: var(--color-ink-muted);
}

/* ── Amenities ── */
.amenities {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding: var(--space-lg) var(--space-md);
  background-color: var(--color-secondary);
}

.amenities__header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;
}

.amenities__grid {
  list-style: none;
  margin: 0 auto;
  padding: 0;
  width: min(100%, 64rem);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr));
  gap: var(--space-sm);
}

.amenity {
  position: relative;
  height: clamp(18rem, 32vw, 22rem);
  overflow: hidden;
  box-shadow: 0 4px 18px var(--color-shadow);
}

.amenity__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.9) saturate(0.85) sepia(0.08) contrast(1.05);
  transition: transform 0.6s ease;
}

.amenity:hover .amenity__image {
  transform: scale(1.04);
}

.amenity__body {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.35rem;
  padding: var(--space-md);
  color: var(--color-on-dark);
  background: linear-gradient(to top, var(--color-scrim) 10%, var(--color-scrim-soft) 45%, var(--color-scrim-none) 70%);
}

.amenity__title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.25rem, 2.6vw, 1.5rem);
  letter-spacing: 0.02em;
}

.amenity__description {
  margin: 0;
  font-size: clamp(0.92rem, 1.6vw, 1rem);
  color: var(--color-on-dark-muted);
}

@media (prefers-reduced-motion: reduce) {
  .amenity__image {
    transition: none;
  }
}

/* ── CTA ── */
.services-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  width: min(92vw, 40rem);
  margin-inline: auto;
  padding: var(--space-lg) var(--space-md);
  text-align: center;
  border-radius: var(--radius-lg);
  background-color: var(--color-primary);
  color: var(--color-on-dark);
}

.services-cta__title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.5rem, 3.6vw, 2.2rem);
}

.services-cta__text {
  margin: 0;
  font-size: clamp(1rem, 1.8vw, 1.1rem);
  color: var(--color-on-dark-muted);
}
</style>
