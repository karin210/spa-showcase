<script setup lang="ts">
// Pill-shaped top-level call to action. Renders a <NuxtLink> when `link` is set,
// otherwise a <button> that emits `click`. The focus ring suits dark backgrounds.
withDefaults(
  defineProps<{
    link?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
  }>(),
  { type: "button", disabled: false },
);

defineEmits<{ click: [event: MouseEvent] }>();
</script>

<template>
  <NuxtLink v-if="link" :to="link" class="primary-btn">
    <slot />
  </NuxtLink>
  <button v-else :type="type" class="primary-btn" :disabled="disabled" @click="$emit('click', $event)">
    <slot />
  </button>
</template>

<style scoped>
.primary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: clamp(0.75rem, 2vw, 0.95rem) clamp(1.5rem, 4vw, 2.4rem);
  background-color: var(--color-primary);
  color: var(--color-on-dark);
  font-size: clamp(0.95rem, 2vw, 1.1rem);
  font-weight: 500;
  letter-spacing: 0.04em;
  text-decoration: none;
  border: 1px solid var(--color-on-dark);
  border-radius: 999px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.primary-btn:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.primary-btn:focus-visible {
  outline: 3px solid var(--color-focus-on-dark);
  outline-offset: 3px;
}

.primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
