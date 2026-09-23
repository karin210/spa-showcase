// Applies a waiting service-worker update at a moment the user won't notice the
// reload it causes, instead of reloading the page under them the instant a new
// version activates (what registerType "autoUpdate" does). Two such moments:
//  - the next in-app navigation: the user asked for a new page anyway, so it is
//    loaded as a full page on the new version instead of an in-app route change;
//  - the tab going to the background: the reload happens out of sight.
// $pwa.needRefresh flips true once a new worker is installed and waiting (see
// registerType "prompt" in nuxt.config.ts).

// If the new worker never takes control (e.g. it was discarded), reload anyway so
// a navigation cancelled below never leaves the user stuck on the old page.
const TAKEOVER_TIMEOUT_MS = 3000;

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();
  let applying = false;

  function hasPendingUpdate(): boolean {
    return !applying && Boolean(nuxtApp.$pwa?.needRefresh);
  }

  // updateServiceWorker() tells the waiting worker to take over; the registration
  // code then reloads the current URL once it controls the page.
  function applyUpdate(): void {
    applying = true;
    void nuxtApp.$pwa?.updateServiceWorker();
    setTimeout(() => window.location.reload(), TAKEOVER_TIMEOUT_MS);
  }

  router.beforeEach((to, from) => {
    // from.name is undefined on the initial navigation, which is already a full load.
    if (!from.name || !hasPendingUpdate()) return;
    // Point the address bar at the destination first, so the reload lands on the
    // page the user asked for rather than the one they're leaving.
    window.history.pushState(null, "", router.resolve(to).href);
    applyUpdate();
    return false;
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && hasPendingUpdate()) applyUpdate();
  });
});
