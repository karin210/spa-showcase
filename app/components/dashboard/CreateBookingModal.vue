<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useBookings } from "~/composables/useBookings";
import { useUsers } from "~/composables/useUsers";
import { combineDateAndTime, toDateKey } from "~/utils/date";
import { simulateRequest } from "~/utils/mock";

// Trigger + non-dismissible form for staff to book on a customer's behalf.
const { addBooking } = useBookings();
const { users } = useUsers();

const open = ref(false);
const saving = ref(false);
const createdMessage = ref<string | null>(null);

interface CreateForm {
  customerName: string;
  phone: string;
  date: string;
  time: string;
  services: string[];
  finalCost: number | null;
  paid: boolean;
}

function emptyForm(): CreateForm {
  return { customerName: "", phone: "", date: toDateKey(new Date()), time: "10:00", services: [], finalCost: null, paid: true };
}

const form = reactive<CreateForm>(emptyForm());

const customerNames = computed<string[]>(() => users.value.map((user) => `${user.firstName} ${user.lastName}`));

const isValid = computed<boolean>(
  () => form.customerName.trim().length >= 2 && !!form.date && !!form.time && form.services.length > 0,
);

function start(): void {
  Object.assign(form, emptyForm());
  createdMessage.value = null;
  open.value = true;
}

async function submit(): Promise<void> {
  if (!isValid.value) return;
  saving.value = true;
  await simulateRequest();
  const hasCost = form.finalCost !== null && String(form.finalCost) !== "";
  const record = addBooking({
    customerName: form.customerName,
    phone: form.phone.trim() || null,
    appointmentAt: combineDateAndTime(form.date, form.time),
    services: [...form.services],
    finalCost: hasCost ? Number(form.finalCost) : null,
    paid: form.paid,
  });
  saving.value = false;
  createdMessage.value =
    record.status === "closed"
      ? `Cita creada y cerrada para ${record.customerName}.`
      : `Cita creada para ${record.customerName}.`;
}
</script>

<template>
  <SecondaryBtn @click="start">
    <template #icon><AppIcon name="calendar" /></template>
    Crear cita
  </SecondaryBtn>

  <ModalDialog :open="open" labelledby="create-booking-title" width="wide" @close="open = false">
    <h2 id="create-booking-title" class="modal-title">Crear cita para un cliente</h2>

    <template v-if="createdMessage">
      <p class="create-booking__success" role="status">{{ createdMessage }}</p>
      <div class="modal-actions">
        <button type="button" class="modal-btn modal-btn-cancel" @click="open = false">Salir</button>
        <button type="button" class="modal-btn modal-btn-primary" @click="start">Crear otra cita</button>
      </div>
    </template>

    <form v-else class="create-booking" @submit.prevent="submit">
      <div class="create-booking__row">
        <label class="modal-field">
          Cliente
          <input
            v-model="form.customerName"
            class="modal-input"
            type="text"
            list="customer-suggestions"
            placeholder="Ej: Ana López"
            autocomplete="off"
            required
          />
          <datalist id="customer-suggestions">
            <option v-for="name in customerNames" :key="name" :value="name" />
          </datalist>
        </label>
        <label class="modal-field">
          Teléfono (opcional)
          <input v-model="form.phone" class="modal-input" type="tel" placeholder="Ej: +52 443 123 4567" />
        </label>
        <label class="modal-field">
          Fecha
          <input v-model="form.date" class="modal-input" type="date" required />
        </label>
        <label class="modal-field">
          Hora
          <input v-model="form.time" class="modal-input" type="time" min="09:00" max="19:30" step="900" required />
        </label>
      </div>

      <DashboardServicePicker v-model="form.services" legend="Servicios" />

      <div class="create-booking__row">
        <label class="modal-field">
          Costo final (opcional)
          <input v-model.number="form.finalCost" class="modal-input" type="number" min="0" step="0.01" inputmode="decimal" placeholder="0.00" />
        </label>
        <DashboardPaidStatusField v-if="form.finalCost !== null && String(form.finalCost) !== ''" v-model="form.paid" />
      </div>

      <div class="modal-actions">
        <button type="button" class="modal-btn modal-btn-cancel" :disabled="saving" @click="open = false">Cancelar</button>
        <button type="submit" class="modal-btn modal-btn-primary" :disabled="saving || !isValid">
          {{ saving ? "Creando…" : "Crear cita" }}
        </button>
      </div>
    </form>
  </ModalDialog>
</template>

<style scoped>
.create-booking {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.create-booking__row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 13rem), 1fr));
  align-items: end;
  gap: var(--space-sm);
}

.create-booking__success {
  margin: 0;
  padding: 0.9rem 1rem;
  border-left: 4px solid var(--color-success);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  background-color: var(--color-primary-soft);
  font-weight: 500;
}
</style>
