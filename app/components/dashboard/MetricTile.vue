<script setup lang="ts">
defineProps<{
  label: string;
  value: string;
  caption?: string;
  // 0–1 fill for an optional progress meter.
  meter?: number;
}>();
</script>

<template>
  <article class="metric-tile">
    <h4 class="metric-tile__label">{{ label }}</h4>
    <p class="metric-tile__value">{{ value }}</p>
    <meter v-if="meter !== undefined" class="metric-tile__meter" min="0" max="1" :value="meter" :aria-label="label" />
    <p v-if="caption" class="metric-tile__caption">{{ caption }}</p>
  </article>
</template>

<style scoped>
.metric-tile {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: clamp(1rem, 2.5vw, 1.5rem);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  box-shadow: 0 1px 6px var(--color-shadow);
}

.metric-tile__label {
  margin: 0;
  font-family: var(--font-body);
  font-size: clamp(0.82rem, 2vw, 0.92rem);
  font-weight: 500;
  color: var(--color-ink-muted);
}

.metric-tile__value {
  margin: 0;
  font-family: var(--font-serif);
  font-size: clamp(1.7rem, 4vw, 2.2rem);
  font-weight: 700;
  line-height: 1.1;
  color: var(--color-primary);
}

.metric-tile__meter {
  width: 100%;
  height: 0.4rem;
  appearance: none;
  border: none;
  border-radius: 999px;
  background: var(--color-primary-soft);
  overflow: hidden;
}

.metric-tile__meter::-webkit-meter-bar {
  border: none;
  border-radius: 999px;
  background: var(--color-primary-soft);
}

.metric-tile__meter::-webkit-meter-optimum-value {
  border-radius: 999px;
  background: var(--color-tertiary);
}

.metric-tile__meter::-moz-meter-bar {
  border-radius: 999px;
  background: var(--color-tertiary);
}

.metric-tile__caption {
  margin: 0;
  font-size: clamp(0.75rem, 1.8vw, 0.82rem);
  color: var(--color-ink-muted);
}
</style>
