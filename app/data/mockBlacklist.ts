import type { BlacklistRecord } from "~/types/dashboard";
import { addDays, atTime, startOfDay } from "~/utils/date";

export function createMockBlacklist(now: Date = new Date()): BlacklistRecord[] {
  const today = startOfDay(now);
  const on = (offset: number, hours: number, minutes: number = 0): Date =>
    atTime(addDays(today, offset), hours, minutes);

  return [
    {
      id: "bl-1",
      startTime: on(0, 14),
      endTime: on(0, 16),
      services: ["temazcal", "spa-circuit"],
    },
    {
      id: "bl-2",
      startTime: on(0, 18),
      endTime: on(0, 19, 30),
      services: ["hot-stone-massage"],
    },
    {
      id: "bl-3",
      startTime: on(1, 9),
      endTime: on(1, 12),
      services: ["anti-aging-facial", "enzyme-peel", "deep-cleansing-facial"],
    },
    {
      id: "bl-4",
      startTime: on(4, 0),
      endTime: on(4, 23, 59),
      services: ["flotation-bath"],
    },
  ];
}
