<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import type { BookingRecord } from "~/types/booking";
import type { ProfileUpdateInput } from "~/types/user";
import { useSession } from "~/composables/useSession";
import { useUsers } from "~/composables/useUsers";
import { useBookings } from "~/composables/useBookings";
import { useToast } from "~/composables/useToast";
import { categoryForService, stockImage } from "~/data/services";
import { useLocaleFormat } from "~/composables/useLocaleFormat";
import { useServiceLabels } from "~/composables/useServiceLabels";
import { formatPhone } from "~/utils/format";
import { simulateRequest } from "~/utils/mock";

const { t: trans } = useI18n();
const { formatDateAtTime, formatLongDate } = useLocaleFormat();
const { serviceList } = useServiceLabels();

useHead(() => ({ title: trans("profile.meta.title") }));

const { user, displayName } = useSession();
const { updateUser } = useUsers();
const { bookings, updateBooking } = useBookings();
const toast = useToast();

const myBookings = computed<BookingRecord[]>(() => bookings.value.filter((booking) => booking.uid === user.value.id));

function byDateAsc(a: BookingRecord, b: BookingRecord): number {
  return a.appointmentAt.getTime() - b.appointmentAt.getTime();
}

const now = Date.now();

// A closed booking is normally one already attended, but staff can register a prepaid
// visit ahead of time; until it happens it still counts as upcoming.
const upcomingBookings = computed(() =>
  myBookings.value
    .filter((b) => (b.status === "confirmed" || b.status === "closed") && b.appointmentAt.getTime() >= now)
    .sort(byDateAsc),
);

const cancelledBookings = computed(() =>
  myBookings.value.filter((b) => b.status === "cancelled").sort((a, b) => byDateAsc(b, a)),
);

interface HistoryEntry {
  id: string;
  name: string;
  date: Date;
  photoId: string;
  imageAlt: string;
}

const FALLBACK_PHOTO_ID = "1540555700478-4be289fbecef";

const history = computed<HistoryEntry[]>(() =>
  myBookings.value
    .filter((b) => (b.status === "confirmed" || b.status === "closed") && b.appointmentAt.getTime() < now)
    .sort((a, b) => byDateAsc(b, a))
    .map((booking) => {
      const category = categoryForService(booking.services[0] ?? "");
      return {
        id: booking.id,
        name: serviceList(booking.services),
        date: booking.appointmentAt,
        photoId: category?.photoId ?? FALLBACK_PHOTO_ID,
        imageAlt: category ? trans(`services.categories.${category.id}.imageAlt`) : trans("profile.history.fallbackAlt"),
      };
    }),
);

const lastService = computed<HistoryEntry | null>(() => history.value[0] ?? null);

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// ── Edit profile ──
const editOpen = ref(false);
const editInitial = computed<ProfileUpdateInput>(() => ({
  firstName: user.value.firstName,
  lastName: user.value.lastName,
  phone: user.value.phone ?? "",
}));

function saveProfile(input: ProfileUpdateInput & { photoURL: string | null }): void {
  updateUser(user.value.id, input);
  editOpen.value = false;
  toast.show(trans("profile.edit.saved"));
}

// ── Cancel a booking ──
const bookingToCancel = ref<BookingRecord | null>(null);
const cancelling = ref(false);

async function confirmCancel(): Promise<void> {
  const booking = bookingToCancel.value;
  if (!booking) return;
  cancelling.value = true;
  await simulateRequest();
  updateBooking(booking.id, { status: "cancelled", rescheduleProposedAt: null, previousAppointmentAt: null });
  cancelling.value = false;
  bookingToCancel.value = null;
}

// ── Sign out (demo) ──
const signOutOpen = ref(false);
const signingOut = ref(false);

async function confirmSignOut(): Promise<void> {
  signingOut.value = true;
  await simulateRequest();
  signingOut.value = false;
  signOutOpen.value = false;
  toast.show(trans("signOutModal.demoNotice"));
}

// ── Image lightbox ──
const lightboxEntry = ref<HistoryEntry | null>(null);
</script>

<template>
  <SiteHeader />
  <main class="profile-page">
    <div class="profile-container">
      <section class="profile-card" aria-labelledby="profile-name">
        <div class="profile-card__avatar">
          <img v-if="user.photoURL" :src="user.photoURL" :alt="trans('profile.card.photoAlt', { name: displayName })" class="profile-card__photo" />
          <AppIcon v-else name="user" />
        </div>
        <div class="profile-card__info">
          <h1 id="profile-name" class="profile-card__name">{{ displayName }}</h1>
          <ul class="profile-card__contact" role="list">
            <li v-if="user.phone"><a :href="`tel:${user.phone}`" class="profile-card__link">{{ formatPhone(user.phone) }}</a></li>
            <li v-if="user.email"><a :href="`mailto:${user.email}`" class="profile-card__link">{{ user.email }}</a></li>
          </ul>
        </div>
        <button type="button" class="profile-card__edit" @click="editOpen = true">
          <AppIcon name="edit" />
          {{ trans("actions.edit") }}
        </button>
      </section>

      <section class="profile-group" aria-labelledby="services-group-heading">
        <h2 id="services-group-heading" class="profile-group__heading">{{ trans("profile.treatments.title") }}</h2>

        <section class="profile-section" aria-labelledby="upcoming-heading">
          <h3 id="upcoming-heading" class="profile-section__heading">{{ trans("profile.upcoming.title") }}</h3>
          <p v-if="upcomingBookings.length === 0" class="profile-empty">
            {{ trans("profile.upcoming.empty") }}
          </p>
          <ul v-else class="booking-list" role="list">
            <li v-for="booking in upcomingBookings" :key="booking.id" class="booking booking--confirmed">
              <span class="booking__service">{{ serviceList(booking.services) }}</span>
              <time class="booking__line" :datetime="isoDate(booking.appointmentAt)">{{ formatDateAtTime(booking.appointmentAt) }}</time>
              <p class="booking__status">
                {{ trans("profile.status.label") }}
                <span class="booking__status-value">
                  {{ booking.status === "closed" ? trans("profile.status.paid") : trans("profile.status.confirmed") }}
                </span>
              </p>
              <div v-if="booking.status !== 'closed'" class="booking__actions">
                <button type="button" class="booking__cancel" @click="bookingToCancel = booking">
                  {{ trans("actions.cancel") }}
                </button>
              </div>
            </li>
          </ul>
        </section>

        <section v-if="cancelledBookings.length > 0" class="profile-section" aria-labelledby="cancelled-heading">
          <h3 id="cancelled-heading" class="profile-section__heading">{{ trans("profile.cancelled.title") }}</h3>
          <ul class="booking-list" role="list">
            <li v-for="booking in cancelledBookings" :key="booking.id" class="booking booking--cancelled">
              <span class="booking__service">{{ serviceList(booking.services) }}</span>
              <time class="booking__line" :datetime="isoDate(booking.appointmentAt)">{{ formatDateAtTime(booking.appointmentAt) }}</time>
              <p class="booking__status">
                {{ trans("profile.status.label") }}
                <span class="booking__status-value">{{ trans("profile.status.cancelled") }}</span>
              </p>
            </li>
          </ul>
        </section>

        <section v-if="lastService" class="profile-section" aria-labelledby="last-service-heading">
          <h3 id="last-service-heading" class="profile-section__heading">{{ trans("profile.lastService.title") }}</h3>
          <article class="last-service">
            <span class="last-service__name">{{ lastService.name }}</span>
            <time class="last-service__date" :datetime="isoDate(lastService.date)">{{ formatLongDate(lastService.date) }}</time>
          </article>
        </section>

        <section v-if="history.length > 0" class="profile-section" aria-labelledby="history-heading">
          <h3 id="history-heading" class="profile-section__heading profile-section__heading--accent">
            {{ trans("profile.history.title") }}
          </h3>
          <ol class="history-list">
            <li v-for="entry in history" :key="entry.id" class="history-list__item">
              <button
                type="button"
                class="history-list__image-btn"
                :aria-label="trans('profile.history.enlarge', { name: entry.name })"
                @click="lightboxEntry = entry"
              >
                <img class="history-list__image" :src="stockImage(entry.photoId, 240)" :alt="entry.imageAlt" loading="lazy" />
              </button>
              <div class="history-list__details">
                <span class="history-list__name">{{ entry.name }}</span>
                <time class="history-list__date" :datetime="isoDate(entry.date)">{{ formatLongDate(entry.date) }}</time>
              </div>
            </li>
          </ol>
        </section>
      </section>

      <section class="profile-group" aria-labelledby="session-group-heading">
        <h2 id="session-group-heading" class="profile-group__heading">{{ trans("profile.session.title") }}</h2>
        <ProfileNotificationSettings />
        <section class="profile-section profile-section--start" aria-labelledby="signout-heading">
          <h3 id="signout-heading" class="profile-section__heading">{{ trans("profile.session.heading") }}</h3>
          <button type="button" class="sign-out-btn" @click="signOutOpen = true">{{ trans("actions.signOut") }}</button>
        </section>
      </section>
    </div>
  </main>
  <SiteFooter />

  <ProfileEditModal
    :open="editOpen"
    :initial="editInitial"
    :photo-url="user.photoURL"
    @close="editOpen = false"
    @save="saveProfile"
  />

  <ConfirmModal
    :open="!!bookingToCancel"
    :title="trans('profile.cancelModal.title')"
    :confirm-label="trans('profile.cancelModal.title')"
    :busy-label="trans('profile.cancelModal.cancelling')"
    :busy="cancelling"
    @close="bookingToCancel = null"
    @confirm="confirmCancel"
  >
    <!-- The booking is emphasised mid-sentence, and word order differs per language. -->
    <i18n-t v-if="bookingToCancel" keypath="profile.cancelModal.confirm" tag="span" scope="global">
      <template #booking>
        <strong>
          {{ serviceList(bookingToCancel.services) }} — {{ formatDateAtTime(bookingToCancel.appointmentAt) }}
        </strong>
      </template>
    </i18n-t>
  </ConfirmModal>

  <ConfirmModal
    :open="signOutOpen"
    :title="trans('signOutModal.title')"
    :confirm-label="trans('signOutModal.action')"
    :busy-label="trans('signOutModal.signingOut')"
    :busy="signingOut"
    @close="signOutOpen = false"
    @confirm="confirmSignOut"
  >
    {{ trans("signOutModal.confirm") }}
  </ConfirmModal>

  <ModalDialog :open="!!lightboxEntry" labelledby="lightbox-caption" dismissible width="wide" @close="lightboxEntry = null">
    <figure v-if="lightboxEntry" class="lightbox">
      <img :src="stockImage(lightboxEntry.photoId, 1400)" :alt="lightboxEntry.imageAlt" class="lightbox__image" />
      <figcaption id="lightbox-caption" class="lightbox__caption">
        {{ lightboxEntry.name }} · {{ formatLongDate(lightboxEntry.date) }}
      </figcaption>
    </figure>
  </ModalDialog>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding-block: var(--space-lg);
}

.profile-container {
  max-width: 50rem;
  margin-inline: auto;
  padding-inline: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

/* ── Identity card ── */
.profile-card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  background-color: var(--color-surface);
  box-shadow: 0 2px 16px var(--color-shadow);
}

.profile-card__avatar {
  flex-shrink: 0;
  width: clamp(4.5rem, 12vw, 6.5rem);
  height: clamp(4.5rem, 12vw, 6.5rem);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--color-primary);
  color: var(--color-on-dark);
  font-size: clamp(2rem, 5vw, 2.75rem);
  box-shadow: 0 0 0 4px var(--color-primary-soft);
}

.profile-card__photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.95) contrast(1.03) brightness(1.02);
}

.profile-card__info {
  flex: 1 1 12rem;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.profile-card__name {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.4rem, 4vw, 2rem);
}

.profile-card__contact {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.profile-card__link {
  color: var(--color-ink-muted);
  text-decoration: none;
  font-size: clamp(0.85rem, 2vw, 0.97rem);
  overflow-wrap: anywhere;
}

.profile-card__link:hover {
  text-decoration: underline;
}

.profile-card__link:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.profile-card__edit {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-primary);
  border-radius: 999px;
  background: transparent;
  color: var(--color-primary);
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  font-weight: 500;
  cursor: pointer;
}

.profile-card__edit:hover {
  background-color: var(--color-primary-soft);
}

.profile-card__edit:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

/* ── Groups ── */
.profile-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.profile-group__heading {
  margin: 0;
  padding-bottom: var(--space-sm);
  border-bottom: 2px solid var(--color-primary);
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.3rem, 3.4vw, 1.75rem);
}

.profile-section--start {
  align-items: flex-start;
}

.profile-section__heading--accent {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.profile-section__heading--accent::before {
  content: "";
  width: 4px;
  height: 1.1em;
  border-radius: 2px;
  background-color: var(--color-primary);
}

.profile-empty {
  margin: 0;
  font-size: clamp(0.88rem, 2vw, 0.97rem);
  color: var(--color-ink-muted);
}

/* ── Booking cards ── */
.booking-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.booking {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: var(--space-sm) var(--space-md);
  border-left: 4px solid var(--color-success);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  background-color: var(--color-background);
}

.booking > p {
  margin: 0;
}

.booking--pending {
  border-left-color: var(--color-pending);
}

.booking--cancelled {
  border-left-color: var(--color-error);
}

.booking__service {
  font-family: var(--font-serif);
  font-size: clamp(1.1rem, 2.5vw, 1.25rem);
  font-weight: 700;
}

.booking__rescheduled {
  font-weight: 600;
  color: var(--color-success);
}

.booking__line {
  font-size: clamp(0.9rem, 2.2vw, 1rem);
}

.booking__line--strong {
  font-weight: 600;
}

.booking__line del {
  color: var(--color-ink-muted);
}

.booking__status {
  font-size: clamp(0.85rem, 2vw, 0.93rem);
  font-weight: 600;
  letter-spacing: 0.04em;
}

.booking--confirmed .booking__status-value {
  color: var(--color-success);
}

.booking--pending .booking__status-value {
  color: var(--color-pending);
}

.booking--cancelled .booking__status-value {
  color: var(--color-error);
}

.booking__actions {
  align-self: flex-end;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.booking__cancel,
.sign-out-btn {
  padding: 0.5em 1.2em;
  border: 1px solid var(--color-error);
  border-radius: 0.5rem;
  background: transparent;
  color: var(--color-error);
  font-size: clamp(0.88rem, 2vw, 0.97rem);
  font-weight: 600;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.booking__cancel:hover,
.sign-out-btn:hover {
  background-color: var(--color-error);
  color: var(--color-on-dark);
}

.booking__cancel:focus-visible,
.sign-out-btn:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

/* ── Last service ── */
.last-service {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  padding: var(--space-sm) var(--space-md);
  border-left: 4px solid var(--color-primary);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  background-color: var(--color-primary-soft);
}

.last-service__name {
  font-weight: 600;
}

.last-service__date {
  font-size: clamp(0.82rem, 1.8vw, 0.92rem);
  color: var(--color-ink-muted);
}

/* ── History ── */
.history-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.history-list__item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding-block: var(--space-sm);
  border-bottom: 1px solid var(--color-border);
}

.history-list__item:last-child {
  border-bottom: none;
}

.history-list__image-btn {
  flex-shrink: 0;
  padding: 0;
  border: none;
  border-radius: var(--radius-sm);
  background: none;
  line-height: 0;
  cursor: zoom-in;
  transition: transform 0.15s ease;
}

.history-list__image-btn:hover {
  transform: scale(1.04);
}

.history-list__image-btn:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.history-list__image {
  width: clamp(3.5rem, 14vw, 5rem);
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: var(--radius-sm);
  filter: saturate(0.88) contrast(1.05);
}

.history-list__details {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.25rem 0.75rem;
}

.history-list__name {
  font-size: clamp(0.9rem, 2.2vw, 1rem);
}

.history-list__date {
  font-size: clamp(0.8rem, 1.8vw, 0.9rem);
  color: var(--color-ink-muted);
  white-space: nowrap;
}

/* ── Lightbox ── */
.lightbox {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.lightbox__image {
  width: 100%;
  max-height: 70vh;
  object-fit: cover;
  border-radius: var(--radius-md);
  filter: saturate(0.9) contrast(1.05);
}

.lightbox__caption {
  font-family: var(--font-serif);
  font-size: clamp(1rem, 2.4vw, 1.2rem);
  text-align: center;
}
</style>
