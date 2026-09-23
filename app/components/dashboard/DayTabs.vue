<script setup lang="ts">
import { useId } from "vue";
import { useI18n } from "vue-i18n";
import type { DayTab } from "~/types/dashboard";

// Each tab is also its i18n key (dashboard.dayTabs.<tab>).
const { t: trans } = useI18n();

defineProps<{ modelValue: DayTab; tabs: DayTab[] }>();
defineEmits<{ select: [tab: DayTab] }>();

const labelId = useId();
</script>

<template>
  <div class="toolbar-section" role="group" :aria-labelledby="labelId">
    <span :id="labelId" class="toolbar-label">{{ trans("dashboard.dayTabs.label") }}</span>
    <div class="chip-group">
      <button
        v-for="tab in tabs"
        :key="tab"
        type="button"
        class="chip-btn"
        :aria-pressed="modelValue === tab"
        @click="$emit('select', tab)"
      >
        {{ trans(`dashboard.dayTabs.${tab}`) }}
      </button>
    </div>
  </div>
</template>
