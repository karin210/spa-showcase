import type { ServiceCategory, SpaService } from "~/types/services";

// Remote stock photography (Unsplash). Sized per use through query params.
export function stockImage(photoId: string, width: number): string {
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&q=75&auto=format&fit=crop`;
}

// Single source of truth for the spa's menu. Shared by the marketing sections, the
// booking flow and every dashboard form that picks services.
//
// Entries are keyed by stable ids, not display strings: bookings and disabled
// schedules store service ids, and every visible label comes from the message
// catalogue (`services.categories.<id>.*` / `services.items.<id>.*` in
// i18n/locales/<locale>/services.json) — see useServiceLabels().
export const serviceCategories: ServiceCategory[] = [
  {
    id: "massages",
    photoId: "1544161515-4ab6ce6db874",
    services: [
      { id: "relaxing-massage", durationMinutes: 60, price: 850 },
      { id: "deep-tissue-massage", durationMinutes: 60, price: 950 },
      { id: "hot-stone-massage", durationMinutes: 75, price: 1100 },
      { id: "aromatherapy-massage", durationMinutes: 60, price: 900 },
      { id: "foot-reflexology", durationMinutes: 45, price: 650 },
    ],
  },
  {
    id: "facials",
    photoId: "1570172619644-dfd03ed5d881",
    services: [
      { id: "hydrating-facial", durationMinutes: 50, price: 780 },
      { id: "deep-cleansing-facial", durationMinutes: 60, price: 850 },
      { id: "anti-aging-facial", durationMinutes: 70, price: 1150 },
      { id: "enzyme-peel", durationMinutes: 45, price: 720 },
    ],
  },
  {
    id: "body-rituals",
    photoId: "1596178060671-7a80dc8059ea",
    services: [
      { id: "sea-salt-scrub", durationMinutes: 45, price: 700 },
      { id: "chocolate-wrap", durationMinutes: 60, price: 980 },
      { id: "seaweed-wrap", durationMinutes: 60, price: 950 },
      { id: "mud-detox-ritual", durationMinutes: 75, price: 1080 },
    ],
  },
  {
    id: "hydrotherapy",
    photoId: "1583416750470-965b2707b355",
    services: [
      { id: "spa-circuit", durationMinutes: 120, price: 650 },
      { id: "temazcal", durationMinutes: 90, price: 750 },
      { id: "flotation-bath", durationMinutes: 60, price: 890 },
    ],
  },
];

export const allServices: SpaService[] = serviceCategories.flatMap((category) => category.services);

export function servicePrice(id: string): number {
  return allServices.find((service) => service.id === id)?.price ?? 0;
}

export function categoryForService(id: string): ServiceCategory | undefined {
  return serviceCategories.find((category) => category.services.some((service) => service.id === id));
}
