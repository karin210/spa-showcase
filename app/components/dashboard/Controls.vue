<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import type { BlacklistRecord, DayTab } from "~/types/dashboard";
import { useBlacklist } from "~/composables/useBlacklist";
import { useToast } from "~/composables/useToast";
import { addDays, startOfDay, toDateKey } from "~/utils/date";
import { useLocaleFormat } from "~/composables/useLocaleFormat";
import { useServiceLabels } from "~/composables/useServiceLabels";
import { simulateRequest } from "~/utils/mock";

const { t: trans } = useI18n();
const { formatLongDate, formatShortWeekday, formatTime } = useLocaleFormat();
const { serviceName } = useServiceLabels();
const { records, removeRecord } = useBlacklist();
const toast = useToast();

const dayTab = ref<DayTab>("today");
const selectedDate = ref<Date>(startOfDay(new Date()));
const calendarOpen = ref(false);

const dayRecords = computed<BlacklistRecord[]>(() =>
  records.value
    .filter((record) => toDateKey(record.startTime) === toDateKey(selectedDate.value))
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime()),
);

const heading = computed<string>(() =>
  dayTab.value === "pickDate"
    ? trans("dashboard.controls.headingDate", { date: formatLongDate(selectedDate.value) })
    : trans("dashboard.tabs.controls"),
);

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

function isAllDay(record: BlacklistRecord): boolean {
  return record.startTime.getHours() === 0 && record.endTime.getHours() === 23;
}

function rangeLabel(record: BlacklistRecord): string {
  return isAllDay(record)
    ? trans("dashboard.controls.allDay")
    : `${formatTime(record.startTime)} – ${formatTime(record.endTime)}`;
}

// ── Re-enable ──
const recordToEnable = ref<BlacklistRecord | null>(null);
const enabling = ref(false);

async function confirmEnable(): Promise<void> {
  const record = recordToEnable.value;
  if (!record) return;
  enabling.value = true;
  await simulateRequest();
  removeRecord(record.id);
  enabling.value = false;
  recordToEnable.value = null;
  toast.show(trans("dashboard.controls.enabled"));
}
</script>

<template>
  <section class="panel" aria-labelledby="controls-heading">
    <header class="panel-header">
      <h2 id="controls-heading" class="panel-heading">{{ heading }}</h2>
      <p class="panel-count">{{ trans("dashboard.controls.total", { count: dayRecords.length }) }}</p>
    </header>

    <div class="panel-toolbar">
      <DashboardDayTabs :model-value="dayTab" :tabs="['today', 'tomorrow', 'pickDate']" @select="selectDayTab" />
      <DashboardAddToBlacklistModal />
    </div>

    <p v-if="dayRecords.length === 0" class="panel-state">{{ trans("dashboard.controls.empty") }}</p>

    <ul v-else class="block-list" role="list">
      <li v-for="record in dayRecords" :key="record.id" class="block">
        <CollapsibleDisclosure class="block__disclosure">
          <template #summary>
            <span class="block__summary">
              <span class="block__range">{{ rangeLabel(record) }}</span>
              <span class="block__meta">
                {{ formatShortWeekday(record.startTime) }} —
                {{ trans("dashboard.controls.serviceCount", record.services.length) }}
              </span>
            </span>
          </template>
          <div class="block__body">
            <span class="block__subtitle">{{ trans("dashboard.controls.disabledServices") }}</span>
            <ul class="block__services" role="list">
              <li v-for="service in record.services" :key="service">{{ serviceName(service) }}</li>
            </ul>
            <button type="button" class="block__enable" @click="recordToEnable = record">
              {{ trans("dashboard.controls.enable") }}
            </button>
          </div>
        </CollapsibleDisclosure>
      </li>
    </ul>

    <CalendarModal :open="calendarOpen" :selected="selectedDate" @close="calendarOpen = false" @select="onDatePicked" />

    <ConfirmModal
      :open="!!recordToEnable"
      :title="trans('dashboard.controls.enable')"
      :confirm-label="trans('dashboard.controls.enableModal.action')"
      :busy-label="trans('dashboard.controls.enableModal.enabling')"
      :busy="enabling"
      @close="recordToEnable = null"
      @confirm="confirmEnable"
    >
      <i18n-t v-if="recordToEnable" keypath="dashboard.controls.enableModal.confirm" tag="span" scope="global">
        <template #range>
          <strong>({{ rangeLabel(recordToEnable) }}, {{ formatShortWeekday(recordToEnable.startTime) }})</strong>
        </template>
      </i18n-t>
    </ConfirmModal>
  </section>
</template>

<style scoped>
.block-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.block {
  padding: 0.9rem clamp(1rem, 2.5vw, 1.5rem);
  border-radius: var(--radius-md);
  background-color: var(--color-primary-dark);
  color: var(--color-on-dark);
}

.block__disclosure {
  --disclosure-chevron-color: var(--color-on-dark);
  --disclosure-focus-color: var(--color-focus-on-dark);
}

.block__summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 0.75rem;
}

.block__range {
  font-weight: 600;
  font-size: clamp(0.98rem, 2vw, 1.08rem);
}

.block__meta {
  font-size: clamp(0.82rem, 2vw, 0.92rem);
  color: var(--color-on-dark-muted);
  text-transform: capitalize;
}

.block__body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.6rem;
  padding-top: 1rem;
}

.block__subtitle {
  font-size: clamp(0.8rem, 1.8vw, 0.88rem);
  font-weight: 600;
}

.block__services {
  align-self: stretch;
  list-style: none;
  margin: 0;
  padding: 0.5rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  border-radius: var(--radius-sm);
  background-color: var(--color-primary);
  font-size: clamp(0.88rem, 2vw, 0.95rem);
}

.block__enable {
  padding: 0.45rem 0.9rem;
  border: none;
  border-radius: var(--radius-sm);
  background-color: var(--color-success);
  color: var(--color-on-dark);
  font-size: clamp(0.8rem, 1.8vw, 0.9rem);
  font-weight: 600;
  cursor: pointer;
}

.block__enable:hover {
  background-color: var(--color-success-dark);
}

.block__enable:focus-visible {
  outline: 2px solid var(--color-focus-on-dark);
  outline-offset: 2px;
}
</style>
