<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { BRAND, TITLE_SEPARATOR } from "~/data/brand";

const { t: trans } = useI18n();

// The home page leads with the brand, so it opts out of app.vue's title template.
useHead(() => ({
  title: `${BRAND}${TITLE_SEPARATOR}${trans("home.meta.title")}`,
  titleTemplate: null,
}));
</script>

<template>
  <SiteHeader />
  <main class="home-page">
    <HomePageHeroSection />
    <HomePageServicesSection />
    <HomePageContactSection />
  </main>
  <SiteFooter />
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}
</style>
