// YYYY-MM-DD from a date's local calendar parts (not UTC, which can shift the day).
export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Parses a YYYY-MM-DD key back into a local-midnight Date.
export function fromDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year!, month! - 1, day);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function atTime(date: Date, hours: number, minutes: number): Date {
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

// "HH:MM" (24h) for <input type="time">.
export function toTimeValue(date: Date): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

// Combines an <input type="date"> and an <input type="time"> value into a Date.
export function combineDateAndTime(dateKey: string, timeValue: string): Date {
  const [hours, minutes] = timeValue.split(":").map(Number);
  return atTime(fromDateKey(dateKey), hours ?? 0, minutes ?? 0);
}

// Every day key from Sunday of the current week up to `today`, inclusive.
export function weekToDateKeys(today: Date): string[] {
  const start = addDays(startOfDay(today), -today.getDay());
  return rangeKeys(start, today);
}

// Every day key from the 1st of the month up to `today`, inclusive.
export function monthToDateKeys(today: Date): string[] {
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  return rangeKeys(start, today);
}

function rangeKeys(start: Date, end: Date): string[] {
  const keys: string[] = [];
  for (let day = startOfDay(start); day <= end; day = addDays(day, 1)) {
    keys.push(toDateKey(day));
  }
  return keys;
}
