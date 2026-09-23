import { computed, type ComputedRef } from "vue";
import type { UserRecord } from "~/types/user";
import { SESSION_USER_ID } from "~/data/mockUsers";
import { useUsers } from "~/composables/useUsers";

interface SessionApi {
  user: ComputedRef<UserRecord>;
  displayName: ComputedRef<string>;
  isStaff: ComputedRef<boolean>;
  isAdmin: ComputedRef<boolean>;
}

// The showcase skips sign-in: a fixed admin account is always "signed in".
export function useSession(): SessionApi {
  const { users } = useUsers();

  const user = computed<UserRecord>(() => users.value.find((entry) => entry.id === SESSION_USER_ID)!);
  const displayName = computed<string>(() => `${user.value.firstName} ${user.value.lastName}`);
  const isStaff = computed<boolean>(() => !!user.value.role);
  const isAdmin = computed<boolean>(() => user.value.role === "admin");

  return { user, displayName, isStaff, isAdmin };
}
