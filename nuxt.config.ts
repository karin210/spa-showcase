// https://nuxt.com/docs/api/configuration/nuxt-config

// Every locale loads the same domain catalogues from i18n/locales/<code>/.
const MESSAGE_FILES = ["common", "home", "services", "booking", "profile", "dashboard", "about", "careers"];

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["@vite-pwa/nuxt", "@nuxtjs/i18n"],
  i18n: {
    // Spanish keeps its unprefixed URLs; English lives under /en.
    strategy: "prefix_except_default",
    defaultLocale: "es",
    locales: [
      { code: "es", language: "es-MX", name: "Español", files: MESSAGE_FILES.map((file) => `es/${file}.json`) },
      { code: "en", language: "en-US", name: "English", files: MESSAGE_FILES.map((file) => `en/${file}.json`) },
    ],
    // Locale files are always lazy-loaded in v10: only the active locale is fetched.
    // Absolute origin for the hreflang/canonical alternates the module emits. Set
    // NUXT_PUBLIC_SITE_URL in production; without it the alternates point at localhost.
    baseUrl: process.env.NUXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      // Redirect on "/" only. Redirecting on every route would mean a shared deep
      // link lands somewhere other than where it points.
      redirectOn: "root",
      alwaysRedirect: false,
    },
    // Keys are page filenames (and therefore route names), which are English; the
    // localized *paths* are the user-facing side. Link to these by route name via
    // localePath("booking") rather than by path — the name is stable, the slugs are not.
    customRoutes: "config",
    pages: {
      booking: { es: "/agendar", en: "/book" },
      profile: { es: "/perfil", en: "/profile" },
      dashboard: { es: "/panel-administrativo", en: "/dashboard" },
      "about-us": { es: "/about-us", en: "/about-us" },
      services: { es: "/services", en: "/services" },
      "work-with-us": { es: "/work-with-us", en: "/work-with-us" },
    },
  },
  app: {
    head: {
      // No `title` and no `description` here on purpose: the title template and the
      // localized site-wide description live in app.vue so they follow the active
      // locale, and useLocaleHead() there sets <html lang>.
      meta: [
        { name: "theme-color", content: "#3f5b4c" },
        { name: "apple-mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      ],
      link: [
        { rel: "manifest", href: "/manifest.webmanifest" },
        { rel: "apple-touch-icon", href: "/icons/apple-touch-icon.png" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Jost:wght@300;400;500;600&family=Marcellus&display=swap",
        },
      ],
    },
  },
  pwa: {
    strategies: "injectManifest",
    srcDir: "../service-worker",
    filename: "sw.ts",
    injectRegister: false,
    // "prompt", not "autoUpdate": autoUpdate reloads every open tab the moment a new
    // worker activates. app/plugins/pwa-update.client.ts applies updates instead on
    // the next navigation or while the tab is hidden, so the reload goes unnoticed.
    registerType: "prompt",
    // Enables $pwa.showInstallPrompt/install() (via the auto-imported usePWA()
    // composable, wrapped by usePwaInstall()), which auto-fires the browser's native
    // install popup on load and also drives the hero "Descargar app" button.
    client: { installPrompt: true },
    manifest: {
      name: "Alma Serena Spa & Bienestar",
      short_name: "Alma Serena",
      description: "Reserva masajes, faciales, rituales corporales e hidroterapia en Alma Serena Spa & Bienestar.",
      lang: "es-MX",
      start_url: "/",
      display: "standalone",
      // --color-background and --color-primary in app/assets/css/main.css.
      background_color: "#f3f5f1",
      theme_color: "#3f5b4c",
      // Regenerate with `npm run icons` (scripts/generate-pwa-icons.mjs).
      icons: [
        { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
        { src: "/icons/maskable-icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
    },
    injectManifest: {
      // Precache only the app shell (JS/CSS). Content photography is cached at
      // runtime as the visitor browses instead — see service-worker/sw.ts.
      globPatterns: ["**/*.{js,css}"],
    },
    devOptions: {
      enabled: true,
      type: "module",
      suppressWarnings: true,
      // Without this, the dev-mode service worker intercepts every navigation
      // request, which fights with Vite's HMR client and makes the app re-mount
      // repeatedly. Scoping the fallback to just "/" stops the SW from
      // intercepting anything else during dev.
      navigateFallback: "/",
      navigateFallbackAllowlist: [/^\/$/],
    },
  },
  // The private pages hold only mock, clock-relative data for a pretend signed-in
  // user, so there is nothing worth server-rendering — and rendering them on the
  // client only keeps "now"-based labels from disagreeing between server and client.
  routeRules: {
    // Rules are path-based, so each localized path needs its own entry.
    "/perfil": { ssr: false },
    "/en/profile": { ssr: false },
    "/panel-administrativo": { ssr: false },
    "/en/dashboard": { ssr: false },
  },
});
