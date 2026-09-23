import type { Ref } from "vue";
import type { UserRecord, UserRole } from "~/types/user";
import { createMockUsers } from "~/data/mockUsers";

interface UsersApi {
  users: Ref<UserRecord[]>;
  updateUser: (id: string, patch: Partial<UserRecord>) => void;
  setRole: (id: string, role: UserRole | undefined) => void;
}

// In-memory user directory standing in for the users collection. Shared app-wide
// through useState, so edits made on one page show up on every other.
export function useUsers(): UsersApi {
  const users = useState<UserRecord[]>("mock-users", () => createMockUsers());

  function updateUser(id: string, patch: Partial<UserRecord>): void {
    users.value = users.value.map((user) => (user.id === id ? { ...user, ...patch } : user));
  }

  function setRole(id: string, role: UserRole | undefined): void {
    updateUser(id, { role });
  }

  return { users, updateUser, setRole };
}
