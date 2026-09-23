<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useLocaleFormat } from "~/composables/useLocaleFormat";

// Second step: pick an appointment date. Inline (not a dialog) so it sits directly
// in the step panel; visually related to global/CalendarModal but with its own
// per-day disabled check instead of a precomputed date-string list.
const props = defineProps<{ initialDate: Date | null; isDateDisabled: (date: Date) => boolean }>();

const emit = defineEmits<{ complete: [date: Date] }>();

const { t: trans } = useI18n();
const { formatLongDate, formatMonthName, weekdays } = useLocaleFormat();

const today = new Date();
today.setHours(0, 0, 0, 0);

const viewMonth = ref<Date>(new Date((props.initialDate ?? today).getFullYear(), (props.initialDate ?? today).getMonth(), 1));
const selectedDate = ref<Date | null>(props.initialDate);

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

// Paging earlier than the current real-world month is pointless: every one of its
// days is already in the past.
const isPrevMonthDisabled = computed<boolean>(
  () => viewMonth.value.getFullYear() === today.getFullYear() && viewMonth.value.getMonth() <= today.getMonth(),
);

function dateFor(day: number): Date {
  return new Date(viewMonth.value.getFullYear(), viewMonth.value.getMonth(), day);
}

function isPast(day: number): boolean {
  return dateFor(day) < today;
}

function isDisabled(day: number | null): boolean {
  return day === null || isPast(day) || props.isDateDisabled(dateFor(day));
}

function isSelected(day: number | null): boolean {
  return day !== null && !!selectedDate.value && dateFor(day).toDateString() === selectedDate.value.toDateString();
}

function changeMonth(step: number): void {
  if (step < 0 && isPrevMonthDisabled.value) return;
  viewMonth.value = new Date(viewMonth.value.getFullYear(), viewMonth.value.getMonth() + step, 1);
}

function selectDay(day: number | null): void {
  if (isDisabled(day)) return;
  const date = dateFor(day as number);
  selectedDate.value = date;
  emit("complete", date);
}
</script>

<template>
  <div class="booking-calendar">
    <div class="calendar__caption">
      <button
        type="button"
        class="calendar__nav"
        :disabled="isPrevMonthDisabled"
        :aria-label="trans('calendar.previousMonth')"
        @click="changeMonth(-1)"
      >
        ‹
      </button>
      <span>{{ formatMonthName(viewMonth) }} {{ viewMonth.getFullYear() }}</span>
      <button type="button" class="calendar__nav" :aria-label="trans('calendar.nextMonth')" @click="changeMonth(1)">
        ›
      </button>
    </div>
    <table class="calendar">
      <thead>
        <tr>
          <th v-for="weekday in weekdays" :key="weekday.name" scope="col" class="calendar__weekday">
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
              :disabled="isDisabled(day)"
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
  </div>
</template>

<style scoped>
.booking-calendar {
  width: min(100%, 24rem);
  margin-inline: auto;
}

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
  font-size: clamp(1.05rem, 2.5vw, 1.25rem);
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

.calendar__nav:hover:not(:disabled) {
  background-color: var(--color-primary-soft);
}

.calendar__nav:disabled {
  color: var(--color-border);
  cursor: not-allowed;
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

.calendar__day:hover:not(:disabled) {
  background-color: var(--color-primary-soft);
}

.calendar__day:disabled {
  color: var(--color-border);
  cursor: not-allowed;
}

.calendar__day[aria-pressed="true"] {
  background-color: var(--color-primary);
  color: var(--color-on-dark);
}
</style>
