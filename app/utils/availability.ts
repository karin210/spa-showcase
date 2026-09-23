import type { BlacklistRecord } from "~/types/dashboard";
import { atTime, toDateKey } from "~/utils/date";

// Business hours by weekday (0 = Sunday), in minutes from midnight. Mirrors the
// hours shown in the footer (app/data/brand.ts's CONTACT.schedule).
const OPEN_HOURS: Record<number, [number, number]> = {
  0: [10 * 60, 18 * 60], // Domingo
  1: [9 * 60, 20 * 60],
  2: [9 * 60, 20 * 60],
  3: [9 * 60, 20 * 60],
  4: [9 * 60, 20 * 60],
  5: [9 * 60, 20 * 60],
  6: [9 * 60, 20 * 60],
};

const SLOT_MINUTES = 30;

function isAllDay(record: BlacklistRecord): boolean {
  return record.startTime.getHours() === 0 && record.endTime.getHours() === 23;
}

// Whether a disabled-schedule record affects any of the requested services.
function blocksServices(record: BlacklistRecord, services: string[]): boolean {
  return record.services.some((service) => services.includes(service));
}

function sameDay(a: Date, b: Date): boolean {
  return toDateKey(a) === toDateKey(b);
}

// A day the calendar should refuse to offer at all: the whole day is blocked for at
// least one of the requested treatments.
export function isDateFullyBooked(date: Date, services: string[], blacklist: BlacklistRecord[]): boolean {
  return blacklist.some(
    (record) => isAllDay(record) && sameDay(record.startTime, date) && blocksServices(record, services),
  );
}

// Every bookable half-hour start time on `date` for the given services: within
// business hours, clear of any disabled schedule, and — for today — not already past.
export function availableSlots(date: Date, services: string[], blacklist: BlacklistRecord[]): Date[] {
  const hours = OPEN_HOURS[date.getDay()];
  if (!hours) return [];
  const [openMinutes, closeMinutes] = hours;

  const now = new Date();
  const isToday = sameDay(date, now);
  const relevantBlocks = blacklist.filter((record) => sameDay(record.startTime, date) && blocksServices(record, services));

  const slots: Date[] = [];
  for (let minutes = openMinutes; minutes < closeMinutes; minutes += SLOT_MINUTES) {
    const slotStart = atTime(date, Math.floor(minutes / 60), minutes % 60);
    if (isToday && slotStart <= now) continue;
    const slotEnd = new Date(slotStart.getTime() + SLOT_MINUTES * 60_000);
    if (relevantBlocks.some((record) => record.startTime < slotEnd && record.endTime > slotStart)) continue;
    slots.push(slotStart);
  }
  return slots;
}
