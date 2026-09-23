<script setup lang="ts">
import { useToast } from "~/composables/useToast";

const { toasts, dismiss } = useToast();
</script>

<template>
  <section class="toast-region" aria-label="Notificaciones" aria-live="polite">
    <TransitionGroup name="toast" tag="ul" class="toast-list">
      <li v-for="toast in toasts" :key="toast.id" class="toast" role="status">
        <AppIcon name="info" />
        <span class="toast__message">{{ toast.message }}</span>
        <button type="button" class="toast__close" aria-label="Cerrar aviso" @click="dismiss(toast.id)">
          <AppIcon name="close" />
        </button>
      </li>
    </TransitionGroup>
  </section>
</template>

<style scoped>
.toast-region {
  position: fixed;
  left: 50%;
  bottom: clamp(1rem, 3vw, 2rem);
  transform: translateX(-50%);
  z-index: 200;
  width: min(28rem, calc(100vw - 2rem));
  pointer-events: none;
}

.toast-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toast {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 0.75rem 0.75rem 1rem;
  border-radius: var(--radius-md);
  background-color: var(--color-tertiary);
  color: var(--color-on-dark);
  font-size: clamp(0.88rem, 2vw, 0.95rem);
  box-shadow: 0 8px 24px var(--color-shadow-strong);
}

.toast__message {
  flex: 1;
}

.toast__close {
  display: inline-flex;
  padding: 0.3rem;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.toast__close:hover {
  background-color: var(--color-tertiary-dark);
}

.toast__close:focus-visible {
  outline: 2px solid var(--color-focus-on-dark);
  outline-offset: 1px;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(0.75rem);
}

@media (prefers-reduced-motion: reduce) {
  .toast-enter-active,
  .toast-leave-active {
    transition: none;
  }
}
</style>
