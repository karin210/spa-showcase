<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useBlacklist } from "~/composables/useBlacklist";
import { useToast } from "~/composables/useToast";
import { combineDateAndTime, toDateKey } from "~/utils/date";
import { simulateRequest } from "~/utils/mock";

// Trigger + non-dismissible form to block some services during a time range.
const { addRecord } = useBlacklist();
const toast = useToast();

const open = ref(false);
const saving = ref(false);

interface BlacklistForm {
  date: string;
  allDay: boolean;
  from: string;
  to: string;
  services: string[];
}

function emptyForm(): BlacklistForm {
  return { date: toDateKey(new Date()), allDay: false, from: "14:00", to: "16:00", services: [] };
}

const form = reactive<BlacklistForm>(emptyForm());

const rangeValid = computed<boolean>(() => form.allDay || form.from < form.to);
const isValid = computed<boolean>(() => !!form.date && rangeValid.value && form.services.length > 0);

function start(): void {
  Object.assign(form, emptyForm());
  open.value = true;
}

async function submit(): Promise<void> {
  if (!isValid.value) return;
  saving.value = true;
  await simulateRequest();
  addRecord({
    startTime: combineDateAndTime(form.date, form.allDay ? "00:00" : form.from),
    endTime: combineDateAndTime(form.date, form.allDay ? "23:59" : form.to),
    services: [...form.services],
  });
  saving.value = false;
  open.value = false;
  toast.show("Horario deshabilitado.");
}
</script>

<template>
  <SecondaryBtn @click="start">
    <template #icon><AppIcon name="controls" /></template>
    Deshabilitar horario
  </SecondaryBtn>

  <ModalDialog :open="open" labelledby="blacklist-title" width="wide" @close="open = false">
    <form class="blacklist-form" @submit.prevent="submit">
      <h2 id="blacklist-title" class="modal-title">Deshabilitar horario</h2>

      <div class="blacklist-form__row">
        <label class="modal-field">
          Fecha
          <input v-model="form.date" type="date" class="modal-input" required />
        </label>
        <fieldset class="blacklist-form__scope">
          <legend class="blacklist-form__legend">Horario</legend>
          <label class="blacklist-form__option">
            <input v-model="form.allDay" type="radio" name="blacklist-scope" :value="true" />
            Todo el día
          </label>
          <label class="blacklist-form__option">
            <input v-model="form.allDay" type="radio" name="blacklist-scope" :value="false" />
            Elegir horario
          </label>
        </fieldset>
      </div>

      <div v-if="!form.allDay" class="blacklist-form__row">
        <label class="modal-field">
          Desde
          <input v-model="form.from" type="time" step="900" class="modal-input" required />
        </label>
        <label class="modal-field">
          Hasta
          <input v-model="form.to" type="time" step="900" class="modal-input" required />
        </label>
      </div>
      <p v-if="!rangeValid" class="modal-error" role="alert">La hora final debe ser posterior a la inicial.</p>

      <ServicePicker v-model="form.services" legend="¿Qué servicios no estarán disponibles?" />

      <div class="modal-actions">
        <button type="button" class="modal-btn modal-btn-cancel" :disabled="saving" @click="open = false">Cancelar</button>
        <button type="submit" class="modal-btn modal-btn-primary" :disabled="saving || !isValid">
          {{ saving ? "Guardando…" : "Deshabilitar" }}
        </button>
      </div>
    </form>
  </ModalDialog>
</template>

<style scoped>
.blacklist-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.blacklist-form__row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
  align-items: end;
  gap: var(--space-sm);
}

.blacklist-form__scope {
  margin: 0;
  padding: 0;
  border: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1.25rem;
}

.blacklist-form__legend {
  padding: 0;
  margin-bottom: 0.4rem;
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  font-weight: 500;
}

.blacklist-form__option {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: clamp(0.88rem, 2vw, 0.95rem);
  cursor: pointer;
}

.blacklist-form__option input {
  width: 1.05rem;
  height: 1.05rem;
  accent-color: var(--color-primary);
}
</style>
