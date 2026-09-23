<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { BookingEdit, BookingRecord, BookingStatus } from "~/types/booking";
import { STATUS_LABELS } from "~/utils/timeSlots";
import { combineDateAndTime, toDateKey, toTimeValue } from "~/utils/date";
import { formatDateAtTime } from "~/utils/format";
import { simulateRequest } from "~/utils/mock";

const props = defineProps<{ open: boolean; booking: BookingRecord | null }>();
const emit = defineEmits<{ close: []; save: [edit: BookingEdit] }>();

// Closing is only possible by recording a paid cost (see FinalCostModal), so it is
// not offered here; a closed booking's status is locked and only its cost can change.
const EDITABLE_STATUSES: BookingStatus[] = ["pending", "confirmed", "cancelled"];

const dateValue = ref("");
const timeValue = ref("");
const status = ref<BookingStatus>("pending");
const finalCost = ref<number | null>(null);
const saving = ref(false);

watch(
  () => props.open,
  (open) => {
    if (!open || !props.booking) return;
    dateValue.value = toDateKey(props.booking.appointmentAt);
    timeValue.value = toTimeValue(props.booking.appointmentAt);
    status.value = props.booking.status;
    finalCost.value = props.booking.finalCost;
  },
);

const isClosed = computed<boolean>(() => props.booking?.status === "closed");
const isValid = computed<boolean>(
  () => !!dateValue.value && !!timeValue.value && (!isClosed.value || (finalCost.value ?? -1) >= 0),
);

async function submit(): Promise<void> {
  if (!isValid.value) return;
  saving.value = true;
  await simulateRequest();
  saving.value = false;
  emit("save", {
    appointmentAt: combineDateAndTime(dateValue.value, timeValue.value),
    status: status.value,
    finalCost: isClosed.value ? (finalCost.value ?? 0) : undefined,
  });
}
</script>

<template>
  <ModalDialog :open="open" labelledby="booking-edit-title" @close="emit('close')">
    <form v-if="booking" class="edit-booking" @submit.prevent="submit">
      <h2 id="booking-edit-title" class="modal-title">Editar cita</h2>
      <p class="modal-text">
        <strong>{{ booking.customerName }}</strong> · {{ booking.services.join(", ") }}<br />
        {{ formatDateAtTime(booking.appointmentAt) }}
      </p>

      <CollapsibleDisclosure class="edit-booking__reschedule">
        <template #summary>Reagendar cita</template>
        <div class="edit-booking__row">
          <label class="modal-field">
            Día
            <input v-model="dateValue" type="date" class="modal-input" required :disabled="saving" />
          </label>
          <label class="modal-field">
            Hora
            <input v-model="timeValue" type="time" min="09:00" max="19:30" step="900" class="modal-input" required :disabled="saving" />
          </label>
        </div>
      </CollapsibleDisclosure>

      <label v-if="!isClosed" class="modal-field">
        Estado
        <select v-model="status" class="modal-input" :disabled="saving">
          <option v-for="option in EDITABLE_STATUSES" :key="option" :value="option">{{ STATUS_LABELS[option] }}</option>
        </select>
      </label>
      <label v-else class="modal-field">
        Costo final (cita cerrada)
        <input v-model.number="finalCost" type="number" min="0" step="0.01" inputmode="decimal" class="modal-input" :disabled="saving" />
      </label>

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
.edit-booking {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.edit-booking__reschedule {
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
}

.edit-booking__reschedule :deep(.disclosure__summary) {
  font-weight: 600;
  color: var(--color-primary);
}

.edit-booking__row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 10rem), 1fr));
  gap: var(--space-sm);
  padding-top: 0.75rem;
}
</style>
