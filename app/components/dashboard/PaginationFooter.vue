<script setup lang="ts">
import { useI18n } from "vue-i18n";

defineProps<{ page: number; totalPages: number }>();
defineEmits<{ change: [page: number] }>();

const { t: trans } = useI18n();
</script>

<template>
  <nav v-if="totalPages > 1" class="pagination" :aria-label="trans('dashboard.pagination.label')">
    <button type="button" class="chip-btn" :disabled="page <= 1" @click="$emit('change', page - 1)">
      {{ trans("dashboard.pagination.previous") }}
    </button>
    <span class="pagination__info" aria-live="polite">
      {{ trans("dashboard.pagination.page", { page, total: totalPages }) }}
    </span>
    <button type="button" class="chip-btn" :disabled="page >= totalPages" @click="$emit('change', page + 1)">
      {{ trans("dashboard.pagination.next") }}
    </button>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: clamp(1rem, 4vw, 2rem);
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.pagination .chip-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.pagination__info {
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  font-weight: 500;
}
</style>
