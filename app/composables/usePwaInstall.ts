import { computed, type ComputedRef } from "vue";

// Drives the hero "Descargar app" button. Browsers only open the native install
// popup from a user gesture — calling prompt() on page load is rejected with
// NotAllowedError — so installing always starts from that button's click.
//
// $pwa.showInstallPrompt (from @vite-pwa/nuxt) is true once the browser has offered
// the install (beforeinstallprompt) and flips back to false as soon as install() is
// called or the app gets installed, which hides the button after its one-shot use.
export function usePwaInstall(): { canInstall: ComputedRef<boolean>; install: () => Promise<void> } {
  const pwa = usePWA();

  const canInstall = computed<boolean>(() => !!pwa?.showInstallPrompt && !pwa.isPWAInstalled);

  async function install(): Promise<void> {
    await pwa?.install();
  }

  return { canInstall, install };
}
