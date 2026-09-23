import type { BookingRecord, BookingStatus } from "~/types/booking";
import type { UserRecord } from "~/types/user";
import { allServices, servicePrice } from "~/data/services";
import { SESSION_USER_ID } from "~/data/mockUsers";
import { addDays, atTime, startOfDay, toDateKey } from "~/utils/date";
import { pick, seededRandom } from "~/utils/mock";

// Walk-in customers without an account (uid: null).
const GUESTS: { name: string; phone: string | null }[] = [
  { name: "Carmen Olvera", phone: "+524435559011" },
  { name: "Luis Ángel Ponce", phone: "+524435559027" },
  { name: "Beatriz Solano", phone: null },
  { name: "Hugo Medina", phone: "+524435559043" },
  { name: "Elena Quiroz", phone: "+524435559058" },
  { name: "Rosa María Téllez", phone: null },
];

// Opening hours in half-hour steps: 9:00 to 19:00.
const SLOTS: [number, number][] = Array.from({ length: 21 }, (_, index) => [
  9 + Math.floor(index / 2),
  (index % 2) * 30,
]);

const PAST_DAYS = 70;
const FUTURE_DAYS = 14;

interface Customer {
  name: string;
  email: string | null;
  phone: string | null;
  uid: string | null;
}

function toCustomer(user: UserRecord): Customer {
  return {
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: user.phone,
    uid: user.id,
  };
}

function totalPrice(services: string[]): number {
  return services.reduce((sum, name) => sum + servicePrice(name), 0);
}

interface BookingDraft {
  id: string;
  customer: Customer;
  services: string[];
  appointmentAt: Date;
  status: BookingStatus;
  finalCost?: number | null;
  paid?: boolean;
  previousAppointmentAt?: Date | null;
  rescheduled?: boolean;
}

function toRecord(draft: BookingDraft): BookingRecord {
  return {
    id: draft.id,
    services: draft.services,
    customerName: draft.customer.name,
    email: draft.customer.email,
    phone: draft.customer.phone,
    uid: draft.customer.uid,
    appointmentAt: draft.appointmentAt,
    status: draft.status,
    createdAt: addDays(draft.appointmentAt, -5),
    rescheduleProposedAt: draft.rescheduled ? draft.appointmentAt : null,
    previousAppointmentAt: draft.previousAppointmentAt ?? null,
    finalCost: draft.finalCost ?? null,
    paid: draft.paid ?? false,
  };
}

// The signed-in demo user's own visits, hand-written so the profile page shows
// every card state (rescheduled, pending, confirmed, prepaid, cancelled, history).
function sessionUserBookings(user: UserRecord, today: Date): BookingDraft[] {
  const customer = toCustomer(user);
  const on = (offset: number, hours: number, minutes: number = 0): Date =>
    atTime(addDays(today, offset), hours, minutes);

  return [
    {
      id: "b-me-rescheduled",
      customer,
      services: ["Masaje de aromaterapia"],
      appointmentAt: on(3, 11),
      previousAppointmentAt: on(2, 17),
      rescheduled: true,
      status: "pending",
    },
    { id: "b-me-pending", customer, services: ["Facial antiedad"], appointmentAt: on(9, 16, 30), status: "pending" },
    { id: "b-me-confirmed", customer, services: ["Masaje con piedras calientes"], appointmentAt: on(5, 10), status: "confirmed" },
    {
      id: "b-me-prepaid",
      customer,
      services: ["Circuito de spa", "Temazcal"],
      appointmentAt: on(12, 12),
      status: "closed",
      finalCost: totalPrice(["Circuito de spa", "Temazcal"]),
      paid: true,
    },
    { id: "b-me-cancelled", customer, services: ["Baño de flotación"], appointmentAt: on(-6, 18), status: "cancelled" },
    ...(
      [
        [-14, ["Masaje relajante"]],
        [-33, ["Facial hidratante", "Exfoliación de sal marina"]],
        [-61, ["Envoltura de chocolate"]],
        [-95, ["Masaje de aromaterapia", "Reflexología podal"]],
      ] as [number, string[]][]
    ).map(([offset, services], index): BookingDraft => ({
      id: `b-me-past-${index}`,
      customer,
      services,
      appointmentAt: on(offset, 13),
      status: "closed",
      finalCost: totalPrice(services),
      paid: true,
    })),
  ];
}

function statusFor(dayOffset: number, appointmentAt: Date, now: Date, roll: number): Pick<BookingDraft, "status" | "finalCost" | "paid"> {
  const hasHappened = appointmentAt.getTime() <= now.getTime();

  if (roll < 0.09) return { status: "cancelled" };

  if (hasHappened) {
    // The last few days keep a small backlog awaiting payment for the dashboard rail.
    if (dayOffset >= -2 && roll < 0.3) return { status: "confirmed" };
    return { status: "closed", paid: true };
  }

  return roll < 0.55 ? { status: "confirmed" } : { status: "pending" };
}

export function createMockBookings(users: UserRecord[], now: Date = new Date()): BookingRecord[] {
  const today = startOfDay(now);
  const sessionUser = users.find((user) => user.id === SESSION_USER_ID)!;
  const customers: Customer[] = [
    ...users.filter((user) => !user.role).map(toCustomer),
    ...GUESTS.map((guest) => ({ name: guest.name, phone: guest.phone, email: null, uid: null })),
  ];
  const serviceNames = allServices.map((service) => service.name);

  const drafts: BookingDraft[] = sessionUserBookings(sessionUser, today);

  for (let offset = -PAST_DAYS; offset <= FUTURE_DAYS; offset++) {
    const day = addDays(today, offset);
    const random = seededRandom(Number(toDateKey(day).replace(/-/g, "")));
    // Busier on weekends, quieter further into the future (fewer bookings made yet).
    const weekendBoost = day.getDay() === 0 || day.getDay() === 6 ? 3 : 0;
    const futureDrop = offset > 0 ? Math.min(offset, 4) : 0;
    const count = Math.max(2, 5 + weekendBoost + Math.floor(random() * 5) - futureDrop);

    const usedSlots = new Set<number>();
    for (let index = 0; index < count; index++) {
      const slotIndex = Math.floor(random() * SLOTS.length);
      if (usedSlots.has(slotIndex) && random() < 0.7) continue;
      usedSlots.add(slotIndex);

      const [hours, minutes] = SLOTS[slotIndex]!;
      const appointmentAt = atTime(day, hours, minutes);
      const services = random() < 0.3
        ? [...new Set([pick(serviceNames, random), pick(serviceNames, random)])]
        : [pick(serviceNames, random)];
      const outcome = statusFor(offset, appointmentAt, now, random());

      drafts.push({
        id: `b-${toDateKey(day)}-${index}`,
        customer: pick(customers, random),
        services,
        appointmentAt,
        ...outcome,
        finalCost: outcome.paid ? totalPrice(services) : null,
      });
    }
  }

  // One visit with a cost recorded but not yet paid, so the rail shows an amount due.
  const unpaid = drafts.find((draft) => draft.status === "confirmed" && draft.appointmentAt <= now && !draft.id.startsWith("b-me"));
  if (unpaid) unpaid.finalCost = totalPrice(unpaid.services);

  return drafts.map(toRecord);
}
