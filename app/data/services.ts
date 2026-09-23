import type { ServiceCategory, SpaService } from "~/types/services";

// Remote stock photography (Unsplash). Sized per use through query params.
export function stockImage(photoId: string, width: number): string {
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&q=75&auto=format&fit=crop`;
}

// Single source of truth for the spa's menu. Shared by the marketing
// ServicesSection and every dashboard form that picks services.
export const serviceCategories: ServiceCategory[] = [
  {
    id: "massages",
    title: "Masajes",
    blurb: "Libera la tensión y recupera tu calma",
    photoId: "1544161515-4ab6ce6db874",
    imageAlt: "Terapeuta aplicando aceite aromático durante un masaje relajante",
    services: [
      { name: "Masaje relajante", durationMinutes: 60, price: 850 },
      { name: "Masaje de tejido profundo", durationMinutes: 60, price: 950 },
      { name: "Masaje con piedras calientes", durationMinutes: 75, price: 1100 },
      { name: "Masaje de aromaterapia", durationMinutes: 60, price: 900 },
      { name: "Reflexología podal", durationMinutes: 45, price: 650 },
    ],
  },
  {
    id: "facials",
    title: "Faciales",
    blurb: "Una piel luminosa empieza con un respiro",
    photoId: "1570172619644-dfd03ed5d881",
    imageAlt: "Clienta recibiendo una mascarilla facial con pincel",
    services: [
      { name: "Facial hidratante", durationMinutes: 50, price: 780 },
      { name: "Limpieza facial profunda", durationMinutes: 60, price: 850 },
      { name: "Facial antiedad", durationMinutes: 70, price: 1150 },
      { name: "Peeling enzimático", durationMinutes: 45, price: 720 },
    ],
  },
  {
    id: "body-rituals",
    title: "Rituales corporales",
    blurb: "Tradición, aromas y descanso profundo",
    photoId: "1596178060671-7a80dc8059ea",
    imageAlt: "Ritual corporal con frutas, flores y aceites sobre piso de talavera",
    services: [
      { name: "Exfoliación de sal marina", durationMinutes: 45, price: 700 },
      { name: "Envoltura de chocolate", durationMinutes: 60, price: 980 },
      { name: "Envoltura de algas marinas", durationMinutes: 60, price: 950 },
      { name: "Ritual detox de barro", durationMinutes: 75, price: 1080 },
    ],
  },
  {
    id: "hydrotherapy",
    title: "Hidroterapia",
    blurb: "Calor, vapor y agua para renovar cuerpo y mente",
    photoId: "1583416750470-965b2707b355",
    imageAlt: "Sauna de madera iluminada con luz cálida",
    services: [
      { name: "Circuito de spa", durationMinutes: 120, price: 650 },
      { name: "Temazcal", durationMinutes: 90, price: 750 },
      { name: "Baño de flotación", durationMinutes: 60, price: 890 },
    ],
  },
];

export const allServices: SpaService[] = serviceCategories.flatMap(
  (category) => category.services,
);

export function servicePrice(name: string): number {
  return allServices.find((service) => service.name === name)?.price ?? 0;
}

export function categoryForService(name: string): ServiceCategory | undefined {
  return serviceCategories.find((category) =>
    category.services.some((service) => service.name === name),
  );
}
