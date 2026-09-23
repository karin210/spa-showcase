<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

// With only two locales this is a toggle, not a picker: the switch shows both
// endonyms with the active one highlighted, and following the link swaps them.
//
// It renders a real <a href> rather than a button so that crawlers follow it (this
// is how /en gets discovered at all), it works without JS, middle-click and
// open-in-new-tab behave, and @nuxtjs/i18n writes its locale cookie on the navigation.

const emit = defineEmits<{ navigate: [] }>();

const { t: trans, locale } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const localePath = useLocalePath();

const targetLocale = computed<"es" | "en">(() => (locale.value === "es" ? "en" : "es"));

// switchLocalePath returns an empty string for a route with no counterpart in the
// target locale; fall back to that locale's home page rather than a dead href.
const targetPath = computed<string>(
  () => switchLocalePath(targetLocale.value) || localePath("index", targetLocale.value),
);

// The switchTo strings live in *both* catalogues (see i18n/locales/*/common.json).
// Locale files are lazy-loaded, so the target locale's own catalogue is not in
// memory while the other one is active — looking the string up there would fail.
const ariaLabel = computed<string>(() => trans(`language.${targetLocale.value}.switchTo`));
</script>

<template>
  <NuxtLink
    :to="targetPath"
    :lang="targetLocale"
    :hreflang="targetLocale"
    :aria-label="ariaLabel"
    class="language-toggle"
    :data-current-locale="locale"
    @click="emit('navigate')"
  >
    <!-- Decorative: the link's accessible name already states the action. The switch
         only mirrors which language is active now — the knob rests on the current
         locale's side and slides across on navigation. -->
    <span class="language-toggle__switch" aria-hidden="true">
      <span class="language-toggle__switch-track">
        <span class="language-toggle__knob" />
      </span>
      <span class="language-toggle__switch-labels">
        <span>ES</span>
        <span>EN</span>
      </span>
    </span>
  </NuxtLink>
</template>

<style scoped>
.language-toggle {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-block: 0.75rem;
  text-decoration: none;
  cursor: pointer;
}

.language-toggle:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 3px;
}

/* .language-toggle__switch is the positioned pill; the knob lives inside a single
   absolutely-positioned wrapper (.language-toggle__switch-track) so no flow sibling
   is individually taken out of the document flow. */
.language-toggle__switch {
  position: relative;
  width: clamp(3.25rem, 8vw, 3.75rem);
  height: clamp(1.4rem, 3.4vw, 1.6rem);
  border-radius: 999px;
  background-color: var(--color-secondary);
  overflow: hidden;
}

.language-toggle__switch-track {
  position: absolute;
  inset: 0;
}

.language-toggle__knob {
  display: block;
  width: 50%;
  height: 100%;
  border-radius: 999px;
  background-color: var(--color-primary);
  transition: transform 0.2s ease;
}

.language-toggle[data-current-locale="en"] .language-toggle__knob {
  transform: translateX(100%);
}

.language-toggle__switch-labels {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
}

.language-toggle__switch-labels span {
  flex: 1;
  display: grid;
  place-items: center;
  font-size: clamp(0.62rem, 1.6vw, 0.72rem);
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--color-primary);
  transition: color 0.2s ease;
}

.language-toggle[data-current-locale="es"] .language-toggle__switch-labels span:first-child,
.language-toggle[data-current-locale="en"] .language-toggle__switch-labels span:last-child {
  color: var(--color-on-dark);
}

@media (prefers-reduced-motion: reduce) {
  .language-toggle__knob,
  .language-toggle__switch-labels span {
    transition: none;
  }
}
</style>
