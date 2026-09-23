<script setup lang="ts">
defineProps<{ page: number; totalPages: number }>();
defineEmits<{ change: [page: number] }>();
</script>

<template>
  <nav v-if="totalPages > 1" class="pagination" aria-label="Paginación">
    <button type="button" class="chip-btn" :disabled="page <= 1" @click="$emit('change', page - 1)">Anterior</button>
    <span class="pagination__info" aria-live="polite">Página {{ page }} de {{ totalPages }}</span>
    <button type="button" class="chip-btn" :disabled="page >= totalPages" @click="$emit('change', page + 1)">Siguiente</button>
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
