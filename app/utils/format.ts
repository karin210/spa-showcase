// Spanish (Mexico) presentation helpers. The site is Spanish-only, so the locale
// is fixed here instead of being threaded through every caller.
const LOCALE = "es-MX";

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// "sábado 26 de septiembre"
export function formatWeekdayDayMonth(date: Date): string {
  return date.toLocaleDateString(LOCALE, { weekday: "long", day: "numeric", month: "long" });
}

// "Sábado, 26 de septiembre de 2026"
export function formatWeekdayDate(date: Date): string {
  return capitalize(
    date.toLocaleDateString(LOCALE, { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
  );
}

// "26 de septiembre de 2026"
export function formatLongDate(date: Date): string {
  return date.toLocaleDateString(LOCALE, { day: "numeric", month: "long", year: "numeric" });
}

// "sáb, 26 sept"
export function formatShortWeekday(date: Date): string {
  return date.toLocaleDateString(LOCALE, { weekday: "short", day: "numeric", month: "short" });
}

// "26 sept 2026"
export function formatShortDate(date: Date): string {
  return date.toLocaleDateString(LOCALE, { day: "numeric", month: "short", year: "numeric" });
}

// "Septiembre de 2026"
export function formatMonthYear(date: Date): string {
  return capitalize(date.toLocaleDateString(LOCALE, { month: "long", year: "numeric" }));
}

// "Septiembre"
export function formatMonthName(date: Date): string {
  return capitalize(date.toLocaleDateString(LOCALE, { month: "long" }));
}

// "3:30 p.m."
export function formatTime(date: Date): string {
  return date.toLocaleTimeString(LOCALE, { hour: "numeric", minute: "2-digit" });
}

// "sábado 26 de septiembre a las 3:30 p.m."
export function formatDateAtTime(date: Date): string {
  return `${formatWeekdayDayMonth(date)} a las ${formatTime(date)}`;
}

// "$1,250.00"
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat(LOCALE, { style: "currency", currency: "MXN" }).format(amount);
}

// "42 %"
export function formatPercent(ratio: number): string {
  return new Intl.NumberFormat(LOCALE, { style: "percent", maximumFractionDigits: 1 }).format(ratio);
}

// "+524435550142" → "+52 443 555 0142". Anything else is returned as-is.
export function formatPhone(phone: string): string {
  const match = /^\+52(\d{3})(\d{3})(\d{4})$/.exec(phone);
  return match ? `+52 ${match[1]} ${match[2]} ${match[3]}` : phone;
}

export function initials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}
