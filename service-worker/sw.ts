import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";

declare let self: ServiceWorkerGlobalScope;

// Workbox's own runtime logger (separate from vite-pwa's suppressWarnings, which
// only covers vite-pwa's build-time output) otherwise logs every dev-mode request
// it intercepts, flooding the console in `npm run dev`.
self.__WB_DISABLE_DEV_LOGS = true;

// No unconditional skipWaiting(): a new version waits until the page applies it at a
// moment the user won't notice (see app/plugins/pwa-update.client.ts), which sends
// this message via $pwa.updateServiceWorker(). Taking over immediately would make
// the registration code reload every open tab mid-session.
self.addEventListener("message", (event: ExtendableMessageEvent) => {
  if (event.data?.type === "SKIP_WAITING") void self.skipWaiting();
});
// Still claim on first install, so a first-time visitor's page is controlled
// without a reload (no previous worker to replace, so nothing reloads).
clientsClaim();

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// Opportunistic runtime cache for content photography — NOT precached at install
// time. Populates as the visitor actually browses the site. Most photos come from
// images.unsplash.com through plain <img> tags, i.e. no-cors requests whose
// responses are opaque (status 0), so those have to be explicitly allowed.
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "content-images",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 80, maxAgeSeconds: 30 * 24 * 60 * 60, purgeOnQuotaError: true }),
    ],
  }),
);
