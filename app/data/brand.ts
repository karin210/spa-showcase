// Fictional business used throughout the showcase. Every contact detail below is
// placeholder data.
export const BRAND = "Alma Serena Spa & Bienestar";
export const BRAND_SHORT = "Alma Serena";
export const TITLE_SEPARATOR = " | ";

export const CONTACT = {
  addressLines: [
    "Av. de los Manantiales 245",
    "Col. Jardines del Lago",
    "58280 Morelia, Mich.",
  ],
  phones: [
    { tel: "+524435550142", display: "+52 443 555 0142" },
    { tel: "+524435550187", display: "+52 443 555 0187" },
  ],
  whatsappNumber: "524435550142",
  whatsappMessage: "¡Hola! Me gustaría reservar un tratamiento.",
  instagramUrl: "https://www.instagram.com/",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Morelia%2C%20Michoac%C3%A1n&z=13&output=embed",
  mapLinkUrl: "https://maps.google.com/?q=Morelia,+Michoac%C3%A1n",
  schedule: [
    { days: "Lunes a sábado", hours: "9:00 a 20:00" },
    { days: "Domingo", hours: "10:00 a 18:00" },
  ],
} as const;

export function whatsappUrl(message: string, number: string = CONTACT.whatsappNumber): string {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
