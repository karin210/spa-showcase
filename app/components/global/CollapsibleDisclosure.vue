<script setup lang="ts">
// Thin wrapper over native <details>/<summary>: owns only the shared mechanics
// (animation, chevron, marker, focus ring). Visual skin stays with each caller via
// :deep(.disclosure__summary) and the --disclosure-* custom properties.
defineProps<{ open?: boolean }>();
</script>

<template>
  <details class="disclosure" :open="open">
    <summary class="disclosure__summary">
      <slot name="summary" />
      <svg
        class="disclosure__chevron"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </summary>
    <slot />
  </details>
</template>

<style scoped>
.disclosure__summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  cursor: pointer;
  list-style: none;
  outline: none;
}

.disclosure__summary::-webkit-details-marker {
  display: none;
}

.disclosure__summary:focus-visible {
  outline: 2px solid var(--disclosure-focus-color, var(--color-focus));
  outline-offset: var(--disclosure-focus-offset, 2px);
}

.disclosure__chevron {
  flex-shrink: 0;
  width: 1.1em;
  height: 1.1em;
  color: var(--disclosure-chevron-color, var(--color-primary));
  transition: transform 0.25s ease;
}

.disclosure[open] .disclosure__chevron {
  transform: rotate(180deg);
}

.disclosure::details-content {
  block-size: 0;
  opacity: 0;
  overflow: hidden;
  transition:
    block-size 0.3s ease,
    opacity 0.3s ease,
    content-visibility 0.3s allow-discrete;
}

.disclosure[open]::details-content {
  block-size: auto;
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .disclosure__chevron,
  .disclosure::details-content {
    transition: none;
  }
}
</style>
