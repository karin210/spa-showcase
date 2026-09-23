<script setup lang="ts">
// Text wordmark with a leaf glyph — the fictional brand has no logo artwork.
withDefaults(defineProps<{ tone?: "dark" | "light" }>(), { tone: "dark" });
</script>

<template>
  <span class="brand-mark" :class="`brand-mark--${tone}`">
    <AppIcon name="leaf" class="brand-mark__glyph" />
    <span class="brand-mark__text">
      <span class="brand-mark__name">Alma Serena</span>
      <span class="brand-mark__sub">spa &amp; bienestar</span>
    </span>
  </span>
</template>

<style scoped>
.brand-mark {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
}

.brand-mark--dark {
  color: var(--color-primary);
}

.brand-mark--light {
  color: var(--color-on-dark);
}

.brand-mark__glyph {
  width: clamp(1.6rem, 3.5vw, 2.1rem);
  height: clamp(1.6rem, 3.5vw, 2.1rem);
}

.brand-mark__text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.brand-mark__name {
  font-family: var(--font-display);
  font-size: clamp(1.15rem, 2.6vw, 1.45rem);
  letter-spacing: 0.06em;
}

.brand-mark__sub {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(0.78rem, 1.6vw, 0.92rem);
  letter-spacing: 0.12em;
}
</style>
