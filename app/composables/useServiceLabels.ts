import { useI18n } from "vue-i18n";

interface ServiceLabels {
  // Display name for a stored service id, in the active locale.
  serviceName: (id: string) => string;
  // Display names for a list of service ids, joined for inline text.
  serviceList: (ids: string[]) => string;
}

// Resolves the service ids stored on bookings and disabled schedules into labels.
export function useServiceLabels(): ServiceLabels {
  const { t: trans } = useI18n();

  const serviceName = (id: string): string => trans(`services.items.${id}.name`);

  return {
    serviceName,
    serviceList: (ids) => ids.map(serviceName).join(", "),
  };
}
