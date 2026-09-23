<script setup lang="ts">
import { computed, ref, useId, watch } from "vue";
import { formatLongDate, formatMonthName } from "~/utils/format";

// Dismissible month-grid date picker. Monday-first, as is usual in Mexico.
const props = defineProps<{ open: boolean; selected?: Date | null }>();

const emit = defineEmits<{ close: []; select: [date: Date] }>();

const titleId = useId();

const WEEKDAYS: { initial: string; name: string }[] = [
  { initial: "L", name: "lunes" },
  { initial: "M", name: "martes" },
  { initial: "M", name: "miércoles" },
  { initial: "J", name: "jueves" },
  { initial: "V", name: "viernes" },
  { initial: "S", name: "sábado" },
  { initial: "D", name: "domingo" },
];

const viewMonth = ref<Date>(new Date());

// Reopening starts from the selected day's month (or the current one).
watch(
  () => props.open,
  (open) => {
    if (!open) return;
    const base = props.selected ?? new Date();
    viewMonth.value = new Date(base.getFullYear(), base.getMonth(), 1);
  },
);

const weeks = computed<(number | null)[][]>(() => {
  const year = viewMonth.value.getFullYear();
  const month = viewMonth.value.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (new Date(year, month, 1).getDay() + 6) % 7;

  const cells: (number | null)[] = Array(startOffset).fill(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: (number | null)[][] = [];
  for (let index = 0; index < cells.length; index += 7) rows.push(cells.slice(index, index + 7));
  return rows;
});

function dateFor(day: number): Date {
  return new Date(viewMonth.value.getFullYear(), viewMonth.value.getMonth(), day);
}

function isSelected(day: number): boolean {
  return !!props.selected && dateFor(day).toDateString() === props.selected.toDateString();
}

function isToday(day: number): boolean {
  return dateFor(day).toDateString() === new Date().toDateString();
}

function changeMonth(step: number): void {
  viewMonth.value = new Date(viewMonth.value.getFullYear(), viewMonth.value.getMonth() + step, 1);
}

function selectDay(day: number): void {
  emit("select", dateFor(day));
  emit("close");
}
</script>

<template>
  <ModalDialog :open="open" :labelledby="titleId" dismissible width="narrow" @close="emit('close')">
    <h2 :id="titleId" class="modal-title">Selecciona una fecha</h2>
    <table class="calendar">
      <caption class="calendar__caption">
        <button type="button" class="calendar__nav" aria-label="Mes anterior" @click="changeMonth(-1)">‹</button>
        <span>{{ formatMonthName(viewMonth) }} {{ viewMonth.getFullYear() }}</span>
        <button type="button" class="calendar__nav" aria-label="Mes siguiente" @click="changeMonth(1)">›</button>
      </caption>
      <thead>
        <tr>
          <th v-for="weekday in WEEKDAYS" :key="weekday.name" scope="col" class="calendar__weekday">
            <abbr :title="weekday.name">{{ weekday.initial }}</abbr>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, weekIndex) in weeks" :key="weekIndex">
          <td v-for="(day, dayIndex) in week" :key="dayIndex" class="calendar__cell">
            <button
              v-if="day !== null"
              type="button"
              class="calendar__day"
              :class="{ 'calendar__day--today': isToday(day) }"
              :aria-pressed="isSelected(day)"
              :aria-label="formatLongDate(dateFor(day))"
              @click="selectDay(day)"
            >
              {{ day }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </ModalDialog>
</template>

<style scoped>
.calendar {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
}

.calendar__caption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.75rem;
  font-family: var(--font-serif);
  font-size: clamp(1.1rem, 2.6vw, 1.3rem);
  font-weight: 700;
}

.calendar__nav {
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background: var(--color-surface);
  color: var(--color-primary);
  font-size: clamp(1.2rem, 3vw, 1.4rem);
  line-height: 1;
  cursor: pointer;
}

.calendar__nav:hover {
  background-color: var(--color-primary-soft);
}

.calendar__nav:focus-visible,
.calendar__day:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.calendar__weekday {
  padding-bottom: 0.35rem;
  font-size: clamp(0.75rem, 1.8vw, 0.85rem);
  font-weight: 600;
  color: var(--color-ink-muted);
}

.calendar__weekday abbr {
  text-decoration: none;
}

.calendar__cell {
  padding: 0.15rem;
}

.calendar__day {
  width: 100%;
  aspect-ratio: 1;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--color-ink);
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.calendar__day:hover {
  background-color: var(--color-primary-soft);
}

.calendar__day--today {
  font-weight: 700;
  color: var(--color-primary);
  box-shadow: inset 0 0 0 1px var(--color-primary);
}

.calendar__day[aria-pressed="true"] {
  background-color: var(--color-primary);
  color: var(--color-on-dark);
}
</style>
