<script setup lang="ts">
import { BRAND, TITLE_SEPARATOR } from "~/data/brand";

useHead({
  titleTemplate: (title?: string) => (title ? `${title}${TITLE_SEPARATOR}${BRAND}` : BRAND),
});
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtPage />
  <ToastRegion />
</template>
