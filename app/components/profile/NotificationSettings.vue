<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { simulateRequest } from "~/utils/mock";

// Mock of the push-notification opt-in: toggles local state only.
const { t: trans } = useI18n();
const enabled = ref(false);
const enabling = ref(false);

async function enable(): Promise<void> {
  enabling.value = true;
  await simulateRequest();
  enabling.value = false;
  enabled.value = true;
}
</script>

<template>
  <section class="profile-section" aria-labelledby="notifications-heading">
    <h3 id="notifications-heading" class="profile-section__heading">{{ trans("profile.notifications.title") }}</h3>
    <div v-if="enabled" class="notifications__active">
      <span class="notifications__badge">{{ trans("profile.notifications.enabled") }}</span>
      <p class="notifications__hint">
        {{ trans("profile.notifications.enabledHint") }}
      </p>
    </div>
    <template v-else>
      <p class="notifications__hint">{{ trans("profile.notifications.hint") }}</p>
      <SecondaryBtn :disabled="enabling" @click="enable">
        {{ enabling ? trans("profile.notifications.enabling") : trans("profile.notifications.enable") }}
      </SecondaryBtn>
    </template>
  </section>
</template>

<style scoped>
.profile-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-sm);
}

.notifications__active {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-sm);
}

.notifications__badge {
  padding: 0.3em 0.85em;
  border-radius: 2em;
  background-color: var(--color-success);
  color: var(--color-on-dark);
  font-size: clamp(0.7rem, 1.5vw, 0.78rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.notifications__hint {
  flex: 1 1 16rem;
  margin: 0;
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  color: var(--color-ink-muted);
}
</style>
