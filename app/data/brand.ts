// Fictional business used throughout the showcase. Every contact detail below is
// placeholder data. The brand name is a proper noun and stays untranslated; the
// copy around it (opening hours, the WhatsApp greeting) lives in the message catalogue.
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
  instagramUrl: "https://www.instagram.com/",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Morelia%2C%20Michoac%C3%A1n&z=13&output=embed",
  mapLinkUrl: "https://maps.google.com/?q=Morelia,+Michoac%C3%A1n",
} as const;

export function whatsappUrl(message: string, number: string = CONTACT.whatsappNumber): string {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
