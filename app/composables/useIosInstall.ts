import { ref, type Ref } from "vue";

// Detects an iPhone/iPad running Safari where the site is still an ordinary browser
// tab — i.e. the user could add it to the Home Screen but hasn't yet. iOS fires no
// `beforeinstallprompt` event, so this is the only signal available for deciding
// whether to surface "Agregar a inicio" instructions. Intended for client-only
// callers (a `.client.vue` component): it reads `navigator`/`window` synchronously
// and simply reports `false` during SSR.
export function useIosInstall(): { isIosInstallable: Ref<boolean> } {
  const isIosInstallable = ref(false);

  if (typeof window !== "undefined") {
    const ua = navigator.userAgent;
    // iPadOS 13+ reports a desktop-Safari UA, so fall back to the touch-capable
    // "MacIntel" heuristic to still catch it.
    const isIos = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    // Chrome/Firefox/Edge/Opera on iOS carry their own UA tokens and use a
    // different (or no) install flow — only real Safari gets these instructions.
    const isSafari = /safari/i.test(ua) && !/crios|fxios|edgios|opios/i.test(ua);
    // Already added to the Home Screen and launched standalone — nothing to prompt.
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;

    isIosInstallable.value = isIos && isSafari && !isStandalone;
  }

  return { isIosInstallable };
}
