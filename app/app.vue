<script setup lang="ts">
import { watch } from "vue";
import { useI18n } from "vue-i18n";
import { BRAND, TITLE_SEPARATOR } from "~/data/brand";
import { usePwaInstall } from "~/composables/usePwaInstall";

const { t: trans } = useI18n();

// Emits <html lang>, the reciprocal hreflang alternates and og:locale for the active
// route, replacing a static htmlAttrs.lang that could only ever claim es-MX.
const localeHead = useLocaleHead();

useHead(() => ({
  htmlAttrs: localeHead.value.htmlAttrs,
  link: localeHead.value.link,
  meta: [
    ...(localeHead.value.meta ?? []),
    // Site-wide default description, localized. Lives here rather than in
    // nuxt.config's app.head because that one can only ever be one language.
    { name: "description", content: trans("meta.description") },
  ],
  // Pages supply only their own name ("Agendar" / "Book"); the brand is appended
  // here. A function rather than the "%s | …" string form so a page with no title of
  // its own renders the brand alone instead of a dangling suffix. The " | " stays out
  // of the catalogue on purpose: vue-i18n reads a literal pipe as a plural separator.
  titleTemplate: (title?: string) => (title ? `${title}${TITLE_SEPARATOR}${BRAND}` : BRAND),
}));

const { canInstall, install } = usePwaInstall();

// Spawns the browser's own native install popup as soon as it's available — canInstall
// only ever flips false -> true once per session (see usePwaInstall), so this fires
// at most once, and also hides the hero "Descargar app" button, since the one-shot
// native prompt is already spent at that point.
watch(canInstall, (installable) => {
  if (installable) void install();
});
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtPage />
  <ToastRegion />
  <IosInstallPromptModal />
</template>
