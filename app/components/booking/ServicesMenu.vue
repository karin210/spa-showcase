<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { serviceCategories } from "~/data/services";
import { useLocaleFormat } from "~/composables/useLocaleFormat";

// First step: pick one or more treatments, grouped by category behind a
// <details>/<summary> disclosure per category (via CollapsibleDisclosure) —
// mirrors the reference app's booking ServicesMenu, so a long catalogue reads
// as a handful of collapsed groups rather than one long scrolling list.
// The model holds service ids.
const selected = defineModel<string[]>({ required: true });

const { t: trans } = useI18n();
const { formatCurrency } = useLocaleFormat();
</script>

<template>
  <fieldset class="services-menu">
    <legend class="visually-hidden">{{ trans("booking.services.legend") }}</legend>
    <ul class="services-menu__groups" role="list">
      <li v-for="category in serviceCategories" :key="category.id" class="services-menu__group">
        <CollapsibleDisclosure class="services-menu__dropdown">
          <template #summary>{{ trans(`services.categories.${category.id}.title`) }}</template>
          <ul class="services-menu__options" role="list">
            <li v-for="service in category.services" :key="service.id">
              <label class="services-menu__option" :class="{ 'services-menu__option--checked': selected.includes(service.id) }">
                <input v-model="selected" type="checkbox" :value="service.id" class="services-menu__checkbox" />
                <span class="services-menu__option-text">
                  <span class="services-menu__option-name">{{ trans(`services.items.${service.id}.name`) }}</span>
                  <span class="services-menu__option-meta">
                    {{ trans("services.minutes", { count: service.durationMinutes }) }} · {{ formatCurrency(service.price) }}
                  </span>
                </span>
              </label>
            </li>
          </ul>
        </CollapsibleDisclosure>
      </li>
    </ul>
  </fieldset>
</template>

<style scoped>
.services-menu {
  margin: 0;
  padding: 0;
  border: none;
}

.services-menu__groups {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

/* Category-heading skin; open/close mechanics come from CollapsibleDisclosure. */
.services-menu__dropdown {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background-color: var(--color-background);
  overflow: hidden;
}

.services-menu__dropdown :deep(.disclosure__summary) {
  gap: var(--space-sm);
  padding: 0.75em 1em;
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: clamp(1rem, 2.3vw, 1.2rem);
  color: var(--color-primary);
}

.services-menu__options {
  list-style: none;
  margin: 0;
  padding: 0.25rem 0.5rem 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.services-menu__option {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5em 0.6em;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color 0.12s ease;
}

.services-menu__option:hover {
  background-color: var(--color-surface);
}

.services-menu__option--checked {
  background-color: var(--color-primary-soft);
}

.services-menu__checkbox {
  flex-shrink: 0;
  width: 1.1rem;
  height: 1.1rem;
  accent-color: var(--color-primary);
  cursor: pointer;
}

.services-menu__option-text {
  display: flex;
  flex-direction: column;
  font-size: clamp(0.85rem, 2vw, 0.95rem);
}

.services-menu__option-meta {
  font-size: clamp(0.75rem, 1.8vw, 0.82rem);
  color: var(--color-ink-muted);
}
</style>
