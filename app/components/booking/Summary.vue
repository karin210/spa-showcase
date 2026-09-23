<script setup lang="ts">
import { computed } from "vue";
import { allServices } from "~/data/services";
import { formatCurrency, formatDateAtTime } from "~/utils/format";

// Final step: review every selection and confirm. Submission itself is owned by
// the page (the orchestrator); this component only presents the review and CTA.
const props = defineProps<{
  customerName: string;
  services: string[];
  dateTime: Date;
  submitting: boolean;
  errorMessage: string | null;
}>();

defineEmits<{ confirm: [] }>();

const totalDuration = computed<number>(() =>
  props.services.reduce((sum, name) => sum + (allServices.find((s) => s.name === name)?.durationMinutes ?? 0), 0),
);

const totalPrice = computed<number>(() =>
  props.services.reduce((sum, name) => sum + (allServices.find((s) => s.name === name)?.price ?? 0), 0),
);
</script>

<template>
  <div class="summary">
    <dl class="summary__list">
      <div class="summary__row">
        <dt class="summary__term">Cliente</dt>
        <dd class="summary__value">{{ customerName }}</dd>
      </div>
      <div class="summary__row">
        <dt class="summary__term">Tratamientos</dt>
        <dd class="summary__value">
          <ul class="summary__services" role="list">
            <li v-for="service in services" :key="service">{{ service }}</li>
          </ul>
        </dd>
      </div>
      <div class="summary__row">
        <dt class="summary__term">Fecha y hora</dt>
        <dd class="summary__value summary__value--capitalize">{{ formatDateAtTime(dateTime) }}</dd>
      </div>
      <div class="summary__row">
        <dt class="summary__term">Duración</dt>
        <dd class="summary__value">{{ totalDuration }} min</dd>
      </div>
      <div class="summary__row">
        <dt class="summary__term">Total estimado</dt>
        <dd class="summary__value">{{ formatCurrency(totalPrice) }}</dd>
      </div>
    </dl>

    <p v-if="errorMessage" class="summary__error" role="alert">{{ errorMessage }}</p>

    <PrimaryBtn class="summary__confirm" :disabled="submitting" @click="$emit('confirm')">
      {{ submitting ? "Confirmando…" : "Confirmar reserva" }}
    </PrimaryBtn>
  </div>
</template>

<style scoped>
.summary {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.summary__list {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.summary__row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem var(--space-sm);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--color-border);
}

.summary__row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.summary__term {
  flex: 0 0 8rem;
  font-size: clamp(0.78rem, 1.9vw, 0.88rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-primary);
}

.summary__value {
  flex: 1 1 12rem;
  margin: 0;
  font-size: clamp(0.92rem, 2.2vw, 1.02rem);
}

.summary__value--capitalize {
  text-transform: capitalize;
}

.summary__services {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.summary__services li {
  background-color: var(--color-primary-soft);
  border-radius: 2em;
  padding: 0.2em 0.8em;
  font-size: clamp(0.82rem, 2vw, 0.92rem);
}

.summary__error {
  margin: 0;
  font-size: clamp(0.82rem, 2vw, 0.92rem);
  color: var(--color-tertiary-dark);
  background-color: var(--color-background);
  border-left: 4px solid var(--color-tertiary);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  padding: 0.6em 0.8em;
}

/* Placement + a step-scale footprint, smaller than PrimaryBtn's hero default.
   Scoped under .summary to outrank the component's equal-specificity rule. */
.summary .summary__confirm {
  align-self: flex-end;
  border-radius: var(--radius-sm);
  font-size: clamp(0.95rem, 2vw, 1.05rem);
  padding: 0.65em 1.5em;
}
</style>
