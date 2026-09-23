import type { BookingRecord, BookingStatus } from "~/types/booking";

// Status labels live in the message catalogue (dashboard.status.<status>).

export interface TimeSlotGroup {
  key: string;
  // First booking time in the slot; formatted by the caller in the active locale.
  startsAt: Date;
  bookings: BookingRecord[];
}

// Groups bookings into 15-minute slots, earliest first.
export function groupBookingsByTimeSlot(bookings: BookingRecord[]): TimeSlotGroup[] {
  const groups = new Map<string, BookingRecord[]>();

  for (const booking of bookings) {
    const hour = booking.appointmentAt.getHours();
    const minute = Math.floor(booking.appointmentAt.getMinutes() / 15) * 15;
    const key = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(booking);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, slotBookings]) => ({
      key,
      startsAt: slotBookings[0]!.appointmentAt,
      bookings: slotBookings,
    }));
}

export function countByStatus(bookings: BookingRecord[]): [BookingStatus, number][] {
  const counts = new Map<BookingStatus, number>();
  for (const booking of bookings) {
    counts.set(booking.status, (counts.get(booking.status) ?? 0) + 1);
  }
  return [...counts.entries()];
}
