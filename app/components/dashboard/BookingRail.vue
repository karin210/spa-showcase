<script setup lang="ts">
import type { BookingRecord } from "~/types/booking";

defineProps<{
  heading: string;
  hint: string;
  bookings: BookingRecord[];
  actionLabel: string;
}>();

defineEmits<{ action: [booking: BookingRecord] }>();
</script>

<template>
  <section class="booking-rail" aria-labelledby="booking-rail-heading">
    <header class="booking-rail__header">
      <h3 id="booking-rail-heading" class="booking-rail__heading">{{ heading }}</h3>
      <p class="booking-rail__hint">{{ hint }}</p>
    </header>
    <!-- tabindex makes the overflow strip reachable and scrollable by keyboard. -->
    <ul class="booking-rail__list" tabindex="0" :aria-label="heading">
      <DashboardBookingCard
        v-for="booking in bookings"
        :key="booking.id"
        class="booking-rail__card"
        :booking="booking"
        :action-label="actionLabel"
        show-time
        stacked
        @action="$emit('action', booking)"
      />
    </ul>
  </section>
</template>

<style scoped>
.booking-rail {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: var(--space-sm);
  border-radius: var(--radius-lg);
  background-color: var(--color-secondary);
}

.booking-rail__header {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.booking-rail__heading {
  margin: 0;
  font-weight: 700;
  font-size: clamp(1.1rem, 2.5vw, 1.25rem);
}

.booking-rail__hint {
  margin: 0;
  font-size: clamp(0.8rem, 2vw, 0.9rem);
  color: var(--color-ink-muted);
}

.booking-rail__list {
  display: flex;
  gap: 1rem;
  margin: 0;
  padding: 0.25rem 0.25rem 0.75rem;
  list-style: none;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x proximity;
}

.booking-rail__list:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

.booking-rail__card {
  flex: 0 0 min(19rem, 80%);
  scroll-snap-align: start;
}
</style>
