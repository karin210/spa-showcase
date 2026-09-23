<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import type { BookingEdit, BookingRecord, BookingStatus } from "~/types/booking";
import type { DayTab } from "~/types/dashboard";
import { useBookings } from "~/composables/useBookings";
import { useToast } from "~/composables/useToast";
import { addDays, startOfDay, toDateKey } from "~/utils/date";
import { useLocaleFormat } from "~/composables/useLocaleFormat";
import { countByStatus, groupBookingsByTimeSlot, type TimeSlotGroup } from "~/utils/timeSlots";

const { t: trans } = useI18n();
const { formatLongDate, formatTime, formatWeekdayDate } = useLocaleFormat();
const { bookings, updateBooking } = useBookings();
const toast = useToast();

const dayTab = ref<DayTab>("today");
const selectedDate = ref<Date>(startOfDay(new Date()));
const statusFilter = ref<BookingStatus | "all">("all");
const calendarOpen = ref(false);

// Ticks each minute so a visit slides onto the pending-payment rail once its hour passes.
const now = ref<Date>(new Date());
let clock: ReturnType<typeof setInterval> | undefined;
onMounted(() => (clock = setInterval(() => (now.value = new Date()), 60_000)));
onUnmounted(() => clearInterval(clock));

const dayBookings = computed<BookingRecord[]>(() => {
  const selectedKey = toDateKey(selectedDate.value);
  return bookings.value.filter((booking) =>
    dayTab.value === "fromToday"
      ? booking.appointmentAt >= selectedDate.value
      : toDateKey(booking.appointmentAt) === selectedKey,
  );
});

const filteredBookings = computed<BookingRecord[]>(() =>
  statusFilter.value === "all"
    ? dayBookings.value
    : dayBookings.value.filter((booking) => booking.status === statusFilter.value),
);

interface DateGroup {
  key: string;
  label: string;
  slots: TimeSlotGroup[];
}

// The "from today" view spans many days, so group by date first, then by time slot.
const dateGroups = computed<DateGroup[]>(() => {
  const byDate = new Map<string, BookingRecord[]>();
  for (const booking of filteredBookings.value) {
    const key = toDateKey(booking.appointmentAt);
    if (!byDate.has(key)) byDate.set(key, []);
    byDate.get(key)!.push(booking);
  }
  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, group]) => ({
      key,
      label: formatWeekdayDate(group[0]!.appointmentAt),
      slots: groupBookingsByTimeSlot(group),
    }));
});

// Visits that already happened but haven't been paid — from any day, not just the selected one.
const pendingPayment = computed<BookingRecord[]>(() =>
  bookings.value
    .filter((booking) => booking.status === "confirmed" && booking.appointmentAt <= now.value && !booking.paid)
    .sort((a, b) => a.appointmentAt.getTime() - b.appointmentAt.getTime()),
);

const heading = computed<string>(() => {
  if (dayTab.value === "today") return trans("dashboard.bookings.heading.today");
  if (dayTab.value === "tomorrow") return trans("dashboard.bookings.heading.tomorrow");
  if (dayTab.value === "fromToday") return trans("dashboard.bookings.heading.fromToday");
  return trans("dashboard.bookings.heading.date", { date: formatLongDate(selectedDate.value) });
});

function selectDayTab(tab: DayTab): void {
  if (tab === "pickDate") {
    calendarOpen.value = true;
    return;
  }
  dayTab.value = tab;
  selectedDate.value = startOfDay(tab === "tomorrow" ? addDays(new Date(), 1) : new Date());
}

function onDatePicked(date: Date): void {
  dayTab.value = "pickDate";
  selectedDate.value = startOfDay(date);
}

// ── Edit ──
const editing = ref<BookingRecord | null>(null);

function saveEdit(edit: BookingEdit): void {
  const booking = editing.value;
  if (!booking) return;
  const moved = edit.appointmentAt.getTime() !== booking.appointmentAt.getTime();
  // Moving a still-pending booking asks the customer to accept the new time.
  const awaitingCustomer = edit.status === "pending" && moved;

  updateBooking(booking.id, {
    appointmentAt: edit.appointmentAt,
    status: edit.status,
    rescheduleProposedAt: awaitingCustomer ? edit.appointmentAt : edit.status === "pending" ? booking.rescheduleProposedAt : null,
    previousAppointmentAt: awaitingCustomer ? booking.appointmentAt : edit.status === "pending" ? booking.previousAppointmentAt : null,
    ...(edit.finalCost !== undefined ? { finalCost: edit.finalCost } : {}),
  });
  editing.value = null;
  toast.show(trans("dashboard.bookings.updated"));
}

// ── Final cost ──
const closing = ref<BookingRecord | null>(null);

function saveFinalCost(payload: { finalCost: number; paid: boolean }): void {
  const booking = closing.value;
  if (!booking) return;
  updateBooking(booking.id, {
    finalCost: payload.finalCost,
    paid: payload.paid,
    status: payload.paid ? "closed" : booking.status,
  });
  closing.value = null;
  toast.show(payload.paid ? trans("dashboard.bookings.closedPaid") : trans("dashboard.bookings.costRecorded"));
}
</script>

<template>
  <section class="panel" aria-labelledby="bookings-heading">
    <header class="panel-header">
      <h2 id="bookings-heading" class="panel-heading">{{ heading }}</h2>
      <p class="panel-count">{{ trans("dashboard.bookings.total", { count: filteredBookings.length }) }}</p>
    </header>

    <div class="panel-toolbar">
      <DashboardDayTabs :model-value="dayTab" :tabs="['today', 'tomorrow', 'fromToday', 'pickDate']" @select="selectDayTab" />
      <label class="toolbar-section">
        <span class="toolbar-label">{{ trans("dashboard.bookings.statusFilter") }}</span>
        <select v-model="statusFilter" class="panel-select">
          <option value="all">{{ trans("dashboard.bookings.allStatuses") }}</option>
          <option value="pending">{{ trans("dashboard.statusPlural.pending") }}</option>
          <option value="confirmed">{{ trans("dashboard.statusPlural.confirmed") }}</option>
          <option value="cancelled">{{ trans("dashboard.statusPlural.cancelled") }}</option>
          <option value="closed">{{ trans("dashboard.statusPlural.closed") }}</option>
        </select>
      </label>
      <DashboardCreateBookingModal />
    </div>

    <DashboardBookingRail
      v-if="pendingPayment.length > 0"
      :heading="trans('dashboard.bookings.pendingPayment.heading')"
      :hint="trans('dashboard.bookings.pendingPayment.hint')"
      :action-label="trans('dashboard.bookings.pendingPayment.action')"
      :bookings="pendingPayment"
      @action="closing = $event"
    />

    <p v-if="filteredBookings.length === 0" class="panel-state">{{ trans("dashboard.bookings.empty") }}</p>

    <div v-else class="date-groups">
      <section v-for="group in dateGroups" :key="group.key" class="date-group" :aria-label="group.label">
        <h3 v-if="dayTab === 'fromToday'" class="date-group__heading">{{ group.label }}</h3>
        <ul class="slot-list" role="list">
          <li v-for="slot in group.slots" :key="slot.key" class="slot">
            <CollapsibleDisclosure class="slot__disclosure">
              <template #summary>
                <span class="slot__summary">
                  <span class="slot__time">{{ formatTime(slot.startsAt) }}</span>
                  <span class="slot__meta">
                    {{ trans("dashboard.bookings.count", slot.bookings.length) }} —
                    <span v-for="[status, count] in countByStatus(slot.bookings)" :key="status" class="slot__status">
                      <span class="status-dot" :class="`status-dot--${status}`" />
                      {{ count }} {{ trans(`dashboard.status.${status}`) }}
                    </span>
                  </span>
                </span>
              </template>
              <ul class="slot__bookings" role="list">
                <DashboardBookingCard
                  v-for="booking in slot.bookings"
                  :key="booking.id"
                  :booking="booking"
                  @action="editing = booking"
                />
              </ul>
            </CollapsibleDisclosure>
          </li>
        </ul>
      </section>
    </div>

    <CalendarModal :open="calendarOpen" :selected="selectedDate" @close="calendarOpen = false" @select="onDatePicked" />
    <DashboardBookingEditModal :open="!!editing" :booking="editing" @close="editing = null" @save="saveEdit" />
    <DashboardFinalCostModal :open="!!closing" :booking="closing" @close="closing = null" @save="saveFinalCost" />
  </section>
</template>

<style scoped>
.date-groups {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.date-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.date-group__heading {
  margin: 0;
  font-weight: 700;
  font-size: clamp(1.1rem, 2.5vw, 1.25rem);
}

.slot-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.slot {
  padding: 0.9rem clamp(1rem, 2.5vw, 1.5rem);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  box-shadow: 0 1px 6px var(--color-shadow);
}

.slot:focus-within {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.slot__disclosure :deep(.disclosure__summary) {
  color: var(--color-primary);
}

.slot__summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 0.75rem;
}

.slot__time {
  font-weight: 600;
  font-size: clamp(0.98rem, 2vw, 1.08rem);
}

.slot__meta {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem 0.6rem;
  padding-left: 0.75rem;
  border-left: 1px solid var(--color-border);
  font-size: clamp(0.82rem, 2vw, 0.92rem);
  color: var(--color-ink-muted);
}

.slot__status {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  white-space: nowrap;
}

.slot__bookings {
  list-style: none;
  margin: 0;
  padding: 1rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
