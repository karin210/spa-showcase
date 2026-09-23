export interface SpaService {
  name: string;
  durationMinutes: number;
  price: number;
}

export interface ServiceCategory {
  // Stable id; doubles as an element-id prefix on the marketing cards.
  id: string;
  title: string;
  blurb: string;
  // Unsplash photo id; render through stockImage() at the size each use needs.
  photoId: string;
  imageAlt: string;
  services: SpaService[];
}
