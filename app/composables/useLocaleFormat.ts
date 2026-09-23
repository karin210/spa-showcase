import { computed, type ComputedRef } from "vue";
import { useI18n } from "vue-i18n";
import type { LocaleObject } from "@nuxtjs/i18n";

export interface LocaleFormatters {
  // BCP-47 tag for the active locale ("es-MX" / "en-US"), read from the i18n config
  // rather than a second hardcoded map.
  languageTag: ComputedRef<string>;
  /** "sábado, 26 de septiembre" / "Saturday, September 26" */
  formatWeekdayDayMonth: (date: Date) => string;
  /** "Sábado, 26 de septiembre de 2026" / "Saturday, September 26, 2026" */
  formatWeekdayDate: (date: Date) => string;
  /** "26 de septiembre de 2026" / "September 26, 2026" */
  formatLongDate: (date: Date) => string;
  /** "sáb, 26 sept" / "Sat, Sep 26" */
  formatShortWeekday: (date: Date) => string;
  /** "26 sept 2026" / "Sep 26, 2026" */
  formatShortDate: (date: Date) => string;
  /** "Septiembre de 2026" / "September 2026" */
  formatMonthYear: (date: Date) => string;
  /** "Septiembre" / "September" */
  formatMonthName: (date: Date) => string;
  /** "3:30 p.m." / "3:30 PM" */
  formatTime: (date: Date) => string;
  /** "sábado, 26 de septiembre a las 3:30 p.m." / "Saturday, September 26 at 3:30 PM" */
  formatDateAtTime: (date: Date) => string;
  /** "$1,250.00" / "MX$1,250.00" — the spa charges in Mexican pesos whatever the UI language */
  formatCurrency: (amount: number) => string;
  /** Monday-first weekday initials and full names: L/lunes … D/domingo, M/Monday … S/Sunday */
  weekdays: ComputedRef<{ initial: string; name: string }[]>;
  /** 0.42 -> "42 %" / "42%" */
  formatPercent: (ratio: number) => string;
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Single locale-aware formatting seam for the whole client: only the *language*
// follows the active locale. Dates stay on the device clock, like the rest of the
// clock-relative mock data (app/utils/date.ts).
export function useLocaleFormat(): LocaleFormatters {
  const { t: trans, locale, locales } = useI18n();

  const languageTag = computed<string>(() => {
    const active = (locales.value as LocaleObject[]).find((entry) => entry.code === locale.value);
    return active?.language ?? locale.value;
  });

  const format = (date: Date, options: Intl.DateTimeFormatOptions): string =>
    new Intl.DateTimeFormat(languageTag.value, options).format(date);

  const formatWeekdayDayMonth = (date: Date): string => format(date, { weekday: "long", day: "numeric", month: "long" });
  const formatTime = (date: Date): string => format(date, { hour: "numeric", minute: "2-digit" });

  // 2024-01-01 was a Monday; the week is Monday-first, as is usual in Mexico.
  const weekdays = computed(() =>
    Array.from({ length: 7 }, (_, index) => {
      const day = new Date(2024, 0, 1 + index);
      return { initial: format(day, { weekday: "narrow" }), name: format(day, { weekday: "long" }) };
    }),
  );

  return {
    languageTag,
    weekdays,
    formatWeekdayDayMonth,
    formatWeekdayDate: (date) =>
      capitalize(format(date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })),
    formatLongDate: (date) => format(date, { day: "numeric", month: "long", year: "numeric" }),
    formatShortWeekday: (date) => format(date, { weekday: "short", day: "numeric", month: "short" }),
    formatShortDate: (date) => format(date, { day: "numeric", month: "short", year: "numeric" }),
    formatMonthYear: (date) => capitalize(format(date, { month: "long", year: "numeric" })),
    formatMonthName: (date) => capitalize(format(date, { month: "long" })),
    formatTime,
    formatDateAtTime: (date) =>
      trans("formats.dateAtTime", { date: formatWeekdayDayMonth(date), time: formatTime(date) }),
    formatCurrency: (amount) =>
      new Intl.NumberFormat(languageTag.value, { style: "currency", currency: "MXN" }).format(amount),
    formatPercent: (ratio) =>
      new Intl.NumberFormat(languageTag.value, { style: "percent", maximumFractionDigits: 1 }).format(ratio),
  };
}
