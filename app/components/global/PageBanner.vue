<script setup lang="ts">
// Image banner that opens an inner page, holding the page's <h1>.
import { stockImage } from "~/data/services";

defineProps<{
  photoId: string;
  imageAlt: string;
  eyebrow: string;
  title: string;
  titleId: string;
}>();
</script>

<template>
  <section class="page-banner" :aria-labelledby="titleId">
    <!-- The one absolutely positioned layer: image + scrim travel together. -->
    <div class="page-banner__media">
      <img class="page-banner__image" :src="stockImage(photoId, 1920)" :alt="imageAlt" fetchpriority="high" />
    </div>

    <header class="page-banner__content">
      <p class="page-banner__eyebrow">{{ eyebrow }}</p>
      <h1 :id="titleId" class="page-banner__title">{{ title }}</h1>
    </header>
  </section>
</template>

<style scoped>
.page-banner {
  position: relative;
  display: flex;
  align-items: flex-end;
  min-height: clamp(18rem, 48vh, 28rem);
  overflow: hidden;
  color: var(--color-on-dark);
}

.page-banner__media {
  position: absolute;
  inset: 0;
}

.page-banner__media::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--color-scrim) 0%, var(--color-scrim-soft) 55%, var(--color-scrim-none) 100%);
}

.page-banner__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.85) saturate(0.88) contrast(1.05);
}

/* Positioned only to stack above the media layer; stays in normal flow. */
.page-banner__content {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: min(92vw, 64rem);
  margin-inline: auto;
  padding-block: var(--space-lg);
}

.page-banner__eyebrow {
  margin: 0;
  font-size: clamp(0.78rem, 1.6vw, 0.92rem);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--color-on-dark-muted);
}

.page-banner__title {
  margin: 0;
  max-width: 18ch;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(2.1rem, 6vw, 3.8rem);
  letter-spacing: 0.02em;
  text-shadow: 0 2px 16px var(--color-scrim);
}
</style>
