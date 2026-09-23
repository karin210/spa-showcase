import { computed, ref, watch, type ComputedRef } from "vue";

// $pwa.showInstallPrompt (from @vite-pwa/nuxt) is ephemeral: it flips back to false
// the instant install() is called anywhere (app.vue's auto-fire on load consumes it
// almost immediately). Latching availability locally keeps the hero "Descargar app"
// button visible from the moment installability is first signaled, rather than only
// for the single tick before the auto-fire consumes it.
const available = ref(false);
// Browsers only ever grant one real native prompt per captured beforeinstallprompt
// event — a second install() call after that can't produce another popup, and there
// is no web API for installing a PWA without that native step. Once install() has
// been called anywhere (the auto-fire or the button), the button would just be dead
// weight, so this hides it rather than leaving an inert CTA on the page.
const consumed = ref(false);

export function usePwaInstall(): { canInstall: ComputedRef<boolean>; install: () => Promise<void> } {
  const pwa = usePWA();

  watch(
    () => pwa?.showInstallPrompt,
    (show) => {
      if (show) available.value = true;
    },
    { immediate: true },
  );

  const canInstall = computed<boolean>(() => available.value && !consumed.value && !pwa?.isPWAInstalled);

  async function install(): Promise<void> {
    consumed.value = true;
    await pwa?.install();
  }

  return { canInstall, install };
}
