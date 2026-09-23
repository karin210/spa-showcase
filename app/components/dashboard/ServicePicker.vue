<script setup lang="ts">
import { serviceCategories } from "~/data/services";

// Checkbox list of every service, grouped by category. Shared by the "Crear cita"
// and "Deshabilitar horario" forms.
const selected = defineModel<string[]>({ required: true });
defineProps<{ legend: string }>();
</script>

<template>
  <fieldset class="service-picker">
    <legend class="service-picker__legend">{{ legend }}</legend>
    <fieldset v-for="category in serviceCategories" :key="category.id" class="service-picker__group">
      <legend class="service-picker__category">{{ category.title }}</legend>
      <label v-for="service in category.services" :key="service.name" class="service-picker__option">
        <input v-model="selected" type="checkbox" :value="service.name" class="service-picker__checkbox" />
        {{ service.name }}
      </label>
    </fieldset>
  </fieldset>
</template>

<style scoped>
.service-picker {
  margin: 0;
  padding: 0;
  border: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.service-picker__legend {
  padding: 0;
  margin-bottom: 0.5rem;
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  font-weight: 500;
}

.service-picker__group {
  margin: 0;
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 12rem), 1fr));
  gap: 0.35rem 1rem;
}

.service-picker__category {
  padding: 0 0.35rem;
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: clamp(0.95rem, 2vw, 1.05rem);
  color: var(--color-primary);
}

.service-picker__option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: clamp(0.85rem, 2vw, 0.93rem);
  cursor: pointer;
}

.service-picker__checkbox {
  width: 1.05rem;
  height: 1.05rem;
  accent-color: var(--color-primary);
}
</style>
