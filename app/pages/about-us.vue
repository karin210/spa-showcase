<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { stockImage } from "~/data/services";
import { ABOUT_BANNER_PHOTO_ID, COMPANY_VALUE_IDS, MILESTONE_YEARS, PHILOSOPHY_PHOTO_ID } from "~/data/about";

const { t: trans, tm, rt } = useI18n();

useHead(() => ({ title: trans("about.meta.title") }));

// The philosophy is a list of paragraphs in the catalogue, resolved one by one.
const philosophyParagraphs = computed<string[]>(() =>
  (tm("about.philosophy.paragraphs") as unknown[]).map((paragraph) => rt(paragraph as string)),
);
</script>

<template>
  <SiteHeader />
  <main class="about-page">
    <PageBanner
      :photo-id="ABOUT_BANNER_PHOTO_ID"
      :image-alt="trans('about.banner.imageAlt')"
      :eyebrow="trans('about.banner.eyebrow')"
      :title="trans('about.banner.title')"
      title-id="about-title"
    />

    <section class="origin" aria-labelledby="origin-title">
      <h2 id="origin-title" class="section-title">{{ trans("about.origin.title") }}</h2>
      <p class="origin__paragraph">{{ trans("about.origin.text") }}</p>
    </section>

    <section class="philosophy" aria-labelledby="philosophy-title">
      <div class="philosophy__text">
        <h2 id="philosophy-title" class="section-title">{{ trans("about.philosophy.title") }}</h2>
        <p v-for="paragraph in philosophyParagraphs" :key="paragraph" class="philosophy__paragraph">
          {{ paragraph }}
        </p>
      </div>
      <img
        class="philosophy__image"
        :src="stockImage(PHILOSOPHY_PHOTO_ID, 1000)"
        :alt="trans('about.philosophy.imageAlt')"
        loading="lazy"
        decoding="async"
      />
    </section>

    <figure class="promise">
      <blockquote class="promise__quote">
        <p>“{{ trans("about.promise.quote") }}”</p>
      </blockquote>
      <figcaption class="promise__caption">{{ trans("about.promise.caption") }}</figcaption>
    </figure>

    <section class="values" aria-labelledby="values-title">
      <header class="values__header">
        <h2 id="values-title" class="section-title">{{ trans("about.values.title") }}</h2>
        <p class="section-subtitle">{{ trans("about.values.subtitle") }}</p>
      </header>

      <ol class="values__grid" role="list">
        <li v-for="(valueId, index) in COMPANY_VALUE_IDS" :key="valueId">
          <article class="value-card">
            <span class="value-card__number" aria-hidden="true">{{ String(index + 1).padStart(2, "0") }}</span>
            <h3 class="value-card__title">{{ trans(`about.values.items.${valueId}.title`) }}</h3>
            <p class="value-card__description">{{ trans(`about.values.items.${valueId}.description`) }}</p>
          </article>
        </li>
      </ol>
    </section>

    <section class="milestones" aria-labelledby="milestones-title">
      <h2 id="milestones-title" class="section-title">{{ trans("about.milestones.title") }}</h2>
      <ol class="milestones__list" role="list">
        <li v-for="year in MILESTONE_YEARS" :key="year" class="milestones__item">
          <p class="milestones__year">{{ year }}</p>
          <p class="milestones__description">{{ trans(`about.milestones.items.${year}`) }}</p>
        </li>
      </ol>
    </section>

    <HomePageContactSection />
  </main>
  <SiteFooter />
</template>

<style scoped>
.about-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

/* ── Origin ── */
.origin {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  width: min(92vw, 44rem);
  margin-inline: auto;
  text-align: center;
}

.origin__paragraph {
  margin: 0;
  font-family: var(--font-serif);
  font-size: clamp(1.15rem, 2.4vw, 1.4rem);
  line-height: 1.6;
}

/* ── Philosophy ── */
.philosophy {
  width: min(92vw, 64rem);
  margin-inline: auto;
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  gap: var(--space-md);
}

@media (min-width: 48rem) {
  .philosophy {
    grid-template-columns: 1.2fr 1fr;
  }
}

.philosophy__text {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.philosophy__paragraph {
  margin: 0;
  font-size: clamp(1rem, 1.6vw, 1.1rem);
  line-height: 1.7;
  color: var(--color-ink-muted);
}

.philosophy__image {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  border-radius: var(--radius-lg);
  box-shadow: 0 6px 24px var(--color-shadow);
  filter: brightness(0.94) saturate(0.88) sepia(0.08) contrast(1.04);
}

/* ── Promise ── */
.promise {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-lg) var(--space-md);
  text-align: center;
  background-color: var(--color-primary);
  color: var(--color-on-dark);
}

.promise__quote {
  margin: 0;
  max-width: 40ch;
}

.promise__quote p {
  margin: 0;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(1.4rem, 3.6vw, 2.2rem);
  line-height: 1.35;
}

.promise__caption {
  font-size: clamp(0.78rem, 1.6vw, 0.9rem);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--color-on-dark-muted);
}

/* ── Values ── */
.values {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  width: min(92vw, 64rem);
  margin-inline: auto;
}

.values__header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;
}

.values__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr));
  gap: var(--space-sm);
}

.value-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: var(--space-md);
  border-radius: var(--radius-md);
  border-top: 3px solid var(--color-primary);
  background-color: var(--color-surface);
  box-shadow: 0 2px 16px var(--color-shadow);
}

.value-card__number {
  font-family: var(--font-display);
  font-size: clamp(0.9rem, 1.8vw, 1rem);
  letter-spacing: 0.12em;
  color: var(--color-primary);
}

.value-card__title {
  margin: 0;
  font-weight: 700;
  font-size: clamp(1.2rem, 2.6vw, 1.45rem);
}

.value-card__description {
  margin: 0;
  font-size: clamp(0.92rem, 1.6vw, 1rem);
  color: var(--color-ink-muted);
}

/* ── Milestones ── */
.milestones {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  width: min(92vw, 48rem);
  margin-inline: auto;
}

.milestones .section-title {
  text-align: center;
}

.milestones__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  border-left: 2px solid var(--color-secondary-dark);
}

.milestones__item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding-left: var(--space-md);
}

.milestones__year {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 2.6vw, 1.5rem);
  color: var(--color-primary);
}

.milestones__description {
  margin: 0;
  font-size: clamp(0.95rem, 1.6vw, 1.05rem);
}
</style>
