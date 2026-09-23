import type { Ref } from "vue";
import type { BlacklistRecord } from "~/types/dashboard";
import { createMockBlacklist } from "~/data/mockBlacklist";
import { mockId } from "~/utils/mock";

interface BlacklistApi {
  records: Ref<BlacklistRecord[]>;
  addRecord: (record: Omit<BlacklistRecord, "id">) => void;
  removeRecord: (id: string) => void;
}

// In-memory disabled schedules (time ranges where some services can't be booked).
export function useBlacklist(): BlacklistApi {
  const records = useState<BlacklistRecord[]>("mock-blacklist", () => createMockBlacklist());

  function addRecord(record: Omit<BlacklistRecord, "id">): void {
    records.value = [...records.value, { ...record, id: mockId("bl") }];
  }

  function removeRecord(id: string): void {
    records.value = records.value.filter((record) => record.id !== id);
  }

  return { records, addRecord, removeRecord };
}
