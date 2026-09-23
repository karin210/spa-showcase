import type { Ref } from "vue";
import { mockId } from "~/utils/mock";

export interface Toast {
  id: string;
  message: string;
}

interface ToastApi {
  toasts: Ref<Toast[]>;
  show: (message: string) => void;
  dismiss: (id: string) => void;
}

const TOAST_DURATION_MS = 4500;

export function useToast(): ToastApi {
  const toasts = useState<Toast[]>("toasts", () => []);

  function dismiss(id: string): void {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  }

  function show(message: string): void {
    const id = mockId("toast");
    toasts.value = [...toasts.value, { id, message }];
    setTimeout(() => dismiss(id), TOAST_DURATION_MS);
  }

  return { toasts, show, dismiss };
}
