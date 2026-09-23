import type { CompanyMilestone, CompanyValue } from "~/types/about";

// Placeholder copy for the /about-us page. The story, values and dates are fictional.

export const ABOUT_BANNER = {
  photoId: "1583416750470-965b2707b355",
  imageAlt: "Sauna de madera iluminada con luz cálida",
} as const;

export const ORIGIN_STORY =
  "Alma Serena nació en 2016, cuando dos terapeutas morelianas abrieron una pequeña cabina de masaje en el centro histórico con una idea sencilla: que cuidarse no debería sentirse como un lujo lejano. Hoy nuestro propósito sigue siendo el mismo: ofrecer a nuestra comunidad un espacio cercano y honesto para detenerse, sanar y volver a casa con más calma.";

export const PHILOSOPHY = {
  photoId: "1596178060671-7a80dc8059ea",
  imageAlt: "Ritual corporal con frutas, flores y aceites sobre piso de talavera",
  paragraphs: [
    "Creemos que el descanso no es un lujo, sino una forma de cuidarse. Alma Serena nació como un refugio donde el tiempo se detiene lo suficiente para escuchar al cuerpo.",
    "Cada tratamiento combina técnicas contemporáneas con saberes tradicionales de Michoacán: plantas locales, barro, aceites y el ritmo pausado de quien hace las cosas con intención.",
    "No seguimos protocolos de reloj. Escuchamos primero, recomendamos después y ajustamos cada sesión a lo que necesitas ese día.",
  ],
} as const;

export const PROMISE_QUOTE =
  "Que salgas de aquí respirando distinto a como llegaste: más lento, más hondo, más tuyo.";

export const COMPANY_VALUES: CompanyValue[] = [
  {
    title: "Cuidado consciente",
    description:
      "Atendemos a la persona completa, no solo al síntoma. Cada sesión empieza con una conversación breve para entender cómo llegas.",
  },
  {
    title: "Raíces locales",
    description:
      "Trabajamos con productores michoacanos de hierbas, miel y arcillas, y apoyamos a artesanas de la región en nuestros espacios.",
  },
  {
    title: "Sostenibilidad",
    description:
      "Usamos productos biodegradables, textiles de algodón orgánico y un sistema de captación de agua de lluvia para la hidroterapia.",
  },
  {
    title: "Transparencia",
    description:
      "Precios claros, sin cargos sorpresa, y recomendaciones honestas: si un tratamiento no es para ti, te lo diremos.",
  },
  {
    title: "Equipo que crece",
    description:
      "Nuestras terapeutas reciben formación continua y un salario justo, porque un equipo cuidado cuida mejor.",
  },
  {
    title: "Espacios seguros",
    description:
      "Un ambiente respetuoso e incluyente, donde cada persona decide el ritmo, la presión y el nivel de conversación.",
  },
];

export const MILESTONES: CompanyMilestone[] = [
  { year: "2016", description: "Abrimos una pequeña cabina de masaje en el centro histórico de Morelia." },
  { year: "2019", description: "Nos mudamos a Jardines del Lago y sumamos faciales y rituales corporales." },
  { year: "2022", description: "Inauguramos el área de hidroterapia con sauna y vapor de eucalipto." },
  { year: "2025", description: "Más de 12,000 visitas y un equipo de 14 terapeutas certificadas." },
];
