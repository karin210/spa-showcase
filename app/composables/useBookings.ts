import type { Ref } from "vue";
import type { BookingRecord, NewBookingInput } from "~/types/booking";
import { createMockBookings } from "~/data/mockBookings";
import { useUsers } from "~/composables/useUsers";
import { mockId } from "~/utils/mock";

interface BookingsApi {
  bookings: Ref<BookingRecord[]>;
  updateBooking: (id: string, patch: Partial<BookingRecord>) => void;
  addBooking: (input: NewBookingInput) => BookingRecord;
}

// In-memory bookings standing in for the bookings collection and its listeners.
export function useBookings(): BookingsApi {
  const { users } = useUsers();
  const bookings = useState<BookingRecord[]>("mock-bookings", () => createMockBookings(users.value));

  function updateBooking(id: string, patch: Partial<BookingRecord>): void {
    bookings.value = bookings.value.map((booking) => (booking.id === id ? { ...booking, ...patch } : booking));
  }

  function addBooking(input: NewBookingInput): BookingRecord {
    const account = users.value.find(
      (user) => `${user.firstName} ${user.lastName}`.toLowerCase() === input.customerName.trim().toLowerCase(),
    );
    const record: BookingRecord = {
      id: mockId("b"),
      services: input.services,
      customerName: input.customerName.trim(),
      email: account?.email ?? null,
      phone: input.phone ?? account?.phone ?? null,
      uid: account?.id ?? null,
      appointmentAt: input.appointmentAt,
      // Staff-created bookings start confirmed; a paid cost closes them straight away.
      status: input.finalCost !== null && input.paid ? "closed" : "confirmed",
      createdAt: new Date(),
      rescheduleProposedAt: null,
      previousAppointmentAt: null,
      finalCost: input.finalCost,
      paid: input.finalCost !== null && input.paid,
    };
    bookings.value = [...bookings.value, record];
    return record;
  }

  return { bookings, updateBooking, addBooking };
}
