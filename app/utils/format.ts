// Locale-independent presentation helpers. Dates, times, currency and percentages
// follow the active language, so those live in useLocaleFormat() instead.

// "+524435550142" → "+52 443 555 0142". Anything else is returned as-is.
export function formatPhone(phone: string): string {
  const match = /^\+52(\d{3})(\d{3})(\d{4})$/.exec(phone);
  return match ? `+52 ${match[1]} ${match[2]} ${match[3]}` : phone;
}

export function initials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}
