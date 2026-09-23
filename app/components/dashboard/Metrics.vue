<script setup lang="ts">
import { computed, ref } from "vue";
import type { BookingRecord } from "~/types/booking";
import type { MetricsPeriod, ServiceDemand } from "~/types/dashboard";
import { useBookings } from "~/composables/useBookings";
import { useUsers } from "~/composables/useUsers";
import { addDays, fromDateKey, monthToDateKeys, startOfDay, toDateKey, weekToDateKeys } from "~/utils/date";
import { formatCurrency, formatLongDate, formatMonthYear, formatPercent, formatWeekdayDate } from "~/utils/format";

// Treatments the spa can serve per day (rooms × slots); the occupancy denominator.
const DAILY_CAPACITY = 16;
const ACTIVE_WINDOW_DAYS = 60;
const TOP_SERVICES_LIMIT = 5;
const NO_DATA = "—";

const PERIODS: { value: MetricsPeriod; label: string }[] = [
  { value: "day", label: "Hoy" },
  { value: "week", label: "Esta semana" },
  { value: "month", label: "Este mes" },
];

const { bookings } = useBookings();
const { users } = useUsers();

const today = startOfDay(new Date());
const period = ref<MetricsPeriod>("day");
const selectedDay = ref<Date>(today);
const dayPickerOpen = ref(false);

function selectPeriod(value: MetricsPeriod): void {
  period.value = value;
  if (value === "day") selectedDay.value = today;
}

const periodKeys = computed<string[]>(() => {
  if (period.value === "week") return weekToDateKeys(today);
  if (period.value === "month") return monthToDateKeys(today);
  return [toDateKey(selectedDay.value)];
});

const periodLabel = computed<string>(() => {
  if (period.value === "day") return formatWeekdayDate(selectedDay.value);
  if (period.value === "month") return formatMonthYear(today);
  const start = fromDateKey(periodKeys.value[0]!);
  return `Semana del ${formatLongDate(start)} al ${formatLongDate(addDays(start, 6))}`;
});

const periodBookings = computed<BookingRecord[]>(() => {
  const keys = new Set(periodKeys.value);
  return bookings.value.filter((booking) => keys.has(toDateKey(booking.appointmentAt)));
});

// Revenue and demand count only paid, closed visits.
const closedBookings = computed<BookingRecord[]>(() =>
  periodBookings.value.filter((booking) => booking.status === "closed" && booking.finalCost !== null),
);

const revenue = computed<number>(() =>
  closedBookings.value.reduce((sum, booking) => sum + (booking.finalCost ?? 0), 0),
);

const revenueValue = computed<string>(() => formatCurrency(revenue.value));
const averageValue = computed<string>(() =>
  closedBookings.value.length === 0 ? NO_DATA : formatCurrency(revenue.value / closedBookings.value.length),
);

const occupancyRatio = computed<number>(() => closedBookings.value.length / (DAILY_CAPACITY * periodKeys.value.length));

const cancellationRatio = computed<number | undefined>(() => {
  const total = periodBookings.value.length;
  if (total === 0) return undefined;
  return periodBookings.value.filter((booking) => booking.status === "cancelled").length / total;
});

// ── All-time client figures (independent of the period) ──
const retentionValue = computed<string>(() => {
  if (users.value.length === 0) return NO_DATA;
  const windowStart = addDays(today, -ACTIVE_WINDOW_DAYS);
  const active = new Set(
    bookings.value
      .filter((booking) => booking.uid && booking.appointmentAt >= windowStart && booking.appointmentAt <= new Date())
      .map((booking) => booking.uid),
  );
  return formatPercent(active.size / users.value.length);
});

const clientsValue = computed<string>(() => {
  const accounts = new Set(bookings.value.filter((b) => b.uid).map((b) => b.uid));
  const walkIns = new Set(bookings.value.filter((b) => !b.uid).map((b) => b.customerName));
  return String(accounts.size + walkIns.size);
});

const topServices = computed<ServiceDemand[]>(() => {
  const counts = new Map<string, number>();
  for (const booking of closedBookings.value) {
    for (const service of booking.services) counts.set(service, (counts.get(service) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort(([nameA, countA], [nameB, countB]) => countB - countA || nameA.localeCompare(nameB, "es"))
    .slice(0, TOP_SERVICES_LIMIT)
    .map(([service, count]) => ({ service, count }));
});
</script>

<template>
  <section class="panel" aria-labelledby="metrics-heading">
    <header class="panel-header">
      <h2 id="metrics-heading" class="panel-heading">Métricas</h2>
      <p class="panel-count">{{ periodLabel }}</p>
    </header>

    <div class="panel-toolbar">
      <div class="toolbar-section" role="group" aria-labelledby="period-label">
        <span id="period-label" class="toolbar-label">Periodo:</span>
        <div class="chip-group">
          <button
            v-for="option in PERIODS"
            :key="option.value"
            type="button"
            class="chip-btn"
            :aria-pressed="period === option.value"
            @click="selectPeriod(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
      <div v-if="period === 'day'" class="toolbar-section">
        <span class="toolbar-label">Elegir día:</span>
        <button type="button" class="chip-btn" @click="dayPickerOpen = true">{{ formatLongDate(selectedDay) }}</button>
      </div>
    </div>

    <section class="metrics-group" aria-labelledby="metrics-revenue">
      <h3 id="metrics-revenue" class="metrics-group__heading">Ingresos</h3>
      <div class="metrics-grid">
        <DashboardMetricTile label="Ingresos totales" :value="revenueValue" />
        <DashboardMetricTile label="Ingreso promedio por cita" :value="averageValue" />
      </div>
    </section>

    <section class="metrics-group" aria-labelledby="metrics-agenda">
      <h3 id="metrics-agenda" class="metrics-group__heading">Agenda</h3>
      <div class="metrics-grid">
        <DashboardMetricTile
          label="Tasa de ocupación"
          :value="formatPercent(occupancyRatio)"
          :meter="Math.min(occupancyRatio, 1)"
          :caption="`Capacidad: ${DAILY_CAPACITY} tratamientos por día`"
        />
        <DashboardMetricTile
          label="Tasa de cancelaciones"
          :value="cancellationRatio === undefined ? NO_DATA : formatPercent(cancellationRatio)"
        />
      </div>
    </section>

    <section class="metrics-group" aria-labelledby="metrics-clients">
      <h3 id="metrics-clients" class="metrics-group__heading">Clientes</h3>
      <p class="metrics-group__subtitle">Histórico, independiente del periodo seleccionado.</p>
      <div class="metrics-grid">
        <DashboardMetricTile
          label="Tasa de retención"
          :value="retentionValue"
          :caption="`Cuentas con visita en los últimos ${ACTIVE_WINDOW_DAYS} días`"
        />
        <DashboardMetricTile label="Clientes atendidos" :value="clientsValue" caption="Con cuenta y sin cuenta" />
      </div>
    </section>

    <section class="metrics-group" aria-labelledby="metrics-services">
      <h3 id="metrics-services" class="metrics-group__heading">Tratamientos más demandados</h3>
      <DashboardMetricBarList v-if="topServices.length > 0" :items="topServices" />
      <p v-else class="panel-state">Sin tratamientos pagados en este periodo.</p>
    </section>

    <CalendarModal :open="dayPickerOpen" :selected="selectedDay" @close="dayPickerOpen = false" @select="selectedDay = startOfDay($event)" />
  </section>
</template>

<style scoped>
.metrics-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.metrics-group__heading {
  margin: 0;
  font-weight: 700;
  font-size: clamp(1.15rem, 2.5vw, 1.3rem);
}

.metrics-group__subtitle {
  margin: 0;
  font-size: clamp(0.8rem, 1.8vw, 0.88rem);
  color: var(--color-ink-muted);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
  gap: 1rem;
}
</style>
