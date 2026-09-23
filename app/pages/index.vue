<script setup lang="ts">
import { BRAND, TITLE_SEPARATOR } from "~/data/brand";

useHead({
  title: `${BRAND}${TITLE_SEPARATOR}Masajes, faciales y rituales en Morelia`,
  titleTemplate: null,
});
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
