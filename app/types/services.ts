export interface SpaService {
  // Stable id; stored on bookings and disabled schedules, and the i18n key for the
  // service's name and description (services.items.<id>.*).
  id: string;
  durationMinutes: number;
  price: number;
}

export interface ServiceCategory {
  // Stable id; doubles as an element-id prefix on the marketing cards and as the
  // i18n key for the category's copy (services.categories.<id>.*).
  id: string;
  // Unsplash photo id; render through stockImage() at the size each use needs.
  photoId: string;
  services: SpaService[];
}
