<script setup lang="ts">
import { useId } from "vue";
import { useI18n } from "vue-i18n";

const paid = defineModel<boolean>({ required: true });
defineProps<{ disabled?: boolean }>();

const { t: trans } = useI18n();
const name = useId();
</script>

<template>
  <fieldset class="paid-field" :disabled="disabled">
    <legend class="paid-field__legend">{{ trans("dashboard.paid.legend") }}</legend>
    <label class="paid-field__option">
      <input v-model="paid" type="radio" :name="name" :value="true" />
      {{ trans("dashboard.paid.yes") }}
    </label>
    <label class="paid-field__option">
      <input v-model="paid" type="radio" :name="name" :value="false" />
      {{ trans("dashboard.paid.no") }}
    </label>
  </fieldset>
</template>

<style scoped>
.paid-field {
  margin: 0;
  padding: 0;
  border: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.25rem;
}

.paid-field__legend {
  padding: 0;
  margin-bottom: 0.4rem;
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  font-weight: 500;
}

.paid-field__option {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: clamp(0.88rem, 2vw, 0.95rem);
  cursor: pointer;
}

.paid-field__option input {
  width: 1.05rem;
  height: 1.05rem;
  accent-color: var(--color-primary);
}
</style>
