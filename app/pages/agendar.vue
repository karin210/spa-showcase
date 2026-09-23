<script setup lang="ts">
import { computed, ref } from "vue";
import { useSession } from "~/composables/useSession";
import { useBookings } from "~/composables/useBookings";
import { useBlacklist } from "~/composables/useBlacklist";
import { isDateFullyBooked } from "~/utils/availability";
import { formatTime, formatWeekdayDate } from "~/utils/format";
import { toDateKey } from "~/utils/date";
import { simulateRequest } from "~/utils/mock";

definePageMeta({ path: "/agendar" });
useHead({ title: "Agendar" });

const { user, displayName } = useSession();
const { addBooking } = useBookings();
const { records: blacklist } = useBlacklist();

type StepId = "services" | "date" | "time" | "summary";

interface StepDef {
  id: StepId;
  title: string;
}

const STEPS: StepDef[] = [
  { id: "services", title: "¿Qué tratamientos quieres reservar?" },
  { id: "date", title: "¿Qué día te gustaría venir?" },
  { id: "time", title: "¿A qué hora?" },
  { id: "summary", title: "Confirma tu reserva" },
];

// ── Collected selections ──
const services = ref<string[]>([]);
const selectedDate = ref<Date | null>(null);
// Holds the full appointment moment (the chosen date's day, at the chosen slot's time).
const selectedTime = ref<Date | null>(null);

function isDateDisabled(date: Date): boolean {
  return isDateFullyBooked(date, services.value, blacklist.value);
}

const activeIndex = ref(0);
// Drives the slide direction of the between-step transition.
const direction = ref<"forward" | "backward">("forward");
const submitting = ref(false);
const errorMessage = ref<string | null>(null);
const booked = ref(false);

const activeStep = computed<StepDef>(() => STEPS[activeIndex.value] ?? STEPS[0]!);
const transitionName = computed(() => (direction.value === "forward" ? "step-forward" : "step-backward"));

const dateLabel = computed<string>(() => (selectedDate.value ? formatWeekdayDate(selectedDate.value) : ""));
const timeLabel = computed<string>(() => (selectedTime.value ? formatTime(selectedTime.value) : ""));

function isStepComplete(id: StepId): boolean {
  switch (id) {
    case "services":
      return services.value.length > 0;
    case "date":
      return selectedDate.value !== null;
    case "time":
      return selectedTime.value !== null;
    case "summary":
      return booked.value;
  }
}

// Index of the first step still missing data (the summary once everything is set).
function firstIncompleteIndex(): number {
  for (let index = 0; index < STEPS.length; index++) {
    if (STEPS[index]!.id === "summary") return index;
    if (!isStepComplete(STEPS[index]!.id)) return index;
  }
  return STEPS.length - 1;
}

function advance(): void {
  errorMessage.value = null;
  direction.value = "forward";
  activeIndex.value = firstIncompleteIndex();
}

function stateOf(index: number, id: StepId): "active" | "done" | "upcoming" {
  if (index === activeIndex.value) return "active";
  return isStepComplete(id) ? "done" : "upcoming";
}

// A step is editable once it (and everything before it) has been reached.
function canEdit(index: number): boolean {
  return index <= firstIncompleteIndex();
}

function editStep(index: number): void {
  if (!canEdit(index) || index === activeIndex.value) return;
  direction.value = index > activeIndex.value ? "forward" : "backward";
  activeIndex.value = index;
}

// The progress list shows the value entered for each data step (the summary carries
// no value and is dropped), each editable on click.
const progressSteps = computed(() =>
  STEPS.map((step, index) => ({ step, index })).filter(({ step }) => step.id !== "summary" && progressValue(step.id) !== ""),
);

function progressLabel(id: StepId): string {
  switch (id) {
    case "services":
      return "Tratamientos";
    case "date":
      return "Fecha";
    case "time":
      return "Hora";
    case "summary":
      return "";
  }
}

function progressValue(id: StepId): string {
  switch (id) {
    case "services":
      return services.value.join(", ");
    case "date":
      return dateLabel.value;
    case "time":
      return timeLabel.value;
    case "summary":
      return "";
  }
}

// ── Step completion handlers ──
function onServicesComplete(value: string[]): void {
  services.value = value;
  advance();
}

function onDateComplete(value: Date): void {
  selectedDate.value = value;
  // A time chosen for a different day no longer applies once the date changes.
  if (selectedTime.value && toDateKey(selectedTime.value) !== toDateKey(value)) selectedTime.value = null;
  advance();
}

function onTimeComplete(value: Date): void {
  selectedTime.value = value;
  advance();
}

async function onConfirm(): Promise<void> {
  if (!selectedTime.value || services.value.length === 0) return;
  submitting.value = true;
  errorMessage.value = null;
  await simulateRequest();
  addBooking({
    customerName: displayName.value,
    phone: user.value.phone,
    appointmentAt: selectedTime.value,
    services: [...services.value],
    finalCost: null,
    paid: false,
  });
  submitting.value = false;
  booked.value = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<template>
  <SiteHeader />
  <main class="booking-page">
    <div class="booking-container">
      <header class="booking-header">
        <h1 class="booking-header__title">Agendar cita</h1>
      </header>

      <section v-if="booked" class="booking-success" aria-live="polite">
        <span class="booking-success__icon" aria-hidden="true">✓</span>
        <h2 class="booking-success__title">¡Tu cita quedó confirmada!</h2>
        <p class="booking-success__text">
          Te esperamos el {{ dateLabel }} a las {{ timeLabel }}. Puedes ver o cancelar tu cita desde tu perfil en
          cualquier momento.
        </p>
        <NuxtLink to="/perfil" class="booking-success__link">Ir a mi perfil</NuxtLink>
        <NuxtLink to="/" class="booking-success__link booking-success__link--ghost">Volver al inicio</NuxtLink>
      </section>

      <template v-else>
        <nav v-if="progressSteps.length > 0" class="booking-progress" aria-label="Progreso de la reserva">
          <p class="booking-progress__subtitle">Datos de tu reserva</p>
          <TransitionGroup tag="ul" name="row" class="booking-progress__list" role="list">
            <li
              v-for="{ step, index } in progressSteps"
              :key="step.id"
              class="booking-progress__item"
              :data-state="stateOf(index, step.id)"
              :aria-current="index === activeIndex ? 'step' : undefined"
            >
              <p class="booking-progress__text">
                <span class="booking-progress__label">{{ progressLabel(step.id) }}:</span>
                <Transition name="value" mode="out-in">
                  <span v-if="progressValue(step.id)" :key="progressValue(step.id)" class="booking-progress__value">
                    {{ progressValue(step.id) }}
                  </span>
                </Transition>
              </p>
              <button
                type="button"
                class="booking-progress__edit"
                :disabled="!canEdit(index) || index === activeIndex"
                :aria-label="`Editar: ${progressLabel(step.id)}`"
                @click="editStep(index)"
              >
                Editar
              </button>
            </li>
          </TransitionGroup>
        </nav>

        <div class="booking-panel-wrap">
          <Transition :name="transitionName" mode="out-in">
            <section :key="activeStep.id" class="booking-panel" :aria-labelledby="`panel-title-${activeStep.id}`">
              <header class="booking-panel__head">
                <h2 :id="`panel-title-${activeStep.id}`" class="booking-panel__title">{{ activeStep.title }}</h2>
              </header>

              <div class="booking-panel__body">
                <template v-if="activeStep.id === 'services'">
                  <BookingServicesMenu v-model="services" />
                  <Transition name="continue-reveal">
                    <SecondaryBtn v-if="services.length > 0" class="booking-panel__continue" @click="advance">
                      Continuar ({{ services.length }})
                    </SecondaryBtn>
                  </Transition>
                </template>

                <BookingCalendar
                  v-else-if="activeStep.id === 'date'"
                  :initial-date="selectedDate"
                  :is-date-disabled="isDateDisabled"
                  @complete="onDateComplete"
                />

                <BookingTimeSlots
                  v-else-if="activeStep.id === 'time' && selectedDate"
                  :date="selectedDate"
                  :services="services"
                  :initial-time="selectedTime"
                  @complete="onTimeComplete"
                />

                <BookingSummary
                  v-else-if="activeStep.id === 'summary' && selectedTime"
                  :customer-name="displayName"
                  :services="services"
                  :date-time="selectedTime"
                  :submitting="submitting"
                  :error-message="errorMessage"
                  @confirm="onConfirm"
                />
              </div>
            </section>
          </Transition>
        </div>
      </template>
    </div>
  </main>
  <SiteFooter />
</template>

<style scoped>
.booking-page {
  min-height: 100vh;
  padding-block: var(--space-lg);
}

.booking-container {
  max-width: 40rem;
  margin-inline: auto;
  padding-inline: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.booking-header {
  text-align: center;
}

.booking-header__title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.7rem, 5vw, 2.6rem);
  color: var(--color-ink);
}

/* ── Progress feedback (vertical, editable) ── */
.booking-progress {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  background-color: var(--color-surface);
  box-shadow: 0 2px 12px var(--color-shadow);
}

.booking-progress__subtitle {
  margin: 0;
  text-align: center;
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: clamp(1.1rem, 2.5vw, 1.35rem);
  color: var(--color-primary);
}

.booking-progress__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.booking-progress__item {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  padding: 0.5em 0.6em;
  border-radius: var(--radius-sm);
  transition: background-color 0.15s ease;
}

.booking-progress__item[data-state="active"] {
  background-color: var(--color-background);
}

.booking-progress__item[data-state="upcoming"] {
  opacity: 0.55;
}

.booking-progress__text {
  flex: 1;
  min-width: 0;
  margin: 0;
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  font-family: var(--font-serif);
  font-size: clamp(1.05rem, 2.4vw, 1.3rem);
}

.booking-progress__label {
  flex-shrink: 0;
  font-weight: 700;
}

.booking-progress__value {
  display: inline-block;
  overflow-wrap: anywhere;
}

.booking-progress__edit {
  flex-shrink: 0;
  align-self: center;
  padding: 0.3em 0.7em;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);
  background: none;
  font-size: clamp(0.78rem, 1.9vw, 0.88rem);
  color: var(--color-primary);
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.booking-progress__edit:not(:disabled):hover {
  background-color: var(--color-primary-soft);
}

.booking-progress__edit:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: -2px;
}

/* The active step is already open below, so its edit control is hidden while
   keeping the row's spacing intact. */
.booking-progress__edit:disabled {
  visibility: hidden;
}

.row-enter-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.row-leave-active {
  transition: opacity 0.2s ease;
}

.row-enter-from {
  opacity: 0;
  transform: translateX(-0.5rem);
}

.row-leave-to {
  opacity: 0;
}

.row-move {
  transition: transform 0.25s ease;
}

.value-enter-active,
.value-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.value-enter-from {
  opacity: 0;
  transform: translateY(-0.3rem);
}

.value-leave-to {
  opacity: 0;
  transform: translateY(0.3rem);
}

/* ── Active step panel ── */
.booking-panel-wrap {
  position: relative;
}

.booking-panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  background-color: var(--color-surface);
  box-shadow: 0 2px 12px var(--color-shadow);
}

.booking-panel__head {
  display: flex;
  justify-content: center;
}

.booking-panel__title {
  margin: 0;
  padding-bottom: var(--space-sm);
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.15rem, 3vw, 1.4rem);
  text-align: center;
}

.booking-panel__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.booking-panel__continue {
  align-self: flex-end;
}

.continue-reveal-enter-active,
.continue-reveal-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.continue-reveal-enter-from,
.continue-reveal-leave-to {
  opacity: 0;
  transform: translateY(0.5rem);
}

/* ── Between-step transitions ── */
.step-forward-enter-active,
.step-forward-leave-active,
.step-backward-enter-active,
.step-backward-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.step-forward-enter-from {
  opacity: 0;
  transform: translateX(1.5rem);
}

.step-forward-leave-to {
  opacity: 0;
  transform: translateX(-1.5rem);
}

.step-backward-enter-from {
  opacity: 0;
  transform: translateX(-1.5rem);
}

.step-backward-leave-to {
  opacity: 0;
  transform: translateX(1.5rem);
}

/* ── Success ── */
.booking-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-lg) var(--space-md);
  border-radius: var(--radius-lg);
  background-color: var(--color-surface);
  box-shadow: 0 2px 12px var(--color-shadow);
  text-align: center;
}

.booking-success__icon {
  width: clamp(3.5rem, 11vw, 4.5rem);
  height: clamp(3.5rem, 11vw, 4.5rem);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: var(--color-on-dark);
  font-size: clamp(1.8rem, 5vw, 2.4rem);
}

.booking-success__title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.3rem, 3.5vw, 1.7rem);
}

.booking-success__text {
  margin: 0;
  max-width: 34ch;
  font-size: clamp(0.9rem, 2.2vw, 1.05rem);
  line-height: 1.6;
}

.booking-success__link {
  margin-top: var(--space-xs);
  padding: 0.65em 1.5em;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);
  background-color: var(--color-primary);
  color: var(--color-on-dark);
  font-weight: 500;
  text-decoration: none;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.booking-success__link:hover {
  background-color: var(--color-primary-dark);
}

.booking-success__link--ghost {
  background-color: transparent;
  color: var(--color-primary);
}

.booking-success__link--ghost:hover {
  background-color: var(--color-primary-soft);
}

.booking-success__link:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .row-enter-active,
  .value-enter-active,
  .value-leave-active,
  .continue-reveal-enter-active,
  .continue-reveal-leave-active,
  .step-forward-enter-active,
  .step-forward-leave-active,
  .step-backward-enter-active,
  .step-backward-leave-active {
    transition: opacity 0.2s ease;
  }

  .row-move {
    transition: none;
  }

  .row-enter-from,
  .value-enter-from,
  .value-leave-to,
  .continue-reveal-enter-from,
  .continue-reveal-leave-to,
  .step-forward-enter-from,
  .step-forward-leave-to,
  .step-backward-enter-from,
  .step-backward-leave-to {
    transform: none;
  }
}
</style>
