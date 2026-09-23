<script setup lang="ts">
import { useId } from "vue";
import { useI18n } from "vue-i18n";

// Non-dismissible yes/no decision (sign out, cancel a booking, remove a member…).
// The message goes in the default slot so callers can emphasise parts of it.
withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    confirmLabel: string;
    busyLabel?: string | null;
    busy?: boolean;
    errorMessage?: string | null;
  }>(),
  { busyLabel: null, busy: false, errorMessage: null },
);

const emit = defineEmits<{ close: []; confirm: [] }>();

const { t: trans } = useI18n();
const titleId = useId();
</script>

<template>
  <ModalDialog :open="open" :labelledby="titleId" width="narrow" @close="emit('close')">
    <h2 :id="titleId" class="modal-title">{{ title }}</h2>
    <p class="modal-text"><slot /></p>
    <p v-if="errorMessage" class="modal-error" role="alert">{{ errorMessage }}</p>
    <div class="modal-actions">
      <button type="button" class="modal-btn modal-btn-cancel" :disabled="busy" @click="emit('close')">
        {{ trans("actions.cancel") }}
      </button>
      <button type="button" class="modal-btn modal-btn-primary" :disabled="busy" @click="emit('confirm')">
        {{ busy ? (busyLabel ?? trans("states.processing")) : confirmLabel }}
      </button>
    </div>
  </ModalDialog>
</template>
