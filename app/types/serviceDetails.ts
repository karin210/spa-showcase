export interface Amenity {
  // Stable id; the i18n key for the amenity's copy.
  id: string;
  // Unsplash photo id; render through stockImage().
  photoId: string;
}
