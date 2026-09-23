<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { stockImage } from "~/data/services";
import { usePwaInstall } from "~/composables/usePwaInstall";

const { t: trans } = useI18n();
const localePath = useLocalePath();
const { canInstall, install } = usePwaInstall();
const isInstalling = ref(false);

async function handleInstall(): Promise<void> {
  isInstalling.value = true;
  try {
    await install();
  } finally {
    isInstalling.value = false;
  }
}
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <!-- The one absolutely positioned layer: image + scrim travel together. -->
    <div class="hero__media">
      <picture>
        <source media="(min-width: 48rem)" :srcset="stockImage('1560750588-73207b1ef5b8', 1920)" />
        <img
          class="hero__image"
          :src="stockImage('1600334129128-685c5582fd35', 900)"
          :alt="trans('home.hero.imageAlt')"
          fetchpriority="high"
        />
      </picture>
    </div>

    <div class="hero__foreground">
      <div class="hero__logo-band">
        <BrandMark tone="light" class="hero__brand" />
      </div>

      <div class="hero__content">
        <p class="hero__eyebrow">{{ trans("home.hero.eyebrow") }}</p>
        <h1 id="hero-title" class="hero__title">{{ trans("home.hero.title") }}</h1>
        <div class="hero__cta-wrapper">
          <PrimaryBtn id="booking-cta" :link="localePath('booking')">{{ trans("home.hero.book") }}</PrimaryBtn>
          <PrimaryBtn v-if="canInstall" class="hero__cta-ghost" :disabled="isInstalling" @click="handleInstall">
            {{ isInstalling ? trans("home.hero.installing") : trans("home.hero.installApp") }}
          </PrimaryBtn>
        </div>
      </div>
    </div>

    <HomePageStartingAnimation />
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  display: flex;
  min-height: clamp(30rem, 86vh, 52rem);
  overflow: hidden;
  text-align: center;
  color: var(--color-on-dark);
}

.hero__media {
  position: absolute;
  inset: 0;
}

.hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.82) saturate(0.9) contrast(1.05);
}

/* Scrim between the photo and the text: dark at the bottom where the copy sits. */
.hero__media::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    var(--color-scrim-soft) 0%,
    var(--color-scrim-none) 35%,
    var(--color-scrim-soft) 60%,
    var(--color-scrim) 100%
  );
}

.hero__foreground {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-lg);
  padding: 0 var(--space-md) var(--space-lg);
}

.hero__logo-band {
  padding: clamp(1rem, 3vw, 1.75rem) clamp(1.5rem, 5vw, 3.5rem);
  background-color: var(--color-primary);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  box-shadow: 0 6px 24px var(--color-shadow-strong);
}

.hero__logo-band > * {
  opacity: 0;
  animation: hero-fade-in 0.6s ease 2.3s forwards;
}

.hero__brand :deep(.brand-mark__name) {
  font-size: clamp(1.5rem, 4vw, 2.4rem);
}

.hero__brand :deep(.brand-mark__sub) {
  font-size: clamp(0.9rem, 2vw, 1.2rem);
}

.hero__brand :deep(.brand-mark__glyph) {
  width: clamp(2rem, 5vw, 3rem);
  height: clamp(2rem, 5vw, 3rem);
}

.hero__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  max-width: 44rem;
}

.hero__eyebrow {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  font-size: clamp(0.72rem, 1.4vw, 0.95rem);
  color: var(--color-on-dark-muted);
}

.hero__title {
  margin: 0;
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: clamp(2rem, 6vw, 3.8rem);
  line-height: 1.08;
  text-shadow: 0 2px 16px var(--color-scrim);
}

.hero__cta-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-sm);
  margin-top: var(--space-xs);
}

/* Scoped under the wrapper to outrank PrimaryBtn's equal-specificity .primary-btn. */
.hero__cta-wrapper .hero__cta-ghost {
  background-color: transparent;
}

.hero__cta-wrapper .hero__cta-ghost:hover {
  background-color: var(--color-scrim-soft);
}

@keyframes hero-fade-in {
  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__logo-band > * {
    animation: none;
    opacity: 1;
  }
}
</style>
