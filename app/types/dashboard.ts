export type DashboardTab = "users" | "bookings" | "team" | "controls" | "metrics";

export type DayTab = "today" | "tomorrow" | "fromToday" | "pickDate";

export type MetricsPeriod = "day" | "week" | "month";

export interface BlacklistRecord {
  id: string;
  startTime: Date;
  endTime: Date;
  services: string[];
}

export interface ServiceDemand {
  service: string;
  count: number;
}
