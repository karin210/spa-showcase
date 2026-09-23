<script setup lang="ts">
import { useI18n } from "vue-i18n";
import type { BookingRecord } from "~/types/booking";
import { whatsappUrl } from "~/data/brand";
import { useLocaleFormat } from "~/composables/useLocaleFormat";
import { useServiceLabels } from "~/composables/useServiceLabels";
import { formatPhone } from "~/utils/format";

withDefaults(
  defineProps<{
    booking: BookingRecord;
    // Adds the time next to the date, for places with no time-slot heading.
    showTime?: boolean;
    // Stacks the two halves, for narrow containers like the pending-payment rail.
    stacked?: boolean;
    // Defaults to the localized "Edit".
    actionLabel?: string | null;
  }>(),
  { showTime: false, stacked: false, actionLabel: null },
);

defineEmits<{ action: [] }>();

const { t: trans } = useI18n();
const { formatCurrency, formatShortWeekday, formatTime } = useLocaleFormat();
const { serviceList } = useServiceLabels();
</script>

<template>
  <li class="booking-card" :class="[`booking-card--${booking.status}`, { 'booking-card--stacked': stacked }]">
    <div class="booking-card__main">
      <div class="booking-card__customer-row">
        <span class="booking-card__customer">{{ booking.customerName }}</span>
        <span class="booking-card__chip" :class="{ 'booking-card__chip--registered': booking.uid }">
          {{ booking.uid ? trans("dashboard.bookingCard.registered") : trans("dashboard.bookingCard.guest") }}
        </span>
      </div>
      <span class="booking-card__date">
        <span class="booking-card__day">{{ formatShortWeekday(booking.appointmentAt) }}</span>
        <strong v-if="showTime">{{ formatTime(booking.appointmentAt) }}</strong>
      </span>
      <span class="booking-card__services">{{ serviceList(booking.services) }}</span>
      <div v-if="booking.phone" class="booking-card__phone-row">
        <span class="booking-card__phone">{{ formatPhone(booking.phone) }}</span>
        <a
          :href="`tel:${booking.phone}`"
          class="booking-card__contact"
          :aria-label="trans('dashboard.bookingCard.call', { name: booking.customerName })"
        >
          <AppIcon name="phone" />
        </a>
        <a
          :href="whatsappUrl(trans('dashboard.bookingCard.whatsappMessage', { name: booking.customerName }), booking.phone)"
          class="booking-card__contact"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="trans('dashboard.bookingCard.whatsapp', { name: booking.customerName })"
        >
          <AppIcon name="whatsapp" />
        </a>
      </div>
    </div>

    <div class="booking-card__side">
      <div class="booking-card__details">
        <span class="booking-card__status-line">
          {{ trans("dashboard.bookingCard.statusLabel") }}
          <span class="booking-card__status">{{ trans(`dashboard.status.${booking.status}`) }}</span>
        </span>
        <span v-if="booking.finalCost !== null" class="booking-card__amount">
          {{
            trans(booking.paid ? "dashboard.bookingCard.amountPaid" : "dashboard.bookingCard.amountDue", {
              amount: formatCurrency(booking.finalCost),
            })
          }}
        </span>
        <p v-if="booking.rescheduleProposedAt" class="booking-card__note">
          <AppIcon name="info" class="booking-card__note-icon" />
          {{ trans("dashboard.bookingCard.rescheduled") }}
        </p>
      </div>
      <SecondaryBtn class="booking-card__action" @click="$emit('action')">
        {{ actionLabel ?? trans("actions.edit") }}
      </SecondaryBtn>
    </div>
  </li>
</template>

<style scoped>
.booking-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.25rem;
  padding: 0.85rem 1rem;
  border: 1px solid transparent;
  border-left-width: 4px;
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
}

.booking-card--confirmed {
  border-color: var(--color-success);
}

.booking-card--pending {
  border-color: var(--color-pending);
}

.booking-card--cancelled {
  border-color: var(--color-error);
}

.booking-card--closed {
  border-color: var(--color-closed);
}

.booking-card__main {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.booking-card__customer-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
}

.booking-card__customer {
  font-weight: 600;
  font-size: clamp(0.92rem, 2vw, 1rem);
}

.booking-card__chip {
  padding: 0.1em 0.6em;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  font-size: clamp(0.68rem, 1.6vw, 0.76rem);
  font-weight: 600;
  white-space: nowrap;
}

.booking-card__chip--registered {
  color: var(--color-success);
}

.booking-card__date,
.booking-card__services,
.booking-card__phone {
  font-size: clamp(0.8rem, 1.8vw, 0.88rem);
  color: var(--color-ink-muted);
}

.booking-card__date {
  display: flex;
  gap: 0.4rem;
}

.booking-card__day {
  text-transform: capitalize;
}

.booking-card__phone-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
}

.booking-card__contact {
  display: inline-flex;
  padding: 0.3rem;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  color: var(--color-primary);
  font-size: clamp(0.72rem, 1.6vw, 0.8rem);
  transition: background-color 0.15s ease;
}

.booking-card__contact:hover {
  background-color: var(--color-primary-soft);
}

.booking-card__contact:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.booking-card__side {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
}

.booking-card__details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.3rem;
  text-align: end;
}

.booking-card__status-line,
.booking-card__amount {
  font-size: clamp(0.8rem, 1.8vw, 0.88rem);
}

.booking-card__amount {
  font-weight: 600;
}

.booking-card__status {
  font-weight: 600;
}

.booking-card--confirmed .booking-card__status {
  color: var(--color-success);
}

.booking-card--pending .booking-card__status {
  color: var(--color-pending);
}

.booking-card--cancelled .booking-card__status {
  color: var(--color-error);
}

.booking-card--closed .booking-card__status {
  color: var(--color-closed);
}

.booking-card__note {
  display: flex;
  gap: 0.3rem;
  margin: 0;
  padding: 0.2rem 0.5rem;
  border-left: 2px solid var(--color-pending);
  background-color: var(--color-background);
  font-size: clamp(0.72rem, 1.8vw, 0.8rem);
  text-align: start;
}

.booking-card__note-icon {
  color: var(--color-pending);
}

/* Size only; scoped under the side column to outrank SecondaryBtn's own rule. */
.booking-card__side .booking-card__action {
  padding: 0.4rem 0.9rem;
  font-size: clamp(0.78rem, 1.8vw, 0.86rem);
}

.booking-card--stacked {
  flex-direction: column;
  gap: 0.75rem;
}

.booking-card--stacked .booking-card__side,
.booking-card--stacked .booking-card__details {
  width: 100%;
  align-items: flex-start;
  text-align: start;
}

@media (max-width: 40rem) {
  .booking-card {
    flex-direction: column;
    gap: 0.75rem;
  }

  .booking-card__side,
  .booking-card__details {
    width: 100%;
    align-items: flex-start;
    text-align: start;
  }
}
</style>
