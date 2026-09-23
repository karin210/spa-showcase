// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  app: {
    head: {
      htmlAttrs: { lang: "es-MX" },
      meta: [
        { name: "theme-color", content: "#3f5b4c" },
        {
          name: "description",
          content:
            "Alma Serena Spa & Bienestar: masajes, faciales, rituales corporales e hidroterapia. Demostración de sitio para spas.",
        },
      ],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Jost:wght@300;400;500;600&family=Marcellus&display=swap",
        },
      ],
    },
  },
  // The private pages hold only mock, clock-relative data for a pretend signed-in
  // user, so there is nothing worth server-rendering — and rendering them on the
  // client only keeps "now"-based labels from disagreeing between server and client.
  routeRules: {
    "/perfil": { ssr: false },
    "/panel-administrativo": { ssr: false },
  },
});
