import type { Amenity } from "~/types/serviceDetails";

// Non-text data for the /services page. Every visible string lives in the message
// catalogue under services.page.* (i18n/locales/<locale>/services.json).

export const SERVICES_BANNER_PHOTO_ID = "1600334129128-685c5582fd35";

// Each id is the i18n key for the amenity's copy (services.page.amenities.items.<id>.*).
export const AMENITIES: Amenity[] = [
  { id: "pool", photoId: "1571896349842-33c89424de2d" },
  { id: "sauna", photoId: "1583416750470-965b2707b355" },
  { id: "lounge", photoId: "1582719478250-c89cae4dc85b" },
  { id: "tea-bar", photoId: "1597318181409-cf64d0b5d8a2" },
  { id: "locker-rooms", photoId: "1540555700478-4be289fbecef" },
  { id: "parking", photoId: "1506521781263-d8422e82f27a" },
];
