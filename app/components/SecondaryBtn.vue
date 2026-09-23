<script setup lang="ts">
// Filled button in the brand primary colour, one notch below PrimaryBtn: for
// operational and contact actions. Renders a plain <a> when `href` is set
// (external / tel: links), otherwise a <button>. An optional `icon` slot renders
// before the label.
withDefaults(
  defineProps<{
    href?: string;
    external?: boolean;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
  }>(),
  { external: false, type: "button", disabled: false },
);

defineEmits<{ click: [event: MouseEvent] }>();
</script>

<template>
  <a
    v-if="href"
    :href="href"
    class="secondary-btn"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
  >
    <slot name="icon" />
    <span class="secondary-btn__label"><slot /></span>
  </a>
  <button v-else :type="type" class="secondary-btn" :disabled="disabled" @click="$emit('click', $event)">
    <slot name="icon" />
    <span class="secondary-btn__label"><slot /></span>
  </button>
</template>

<style scoped>
.secondary-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: clamp(0.88rem, 2.2vw, 0.98rem);
  font-weight: 500;
  color: var(--color-on-dark);
  background-color: var(--color-primary);
  border: none;
  border-radius: 0.5rem;
  padding: 0.6em 1.3em;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.secondary-btn:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.secondary-btn:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.secondary-btn:disabled {
  opacity: 0.55;
  cursor: default;
}

.secondary-btn__label:empty {
  display: none;
}
</style>
