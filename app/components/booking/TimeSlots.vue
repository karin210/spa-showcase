<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useBlacklist } from "~/composables/useBlacklist";
import { availableSlots } from "~/utils/availability";
import { useLocaleFormat } from "~/composables/useLocaleFormat";

// Third step: pick a time. Offers only slots business hours and the disabled
// schedule allow (see app/utils/availability.ts), already narrowed to the chosen
// date and services.
const props = defineProps<{ date: Date; services: string[]; initialTime: Date | null }>();

const emit = defineEmits<{ complete: [time: Date] }>();

const { t: trans } = useI18n();
const { formatTime } = useLocaleFormat();
const { records } = useBlacklist();

const slots = computed<Date[]>(() => availableSlots(props.date, props.services, records.value));

function isSelected(slot: Date): boolean {
  return !!props.initialTime && slot.getTime() === props.initialTime.getTime();
}

function select(slot: Date): void {
  emit("complete", slot);
}
</script>

<template>
  <div class="time-slots">
    <p v-if="slots.length === 0" class="time-slots__empty">
      {{ trans("booking.time.empty") }}
    </p>
    <div v-else class="time-slots__grid" role="list">
      <button
        v-for="slot in slots"
        :key="slot.getTime()"
        type="button"
        class="time-slots__slot"
        role="listitem"
        :aria-pressed="isSelected(slot)"
        @click="select(slot)"
      >
        {{ formatTime(slot) }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.time-slots__empty {
  margin: 0;
  padding: var(--space-sm) var(--space-md);
  border-left: 4px solid var(--color-tertiary);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  background-color: var(--color-background);
  font-size: clamp(0.88rem, 2vw, 0.97rem);
}

.time-slots__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(5.5rem, 1fr));
  gap: 0.6rem;
}

.time-slots__slot {
  padding: 0.55em 0.75em;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);
  background-color: var(--color-surface);
  color: var(--color-primary);
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.time-slots__slot:hover {
  background-color: var(--color-primary-soft);
}

.time-slots__slot:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.time-slots__slot[aria-pressed="true"] {
  background-color: var(--color-primary);
  color: var(--color-on-dark);
  font-weight: 700;
}
</style>
