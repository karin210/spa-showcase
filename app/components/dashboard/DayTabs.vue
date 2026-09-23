<script setup lang="ts">
import { useId } from "vue";
import type { DayTab } from "~/types/dashboard";

const LABELS: Record<DayTab, string> = {
  today: "Hoy",
  tomorrow: "Mañana",
  fromToday: "Desde hoy",
  pickDate: "Elegir fecha",
};

defineProps<{ modelValue: DayTab; tabs: DayTab[] }>();
defineEmits<{ select: [tab: DayTab] }>();

const labelId = useId();
</script>

<template>
  <div class="toolbar-section" role="group" :aria-labelledby="labelId">
    <span :id="labelId" class="toolbar-label">Filtrar por fecha:</span>
    <div class="chip-group">
      <button
        v-for="tab in tabs"
        :key="tab"
        type="button"
        class="chip-btn"
        :aria-pressed="modelValue === tab"
        @click="$emit('select', tab)"
      >
        {{ LABELS[tab] }}
      </button>
    </div>
  </div>
</template>
