<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { BookingRecord } from "~/types/booking";
import { servicePrice } from "~/data/services";
import { formatCurrency, formatDateAtTime } from "~/utils/format";
import { simulateRequest } from "~/utils/mock";

const props = defineProps<{ open: boolean; booking: BookingRecord | null }>();
const emit = defineEmits<{ close: []; save: [payload: { finalCost: number; paid: boolean }] }>();

const finalCost = ref<number | null>(null);
const paid = ref(true);
const saving = ref(false);

// Suggest the menu price; staff adjust it for tips, discounts or extras.
const menuPrice = computed<number>(() =>
  (props.booking?.services ?? []).reduce((sum, name) => sum + servicePrice(name), 0),
);

watch(
  () => props.open,
  (open) => {
    if (!open) return;
    finalCost.value = props.booking?.finalCost ?? menuPrice.value;
    paid.value = true;
  },
);

const isValid = computed<boolean>(() => finalCost.value !== null && finalCost.value >= 0);

async function submit(): Promise<void> {
  if (!isValid.value) return;
  saving.value = true;
  await simulateRequest();
  saving.value = false;
  emit("save", { finalCost: finalCost.value ?? 0, paid: paid.value });
}
</script>

<template>
  <ModalDialog :open="open" labelledby="final-cost-title" width="narrow" @close="emit('close')">
    <form v-if="booking" class="final-cost" @submit.prevent="submit">
      <h2 id="final-cost-title" class="modal-title">Registrar costo</h2>
      <p class="modal-text">
        <strong>{{ booking.customerName }} — {{ booking.services.join(", ") }}</strong><br />
        {{ formatDateAtTime(booking.appointmentAt) }}
      </p>
      <label class="modal-field">
        Costo final
        <input
          v-model.number="finalCost"
          type="number"
          min="0"
          step="0.01"
          inputmode="decimal"
          class="modal-input"
          placeholder="0.00"
          :disabled="saving"
          required
        />
        <span class="final-cost__hint">Precio de menú: {{ formatCurrency(menuPrice) }}</span>
      </label>
      <DashboardPaidStatusField v-model="paid" :disabled="saving" />
      <div class="modal-actions">
        <button type="button" class="modal-btn modal-btn-cancel" :disabled="saving" @click="emit('close')">Cancelar</button>
        <button type="submit" class="modal-btn modal-btn-primary" :disabled="saving || !isValid">
          {{ saving ? "Guardando…" : "Guardar" }}
        </button>
      </div>
    </form>
  </ModalDialog>
</template>

<style scoped>
.final-cost {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.final-cost__hint {
  font-size: clamp(0.78rem, 1.8vw, 0.85rem);
  font-weight: 400;
  color: var(--color-ink-muted);
}
</style>
