<script setup lang="ts">
import { computed } from "vue";
import type { ServiceDemand } from "~/types/dashboard";

const props = defineProps<{ items: ServiceDemand[] }>();

const maxCount = computed<number>(() => Math.max(...props.items.map((item) => item.count), 1));
</script>

<template>
  <ol class="bar-list">
    <li v-for="item in items" :key="item.service" class="bar-list__row">
      <span class="bar-list__label">{{ item.service }}</span>
      <span class="bar-list__track" aria-hidden="true">
        <span class="bar-list__fill" :style="{ width: `${(item.count / maxCount) * 100}%` }" />
      </span>
      <span class="bar-list__count">{{ item.count }}</span>
    </li>
  </ol>
</template>

<style scoped>
.bar-list {
  list-style: none;
  margin: 0;
  padding: clamp(1rem, 2.5vw, 1.5rem);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  box-shadow: 0 1px 6px var(--color-shadow);
}

.bar-list__row {
  display: grid;
  grid-template-columns: minmax(9rem, 1.2fr) minmax(6rem, 3fr) 3ch;
  align-items: center;
  gap: 0.75rem;
}

.bar-list__label {
  font-size: clamp(0.85rem, 2vw, 0.95rem);
}

.bar-list__track {
  display: block;
  height: 0.6rem;
  border-radius: 999px;
  background-color: var(--color-primary-soft);
  overflow: hidden;
}

.bar-list__fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background-color: var(--color-primary);
  transition: width 0.3s ease;
}

.bar-list__count {
  font-size: clamp(0.82rem, 2vw, 0.92rem);
  font-weight: 600;
  color: var(--color-primary);
  text-align: right;
}

@media (max-width: 40rem) {
  .bar-list__row {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      "label label"
      "track count";
    row-gap: 0.35rem;
  }

  .bar-list__label {
    grid-area: label;
  }

  .bar-list__track {
    grid-area: track;
  }

  .bar-list__count {
    grid-area: count;
  }
}
</style>
