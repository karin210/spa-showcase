export type BookingStatus = "pending" | "confirmed" | "cancelled" | "closed";

export interface BookingRecord {
  id: string;
  // Service names as listed in the catalogue (app/data/services.ts).
  services: string[];
  customerName: string;
  email: string | null;
  phone: string | null;
  appointmentAt: Date;
  // "closed" means the visit happened and was paid; only recording a paid final
  // cost closes a booking.
  status: BookingStatus;
  createdAt: Date;
  // null for walk-in / guest customers without an account.
  uid: string | null;
  // Set when staff move a still-pending booking; cleared once the customer accepts.
  rescheduleProposedAt: Date | null;
  previousAppointmentAt: Date | null;
  finalCost: number | null;
  paid: boolean;
}

// What the dashboard's edit modal returns. finalCost is present only when a closed
// booking's cost was corrected.
export interface BookingEdit {
  appointmentAt: Date;
  status: BookingStatus;
  finalCost?: number;
}

export interface NewBookingInput {
  customerName: string;
  phone: string | null;
  appointmentAt: Date;
  services: string[];
  finalCost: number | null;
  paid: boolean;
}
