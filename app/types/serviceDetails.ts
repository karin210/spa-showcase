export interface CategoryDetail {
  description: string;
  idealFor: string[];
}

export interface Amenity {
  title: string;
  description: string;
  // Unsplash photo id; render through stockImage().
  photoId: string;
  imageAlt: string;
}
