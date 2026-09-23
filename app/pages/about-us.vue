<script setup lang="ts">
import { stockImage } from "~/data/services";
import { ABOUT_BANNER, COMPANY_VALUES, MILESTONES, ORIGIN_STORY, PHILOSOPHY, PROMISE_QUOTE } from "~/data/about";

useHead({ title: "Nosotros" });
</script>

<template>
  <SiteHeader />
  <main class="about-page">
    <section class="about-banner" aria-labelledby="about-title">
      <!-- The one absolutely positioned layer: image + scrim travel together. -->
      <div class="about-banner__media">
        <img
          class="about-banner__image"
          :src="stockImage(ABOUT_BANNER.photoId, 1920)"
          :alt="ABOUT_BANNER.imageAlt"
          fetchpriority="high"
        />
      </div>

      <header class="about-banner__content">
        <p class="about-banner__eyebrow">Nuestra historia</p>
        <h1 id="about-title" class="about-banner__title">Hacemos del descanso un ritual</h1>
      </header>
    </section>

    <section class="origin" aria-labelledby="origin-title">
      <h2 id="origin-title" class="section-title">Cómo empezamos</h2>
      <p class="origin__paragraph">{{ ORIGIN_STORY }}</p>
    </section>

    <section class="philosophy" aria-labelledby="philosophy-title">
      <div class="philosophy__text">
        <h2 id="philosophy-title" class="section-title">Nuestra filosofía</h2>
        <p v-for="paragraph in PHILOSOPHY.paragraphs" :key="paragraph" class="philosophy__paragraph">
          {{ paragraph }}
        </p>
      </div>
      <img
        class="philosophy__image"
        :src="stockImage(PHILOSOPHY.photoId, 1000)"
        :alt="PHILOSOPHY.imageAlt"
        loading="lazy"
        decoding="async"
      />
    </section>

    <figure class="promise">
      <blockquote class="promise__quote">
        <p>“{{ PROMISE_QUOTE }}”</p>
      </blockquote>
      <figcaption class="promise__caption">Nuestra promesa</figcaption>
    </figure>

    <section class="values" aria-labelledby="values-title">
      <header class="values__header">
        <h2 id="values-title" class="section-title">Nuestros valores</h2>
        <p class="section-subtitle">Lo que guía cada tratamiento, cada día</p>
      </header>

      <ol class="values__grid" role="list">
        <li v-for="(value, index) in COMPANY_VALUES" :key="value.title">
          <article class="value-card">
            <span class="value-card__number" aria-hidden="true">{{ String(index + 1).padStart(2, "0") }}</span>
            <h3 class="value-card__title">{{ value.title }}</h3>
            <p class="value-card__description">{{ value.description }}</p>
          </article>
        </li>
      </ol>
    </section>

    <section class="milestones" aria-labelledby="milestones-title">
      <h2 id="milestones-title" class="section-title">Nuestro progreso</h2>
      <ol class="milestones__list" role="list">
        <li v-for="milestone in MILESTONES" :key="milestone.year" class="milestones__item">
          <p class="milestones__year">{{ milestone.year }}</p>
          <p class="milestones__description">{{ milestone.description }}</p>
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

/* ── Banner ── */
.about-banner {
  position: relative;
  display: flex;
  align-items: flex-end;
  min-height: clamp(18rem, 48vh, 28rem);
  overflow: hidden;
  color: var(--color-on-dark);
}

.about-banner__media {
  position: absolute;
  inset: 0;
}

.about-banner__media::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--color-scrim) 0%, var(--color-scrim-soft) 55%, var(--color-scrim-none) 100%);
}

.about-banner__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.85) saturate(0.88) contrast(1.05);
}

/* Positioned only to stack above the media layer; stays in normal flow. */
.about-banner__content {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: min(92vw, 64rem);
  margin-inline: auto;
  padding-block: var(--space-lg);
}

.about-banner__eyebrow {
  margin: 0;
  font-size: clamp(0.78rem, 1.6vw, 0.92rem);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--color-on-dark-muted);
}

.about-banner__title {
  margin: 0;
  max-width: 18ch;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(2.1rem, 6vw, 3.8rem);
  letter-spacing: 0.02em;
  text-shadow: 0 2px 16px var(--color-scrim);
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
