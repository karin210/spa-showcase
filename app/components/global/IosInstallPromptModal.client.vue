<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useIosInstall } from "~/composables/useIosInstall";

// iOS Safari has no native install popup, so iPhone/iPad visitors get these
// "Agregar a inicio" instructions instead. Once dismissed, it never nags again.
const DISMISSED_STORAGE_KEY = "ios-install-prompt-dismissed";
// Let the home hero's intro animation settle before interrupting with the prompt.
const SHOW_DELAY_MS = 3000;

const { t: trans } = useI18n();
const { isIosInstallable } = useIosInstall();

const isOpen = ref(false);
let showTimer: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
  if (!isIosInstallable.value) return;

  let dismissed = false;
  try {
    dismissed = localStorage.getItem(DISMISSED_STORAGE_KEY) === "true";
  } catch {
    // Private mode / storage disabled — treat as not dismissed.
  }
  if (dismissed) return;

  showTimer = setTimeout(() => {
    isOpen.value = true;
  }, SHOW_DELAY_MS);
});

onBeforeUnmount(() => {
  if (showTimer) clearTimeout(showTimer);
});

function dismiss(): void {
  isOpen.value = false;
  try {
    localStorage.setItem(DISMISSED_STORAGE_KEY, "true");
  } catch {
    // Storage unavailable — the prompt just reappears next visit.
  }
}
</script>

<template>
  <ModalDialog :open="isOpen" labelledby="ios-install-title" width="narrow" dismissible @close="dismiss">
    <h2 id="ios-install-title" class="modal-title">{{ trans("installPrompt.title") }}</h2>
    <p class="modal-text">{{ trans("installPrompt.text") }}</p>

    <!-- The Safari control names are bolded, so each step is split around them. -->
    <ol class="ios-steps">
      <li>
        {{ trans("installPrompt.step1.before") }}
        <AppIcon name="share" class="ios-steps__share" />
        <strong>{{ trans("installPrompt.step1.control") }}</strong> {{ trans("installPrompt.step1.after") }}
      </li>
      <li>
        {{ trans("installPrompt.step2.before") }} <strong>{{ trans("installPrompt.step2.control") }}</strong>.
      </li>
      <li>
        {{ trans("installPrompt.step3.before") }} <strong>{{ trans("installPrompt.step3.control") }}</strong>.
      </li>
    </ol>

    <div class="modal-actions">
      <button type="button" class="modal-btn modal-btn-primary" @click="dismiss">{{ trans("installPrompt.dismiss") }}</button>
    </div>
  </ModalDialog>
</template>

<style scoped>
.ios-steps {
  margin: 0;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: clamp(0.9rem, 2.2vw, 0.98rem);
  line-height: 1.45;
}

.ios-steps strong {
  font-weight: 600;
}

.ios-steps__share {
  vertical-align: -0.15em;
  color: var(--color-primary);
}
</style>
