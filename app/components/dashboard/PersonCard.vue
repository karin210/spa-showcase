<script setup lang="ts">
import type { UserRecord } from "~/types/user";
import { formatPhone, formatShortDate, initials } from "~/utils/format";

// One person row shared by the Users and Team tabs; the `actions` slot lets each
// tab append its own controls (role badge, role picker, remove…).
defineProps<{ user: UserRecord }>();
</script>

<template>
  <li class="person-card">
    <img
      v-if="user.photoURL"
      :src="user.photoURL"
      :alt="`${user.firstName} ${user.lastName}`"
      class="person-card__photo"
      loading="lazy"
    />
    <span v-else class="person-card__photo person-card__photo--initials" aria-hidden="true">
      {{ initials(user.firstName, user.lastName) }}
    </span>
    <div class="person-card__info">
      <span class="person-card__name">{{ user.firstName }} {{ user.lastName }}</span>
      <span v-if="user.email" class="person-card__meta">{{ user.email }}</span>
      <span v-if="user.phone" class="person-card__meta">{{ formatPhone(user.phone) }}</span>
      <span class="person-card__meta person-card__meta--soft">Miembro desde {{ formatShortDate(user.createdAt) }}</span>
    </div>
    <div class="person-card__actions">
      <slot name="actions" />
    </div>
  </li>
</template>

<style scoped>
.person-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: clamp(0.75rem, 2.5vw, 1.5rem);
  padding: clamp(0.75rem, 2vw, 1rem);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  box-shadow: 0 1px 6px var(--color-shadow);
}

.person-card__photo {
  width: clamp(3rem, 8vw, 4rem);
  height: clamp(3rem, 8vw, 4rem);
  border-radius: 50%;
  object-fit: cover;
  filter: saturate(0.92) contrast(1.03);
}

.person-card__photo--initials {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary);
  color: var(--color-on-dark);
  font-size: clamp(1rem, 2.4vw, 1.2rem);
  font-weight: 600;
}

.person-card__info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.person-card__name {
  font-weight: 600;
  font-size: clamp(0.95rem, 2vw, 1.05rem);
}

.person-card__meta {
  font-size: clamp(0.8rem, 1.8vw, 0.9rem);
  color: var(--color-ink-muted);
  overflow-wrap: anywhere;
}

.person-card__meta--soft {
  font-size: clamp(0.75rem, 1.6vw, 0.82rem);
}

.person-card__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
}

.person-card__actions:empty {
  display: none;
}

@media (max-width: 40rem) {
  .person-card {
    grid-template-columns: auto 1fr;
  }

  .person-card__actions {
    grid-column: 1 / -1;
    justify-content: flex-start;
  }
}
</style>
