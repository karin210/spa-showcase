<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

// The single native-<dialog> shell every modal is built on. Two flavours:
//  - dismissible: closes on backdrop click, Escape, or the floating X.
//  - non-dismissible (default): closes only through the caller's own buttons.
const props = withDefaults(
  defineProps<{
    open: boolean;
    labelledby: string;
    dismissible?: boolean;
    width?: "narrow" | "regular" | "wide";
  }>(),
  { dismissible: false, width: "regular" },
);

const emit = defineEmits<{ close: [] }>();

const { t: trans } = useI18n();

const dialogEl = ref<HTMLDialogElement | null>(null);

function sync(open: boolean): void {
  const dialog = dialogEl.value;
  if (!dialog) return;
  if (open && !dialog.open) dialog.showModal();
  if (!open && dialog.open) dialog.close();
}

watch(() => props.open, sync);
onMounted(() => sync(props.open));

function onCancel(event: Event): void {
  event.preventDefault();
  if (props.dismissible) emit("close");
}

function onClick(event: MouseEvent): void {
  if (props.dismissible && event.target === dialogEl.value) emit("close");
}
</script>

<template>
  <dialog
    ref="dialogEl"
    class="modal-dialog"
    :class="`modal-dialog--${width}`"
    :aria-labelledby="labelledby"
    :closedby="dismissible ? 'any' : 'none'"
    @cancel="onCancel"
    @click="onClick"
  >
    <button
      v-if="dismissible"
      type="button"
      class="modal-close-floating"
      :aria-label="trans('actions.close')"
      @click="emit('close')"
    >
      <AppIcon name="close" />
    </button>
    <div class="modal-dialog__body">
      <slot />
    </div>
  </dialog>
</template>

<!-- ::backdrop lives in the top layer, which scoped attributes don't reach. -->
<style>
.modal-dialog::backdrop {
  background-color: transparent;
  backdrop-filter: blur(0);
  transition:
    background-color 0.25s ease,
    backdrop-filter 0.25s ease,
    overlay 0.25s ease allow-discrete,
    display 0.25s ease allow-discrete;
}

.modal-dialog[open]::backdrop {
  background-color: var(--color-overlay);
  backdrop-filter: blur(3px);
}

@starting-style {
  .modal-dialog[open]::backdrop {
    background-color: transparent;
    backdrop-filter: blur(0);
  }
}
</style>

<style scoped>
.modal-dialog {
  border: none;
  border-radius: var(--radius-lg);
  padding: 0;
  max-height: 90dvh;
  overflow: visible;
  background-color: var(--color-surface);
  color: var(--color-ink);
  box-shadow: 0 12px 44px var(--color-shadow-strong);
  opacity: 0;
  transform: translateY(1rem);
  transition:
    opacity 0.25s ease,
    transform 0.25s ease,
    overlay 0.25s ease allow-discrete,
    display 0.25s ease allow-discrete;
}

.modal-dialog[open] {
  opacity: 1;
  transform: translateY(0);
}

@starting-style {
  .modal-dialog[open] {
    opacity: 0;
    transform: translateY(1rem);
  }
}

.modal-dialog--narrow {
  width: min(24rem, 92vw);
}

.modal-dialog--regular {
  width: min(30rem, 92vw);
}

.modal-dialog--wide {
  width: min(40rem, 94vw);
}

.modal-dialog__body {
  max-height: 90dvh;
  overflow-y: auto;
  padding: clamp(1.25rem, 3vw, 2rem);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

@media (prefers-reduced-motion: reduce) {
  .modal-dialog,
  .modal-dialog::backdrop {
    transition: none;
  }
}
</style>
